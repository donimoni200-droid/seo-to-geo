"use client";

import { useActionState } from "react";
import { sendContactMessage, type ActionState } from "@/app/actions";
import { LoaderCircle } from "lucide-react";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionState | null, FormData>(
    sendContactMessage,
    null
  );

  return (
    <form action={formAction} className="contact-form" data-open={state?.ok}>
      <p className="home-section-kicker">Send a message</p>
      <h2 className="contact-form__title">
        Skip the inbox <em>small talk.</em>
      </h2>
      <div className="contact-form__grid">
        <div className="contact-form__field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" name="name" type="text" required maxLength={120} autoComplete="name" />
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-email">Your email</label>
          <input id="cf-email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div className="contact-form__field">
        <label htmlFor="cf-subject">Subject (optional)</label>
        <input id="cf-subject" name="subject" type="text" maxLength={200} />
      </div>
      <div className="contact-form__field">
        <label htmlFor="cf-message">What's on your mind?</label>
        <textarea id="cf-message" name="message" required minLength={10} maxLength={5000} rows={5} />
      </div>
      <button type="submit" className="site-form__submit" disabled={pending || state?.ok}>
        {pending ? (
          <>
            <LoaderCircle size={16} className="spin" aria-hidden /> Sending…
          </>
        ) : (
          "Send the message →"
        )}
      </button>
      {state && (
        <p className={`waitlist-form__msg${state.ok ? " is-ok" : ""}`} role="status">
          {state.message}
        </p>
      )}
    </form>
  );
}
