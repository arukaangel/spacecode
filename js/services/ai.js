import { supabase } from "./supabase.js";

export async function askSpaceCodeAI(message, history = []) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.functions.invoke("ai-chat", {
    body: { message, history: history.slice(-8) }
  });
  if (error) throw error;
  if (!data?.reply) throw new Error("AI assistant returned an empty response.");
  return data.reply;
}
