"use client";

import { useActionState } from "react";
import { joinWaitlist, type ActionState } from "@/app/actions";
import { LoaderCircle } from "lucide-react";

/* Waitlist email capture — used in the footer CTA and final CTAs */
export function WaitlistForm({
  source = "site",
  buttonText = "Join the waitlist",
  className = "",
  buttonClassName = "site-form__submit",
}: {
  source?: string;
  buttonText?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState | null, FormData>(
    joinWaitlist,
    null
  );

  return (
    <form action={formAction} className={`waitlist-form ${className}`} data-open={state?.ok}>
      <input type="hidden" name="source" value={source} />
      <label htmlFor={`waitlist-email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`waitlist-email-${source}`}
        name="email"
        type="email"
        required
        placeholder="you@company.com"
        autoComplete="email"
        disabled={state?.ok}
      />
      <button type="submit" className={buttonClassName} disabled={pending || state?.ok}>
        {pending ? <LoaderCircle size={16} className="spin" aria-hidden /> : buttonText}
      </button>
      {state && (
        <p className={`waitlist-form__msg${state.ok ? " is-ok" : ""}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
