import { modules } from "../data/modules.js";

export function profilePage(user, progress = {}, profile = null) {
  if (!user) return `<section class="section"><div class="container"><div class="card"><h2>Sign in to save your learning history.</h2><p>Your progress works locally without an account, but a SpaceCode account lets it sync across devices.</p><a class="btn btn-primary" href="#/auth">Sign in</a></div></div></section>`;
  const completed = Object.values(progress).filter(p => p.completed).length;
  const avg = modules.length ? Math.round(modules.reduce((sum,m)=>sum+(progress[m.id]?.progressPercent||0),0)/modules.length) : 0;
  return `<section class="page-hero"><div class="container"><div class="eyebrow">Your dashboard</div><h1>${profile?.display_name || user.email}</h1><p>Track learning progress, completed modules and future project work.</p></div></section>
  <section class="section-tight"><div class="container">
    <div class="kpi-grid"><div class="kpi"><span>Modules completed</span><strong>${completed}/${modules.length}</strong></div><div class="kpi"><span>Average progress</span><strong>${avg}%</strong></div><div class="kpi"><span>Account</span><strong style="font-size:1rem">${user.email}</strong></div><div class="kpi"><span>Role</span><strong>${profile?.role || "learner"}</strong></div></div>
    <div class="grid grid-2" style="margin-top:20px">${modules.map(m=>{const p=progress[m.id]?.progressPercent||0;return `<div class="card"><h3>${m.icon} ${m.title}</h3><div class="progress"><span style="width:${p}%"></span></div><p>${p}% complete</p><a class="btn btn-secondary" href="#/module/${m.id}">Continue</a></div>`}).join("")}</div>
    ${profile?.role === "admin" ? `<div style="margin-top:20px"><a class="btn btn-primary" href="#/admin">Open admin analytics</a></div>` : ""}
  </div></section>`;
}
