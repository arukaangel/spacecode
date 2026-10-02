import { shell } from "./components/layout.js";
import { parseRoute } from "./router.js";
import { homePage } from "./pages/home.js";
import { learnPage } from "./pages/learn.js";
import { modulePage } from "./pages/module.js";
import { projectsPage } from "./pages/projects.js";
import { spaceDataPage } from "./pages/space-data.js";
import { authPage } from "./pages/auth.js";
import { profilePage } from "./pages/profile.js";
import { communityPage } from "./pages/community.js";
import { adminPage } from "./pages/admin.js";
import { modules, getModule } from "./data/modules.js";
import { supabase, getCurrentUser, getProfile, isSupabaseConfigured } from "./services/supabase.js";
import { requestEmailCode, verifyEmailCode, signOut } from "./services/auth.js";
import { saveModuleProgress, saveQuizAttempt, loadAllProgress } from "./services/progress.js";
import { trackEvent, getAdminAnalytics } from "./services/analytics.js";
import { getApod, getNeoFeed } from "./services/nasa.js";

const app = document.querySelector("#app");
let user = null;
let profile = null;
let progress = {};
let completedLessons = {};

function escapeHtml(value = "") {
  return value.replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}

async function refreshSession() {
  user = await getCurrentUser();
  profile = user ? await getProfile(user.id) : null;
  progress = await loadAllProgress(user);
}

async function render() {
  const { page, param } = parseRoute();
  let content;
  if (page === "home") content = homePage();
  else if (page === "learn") content = learnPage(progress);
  else if (page === "module") content = modulePage(param, progress[param]?.progressPercent || 0);
  else if (page === "projects") content = projectsPage();
  else if (page === "space-data") content = spaceDataPage();
  else if (page === "auth") content = authPage(isSupabaseConfigured());
  else if (page === "profile") content = profilePage(user, progress, profile);
  else if (page === "community") content = communityPage();
  else if (page === "admin") content = adminPage(profile);
  else content = `<section class="section"><div class="container"><div class="empty">Page not found.</div></div></section>`;

  app.innerHTML = shell(content, user);
  bindGlobal();
  bindPage(page, param);
  trackEvent(user, "page_view", { page, param });
}

function bindGlobal() {
  document.querySelector("#logoutBtn")?.addEventListener("click", async () => {
    await signOut();
    user = null; profile = null; progress = await loadAllProgress(null);
    location.hash = "#/";
    await render();
  });
}

function bindPage(page, param) {
  if (page === "auth") bindAuth();
  if (page === "module") bindModule(param);
  if (page === "space-data") bindSpaceData();
  if (page === "projects") bindProjects();
  if (page === "admin") bindAdmin();
}

function bindAuth() {
  const requestForm = document.querySelector("#requestCodeForm");
  const verifyForm = document.querySelector("#verifyCodeForm");
  const msg = document.querySelector("#authMessage");
  let email = "";

  requestForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    email = document.querySelector("#authEmail").value.trim();
    try {
      await requestEmailCode(email);
      verifyForm.classList.remove("hidden");
      msg.innerHTML = `<div class="notice success">Code sent. Check your email.</div>`;
    } catch (err) {
      msg.innerHTML = `<div class="notice error">${escapeHtml(err.message)}</div>`;
    }
  });

  verifyForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = document.querySelector("#authCode").value.trim();
    try {
      await verifyEmailCode(email, token);
      await refreshSession();
      location.hash = "#/profile";
    } catch (err) {
      msg.innerHTML = `<div class="notice error">${escapeHtml(err.message)}</div>`;
    }
  });
}

function bindModule(moduleId) {
  const m = getModule(moduleId);
  if (!m) return;
  completedLessons[moduleId] ??= new Set();

  document.querySelectorAll("[data-jump]").forEach(btn => btn.addEventListener("click", () => {
    document.querySelector(`#${btn.dataset.jump}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  document.querySelectorAll(".complete-lesson").forEach(btn => btn.addEventListener("click", async () => {
    completedLessons[moduleId].add(Number(btn.dataset.lesson));
    btn.textContent = "Completed ✓";
    btn.disabled = true;
    const base = Math.round((completedLessons[moduleId].size / (m.lessons.length + 1)) * 100);
    await saveModuleProgress(user, moduleId, base, false);
    progress[moduleId] = { progressPercent: base, completed: false };
    updateModuleProgress(base);
    trackEvent(user, "lesson_completed", { moduleId, lesson: Number(btn.dataset.lesson) });
  }));

  document.querySelector("#quizForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    let score = 0;
    let answered = 0;
    m.quiz.forEach((q, i) => {
      const chosen = document.querySelector(`input[name="q${i}"]:checked`);
      if (chosen) {
        answered++;
        if (Number(chosen.value) === q.answer) score++;
      }
    });
    const result = document.querySelector("#quizResult");
    if (answered < m.quiz.length) {
      result.innerHTML = `<div class="notice error">Answer all questions before submitting.</div>`;
      return;
    }
    const passed = score / m.quiz.length >= 0.67;
    result.innerHTML = `<div class="notice ${passed ? "success" : "error"}">You scored ${score}/${m.quiz.length}. ${passed ? "Module completed!" : "Review the lessons and try again."}</div>`;
    await saveQuizAttempt(user, moduleId, score, m.quiz.length);
    trackEvent(user, "quiz_submitted", { moduleId, score, total: m.quiz.length, passed });
    if (passed) {
      await saveModuleProgress(user, moduleId, 100, true);
      progress[moduleId] = { progressPercent: 100, completed: true };
      updateModuleProgress(100);
    }
  });
}

function updateModuleProgress(percent) {
  const bar = document.querySelector("#moduleProgressBar");
  const label = document.querySelector("#moduleProgressLabel");
  if (bar) bar.style.width = `${percent}%`;
  if (label) label.textContent = `${percent}% complete`;
}

function bindProjects() {
  document.querySelectorAll(".project-start").forEach(btn => btn.addEventListener("click", async () => {
    btn.textContent = "Saved ✓";
    btn.disabled = true;
    trackEvent(user, "project_saved", { projectId: btn.dataset.project });
    if (supabase && user) {
      await supabase.from("project_submissions").upsert({ user_id: user.id, project_id: btn.dataset.project, status: "planned" }, { onConflict: "user_id,project_id" });
    }
  }));
}

function bindSpaceData() {
  document.querySelector("#loadApod")?.addEventListener("click", async () => {
    const target = document.querySelector("#apodResult");
    target.innerHTML = `<div class="notice">Loading…</div>`;
    try {
      const d = await getApod();
      const media = d.media_type === "image" ? `<img src="${d.url}" alt="${escapeHtml(d.title)}" style="width:100%;border-radius:14px;margin:10px 0">` : `<a class="btn btn-secondary" href="${d.url}" target="_blank" rel="noopener">Open media ↗</a>`;
      target.innerHTML = `<h3>${escapeHtml(d.title)}</h3>${media}<p>${escapeHtml(d.explanation)}</p>`;
      trackEvent(user, "space_data_loaded", { source: "apod" });
    } catch (err) { target.innerHTML = `<div class="notice error">${escapeHtml(err.message)}</div>`; }
  });

  document.querySelector("#loadNeo")?.addEventListener("click", async () => {
    const target = document.querySelector("#neoResult");
    target.innerHTML = `<div class="notice">Loading…</div>`;
    try {
      const objects = await getNeoFeed();
      const rows = objects.slice(0, 12).map(o => {
        const approach = o.close_approach_data?.[0];
        const min = o.estimated_diameter?.kilometers?.estimated_diameter_min ?? 0;
        const max = o.estimated_diameter?.kilometers?.estimated_diameter_max ?? 0;
        return `<tr><td>${escapeHtml(o.name)}</td><td>${((min+max)/2).toFixed(3)} km</td><td>${Number(approach?.relative_velocity?.kilometers_per_hour || 0).toLocaleString()} km/h</td><td>${Number(approach?.miss_distance?.kilometers || 0).toLocaleString()} km</td><td>${o.is_potentially_hazardous_asteroid ? "Yes" : "No"}</td></tr>`;
      }).join("");
      target.innerHTML = `<div class="data-table-wrap"><table><thead><tr><th>Object</th><th>Est. diameter</th><th>Velocity</th><th>Miss distance</th><th>Potentially hazardous</th></tr></thead><tbody>${rows}</tbody></table></div><p><strong>Data question:</strong> Which variable seems most useful for comparing objects, and why?</p>`;
      trackEvent(user, "space_data_loaded", { source: "neo", count: objects.length });
    } catch (err) { target.innerHTML = `<div class="notice error">${escapeHtml(err.message)}</div>`; }
  });
}

async function bindAdmin() {
  if (!profile || profile.role !== "admin") return;
  const target = document.querySelector("#analyticsTable");
  try {
    const events = await getAdminAnalytics();
    const counts = Object.fromEntries(["module_started","quiz_submitted","project_saved"].map(k=>[k,events.filter(e=>e.event_name===k).length]));
    const kpis = document.querySelectorAll("#adminKpis .kpi strong");
    if (kpis[0]) kpis[0].textContent = events.length;
    if (kpis[1]) kpis[1].textContent = counts.module_started || events.filter(e=>e.event_name==="lesson_completed").length;
    if (kpis[2]) kpis[2].textContent = counts.quiz_submitted || 0;
    if (kpis[3]) kpis[3].textContent = counts.project_saved || 0;
    target.className = "data-table-wrap";
    target.innerHTML = `<table><thead><tr><th>Event</th><th>Page</th><th>Time</th></tr></thead><tbody>${events.slice(0,100).map(e=>`<tr><td>${escapeHtml(e.event_name)}</td><td>${escapeHtml(e.page_path||"")}</td><td>${new Date(e.created_at).toLocaleString()}</td></tr>`).join("")}</tbody></table>`;
  } catch (err) { target.innerHTML = `<div class="notice error">${escapeHtml(err.message)}</div>`; }
}

window.addEventListener("hashchange", render);

if (supabase) {
  supabase.auth.onAuthStateChange(async () => { await refreshSession(); await render(); });
}

await refreshSession();
await render();
