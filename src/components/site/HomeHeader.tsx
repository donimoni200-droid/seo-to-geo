"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Nav, Socials, Brand } from "@/lib/content";
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          <span className={`home-header__logobadge${scrolled ? " is-scrolled" : ""}`}>
            <img
              src="/assets/brand/logo.png"
              alt={`${brand.name} logo`}
              width={42}
              height={42}
              draggable={false}
            />
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
              <Link
                href={l.href}
                className={`${l.highlight ? "nav-challenge" : ""} ${
                  isActive(l.href) ? "active" : ""
                }`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className={`site-nav__dropdown${pathname.startsWith("/blogs") ? " is-dd-active" : ""}`}
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
            <Link
              href={nav.contact.href}
              className={isActive(nav.contact.href) ? "active" : undefined}
              aria-current={isActive(nav.contact.href) ? "page" : undefined}
            >
              {nav.contact.label}
            </Link>
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
