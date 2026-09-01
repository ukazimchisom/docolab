"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

const AVATAR_COLORS = [
  "bg-primary",
  "bg-emerald-700",
  "bg-amber-700",
  "bg-rose-700",
];

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export async function login(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(input: unknown) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the form for errors." };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        initials: getInitials(fullName),
        avatar_color:
          AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // A session means email confirmation is off and the user is already
  // logged in. No session means they must confirm their email first.
  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/signup/confirm-email");
}
