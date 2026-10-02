import { supabase } from "./supabase.js";

export async function getCommunityPosts(userId) {
  const { data: posts, error } = await supabase.from("community_posts")
    .select(`id,user_id,title,body,github_url,demo_url,image_url,created_at,profiles:user_id(id,display_name,username,avatar_url),community_likes(user_id),community_comments(id)`) 
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (posts || []).map(p => ({
    ...p,
    like_count: p.community_likes?.length || 0,
    comment_count: p.community_comments?.length || 0,
    liked_by_me: !!p.community_likes?.some(l => l.user_id === userId)
  }));
}

export async function createCommunityPost(userId, payload, imageFile = null) {
  let image_url = null;
  if (imageFile?.size) {
    const ext = (imageFile.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("community-media").upload(path, imageFile, { contentType: imageFile.type });
    if (uploadError) throw uploadError;
    image_url = supabase.storage.from("community-media").getPublicUrl(path).data.publicUrl;
  }
  const { data, error } = await supabase.from("community_posts").insert({ user_id: userId, ...payload, image_url }).select().single();
  if (error) throw error;
  return data;
}

export async function toggleLike(postId, userId, liked) {
  if (liked) {
    const { error } = await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("community_likes").insert({ post_id: postId, user_id: userId });
    if (error) throw error;
  }
}

export async function getComments(postId) {
  const { data, error } = await supabase.from("community_comments")
    .select(`id,post_id,user_id,body,created_at,profiles:user_id(id,display_name,username,avatar_url)`)
    .eq("post_id", postId).order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addComment(postId, userId, body) {
  const { error } = await supabase.from("community_comments").insert({ post_id: postId, user_id: userId, body });
  if (error) throw error;
}
