/* ============================================================
   PRODUCTION START — runs migrations + seed before next start.
   Works locally and on Railway (volume at /data optional).
   ============================================================ */

import { execSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";

const dbUrl = process.env.DATABASE_URL || "file:/data/site.db";
process.env.DATABASE_URL = dbUrl;

// Ensure the SQLite directory exists (e.g. /data on Railway volume)
if (dbUrl.startsWith("file:")) {
  const filePath = dbUrl.slice(5);
  const dir = filePath.replace(/\/[^/]*$/, "") || ".";
  if (dir && !existsSync(dir)) {
    try {
      mkdirSync(dir, { recursive: true });
      console.log(`Created database directory: ${dir}`);
    } catch (err) {
      console.warn(`Could not create ${dir}: ${err.message}`);
    }
  }
}

console.log("→ Applying database migrations…");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("→ Seeding database (idempotent)…");
execSync("node prisma/seed.mjs", { stdio: "inherit" });

console.log("→ Starting Next.js…");
execSync("npx next start", { stdio: "inherit" });
