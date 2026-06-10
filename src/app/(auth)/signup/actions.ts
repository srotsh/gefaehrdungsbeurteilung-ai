"use server";

import { signUp } from "@flow/auth";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const companyName = String(formData.get("companyName") ?? "");
  if (!email || !password) return { error: "E-Mail und Passwort erforderlich." };
  if (password.length < 8) return { error: "Passwort muss mindestens 8 Zeichen lang sein." };

  const { error } = await signUp({
    email,
    password,
    fullName,
    companyName,
    emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/callback`,
  });
  if (error) return { error: error.message };
  return { ok: true };
}
