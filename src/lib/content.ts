import { cache } from "react";
import { z } from "zod";
import rawSite from "@/content/site.json";
import rawGuides from "@/content/guides.json";
import { db } from "@/lib/db";

/* ============================================================
   CONTENT LAYER — every section of the site is stored in the
   `Content` table as JSON, falls back to the SEO→GEO defaults
   below, and is deep-merged so partial data never breaks a page.
   ============================================================ */

export type SiteDefaults = typeof rawSite;
export type Brand = typeof rawSite.brand;
export type Socials = typeof rawSite.socials;
export type Emails = typeof rawSite.emails;
export type Countdown = typeof rawSite.countdown;
export type Nav = typeof rawSite.nav;
export type Hero = typeof rawSite.hero;
export type Manifesto = typeof rawSite.manifesto;
export type ChallengeSection = typeof rawSite.challenge;
export type Marquee = typeof rawSite.marquee;
export type Paths = typeof rawSite.paths;
export type GuidesSection = typeof rawSite.guidesSection;
export type SocialSection = typeof rawSite.socialSection;
export type Footer = typeof rawSite.footer;
export type About = typeof rawSite.about;
export type ChallengePage = typeof rawSite.challengePage;
export type Contact = typeof rawSite.contact;
export type PlaceholderPages = typeof rawSite.placeholderPages;

export const CONTENT_KEYS = Object.keys(rawSite) as (keyof SiteDefaults)[];

export type GuideBody = { heading: string; paras: string[] };
export type Guide = {
  slug: string;
  tag: string;
  title: string;
  desc: string;
  readTime: string;
  body: GuideBody[];
  published: boolean;
  order: number;
  pdfPath?: string | null;
  pdfName?: string | null;
};

export const DEFAULT_GUIDES = rawGuides as unknown as Guide[];

/* ── Build a zod schema from the shape of the defaults ── */
export function schemaFrom(value: unknown): z.ZodTypeAny {
  if (typeof value === "string") return z.string();
  if (typeof value === "number") return z.number();
  if (typeof value === "boolean") return z.boolean();
  if (Array.isArray(value)) {
    if (value.length === 0) return z.array(z.any());
    const isPrimitive = value.every((v) => typeof v !== "object" || v === null);
    if (isPrimitive) {
      const types = Array.from(new Set(value.map((v) => typeof v)));
      if (types.length === 1 && types[0] === "number") return z.array(z.number());
      return z.array(z.string());
    }
    return z.array(schemaFrom(value[0]));
  }
  if (value && typeof value === "object") {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      shape[k] = schemaFrom(v);
    }
    return z.object(shape).passthrough();
  }
  return z.any();
}

/* ── Deep merge: overrides win, plain objects merge, arrays replace ── */
export function deepMerge<T>(base: T, overrides: unknown): T {
  if (overrides === null || overrides === undefined) return base;
  if (Array.isArray(base) || Array.isArray(overrides)) {
    return (Array.isArray(overrides) ? overrides : base) as T;
  }
  if (
    typeof base === "object" &&
    base !== null &&
    typeof overrides === "object" &&
    overrides !== null &&
    !(overrides instanceof Date)
  ) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(overrides as Record<string, unknown>)) {
      const baseVal = (base as Record<string, unknown>)[k];
      out[k] = baseVal !== undefined ? deepMerge(baseVal, v) : v;
    }
    return out as T;
  }
  return (typeof overrides === typeof base ? overrides : base) as T;
}

/* ── Load one section from DB with fallback + merge + validation ── */
export async function loadSection<K extends keyof SiteDefaults>(
  key: K
): Promise<SiteDefaults[K]> {
  const defaults = rawSite[key];
  try {
    const row = await db.content.findUnique({ where: { key } });
    if (row) {
      const parsed = JSON.parse(row.value);
      const merged = deepMerge(defaults, parsed);
      const result = schemaFrom(defaults).safeParse(merged);
      if (result.success) return result.data as SiteDefaults[K];
    }
  } catch {
    /* DB missing / malformed JSON — fall through to defaults */
  }
  return defaults;
}

/* Per-section cached loaders (one query per section per request) */
export const getBrand = cache(() => loadSection("brand"));
export const getSocials = cache(() => loadSection("socials"));
export const getEmails = cache(() => loadSection("emails"));
export const getCountdown = cache(() => loadSection("countdown"));
export const getNav = cache(() => loadSection("nav"));
export const getHero = cache(() => loadSection("hero"));
export const getManifesto = cache(() => loadSection("manifesto"));
export const getChallengeSection = cache(() => loadSection("challenge"));
export const getMarquee = cache(() => loadSection("marquee"));
export const getPaths = cache(() => loadSection("paths"));
export const getGuidesSection = cache(() => loadSection("guidesSection"));
export const getSocialSection = cache(() => loadSection("socialSection"));
export const getFooter = cache(() => loadSection("footer"));
export const getAbout = cache(() => loadSection("about"));
export const getChallengePage = cache(() => loadSection("challengePage"));
export const getContact = cache(() => loadSection("contact"));
export const getPlaceholderPages = cache(() => loadSection("placeholderPages"));

/* ── Guides ── */
const guideBodySchema = z.array(
  z.object({ heading: z.string(), paras: z.array(z.string()) })
);

export const getGuides = cache(async (): Promise<Guide[]> => {
  try {
    const rows = await db.guide.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0) {
      return rows.map((r) => {
        let body: GuideBody[] = [];
        try {
          const parsed = JSON.parse(r.body);
          if (Array.isArray(parsed)) body = parsed as GuideBody[];
        } catch {
          /* ignore malformed body */
        }
        return {
          slug: r.slug,
          tag: r.tag,
          title: r.title,
          desc: r.desc,
          readTime: r.readTime,
          body,
          published: r.published,
          order: r.order,
          pdfPath: r.pdfPath ?? null,
          pdfName: r.pdfName ?? null,
        };
      });
    }
  } catch {
    /* table missing — fall through to defaults */
  }
  return DEFAULT_GUIDES;
});

export async function getPublishedGuides(): Promise<Guide[]> {
  const all = await getGuides();
  return all.filter((g) => g.published);
}

export async function getGuide(slug: string): Promise<Guide | null> {
  const all = await getGuides();
  return all.find((g) => g.slug === slug && g.published) ?? null;
}

export function guideTags(guides: Guide[]): string[] {
  const tags = Array.from(new Set(guides.map((g) => g.tag)));
  return ["All", ...tags];
}
