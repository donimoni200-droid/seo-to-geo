import { requireAdmin } from "@/lib/auth";
import { AccountForms } from "@/components/admin/AccountForms";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const user = await requireAdmin();
  return (
    <div>
      <h1 className="admin-page-title">Account</h1>
      <p className="admin-page-desc">
        Your admin login details for this panel.
      </p>
      <AccountForms name={user.name || ""} email={user.email} />
    </div>
  );
}
