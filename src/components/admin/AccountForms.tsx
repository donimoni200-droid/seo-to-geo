"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  updateAccountAction,
  changePasswordAction,
  type AdminActionState,
} from "@/app/admin/actions";

export function AccountForms({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [accountState, accountAction, accountPending] = useActionState<
    AdminActionState | null,
    FormData
  >(updateAccountAction, null);

  const [pwState, pwAction, pwPending] = useActionState<
    AdminActionState | null,
    FormData
  >(changePasswordAction, null);

  return (
    <div className="space-y-5">
      <form action={accountAction} className="admin-card space-y-4">
        <h2 className="admin-card__title">Profile</h2>
        <div className="space-y-1.5">
          <Label htmlFor="acc-name">Display name</Label>
          <Input id="acc-name" name="name" defaultValue={name} placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="acc-email">Login email</Label>
          <Input id="acc-email" name="email" type="email" required defaultValue={email} />
        </div>
        <Button type="submit" disabled={accountPending} className="bg-[#d02e2e] hover:bg-[#b62626]">
          {accountPending ? <LoaderCircle size={16} className="spin" /> : null}
          Save profile
        </Button>
        {accountState && (
          <p className={`text-sm font-semibold ${accountState.ok ? "text-green-700" : "text-red-600"}`} role="status">
            {accountState.message}
          </p>
        )}
      </form>

      <form action={pwAction} className="admin-card space-y-4">
        <h2 className="admin-card__title">Change password</h2>
        <div className="space-y-1.5">
          <Label htmlFor="pw-current">Current password</Label>
          <Input id="pw-current" name="current" type="password" required autoComplete="current-password" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw-next">New password</Label>
          <Input
            id="pw-next"
            name="next"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </div>
        <Button type="submit" disabled={pwPending} className="bg-[#d02e2e] hover:bg-[#b62626]">
          {pwPending ? <LoaderCircle size={16} className="spin" /> : null}
          Change password
        </Button>
        {pwState && (
          <p className={`text-sm font-semibold ${pwState.ok ? "text-green-700" : "text-red-600"}`} role="status">
            {pwState.message}
          </p>
        )}
      </form>
    </div>
  );
}
