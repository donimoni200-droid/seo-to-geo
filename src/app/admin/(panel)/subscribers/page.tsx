import { db } from "@/lib/db";
import {
  SubscriberRowActions,
  ExportSubscribersButton,
} from "@/components/admin/SubscriberActions";
import { datef } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  let subscribers: Awaited<ReturnType<typeof db.subscriber.findMany>> = [];
  try {
    subscribers = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    subscribers = [];
  }

  return (
    <div>
      <h1 className="admin-page-title">Subscribers</h1>
      <p className="admin-page-desc">
        Everyone who joined the waitlist from any form on the site.
      </p>

      <div style={{ marginBottom: 18 }}>
        <ExportSubscribersButton
          subscribers={subscribers.map((s) => ({
            email: s.email,
            source: s.source,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      </div>

      <div className="admin-card admin-table-wrap">
        {subscribers.length === 0 && (
          <p style={{ color: "rgba(47,45,45,0.5)" }}>
            No subscribers yet — the waitlist forms feed this list automatically.
          </p>
        )}
        {subscribers.length > 0 && (
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid rgba(47,45,45,0.12)" }}>
                <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Email</th>
                <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Source</th>
                <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Signed up</th>
                <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(47,45,45,0.08)" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 700 }}>{s.email}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <span className="admin-badge admin-badge--off">{s.source}</span>
                  </td>
                  <td style={{ padding: "12px 8px", fontSize: "0.78rem", color: "rgba(47,45,45,0.55)" }}>
                    {datef(s.createdAt)}
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>
                    <SubscriberRowActions id={s.id} email={s.email} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
