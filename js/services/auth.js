import { supabase } from "./supabase.js";

export async function requestEmailCode(email) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });
  if (error) throw error;
}

export async function verifyEmailCode(email, token) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email"
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
