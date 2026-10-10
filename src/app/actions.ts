"use server";

import { z } from "zod";
import { db } from "@/lib/db";

/* ============================================================
   PUBLIC SERVER ACTIONS — waitlist signups & contact messages
   ============================================================ */

export type ActionState = {
  ok: boolean;
  message: string;
};

const emailSchema = z.string().trim().email().max(200);

export async function joinWaitlist(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  const source = String(formData.get("source") || "site").slice(0, 50);
  try {
    await db.subscriber.upsert({
      where: { email: email.data.toLowerCase() },
      update: {},
      create: { email: email.data.toLowerCase(), source },
    });
    return { ok: true, message: "You're on the list! Watch your inbox." };
  } catch {
    return { ok: false, message: "Something went wrong — please try again." };
  }
}

const messageSchema = z.object({
  name: z.string().trim().min(1, "Please tell me your name.").max(120),
  email: emailSchema,
  subject: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more (at least 10 characters).")
    .max(5000),
});

export async function sendContactMessage(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const parsed = messageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || "",
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Please check the form.",
    };
  }
  try {
    await db.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject,
        body: parsed.data.message,
      },
    });
    return { ok: true, message: "Message sent! I usually reply within a day." };
  } catch {
    return { ok: false, message: "Something went wrong — please try again." };
  }
}
