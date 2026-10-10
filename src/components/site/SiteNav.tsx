"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Nav, Brand } from "@/lib/content";
import { CaretIcon } from "./icons";

export function SiteNav({ nav, brand }: { nav: Nav; brand: Brand }) {
  const [ddOpen, setDdOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__brand">
          {brand.name}
        </Link>
        <ul className="site-nav__links">
          <li>
            <Link href="/" className={pathname === "/" ? "active" : undefined}>
              Home
            </Link>
          </li>
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${l.highlight ? "nav-challenge" : ""} ${
                  pathname.startsWith(l.href) ? "active" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className="site-nav__dropdown"
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
              className={pathname === nav.contact.href ? "active" : undefined}
            >
              {nav.contact.label} Me
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
