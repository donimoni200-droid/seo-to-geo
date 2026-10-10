"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { unlinkSync, writeFileSync } from "node:fs";
import { db } from "@/lib/db";
import {
  verifyPassword,
  hashPassword,
  setSessionCookie,
  clearSessionCookie,
  requireAdmin,
} from "@/lib/auth";
import { deepMerge, schemaFrom, CONTENT_KEYS, type GuideBody } from "@/lib/content";
import { guidePdfPath, MAX_PDF_BYTES } from "@/lib/uploads";
import rawSite from "@/content/site.json";
import rawGuides from "@/content/guides.json";

/* ============================================================
   ADMIN SERVER ACTIONS — auth + content + guides + inbox
   ============================================================ */

export type AdminActionState = {
  ok: boolean;
  message: string;
};

function refresh() {
  revalidatePath("/", "layout");
}

/* ── AUTH ── */

export async function loginAction(
  _prev: AdminActionState | null,
  formData: FormData
): Promise<AdminActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }
  try {
    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { ok: false, message: "Invalid email or password." };
    }
    await setSessionCookie(user.id);
  } catch {
    return { ok: false, message: "Login failed — is the database initialized?" };
  }
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

/* ── CONTENT SECTIONS ── */

export async function saveContentAction(
  key: string,
  json: string
): Promise<AdminActionState> {
  await requireAdmin();
  if (!CONTENT_KEYS.includes(key as (typeof CONTENT_KEYS)[number])) {
    return { ok: false, message: "Unknown section." };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, message: "Invalid data — please retry." };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, message: "Invalid section payload." };
  }
  const defaults = (rawSite as Record<string, unknown>)[key];
  const merged = deepMerge(defaults, parsed);
  const check = schemaFrom(defaults).safeParse(merged);
  if (!check.success) {
    return {
      ok: false,
      message: "Saved data has the wrong shape — check the fields and try again.",
    };
  }
  try {
    await db.content.upsert({
      where: { key },
      update: { value: JSON.stringify(check.data) },
      create: { key, value: JSON.stringify(check.data) },
    });
    refresh();
    return { ok: true, message: "Saved. The site is already updated." };
  } catch {
    return { ok: false, message: "Could not save — please try again." };
  }
}

export async function resetContentAction(key: string): Promise<AdminActionState> {
  await requireAdmin();
  if (!CONTENT_KEYS.includes(key as (typeof CONTENT_KEYS)[number])) {
    return { ok: false, message: "Unknown section." };
  }
  try {
    await db.content.delete({ where: { key } }).catch(() => undefined);
    refresh();
    return {
      ok: true,
      message: "Section reset to the built-in SEO→GEO defaults.",
    };
  } catch {
    return { ok: false, message: "Reset failed." };
  }
}

/* ── GUIDES ── */

const guideSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and dashes."),
  tag: z.string().trim().min(1, "Tag is required."),
  title: z.string().trim().min(3, "Title is required."),
  desc: z.string().trim().min(3, "Description is required."),
  readTime: z.string().trim().min(1, "Read time is required."),
  published: z.boolean(),
  order: z.number(),
  body: z.array(
    z.object({ heading: z.string().trim().min(1), paras: z.array(z.string()) })
  ),
});

export async function saveGuideAction(
  id: string | null,
  json: string
): Promise<AdminActionState> {
  await requireAdmin();
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, message: "Invalid data — please retry." };
  }
  const parsed = guideSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Please check the guide fields.",
    };
  }
  const { slug, tag, title, desc, readTime, published, order, body } = parsed.data;
  try {
    if (id) {
      const existing = await db.guide.findUnique({ where: { id } });
      if (!existing) return { ok: false, message: "Guide not found." };
      if (existing.slug !== slug) {
        const clash = await db.guide.findUnique({ where: { slug } });
        if (clash) return { ok: false, message: `Slug "${slug}" is already used by another guide.` };
      }
      await db.guide.update({
        where: { id },
        data: {
          slug,
          tag,
          title,
          desc,
          readTime,
          published,
          order,
          body: JSON.stringify(body as GuideBody[]),
        },
      });
      refresh();
      return { ok: true, message: "Blog post updated." };
    } else {
      const clash = await db.guide.findUnique({ where: { slug } });
      if (clash) return { ok: false, message: `Slug "${slug}" is already used by another guide.` };
      await db.guide.create({
        data: {
          slug,
          tag,
          title,
          desc,
          readTime,
          published,
          order,
          body: JSON.stringify(body as GuideBody[]),
        },
      });
      refresh();
      return { ok: true, message: "Blog post created." };
    }
  } catch {
    return { ok: false, message: "Could not save the guide — please try again." };
  }
}

export async function deleteGuideAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    const guide = await db.guide.findUnique({ where: { id } });
    if (guide?.pdfPath) {
      try {
        unlinkSync(guide.pdfPath);
      } catch {
        /* file already gone — fine */
      }
    }
    await db.guide.delete({ where: { id } });
    refresh();
    return { ok: true, message: "Blog post deleted." };
  } catch {
    return { ok: false, message: "Could not delete the blog post." };
  }
}

export async function toggleGuidePublishedAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    const guide = await db.guide.findUnique({ where: { id } });
    if (!guide) return { ok: false, message: "Blog post not found." };
    await db.guide.update({ where: { id }, data: { published: !guide.published } });
    refresh();
    return { ok: true, message: guide.published ? "Blog post hidden." : "Blog post published." };
  } catch {
    return { ok: false, message: "Could not update the blog post." };
  }
}

export async function resetGuidesAction(): Promise<AdminActionState> {
  await requireAdmin();
  try {
    await db.guide.deleteMany({});
    for (const g of rawGuides) {
      await db.guide.create({
        data: {
          slug: g.slug,
          tag: g.tag,
          title: g.title,
          desc: g.desc,
          readTime: g.readTime,
          published: true,
          order: g.order,
          body: JSON.stringify(g.body),
        },
      });
    }
    refresh();
    return { ok: true, message: "Guides restored to the built-in SEO→GEO library." };
  } catch {
    return { ok: false, message: "Could not restore guides." };
  }
}

/* ── GUIDE PDF ── */

export async function uploadGuidePdfAction(
  id: string,
  formData: FormData
): Promise<AdminActionState> {
  await requireAdmin();
  const file = formData.get("pdf");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a PDF file first." };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, message: "PDF is too large — the limit is 25 MB." };
  }
  const guide = await db.guide.findUnique({ where: { id } });
  if (!guide) return { ok: false, message: "Blog post not found — save it first." };
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.subarray(0, 5).toString("latin1") !== "%PDF-") {
      return { ok: false, message: "That file does not look like a PDF." };
    }
    const target = guidePdfPath(guide.id);
    writeFileSync(target, buf);
    const cleanName = (file.name || "download.pdf").replace(/[\\/:*?\"<>|]/g, "_").slice(0, 120);
    await db.guide.update({
      where: { id },
      data: { pdfPath: target, pdfName: cleanName || "download.pdf" },
    });
    refresh();
    return { ok: true, message: "PDF attached — visitors can now download it." };
  } catch {
    return { ok: false, message: "Could not save the PDF — try again." };
  }
}

export async function removeGuidePdfAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    const guide = await db.guide.findUnique({ where: { id } });
    if (!guide) return { ok: false, message: "Blog post not found." };
    if (guide.pdfPath) {
      try {
        unlinkSync(guide.pdfPath);
      } catch {
        /* file already gone — fine */
      }
    }
    await db.guide.update({ where: { id }, data: { pdfPath: null, pdfName: null } });
    refresh();
    return { ok: true, message: "PDF removed." };
  } catch {
    return { ok: false, message: "Could not remove the PDF." };
  }
}

/* ── SUBSCRIBERS ── */

export async function deleteSubscriberAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    await db.subscriber.delete({ where: { id } });
    return { ok: true, message: "Subscriber removed." };
  } catch {
    return { ok: false, message: "Could not remove the subscriber." };
  }
}

/* ── MESSAGES ── */

export async function toggleMessageReadAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    const msg = await db.message.findUnique({ where: { id } });
    if (!msg) return { ok: false, message: "Message not found." };
    await db.message.update({ where: { id }, data: { read: !msg.read } });
    return { ok: true, message: msg.read ? "Marked as unread." : "Marked as read." };
  } catch {
    return { ok: false, message: "Could not update the message." };
  }
}

export async function deleteMessageAction(id: string): Promise<AdminActionState> {
  await requireAdmin();
  try {
    await db.message.delete({ where: { id } });
    return { ok: true, message: "Message deleted." };
  } catch {
    return { ok: false, message: "Could not delete the message." };
  }
}

/* ── ACCOUNT ── */

const accountSchema = z.object({
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(200),
});

export async function updateAccountAction(
  _prev: AdminActionState | null,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireAdmin();
  const parsed = accountSchema.safeParse({
    name: formData.get("name") || "",
    email: formData.get("email") || "",
  });
  if (!parsed.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  try {
    if (parsed.data.email.toLowerCase() !== user.email) {
      const clash = await db.adminUser.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (clash) return { ok: false, message: "That email is already used." };
    }
    await db.adminUser.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name || null,
        email: parsed.data.email.toLowerCase(),
      },
    });
    return { ok: true, message: "Account updated." };
  } catch {
    return { ok: false, message: "Could not update the account." };
  }
}

export async function changePasswordAction(
  _prev: AdminActionState | null,
  formData: FormData
): Promise<AdminActionState> {
  const user = await requireAdmin();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  if (next.length < 8) {
    return { ok: false, message: "New password must be at least 8 characters." };
  }
  try {
    const record = await db.adminUser.findUnique({ where: { id: user.id } });
    if (!record || !verifyPassword(current, record.passwordHash)) {
      return { ok: false, message: "Current password is incorrect." };
    }
    await db.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(next) },
    });
    return { ok: true, message: "Password changed." };
  } catch {
    return { ok: false, message: "Could not change the password." };
  }
}
