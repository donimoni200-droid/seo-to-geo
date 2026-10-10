import type { Brand } from "@/lib/content";

/* Brand logo — the SEO to GEO HQ badge image, with a gentle
   floating animation. Used in header, nav, footer and the
   page-transition overlay. */
export function SiteLogo({
  variant = "red",
  name,
  size = 40,
  className,
}: {
  variant?: "red" | "cream" | "plain";
  name?: string;
  size?: number;
  className?: string;
} & Partial<Brand>) {
  const alt = name || "SEO to GEO HQ";
  return (
    <span
      className={`brand-logo brand-logo--${variant} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/brand/logo.png"
        alt={alt}
        width={size}
        height={size}
        draggable={false}
      />
    </span>
  );
}
