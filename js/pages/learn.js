import { modules } from "../data/modules.js";

export function learnPage(progress = {}) {
  return `
    <section class="page-hero"><div class="container"><div class="eyebrow">Learn</div><h1>Structured paths for beginners.</h1><p>Learn the concept, read high-quality resources, complete a mini quiz and then apply the skill in a scientific project.</p></div></section>
    <section class="section-tight"><div class="container"><div class="grid grid-3">
      ${modules.map(m => {
        const p = progress[m.id]?.progressPercent || 0;
        return `<article class="card">
          <div class="icon-box">${m.icon}</div><h3>${m.title}</h3><p>${m.description}</p>
          <div class="tag-row">${m.skills.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
          <div style="margin-top:18px"><div class="progress"><span style="width:${p}%"></span></div><small style="color:var(--muted)">${p}% complete · ${m.estimated}</small></div>
          <div class="card-footer"><span class="tag">${m.level}</span><a class="btn btn-primary" href="#/module/${m.id}">${p ? "Continue" : "Start"}</a></div>
        </article>`;
      }).join("")}
    </div></div></section>`;
}
