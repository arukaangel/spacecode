import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

const configured = SUPABASE_URL.startsWith("http") && !SUPABASE_ANON_KEY.startsWith("YOUR_");

export const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

export const isSupabaseConfigured = () => Boolean(supabase);

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) return null;
  const { count } = await supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("user_id", userId);
  return { ...data, posts_count: count || 0 };
}
