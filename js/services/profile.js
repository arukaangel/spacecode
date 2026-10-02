import { supabase } from "./supabase.js";

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase.from("profiles")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(userId, file) {
  if (!file) return null;
  const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/avatar-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
