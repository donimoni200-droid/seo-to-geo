import type { SiteDefaults } from "@/lib/content";

/* ============================================================
   ADMIN SECTION CONFIG — declarative form definitions for every
   editable piece of the site. The generic form engine renders
   these, so adding a field here instantly makes it editable.
   ============================================================ */

export type FieldDef =
  | {
      type: "text" | "textarea" | "number";
      key: string;
      label: string;
      placeholder?: string;
      help?: string;
    }
  | { type: "boolean"; key: string; label: string; help?: string }
  | {
      type: "stringList";
      key: string;
      label: string;
      itemLabel?: string;
      textarea?: boolean;
      help?: string;
    }
  | { type: "group"; key: string; label: string; fields: FieldDef[] }
  | {
      type: "list";
      key: string;
      label: string;
      titleKey: string;
      fields: FieldDef[];
      addLabel?: string;
      help?: string;
    };

export type AdminSection = {
  key: keyof SiteDefaults;
  title: string;
  description: string;
  group: string;
  fields: FieldDef[];
};

const text = (key: string, label: string, help?: string): FieldDef => ({
  type: "text",
  key,
  label,
  help,
});
const area = (key: string, label: string, help?: string): FieldDef => ({
  type: "textarea",
  key,
  label,
  help,
});
const num = (key: string, label: string): FieldDef => ({ type: "number", key, label });
const bool = (key: string, label: string, help?: string): FieldDef => ({
  type: "boolean",
  key,
  label,
  help,
});
const paraList = (key: string, label: string, help?: string): FieldDef => ({
  type: "stringList",
  key,
  label,
  textarea: true,
  help,
});
const strList = (key: string, label: string, help?: string): FieldDef => ({
  type: "stringList",
  key,
  label,
  help,
});

/* ── link field groups reused in several sections ── */
const linkFields: FieldDef[] = [text("label", "Label"), text("href", "Link (href)")];

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "brand",
    group: "Brand & Global",
    title: "Brand & Identity",
    description: "The site name shown in page titles and the footer, plus the footer tagline.",
    fields: [
      text("name", "Site name (titles, footer, alt texts)"),
      text("firstName", "First name (optional)"),
      text("emWord", "Italic word", "Kept for compatibility — the logo image is used in the header now."),
      text("footerTagline", "Footer tagline"),
      num("year", "Copyright year"),
    ],
  },
  {
    key: "socials",
    group: "Brand & Global",
    title: "Social Links",
    description: "Instagram and TikTok links used in the header, social section, and footer.",
    fields: [text("instagram", "Instagram URL"), text("tiktok", "TikTok URL")],
  },
  {
    key: "emails",
    group: "Brand & Global",
    title: "Contact Emails",
    description: "Email addresses shown on the contact page.",
    fields: [text("partnerships", "Partnerships email"), text("support", "Support email")],
  },
  {
    key: "countdown",
    group: "Brand & Global",
    title: "Countdown Bar",
    description: "The thin sticky bar at the very top of every page. Turn it off to hide it.",
    fields: [
      bool("enabled", "Show countdown bar"),
      text("target", "Target date (ISO)", "Example: 2026-11-15T17:00:00Z"),
      text("label", "Bar label"),
      text("href", "Bar link"),
    ],
  },
  {
    key: "nav",
    group: "Navigation",
    title: "Menu & Links",
    description: "Header navigation links, the dropdown menu, contact link, and the header CTA button.",
    fields: [
      {
        type: "list",
        key: "links",
        label: "Main links",
        titleKey: "label",
        fields: [...linkFields, bool("highlight", "Highlight (red style)")],
        addLabel: "Add link",
      },
      {
        type: "group",
        key: "dropdown",
        label: "Dropdown menu",
        fields: [
          text("trigger", "Dropdown label"),
          {
            type: "list",
            key: "items",
            label: "Dropdown items",
            titleKey: "label",
            fields: linkFields,
            addLabel: "Add item",
          },
        ],
      },
      {
        type: "group",
        key: "contact",
        label: "Contact link",
        fields: [text("label", "Label"), text("href", "Link")],
      },
      {
        type: "group",
        key: "cta",
        label: "Header CTA button",
        fields: [text("label", "Button text"), text("href", "Link")],
      },
    ],
  },
  {
    key: "hero",
    group: "Homepage",
    title: "Hero Section",
    description: "The big intro over the photo, plus the floating callout labels around it.",
    fields: [
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic word)"),
      text("titleB", "Title (last part)"),
      {
        type: "list",
        key: "callouts",
        label: "Floating callouts",
        titleKey: "__none",
        fields: [
          {
            type: "stringList",
            key: "text",
            label: "Callout lines",
            help: "Two lines each — they float around the hero photo.",
          },
        ],
        addLabel: "Add callout",
      },
    ],
  },
  {
    key: "manifesto",
    group: "Homepage",
    title: "Manifesto Section",
    description: "The sticky story section with orbiting chips (ChatGPT, Perplexity…).",
    fields: [
      text("kicker", "Kicker (small label)"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic part)"),
      paraList("body", "Paragraphs"),
      strList("chips", "Orbiting chips", "Up to four chips orbit the section."),
    ],
  },
  {
    key: "challenge",
    group: "Homepage",
    title: "Challenge Block",
    description: "The flagship program block in the middle of the homepage.",
    fields: [
      text("kicker", "Kicker"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic word)"),
      text("titleB", "Title (last part)"),
      area("body", "Body text"),
      text("cta", "Button text"),
    ],
  },
  {
    key: "marquee",
    group: "Homepage",
    title: "Marquee Text",
    description: "The scrolling red text band. Keep it short — it repeats in a loop.",
    fields: [text("text", "Marquee text")],
  },
  {
    key: "paths",
    group: "Homepage",
    title: "Paths Section",
    description: "The “Pick your next move” list: community, bootcamp, agents…",
    fields: [
      text("visualBadgeA", "Photo badge (first part)"),
      text("visualBadgeEm", "Photo badge (italic part)"),
      text("visualBadgeB", "Photo badge (last part)"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic part)"),
      text("titleB", "Title (last part)"),
      {
        type: "list",
        key: "items",
        label: "Path items",
        titleKey: "title",
        fields: [
          text("number", "Number (01, 02…)"),
          text("title", "Title"),
          area("desc", "Description"),
          text("cta", "Link text"),
          text("href", "Link"),
        ],
        addLabel: "Add path",
      },
    ],
  },
  {
    key: "guidesSection",
    group: "Homepage",
    title: "Blogs Block Headings",
    description: "Headings of the “Latest GEO posts” grid on the homepage and the blog page hero.",
    fields: [
      text("kicker", "Kicker"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic part)"),
      text("titleB", "Title (last part)"),
      area("desc", "Description"),
      text("cta", "Button text"),
    ],
  },
  {
    key: "socialSection",
    group: "Homepage",
    title: "Social Section",
    description: "The “Let's be internet friends” block near the bottom.",
    fields: [
      text("kicker", "Kicker"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic part)"),
      text("titleB", "Title (last part)"),
      area("desc", "Description"),
      text("instagram", "Instagram button text"),
      text("tiktok", "TikTok button text"),
    ],
  },
  {
    key: "footer",
    group: "Homepage",
    title: "Footer",
    description: "Footer link columns, the waitlist CTA block, and the bottom line.",
    fields: [
      {
        type: "list",
        key: "columns",
        label: "Link columns",
        titleKey: "label",
        fields: [
          text("label", "Column label"),
          {
            type: "list",
            key: "links",
            label: "Column links",
            titleKey: "label",
            fields: linkFields,
            addLabel: "Add link",
          },
        ],
        addLabel: "Add column",
      },
      text("ctaLabel", "CTA block label"),
      area("ctaText", "CTA block text"),
      text("ctaButton", "Waitlist button text"),
      text("ctaHref", "CTA link"),
      text("bottomLeft", "Bottom left text"),
      text("bottomRight", "Bottom right text"),
    ],
  },
  {
    key: "about",
    group: "Pages",
    title: "About Page",
    description: "The scroll story, the closing lines, and the journey timeline.",
    fields: [
      text("titleA", "Story title (first part)"),
      text("titleEm", "Story title (italic part)"),
      paraList("beats", "Story beats (appear while scrolling)"),
      strList("close", "Closing lines (two lines)"),
      text("hint", "Scroll hint text"),
      text("journeyTitle", "Timeline title (first part)"),
      text("journeyTitleEm", "Timeline title (italic part)"),
      {
        type: "list",
        key: "timeline",
        label: "Timeline cards",
        titleKey: "title",
        fields: [
          text("step", "Step label (2017, 2020…)"),
          text("img", "Image path", "e.g. /assets/about/journey-2017.png"),
          text("title", "Title"),
          area("desc", "Description"),
        ],
        addLabel: "Add card",
      },
    ],
  },
  {
    key: "challengePage",
    group: "Pages",
    title: "Challenge Page",
    description: "Everything on the 30-Day GEO Challenge page — hero, sections, stats, bonuses, FAQ, final CTA.",
    fields: [
      text("heroKicker", "Hero kicker"),
      strList("heroTitle", "Hero title lines"),
      text("heroCta", "Hero CTA text"),
      area("statusLine", "Status line"),
      {
        type: "group",
        key: "sectionOne",
        label: "Why-now section",
        fields: [text("title", "Title"), area("body", "Body"), strList("points", "Bullet points")],
      },
      {
        type: "group",
        key: "sectionTwo",
        label: "Reassurance section",
        fields: [text("title", "Title"), area("body", "Body")],
      },
      { type: "group", key: "intro", label: "Red band intro", fields: [text("title", "Title"), area("body", "Body")] },
      {
        type: "group",
        key: "socialProof",
        label: "Stats",
        fields: [
          text("title", "Stats title"),
          {
            type: "list",
            key: "stats",
            label: "Stat cards",
            titleKey: "label",
            fields: [text("value", "Value (1,900+)"), text("label", "Label")],
            addLabel: "Add stat",
          },
        ],
      },
      {
        type: "group",
        key: "packageSection",
        label: "The package",
        fields: [
          text("title", "Section title"),
          {
            type: "list",
            key: "blocks",
            label: "Blocks",
            titleKey: "title",
            fields: [text("title", "Block title"), area("desc", "Block description")],
            addLabel: "Add block",
          },
        ],
      },
      {
        type: "group",
        key: "howItWorks",
        label: "How it works",
        fields: [
          text("title", "Section title"),
          {
            type: "list",
            key: "items",
            label: "Items",
            titleKey: "title",
            fields: [text("title", "Title"), area("desc", "Description")],
            addLabel: "Add item",
          },
        ],
      },
      {
        type: "group",
        key: "bonuses",
        label: "Bonuses",
        fields: [
          text("title", "Section title"),
          {
            type: "list",
            key: "items",
            label: "Bonus items",
            titleKey: "title",
            fields: [text("title", "Title"), area("desc", "Description")],
            addLabel: "Add bonus",
          },
        ],
      },
      { type: "group", key: "honest", label: "Honest section", fields: [text("title", "Title"), area("body", "Body")] },
      {
        type: "group",
        key: "readBefore",
        label: "Read before joining",
        fields: [text("title", "Title"), strList("points", "Points")],
      },
      {
        type: "group",
        key: "certificate",
        label: "Certificate section",
        fields: [text("title", "Title"), area("body", "Body")],
      },
      {
        type: "group",
        key: "faq",
        label: "FAQ",
        fields: [
          text("title", "FAQ title"),
          {
            type: "list",
            key: "items",
            label: "Questions",
            titleKey: "q",
            fields: [text("q", "Question"), area("a", "Answer")],
            addLabel: "Add question",
          },
        ],
      },
      {
        type: "group",
        key: "final",
        label: "Final CTA",
        fields: [text("titleA", "Title line 1"), text("titleB", "Title line 2"), text("cta", "Button text"), text("sub", "Sub text")],
      },
    ],
  },
  {
    key: "contact",
    group: "Pages",
    title: "Contact Page",
    description: "Contact page intro and the two contact cards.",
    fields: [
      text("kicker", "Kicker"),
      text("titleA", "Title (first part)"),
      text("titleEm", "Title (italic part)"),
      area("intro", "Intro text"),
      {
        type: "list",
        key: "cards",
        label: "Contact cards",
        titleKey: "label",
        fields: [
          text("label", "Card label"),
          text("title", "Card title"),
          area("desc", "Card description"),
          text("email", "Email address"),
          text("linkLabel", "Social link label"),
          text("linkHref", "Social link URL"),
        ],
        addLabel: "Add card",
      },
    ],
  },
  {
    key: "placeholderPages",
    group: "Pages",
    title: "Other Pages",
    description: "Community, Bootcamp, and Agents pages.",
    fields: [
      {
        type: "group",
        key: "community",
        label: "Community page",
        fields: [text("kicker", "Kicker"), text("title", "Title"), area("desc", "Description"), text("cta", "Button text")],
      },
      {
        type: "group",
        key: "bootcamp",
        label: "Bootcamp page",
        fields: [
          text("kicker", "Kicker"),
          text("titleA", "Title (first part)"),
          text("titleEm", "Title (italic part)"),
          area("desc", "Description"),
          text("cta", "Button text"),
          text("headingA", "Grid heading (first part)"),
          text("headingEm", "Grid heading (italic part)"),
          {
            type: "list",
            key: "days",
            label: "Weekend cards",
            titleKey: "title",
            fields: [text("title", "Card title"), area("desc", "Card description")],
            addLabel: "Add card",
          },
        ],
      },
      {
        type: "group",
        key: "agents",
        label: "Agents page",
        fields: [
          text("kicker", "Kicker"),
          text("titleA", "Title (first part)"),
          text("titleEm", "Title (italic part)"),
          text("titleB", "Title (last part)"),
          area("desc", "Description"),
          text("cta", "Button text"),
          text("suiteHeadingA", "Suite heading (first part)"),
          text("suiteHeadingEm", "Suite heading (italic part)"),
          {
            type: "list",
            key: "items",
            label: "Agent cards",
            titleKey: "label",
            fields: [text("label", "Agent name"), area("desc", "Description"), text("href", "Link")],
            addLabel: "Add agent",
          },
        ],
      },
    ],
  },
];

export function findSection(key: string): AdminSection | undefined {
  return ADMIN_SECTIONS.find((s) => s.key === key);
}

/* Guide (blog post) editor fields (used by the GuideForm component) */
export const GUIDE_FIELDS: FieldDef[] = [
  text("tag", "Tag / topic", "Shown as the post's topic chip and used by the filter bar."),
  text("title", "Title"),
  text("slug", "URL slug", "Letters, numbers and dashes — e.g. what-is-geo. The public link is /blogs/your-slug."),
  area("desc", "Short description", "Shown on cards and list rows."),
  text("readTime", "Read time", "e.g. 7 min"),
  bool("published", "Published (visible on the site)"),
  num("order", "Sort order", "Lower numbers come first."),
  {
    type: "list",
    key: "body",
    label: "Post body (sections)",
    titleKey: "heading",
    fields: [text("heading", "Section heading"), paraList("paras", "Section paragraphs")],
    addLabel: "Add section",
  },
];
