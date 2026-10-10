import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";

/* ============================================================
   AUTH — lightweight session for the admin panel.
   scrypt password hashing + HMAC-signed cookie (no deps).
   ============================================================ */

const COOKIE_NAME = "geo_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  return process.env.SESSION_SECRET || "seo-to-geo-dev-secret-change-me";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64);
    const target = Buffer.from(hash, "hex");
    return test.length === target.length && timingSafeEqual(test, target);
  } catch {
    return false;
  }
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(userId: string): string {
  const payload = b64url(
    JSON.stringify({ sub: userId, exp: Date.now() + SESSION_TTL_MS })
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(
  token: string | undefined
): { sub: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (
    sig.length !== expected.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.sub !== "string") return null;
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export const getSessionUser = cache(async (): Promise<AdminSessionUser | null> => {
  try {
    const jar = await cookies();
    const session = verifySessionToken(jar.get(COOKIE_NAME)?.value);
    if (!session) return null;
    const user = await db.adminUser.findUnique({ where: { id: session.sub } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name };
  } catch {
    return null;
  }
});

export async function requireAdmin(): Promise<AdminSessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}
