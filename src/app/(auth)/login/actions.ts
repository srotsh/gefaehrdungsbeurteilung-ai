"use server";

import { signIn } from "@flow/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-Mail und Passwort erforderlich." };

  const { error } = await signIn({ email, password });
  if (error) return { error: error.message };
  return { ok: true };
}
