import { supabase } from "./supabase.js";

const LOCAL_KEY = "spacecode_progress_v1";

function getLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; }
  catch { return {}; }
}

function setLocal(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

export async function saveModuleProgress(user, moduleId, progressPercent, completed = false) {
  if (!user || !supabase) {
    const current = getLocal();
    current[moduleId] = { moduleId, progressPercent, completed, updatedAt: new Date().toISOString() };
    setLocal(current);
    return;
  }

  const { error } = await supabase.from("module_progress").upsert({
    user_id: user.id,
    module_id: moduleId,
    progress_percent: progressPercent,
    completed,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id,module_id" });
  if (error) throw error;
}

export async function saveQuizAttempt(user, moduleId, score, total) {
  if (!user || !supabase) {
    const current = getLocal();
    current[`${moduleId}_quiz`] = { score, total, attemptedAt: new Date().toISOString() };
    setLocal(current);
    return;
  }
  const { error } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: moduleId,
    score,
    total_questions: total
  });
  if (error) throw error;
}

export async function loadAllProgress(user) {
  if (!user || !supabase) return getLocal();
  const { data, error } = await supabase.from("module_progress").select("*").eq("user_id", user.id);
  if (error) return {};
  return Object.fromEntries((data || []).map((row) => [row.module_id, {
    moduleId: row.module_id,
    progressPercent: row.progress_percent,
    completed: row.completed,
    updatedAt: row.updated_at
  }]));
}
