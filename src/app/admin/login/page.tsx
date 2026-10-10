"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AdminActionState } from "@/app/admin/actions";
import { LoaderCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<AdminActionState | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="admin-login">
      <div className="admin-login__card contact-form">
        <p className="home-section-kicker">Control room</p>
        <h1 className="contact-form__title">
          SEO <em>to GEO</em> Admin
        </h1>
        <p className="admin-login__lead">
          Sign in to edit every word, section, guide, and setting on the site.
        </p>
        <form action={formAction} className="admin-login__form">
          <div className="contact-form__field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@seotogeo.io"
            />
          </div>
          <div className="contact-form__field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="site-form__submit" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle size={16} className="spin" aria-hidden /> Signing in…
              </>
            ) : (
              "Sign in →"
            )}
          </button>
          {state && !state.ok && (
            <p className="waitlist-form__msg" role="alert" style={{ flexBasis: "100%" }}>
              {state.message}
            </p>
          )}
        </form>
        <div className="admin-login__foot">
          <Link href="/">← Back to the site</Link>
        </div>
      </div>
    </div>
  );
}
