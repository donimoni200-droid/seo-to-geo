/* ============================================================
   BRAND MIGRATION — one-time data fix, safe to re-run.
   1. Removes every "Layla" reference from stored content.
   2. Rebrands the site to "SEO to GEO HQ".
   3. Rewrites /guides links to /blogs.
   Targeted key updates only — any other admin edits are kept.
   Run with: node scripts/fix-brand.mjs
   ============================================================ */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const NEW_BRAND = {
  name: "SEO to GEO HQ",
  firstName: "",
  emWord: "to",
};

/* Replace /guides links anywhere inside a stored JSON value */
function rewriteGuidesLinks(value) {
  if (typeof value === "string") {
    return value
      .replace(/\/guides\//g, "/blogs/")
      .replace(/\/guides\b/g, "/blogs");
  }
  if (Array.isArray(value)) return value.map(rewriteGuidesLinks);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = rewriteGuidesLinks(v);
    return out;
  }
  return value;
}

const has = (s, needle) => typeof s === "string" && s.toLowerCase().includes(needle);

async function main() {
  let changes = 0;

  const rows = await db.content.findMany();
  for (const row of rows) {
    let data;
    try {
      data = JSON.parse(row.value);
    } catch {
      continue;
    }
    const before = JSON.stringify(data);
    data = rewriteGuidesLinks(data);

    /* ── brand ── */
    if (row.key === "brand") {
      if (has(data.name, "layla")) Object.assign(data, NEW_BRAND);
    }

    /* ── hero ── */
    if (row.key === "hero" && has(data.titleB, "layla")) {
      data.titleA = "Hey,";
      data.titleEm = "we're";
      data.titleB = "SEO to GEO HQ.";
    }

    /* ── nav ── */
    if (row.key === "nav") {
      if (Array.isArray(data.links)) {
        for (const l of data.links) {
          if (has(l?.label, "guide")) l.label = "BLOGS";
        }
      }
    }

    /* ── guidesSection ── */
    if (row.key === "guidesSection" && (has(data.titleB, "guide") || has(data.kicker, "library"))) {
      data.kicker = "The blog";
      data.titleA = "Latest ";
      data.titleEm = data.titleEm || "GEO";
      data.titleB = " posts";
      if (has(data.cta, "guide")) data.cta = "Browse all blogs →";
    }

    /* ── footer ── */
    if (row.key === "footer") {
      if (has(data.bottomLeft, "layla")) {
        data.bottomLeft = data.bottomLeft.replace(/SEO to GEO With Layla/gi, "SEO to GEO HQ");
      }
      if (Array.isArray(data.columns)) {
        for (const col of data.columns) {
          for (const l of col?.links ?? []) {
            if (has(l?.label, "free guides")) l.label = "BLOGS";
          }
        }
      }
    }

    /* ── about ── */
    if (row.key === "about" && (has(data.titleA, "layla") || has(data.titleEm, "layla"))) {
      data.titleA = "SEO to ";
      data.titleEm = "GEO HQ";
    }

    /* ── challengePage ── */
    if (row.key === "challengePage") {
      if (has(data?.intro?.title, "layla")) data.intro.title = "Hey, welcome.";
      if (has(data?.intro?.body, "layla")) {
        data.intro.body = data.intro.body
          .replace(/I spent/g, "We spent")
          .replace(/my entire playbook/g, "the entire playbook")
          .replace(/my brands and clients/g, "our brands and clients")
          .replace(/my past self/g, "our past selves");
      }
    }

    const after = JSON.stringify(data);
    if (after !== before) {
      await db.content.update({ where: { key: row.key }, data: { value: after } });
      console.log(`✔ content/${row.key} updated`);
      changes++;
    }
  }

  /* ── admin user name ── */
  const admins = await db.adminUser.findMany();
  for (const a of admins) {
    if (has(a.name, "layla")) {
      await db.adminUser.update({
        where: { id: a.id },
        data: { name: "SEO to GEO HQ" },
      });
      console.log(`✔ admin user "${a.email}" renamed`);
      changes++;
    }
  }

  console.log(
    changes === 0
      ? "• Nothing to migrate — brand is already SEO to GEO HQ."
      : `Brand migration done (${changes} updates).`
  );
}

main()
  .catch((e) => {
    console.error("Brand migration failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
