"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Nav, Brand } from "@/lib/content";
import { CaretIcon } from "./icons";

export function SiteNav({ nav, brand }: { nav: Nav; brand: Brand }) {
  const [ddOpen, setDdOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__brand" aria-label={`${brand.name} — home`}>
          <span className="site-nav__logobadge">
            <img
              src="/assets/brand/logo.png"
              alt={`${brand.name} logo`}
              width={38}
              height={38}
              draggable={false}
            />
          </span>
        </Link>
        <ul className="site-nav__links">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? "active" : undefined}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
          </li>
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
              className="site-nav__dropdown-trigger"
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
      </div>
    </nav>
  );
}
