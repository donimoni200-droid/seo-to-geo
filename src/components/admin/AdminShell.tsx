"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { logoutAction } from "@/app/admin/actions";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";

type Props = {
  siteName: string;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

const groups = Array.from(new Set(ADMIN_SECTIONS.map((s) => s.group)));

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const fixed = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/guides", label: "Blogs", icon: FileText },
    { href: "/admin/messages", label: "Messages", icon: Inbox },
    { href: "/admin/subscribers", label: "Subscribers", icon: Users },
    { href: "/admin/account", label: "Account", icon: Settings },
  ];

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <div className="admin-nav__group">
        {fixed.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`admin-nav__link ${isActive(item.href) ? "is-active" : ""}`}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        ))}
      </div>
      <p className="admin-nav__heading">Site content</p>
      {groups.map((group) => (
        <div key={group} className="admin-nav__group">
          <p className="admin-nav__subheading">{group}</p>
          {ADMIN_SECTIONS.filter((s) => s.group === group).map((s) => (
            <Link
              key={s.key}
              href={`/admin/content/${s.key}`}
              onClick={onNavigate}
              className={`admin-nav__link is-sm ${isActive(`/admin/content/${s.key}`) ? "is-active" : ""}`}
            >
              <PenSquare size={13} />
              {s.title}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ siteName, userName, userEmail, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <img
            src="/assets/brand/logo.png"
            alt={`${siteName} logo`}
            width={34}
            height={34}
            style={{ borderRadius: 5, boxShadow: "0 2px 10px rgba(47,45,45,0.25)" }}
          />
          <div>
            <p className="admin-sidebar__name">{siteName}</p>
            <p className="admin-sidebar__sub">Admin Panel</p>
          </div>
        </div>
        <div className="admin-sidebar__scroll">
          <NavLinks />
        </div>
        <div className="admin-sidebar__foot">
          <Link href="/" target="_blank" className="admin-nav__link">
            <ExternalLink size={15} />
            View live site
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="admin-nav__link admin-nav__link--danger">
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-[#fffae7]">
                <SheetTitle className="sr-only">Admin menu</SheetTitle>
                <div className="admin-sidebar__brand">
                  <img
                    src="/assets/brand/logo.png"
                    alt={`${siteName} logo`}
                    width={34}
                    height={34}
                    style={{ borderRadius: 5, boxShadow: "0 2px 10px rgba(47,45,45,0.25)" }}
                  />
                  <div>
                    <p className="admin-sidebar__name">{siteName}</p>
                    <p className="admin-sidebar__sub">Admin Panel</p>
                  </div>
                </div>
                <div className="admin-sidebar__scroll">
                  <NavLinks onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <p className="admin-topbar__crumb">
              Logged in as <b>{userName || userEmail}</b>
            </p>
          </div>
          <Link href="/" target="_blank" className="admin-topbar__visit">
            View site <ExternalLink size={13} />
          </Link>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
