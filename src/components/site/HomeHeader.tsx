"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Nav, Socials, Brand } from "@/lib/content";
import { SiteLogo } from "./SiteLogo";
import { InstagramIcon, TikTokIcon, CaretIcon } from "./icons";

export function HomeHeader({
  nav,
  socials,
  brand,
}: {
  nav: Nav;
  socials: Socials;
  brand: Brand;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`home-header${scrolled ? " is-scrolled" : ""}`}
      data-open={open}
    >
      <div className="home-header__inner">
        <Link href="/" className="home-header__brand" aria-label={`${brand.name} — home`}>
          <span className="home-header__logo home-header__logo--red" style={{ color: "#d02e2e" }}>
            <SiteLogo variant="red" name={brand.name} emWord={brand.emWord} />
          </span>
          <span className="home-header__logo home-header__logo--cream" style={{ color: "#fffae7" }}>
            <SiteLogo variant="cream" name={brand.name} emWord={brand.emWord} />
          </span>
        </Link>
        <button
          className="home-header__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="home-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <ul className="home-header__menu" id="home-menu">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={l.highlight ? "nav-challenge" : undefined}>
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className={`site-nav__dropdown${ddOpen ? "" : ""}`}
            data-nav-dd
            data-open={ddOpen}
          >
            <button
              type="button"
              data-nav-dd-trigger
              aria-expanded={ddOpen}
              aria-haspopup="true"
              onClick={() => setDdOpen((v) => !v)}
            >
              {nav.dropdown.trigger} <CaretIcon />
            </button>
            <ul className="site-nav__dropdown-menu" role="menu">
              {nav.dropdown.items.map((item) => (
                <li key={item.label} role="none">
                  <Link href={item.href} role="menuitem">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link href={nav.contact.href}>{nav.contact.label}</Link>
          </li>
        </ul>
        <div className="home-header__actions">
          <a
            className="home-header__social"
            href={socials.instagram}
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <InstagramIcon size={16} />
          </a>
          <a
            className="home-header__social"
            href={socials.tiktok}
            target="_blank"
            rel="noopener"
            aria-label="TikTok"
          >
            <TikTokIcon size={16} />
          </a>
          <Link className="home-header__cta" href={nav.cta.href}>
            {nav.cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
