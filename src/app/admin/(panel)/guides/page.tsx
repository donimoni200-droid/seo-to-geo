import Link from "next/link";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { GuideActions } from "@/components/admin/GuideActions";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { datef } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminGuidesPage() {
  let guides: Awaited<ReturnType<typeof db.guide.findMany>> = [];
  try {
    guides = await db.guide.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch {
    guides = [];
  }

  return (
    <div>
      <h1 className="admin-page-title">Blogs</h1>
      <p className="admin-page-desc">
        Every blog post on the site lives here — create new posts, attach free PDF downloads,
        copy each post's public link (perfect for Instagram DMs), edit, hide, or delete any time.
      </p>

      <div style={{ marginBottom: 18 }}>
        <Link
          href="/admin/guides/new"
          className="inline-flex items-center gap-2 rounded-md bg-[#d02e2e] px-4 py-2.5 text-sm font-bold text-[#fffae7] hover:bg-[#b62626] transition-colors"
        >
          <Plus size={16} /> New blog post
        </Link>
      </div>

      <div className="admin-card admin-table-wrap">
        {guides.length === 0 && (
          <p style={{ color: "rgba(47,45,45,0.5)" }}>No posts yet — create your first one.</p>
        )}
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid rgba(47,45,45,0.12)" }}>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Post</th>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tag</th>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>PDF</th>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Updated</th>
              <th style={{ padding: "10px 8px", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g.id} style={{ borderBottom: "1px solid rgba(47,45,45,0.08)" }}>
                <td style={{ padding: "12px 8px", maxWidth: 380 }}>
                  <Link href={`/admin/guides/${g.id}`} style={{ fontWeight: 700, color: "#2f2d2d" }}>
                    {g.title}
                  </Link>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(47,45,45,0.5)" }}>/blogs/{g.slug}</p>
                </td>
                <td style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>{g.tag}</td>
                <td style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
                  {g.pdfName ? (
                    <span className="admin-badge admin-badge--ok">Attached</span>
                  ) : (
                    <span className="admin-badge admin-badge--off">—</span>
                  )}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  <span className={`admin-badge ${g.published ? "admin-badge--ok" : "admin-badge--off"}`}>
                    {g.published ? "Live" : "Hidden"}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", whiteSpace: "nowrap", fontSize: "0.78rem", color: "rgba(47,45,45,0.55)" }}>
                  {datef(g.updatedAt)}
                </td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>
                  <div className="inline-flex items-center gap-1">
                    <CopyLinkButton path={`/blogs/${g.slug}`} />
                    <GuideActions id={g.id} published={g.published} title={g.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
