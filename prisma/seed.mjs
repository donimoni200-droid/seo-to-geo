/* ============================================================
   SEED — idempotent. Creates the admin user, all content
   sections, and the default GEO guide library if missing.
   Run with: node prisma/seed.mjs
   ============================================================ */

import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function loadJson(rel) {
  return JSON.parse(readFileSync(path.join(root, rel), "utf8"));
}

async function main() {
  /* ── Admin user ── */
  const email = (process.env.ADMIN_EMAIL || "admin@seotogeo.io").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "GEOadmin2026!";
  const adminCount = await db.adminUser.count();
  if (adminCount === 0) {
    await db.adminUser.create({
      data: { email, passwordHash: hashPassword(password), name: "Layla" },
    });
    console.log(`✔ Admin user created: ${email}`);
  } else {
    console.log("• Admin user already exists — skipped");
  }

  /* ── Content sections ── */
  const site = loadJson("src/content/site.json");
  for (const [key, value] of Object.entries(site)) {
    const existing = await db.content.findUnique({ where: { key } });
    if (!existing) {
      await db.content.create({ data: { key, value: JSON.stringify(value) } });
      console.log(`✔ Content seeded: ${key}`);
    }
  }
  const contentCount = await db.content.count();
  console.log(`• Content sections in DB: ${contentCount}/${Object.keys(site).length}`);

  /* ── Guides ── */
  const guides = loadJson("src/content/guides.json");
  const guideCount = await db.guide.count();
  if (guideCount === 0) {
    for (const g of guides) {
      await db.guide.create({
        data: {
          slug: g.slug,
          tag: g.tag,
          title: g.title,
          desc: g.desc,
          readTime: g.readTime,
          published: g.published !== false,
          order: g.order ?? 0,
          body: JSON.stringify(g.body),
        },
      });
    }
    console.log(`✔ ${guides.length} guides seeded`);
  } else {
    console.log(`• Guides already exist (${guideCount}) — skipped`);
  }

  console.log("\nSeed complete. Admin login:");
  console.log(`  Email:    ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log("  Password: GEOadmin2026!  (set ADMIN_PASSWORD to override)");
  }
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
