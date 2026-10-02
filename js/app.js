import { shell } from "./components/layout.js";
import { parseRoute } from "./router.js";
import { homePage } from "./pages/home.js";
import { learnPage } from "./pages/learn.js";
import { modulePage } from "./pages/module.js";
import { projectsPage } from "./pages/projects.js";
import { guidedProjectsPage } from "./pages/guided-projects.js";
import { spaceDataPage } from "./pages/space-data.js";
import { authPage } from "./pages/auth.js";
import { profilePage } from "./pages/profile.js";
import { communityPage } from "./pages/community.js";
import { adminPage } from "./pages/admin.js";
import { getModule } from "./data/modules.js";
import { supabase, getCurrentUser, getProfile, isSupabaseConfigured } from "./services/supabase.js";
import {
  signInWithPassword,
  signUpWithPassword,
  requestEmailCode,
  verifyEmailCode,
  signOut
} from "./services/auth.js";
import { saveModuleProgress, saveQuizAttempt, loadAllProgress } from "./services/progress.js";
import { trackEvent, getAdminAnalytics } from "./services/analytics.js";
import { getApod, getNeoFeed } from "./services/nasa.js";
import { updateProfile, uploadAvatar } from "./services/profile.js";
import { getCommunityPosts, createCommunityPost, toggleLike, getComments, addComment } from "./services/community.js";
import { askSpaceCodeAI } from "./services/ai.js";

const app = document.querySelector("#app");
let user = null, profile = null, progress = {}, completedLessons = {}, communityPosts = [];
const aiHistory = [];
const privatePages = new Set(["learn","module","projects","guided-projects","space-data","profile","community","admin"]);

function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }

async function refreshSession() {
  user = await getCurrentUser();
  profile = user ? await getProfile(user.id) : null;
  progress = user ? await loadAllProgress(user) : {};
}

async function render() {
  let { page, param } = parseRoute();
  if (!user && privatePages.has(page)) {
    location.hash = "#/auth";
    page = "auth"; param = null;
  }
  let content;
  if (page === "home") content = homePage();
  else if (page === "learn") content = learnPage(progress);
  else if (page === "module") content = modulePage(param, progress[param]?.progressPercent || 0);
  else if (page === "projects") content = projectsPage();
  else if (page === "guided-projects") content = guidedProjectsPage(progress);
  else if (page === "space-data") content = spaceDataPage();
  else if (page === "auth") content = user ? `<section class="section"><div class="container"><div class="card"><h2>You are signed in.</h2><a class="btn btn-primary" href="#/learn">Start learning</a></div></div></section>` : authPage(isSupabaseConfigured());
  else if (page === "profile") content = profilePage(user, progress, profile);
  else if (page === "community") { communityPosts = await getCommunityPosts(user.id).catch(()=>[]); content = communityPage(communityPosts, profile); }
  else if (page === "admin") content = adminPage(profile);
  else content = `<section class="section"><div class="container"><div class="empty">Page not found.</div></div></section>`;

  app.innerHTML = shell(content, user, profile);
  bindGlobal(); bindPage(page, param); if (user) bindAI();
  trackEvent(user, "page_view", { page, param });
}

function bindGlobal() {
  document.querySelector("#logoutBtn")?.addEventListener("click", async()=>{ await signOut(); user=null; profile=null; progress={}; location.hash="#/"; await render(); });
}

function bindPage(page, param) {
  if (page === "auth") bindAuth();
  if (page === "module") bindModule(param);
  if (page === "space-data") bindSpaceData();
  if (page === "projects") bindProjects();
  if (page === "guided-projects") bindGuidedProjects();
  if (page === "profile") bindProfile();
  if (page === "community") bindCommunity();
  if (page === "admin") bindAdmin();
}

function bindAuth() {
  const loginForm = document.querySelector("#loginForm");
  const signupForm = document.querySelector("#signupForm");

  const requestForm = document.querySelector("#requestCodeForm");
  const verifyForm = document.querySelector("#verifyCodeForm");

  const otpArea = document.querySelector("#otpArea");
  const msg = document.querySelector("#authMessage");

  let otpEmail = "";

  // Tabs
  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.mode;

      loginForm?.classList.toggle("hidden", mode !== "login");
      signupForm?.classList.toggle("hidden", mode !== "signup");
      otpArea?.classList.toggle("hidden", mode !== "otp");

      document.querySelectorAll(".auth-tab").forEach((tab) => {
        tab.classList.toggle(
          "btn-primary",
          tab.dataset.mode === mode
        );
      });

      if (msg) {
        msg.innerHTML = "";
      }
    });
  });

  // LOGIN WITH PASSWORD
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
      document.querySelector("#loginEmail").value.trim();

    const password =
      document.querySelector("#loginPassword").value;

    try {
      msg.innerHTML =
        `<div class="notice">Signing in...</div>`;

      await signInWithPassword(email, password);

      await refreshSession();

      location.hash = "#/learn";

      await render();
    } catch (error) {
      msg.innerHTML =
        `<div class="notice error">${escapeHtml(error.message)}</div>`;
    }
  });

  // CREATE ACCOUNT
  signupForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
      document.querySelector("#signupEmail").value.trim();

    const password =
      document.querySelector("#signupPassword").value;

    const confirm =
      document.querySelector("#signupPasswordConfirm").value;

    if (password !== confirm) {
      msg.innerHTML =
        `<div class="notice error">Passwords do not match.</div>`;
      return;
    }

    try {
      msg.innerHTML =
        `<div class="notice">Creating account...</div>`;

      const result =
        await signUpWithPassword(email, password);

      if (result.session) {
        await refreshSession();

        location.hash = "#/profile";

        await render();
      } else {
        msg.innerHTML = `
          <div class="notice success">
            Account created. Check your email to confirm your account,
            then return here and log in.
          </div>
        `;
      }
    } catch (error) {
      msg.innerHTML =
        `<div class="notice error">${escapeHtml(error.message)}</div>`;
    }
  });

  // REQUEST EMAIL CODE
  requestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    otpEmail =
      document.querySelector("#authEmail").value.trim();

    try {
      await requestEmailCode(otpEmail);

      verifyForm.classList.remove("hidden");

      msg.innerHTML =
        `<div class="notice success">
          Code sent. Check your email.
        </div>`;
    } catch (error) {
      msg.innerHTML =
        `<div class="notice error">${escapeHtml(error.message)}</div>`;
    }
  });

  // VERIFY EMAIL CODE
  verifyForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token =
      document.querySelector("#authCode").value.trim();

    try {
      await verifyEmailCode(otpEmail, token);

      await refreshSession();

      location.hash = "#/learn";

      await render();
    } catch (error) {
      msg.innerHTML =
        `<div class="notice error">${escapeHtml(error.message)}</div>`;
    }
  });
}

function bindProfile() {
  document.querySelector("#profileForm")?.addEventListener("submit", async e=>{
    e.preventDefault(); const msg=document.querySelector("#profileMessage");
    try {
      const display_name=document.querySelector("#profileName").value.trim();
      const username=document.querySelector("#profileUsername").value.trim().toLowerCase();
      const file=document.querySelector("#profileAvatar").files?.[0];
      const avatar_url=file ? await uploadAvatar(user.id,file) : profile?.avatar_url || null;
      profile=await updateProfile(user.id,{display_name,username,avatar_url});
      msg.innerHTML='<div class="notice success">Profile saved ✓</div>'; setTimeout(render,500);
    } catch(err){ msg.innerHTML=`<div class="notice error">${escapeHtml(err.message.includes("duplicate") ? "That username is already taken." : err.message)}</div>`; }
  });
}

async function bindCommunity() {
  document.querySelector("#communityPostForm")?.addEventListener("submit", async e=>{
    e.preventDefault(); const msg=document.querySelector("#communityMessage");
    try { await createCommunityPost(user.id,{title:document.querySelector("#postTitle").value.trim(),body:document.querySelector("#postBody").value.trim(),github_url:document.querySelector("#postGithub").value.trim()||null,demo_url:document.querySelector("#postDemo").value.trim()||null},document.querySelector("#postImage").files?.[0]); trackEvent(user,"community_post_created",{}); await render(); }
    catch(err){ msg.innerHTML=`<div class="notice error">${escapeHtml(err.message)}</div>`; }
  });
  document.querySelectorAll(".like-post").forEach(btn=>btn.addEventListener("click",async()=>{ await toggleLike(btn.dataset.post,user.id,btn.dataset.liked==="true"); await render(); }));
  document.querySelectorAll(".comments-toggle").forEach(btn=>btn.addEventListener("click",async()=>{
    const wrap=document.querySelector(`#comments-${btn.dataset.post}`); wrap.classList.toggle("hidden"); if(wrap.classList.contains("hidden")) return;
    const list=wrap.querySelector(".comments-list"); list.innerHTML='<div class="muted">Loading…</div>'; try{ const comments=await getComments(btn.dataset.post); list.innerHTML=comments.length?comments.map(c=>`<div class="comment"><strong>@${escapeHtml(c.profiles?.username||"learner")}</strong><p>${escapeHtml(c.body)}</p></div>`).join(""):'<div class="muted">No comments yet.</div>'; }catch(err){list.innerHTML=`<div class="notice error">${escapeHtml(err.message)}</div>`;}
  }));
  document.querySelectorAll(".comment-form").forEach(form=>form.addEventListener("submit",async e=>{ e.preventDefault(); const input=form.querySelector("input"); await addComment(form.dataset.post,user.id,input.value.trim()); input.value=""; const toggle=document.querySelector(`.comments-toggle[data-post="${form.dataset.post}"]`); await toggle.click(); await toggle.click(); }));
}

function bindGuidedProjects(){ document.querySelectorAll(".guided-complete").forEach(btn=>btn.addEventListener("click",async()=>{ const id=`guided:${btn.dataset.project}`; await saveModuleProgress(user,id,100,true); progress[id]={progressPercent:100,completed:true}; btn.textContent="Completed ✓";btn.disabled=true;trackEvent(user,"guided_project_completed",{projectId:btn.dataset.project}); })); }

function bindAI(){
  const fab=document.querySelector("#aiFab"), panel=document.querySelector("#aiPanel"), close=document.querySelector("#aiClose"), form=document.querySelector("#aiForm"), input=document.querySelector("#aiInput"), messages=document.querySelector("#aiMessages");
  fab?.addEventListener("click",()=>panel.classList.remove("hidden")); close?.addEventListener("click",()=>panel.classList.add("hidden"));
  form?.addEventListener("submit",async e=>{ e.preventDefault(); const text=input.value.trim(); if(!text)return; input.value=""; messages.insertAdjacentHTML("beforeend",`<div class="ai-msg user">${escapeHtml(text)}</div><div class="ai-msg assistant ai-loading">Thinking…</div>`); messages.scrollTop=messages.scrollHeight; try{ const reply=await askSpaceCodeAI(text,aiHistory); aiHistory.push({role:"user",content:text},{role:"assistant",content:reply}); messages.querySelector(".ai-loading")?.remove(); messages.insertAdjacentHTML("beforeend",`<div class="ai-msg assistant">${escapeHtml(reply).replace(/\n/g,"<br>")}</div>`); }catch(err){ messages.querySelector(".ai-loading")?.remove(); messages.insertAdjacentHTML("beforeend",`<div class="ai-msg assistant">AI is not configured yet. ${escapeHtml(err.message)}</div>`);} messages.scrollTop=messages.scrollHeight; });
}

function bindModule(moduleId) {
  const m=getModule(moduleId); if(!m)return; completedLessons[moduleId]??=new Set();
  document.querySelectorAll("[data-jump]").forEach(btn=>btn.addEventListener("click",()=>document.querySelector(`#${btn.dataset.jump}`)?.scrollIntoView({behavior:"smooth",block:"start"})));
  document.querySelectorAll(".complete-lesson").forEach(btn=>btn.addEventListener("click",async()=>{ completedLessons[moduleId].add(Number(btn.dataset.lesson));btn.textContent="Completed ✓";btn.disabled=true;const base=Math.round((completedLessons[moduleId].size/(m.lessons.length+1))*100);await saveModuleProgress(user,moduleId,base,false);progress[moduleId]={progressPercent:base,completed:false};updateModuleProgress(base);trackEvent(user,"lesson_completed",{moduleId,lesson:Number(btn.dataset.lesson)}); }));
  document.querySelector("#quizForm")?.addEventListener("submit",async e=>{e.preventDefault();let score=0,answered=0;m.quiz.forEach((q,i)=>{const chosen=document.querySelector(`input[name="q${i}"]:checked`);if(chosen){answered++;if(Number(chosen.value)===q.answer)score++;}});const result=document.querySelector("#quizResult");if(answered<m.quiz.length){result.innerHTML='<div class="notice error">Answer all questions before submitting.</div>';return;}const passed=score/m.quiz.length>=.67;result.innerHTML=`<div class="notice ${passed?"success":"error"}">You scored ${score}/${m.quiz.length}. ${passed?"Module completed!":"Review the lessons and try again."}</div>`;await saveQuizAttempt(user,moduleId,score,m.quiz.length);trackEvent(user,"quiz_submitted",{moduleId,score,total:m.quiz.length,passed});if(passed){await saveModuleProgress(user,moduleId,100,true);progress[moduleId]={progressPercent:100,completed:true};updateModuleProgress(100);}});
}
function updateModuleProgress(percent){const bar=document.querySelector("#moduleProgressBar"),label=document.querySelector("#moduleProgressLabel");if(bar)bar.style.width=`${percent}%`;if(label)label.textContent=`${percent}% complete`;}
function bindProjects(){document.querySelectorAll(".project-start").forEach(btn=>btn.addEventListener("click",async()=>{btn.textContent="Saved ✓";btn.disabled=true;trackEvent(user,"project_saved",{projectId:btn.dataset.project});if(supabase&&user)await supabase.from("project_submissions").upsert({user_id:user.id,project_id:btn.dataset.project,status:"planned"},{onConflict:"user_id,project_id"});}));}
function bindSpaceData(){
  document.querySelector("#loadApod")?.addEventListener("click",async()=>{const target=document.querySelector("#apodResult");target.innerHTML='<div class="notice">Loading…</div>';try{const d=await getApod();const media=d.media_type==="image"?`<img src="${d.url}" alt="${escapeHtml(d.title)}" style="width:100%;border-radius:14px;margin:10px 0">`:`<a class="btn btn-secondary" href="${d.url}" target="_blank" rel="noopener">Open media ↗</a>`;target.innerHTML=`<h3>${escapeHtml(d.title)}</h3>${media}<p>${escapeHtml(d.explanation)}</p>`;}catch(err){target.innerHTML=`<div class="notice error">${escapeHtml(err.message)}</div>`;}});
  document.querySelector("#loadNeo")?.addEventListener("click",async()=>{const target=document.querySelector("#neoResult");target.innerHTML='<div class="notice">Loading…</div>';try{const objects=await getNeoFeed();const rows=objects.slice(0,12).map(o=>{const a=o.close_approach_data?.[0],min=o.estimated_diameter?.kilometers?.estimated_diameter_min??0,max=o.estimated_diameter?.kilometers?.estimated_diameter_max??0;return `<tr><td>${escapeHtml(o.name)}</td><td>${((min+max)/2).toFixed(3)} km</td><td>${Number(a?.relative_velocity?.kilometers_per_hour||0).toLocaleString()} km/h</td><td>${Number(a?.miss_distance?.kilometers||0).toLocaleString()} km</td><td>${o.is_potentially_hazardous_asteroid?"Yes":"No"}</td></tr>`}).join("");target.innerHTML=`<div class="data-table-wrap"><table><thead><tr><th>Object</th><th>Est. diameter</th><th>Velocity</th><th>Miss distance</th><th>Potentially hazardous</th></tr></thead><tbody>${rows}</tbody></table></div>`;}catch(err){target.innerHTML=`<div class="notice error">${escapeHtml(err.message)}</div>`;}});
}
async function bindAdmin(){if(!profile||profile.role!=="admin")return;const target=document.querySelector("#analyticsTable");try{const events=await getAdminAnalytics();const kpis=document.querySelectorAll("#adminKpis .kpi strong");if(kpis[0])kpis[0].textContent=events.length;if(kpis[1])kpis[1].textContent=events.filter(e=>e.event_name==="lesson_completed").length;if(kpis[2])kpis[2].textContent=events.filter(e=>e.event_name==="quiz_submitted").length;if(kpis[3])kpis[3].textContent=events.filter(e=>e.event_name==="community_post_created").length;target.className="data-table-wrap";target.innerHTML=`<table><thead><tr><th>Event</th><th>Page</th><th>Time</th></tr></thead><tbody>${events.slice(0,100).map(e=>`<tr><td>${escapeHtml(e.event_name)}</td><td>${escapeHtml(e.page_path||"")}</td><td>${new Date(e.created_at).toLocaleString()}</td></tr>`).join("")}</tbody></table>`;}catch(err){target.innerHTML=`<div class="notice error">${escapeHtml(err.message)}</div>`;}}

window.addEventListener("hashchange",render);
if(supabase) supabase.auth.onAuthStateChange(async()=>{await refreshSession();await render();});
await refreshSession();await render();
