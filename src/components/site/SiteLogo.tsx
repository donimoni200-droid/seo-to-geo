import type { Brand } from "@/lib/content";

/* Brand wordmark — text-based logo with the signature italic serif middle word */
export function SiteLogo({
  variant = "red",
  name,
  emWord,
}: {
  variant?: "red" | "cream";
  name?: string;
  emWord?: string;
} & Partial<Brand>) {
  const words = (name || "SEO to GEO With Layla").split(" ");
  const em = emWord || "With";
  // Italicize the signature middle word (e.g. "With")
  const emIndex = words.findIndex((w) => w === em);
  return (
    <span
      className={`site-logo site-logo--${variant}`}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "clamp(1.15rem, 2vw, 1.5rem)",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      {words.map((w, i) =>
        i === emIndex ? (
          <em
            key={i}
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "1.05em",
              margin: "0 0.12em",
            }}
          >
            {w}
          </em>
        ) : (
          <span key={i} style={{ margin: "0 0.08em" }}>
            {w}
          </span>
        )
      )}
    </span>
  );
}
