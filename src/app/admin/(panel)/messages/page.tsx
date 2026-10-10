import { db } from "@/lib/db";
import { MessageActions } from "@/components/admin/MessageActions";
import { datef } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  let messages: Awaited<ReturnType<typeof db.message.findMany>> = [];
  try {
    messages = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    messages = [];
  }
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="admin-page-title">Messages</h1>
      <p className="admin-page-desc">
        Every message sent through the contact form lands here. {unread > 0 ? `${unread} unread.` : "All read."}
      </p>

      {messages.length === 0 && (
        <div className="admin-card">
          <p style={{ color: "rgba(47,45,45,0.5)" }}>
            The inbox is empty — messages from the site&rsquo;s contact form will appear here.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className="admin-card" style={{ borderLeft: m.read ? undefined : "4px solid #d02e2e" }}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 800 }}>
                {m.subject || "(no subject)"}
                {!m.read && <span className="admin-badge admin-badge--red" style={{ marginLeft: 10 }}>New</span>}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "rgba(47,45,45,0.6)" }}>
                <b>{m.name}</b> &lt;{m.email}&gt; · {datef(m.createdAt)}
              </p>
            </div>
            <MessageActions id={m.id} read={m.read} />
          </div>
          <p style={{ margin: "14px 0 0", whiteSpace: "pre-wrap", fontSize: "0.9rem", lineHeight: 1.7 }}>
            {m.body}
          </p>
          <p style={{ margin: "10px 0 0" }}>
            <a
              href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "your message")}`}
              style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#d02e2e" }}
            >
              Reply by email →
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
