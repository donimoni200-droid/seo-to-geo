import type { Footer, Brand } from "@/lib/content";
import { SiteLogo } from "./SiteLogo";

export function HomeFooter({
  footer,
  brand,
  children,
}: {
  footer: Footer;
  brand: Brand;
  children?: React.ReactNode;
}) {
  return (
    <footer className="home-footer">
      <div className="home-footer__brand">
        <SiteLogo variant="cream" name={brand.name} size={56} />
      </div>
      <div className="home-footer__grid">
        {footer.columns.map((col) => (
          <div key={col.label}>
            <p className="home-footer__label">{col.label}</p>
            {col.links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        ))}
        <div className="home-footer__cta">
          <p className="home-footer__label">{footer.ctaLabel}</p>
          <p>{footer.ctaText}</p>
          {children ?? <a href={footer.ctaHref}>{footer.ctaButton}</a>}
        </div>
      </div>
      <div className="home-footer__bottom">
        <span>{footer.bottomLeft}</span>
        <span>{footer.bottomRight}</span>
      </div>
    </footer>
  );
}
