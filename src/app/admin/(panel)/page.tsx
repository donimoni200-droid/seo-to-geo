import Link from "next/link";
import { db } from "@/lib/db";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import { FileText, Inbox, Users, PenSquare } from "lucide-react";
import { datef } from "@/lib/format";

export const dynamic = "force-dynamic";

async function loadStats() {
  try {
    const [guides, published, subscribers, messages, unread, sections] = await Promise.all([
      db.guide.count(),
      db.guide.count({ where: { published: true } }),
      db.subscriber.count(),
      db.message.count(),
      db.message.count({ where: { read: false } }),
      db.content.count(),
    ]);
    const recentMessages = await db.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    });
    const recentSubs = await db.subscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return { guides, published, subscribers, messages, unread, sections, recentMessages, recentSubs };
  } catch {
    return {
      guides: 0,
      published: 0,
      subscribers: 0,
      messages: 0,
      unread: 0,
      sections: 0,
      recentMessages: [],
      recentSubs: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await loadStats();

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-desc">
        Everything on the site is editable from here — content sections, blog posts (with
        PDF downloads), the waitlist, and your messages.
      </p>

      <div className="admin-stat-grid">
        <Link href="/admin/guides" className="admin-stat">
          <span className="admin-stat__value">{stats.guides}</span>
          <span className="admin-stat__label">
            <FileText size={11} style={{ display: "inline", marginRight: 4 }} />
            Blog posts ({stats.published} live)
          </span>
        </Link>
        <Link href="/admin/messages" className="admin-stat">
          <span className="admin-stat__value">{stats.messages}</span>
          <span className="admin-stat__label">
            <Inbox size={11} style={{ display: "inline", marginRight: 4 }} />
            Messages ({stats.unread} unread)
          </span>
        </Link>
        <Link href="/admin/subscribers" className="admin-stat">
          <span className="admin-stat__value">{stats.subscribers}</span>
          <span className="admin-stat__label">
            <Users size={11} style={{ display: "inline", marginRight: 4 }} />
            Waitlist subscribers
          </span>
        </Link>
        <div className="admin-stat">
          <span className="admin-stat__value">
            {stats.sections}/{ADMIN_SECTIONS.length}
          </span>
          <span className="admin-stat__label">
            <PenSquare size={11} style={{ display: "inline", marginRight: 4 }} />
            Sections customized
          </span>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Latest messages</h2>
        {stats.recentMessages.length === 0 && (
          <p className="admin-row" style={{ color: "rgba(47,45,45,0.5)" }}>
            No messages yet — the contact form on the site feeds this inbox.
          </p>
        )}
        {stats.recentMessages.map((m) => (
          <div key={m.id} className="admin-row">
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.name} — {m.subject || "(no subject)"}
              </p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(47,45,45,0.55)" }}>
                {datef(m.createdAt)}
              </p>
            </div>
            {!m.read && <span className="admin-badge admin-badge--red">New</span>}
          </div>
        ))}
        <p style={{ margin: "12px 0 0" }}>
          <Link href="/admin/messages" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#d02e2e" }}>
            Open the inbox →
          </Link>
        </p>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Newest waitlist signups</h2>
        {stats.recentSubs.length === 0 && (
          <p className="admin-row" style={{ color: "rgba(47,45,45,0.5)" }}>
            No signups yet — every waitlist form on the site feeds this list.
          </p>
        )}
        {stats.recentSubs.map((s) => (
          <div key={s.id} className="admin-row">
            <span style={{ fontWeight: 600 }}>{s.email}</span>
            <span style={{ fontSize: "0.78rem", color: "rgba(47,45,45,0.55)" }}>{datef(s.createdAt)}</span>
          </div>
        ))}
        <p style={{ margin: "12px 0 0" }}>
          <Link href="/admin/subscribers" style={{ fontSize: "0.8rem", fontWeight: 800, color: "#d02e2e" }}>
            See all subscribers →
          </Link>
        </p>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Quick edit</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {ADMIN_SECTIONS.slice(0, 10).map((s) => (
            <Link
              key={s.key}
              href={`/admin/content/${s.key}`}
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#2f2d2d",
                textDecoration: "none",
                border: "1px solid rgba(47,45,45,0.18)",
                padding: "7px 12px",
                borderRadius: 999,
              }}
            >
              {s.title}
            </Link>
          ))}
          <Link
            href="/admin/content/nav"
            style={{
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#d02e2e",
              textDecoration: "none",
              border: "1px solid rgba(208,46,46,0.4)",
              padding: "7px 12px",
              borderRadius: 999,
            }}
          >
            + {ADMIN_SECTIONS.length - 10} more sections
          </Link>
        </div>
      </div>
    </div>
  );
}
