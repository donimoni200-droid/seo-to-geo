import { requireAdmin } from "@/lib/auth";
import { getBrand } from "@/lib/content";
import { AdminShell } from "@/components/admin/AdminShell";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  let brand;
  try {
    brand = await getBrand();
  } catch {
    brand = { name: "SEO to GEO", firstName: "Layla", emWord: "With", footerTagline: "", year: 2026 };
  }

  return (
    <AdminShell siteName={brand.name} userName={user.name || ""} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
