import { modules } from "../data/modules.js";

export function profilePage(user, progress = {}, profile = null) {
  if (!user) return "";
  const completed = Object.values(progress).filter(p => p.completed).length;
  const avg = modules.length ? Math.round(modules.reduce((sum,m)=>sum+(progress[m.id]?.progressPercent||0),0)/modules.length) : 0;
  const initial = (profile?.username || profile?.display_name || user.email || "S").slice(0,1).toUpperCase();
  return `<section class="page-hero"><div class="container profile-head"><div>${profile?.avatar_url ? `<img class="profile-avatar" src="${profile.avatar_url}" alt="Avatar">` : `<div class="profile-avatar avatar-fallback">${initial}</div>`}</div><div><div class="eyebrow">Your dashboard</div><h1>${profile?.display_name || user.email}</h1><p>@${profile?.username || "choose-a-username"} · Keep building, learning and sharing.</p></div></div></section>
  <section class="section-tight"><div class="container">
    <div class="grid grid-2">
      <div class="card"><h3>Edit profile</h3><form id="profileForm">
        <div class="form-group"><label class="label">Display name</label><input class="input" id="profileName" maxlength="50" value="${escapeAttr(profile?.display_name || "")}" required></div>
        <div class="form-group"><label class="label">Username</label><input class="input" id="profileUsername" maxlength="24" pattern="[A-Za-z0-9_]{3,24}" value="${escapeAttr(profile?.username || "")}" placeholder="spacelearner" required><small class="muted">3–24 characters: letters, numbers, underscore.</small></div>
        <div class="form-group"><label class="label">Avatar</label><input class="input" id="profileAvatar" type="file" accept="image/png,image/jpeg,image/webp"></div>
        <button class="btn btn-primary">Save profile</button><div id="profileMessage"></div>
      </form></div>
      <div><div class="kpi-grid"><div class="kpi"><span>Modules completed</span><strong>${completed}/${modules.length}</strong></div><div class="kpi"><span>Average progress</span><strong>${avg}%</strong></div><div class="kpi"><span>Projects shared</span><strong>${profile?.posts_count || 0}</strong></div><div class="kpi"><span>Role</span><strong>${profile?.role || "learner"}</strong></div></div></div>
    </div>
    <div class="grid grid-2" style="margin-top:20px">${modules.map(m=>{const p=progress[m.id]?.progressPercent||0;return `<div class="card"><h3>${m.icon} ${m.title}</h3><div class="progress"><span style="width:${p}%"></span></div><p>${p}% complete</p><a class="btn btn-secondary" href="#/module/${m.id}">Continue</a></div>`}).join("")}</div>
    ${profile?.role === "admin" ? `<div style="margin-top:20px"><a class="btn btn-primary" href="#/admin">Open admin analytics</a></div>` : ""}
  </div></section>`;
}

function escapeAttr(value="") { return String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
