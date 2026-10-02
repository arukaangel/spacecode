import { supabase } from "./supabase.js";

export async function trackEvent(user, eventName, metadata = {}) {
  try {
    if (!supabase) return;
    await supabase.from("analytics_events").insert({
      user_id: user?.id ?? null,
      event_name: eventName,
      metadata,
      page_path: location.hash || "#/"
    });
  } catch {
    // Analytics should never break the product experience.
  }
}

export async function getAdminAnalytics() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("analytics_events").select("event_name, created_at, page_path").order("created_at", { ascending: false }).limit(5000);
  if (error) throw error;
  return data || [];
}
