import { guidedProjects } from "../data/guided-projects.js";

export function guidedProjectsPage(userProgress = {}) {
  return `<section class="page-hero"><div class="container"><div class="eyebrow">Guided build path</div><h1>Five projects. One step at a time.</h1><p>Start with a small browser app and gradually move toward APIs and data science. Every project includes a clear outcome, build steps and a stretch challenge.</p></div></section>
  <section class="section-tight"><div class="container guided-list">
    ${guidedProjects.map((p, index) => {
      const done = userProgress[`guided:${p.id}`]?.completed;
      return `<article class="card guided-card" id="guided-${p.id}">
        <div class="guided-number">${String(index + 1).padStart(2,"0")}</div>
        <div>
          <div class="card-footer" style="margin-top:0"><span class="tag">${p.level}</span><span class="tag">${p.time}</span></div>
          <h2>${p.icon} ${p.title}</h2><p>${p.description}</p>
          <div class="tag-row">${p.skills.map(s=>`<span class="tag">${s}</span>`).join("")}</div>
          <div class="notice"><strong>What you will have:</strong> ${p.outcome}</div>
          <ol class="tutorial-steps">${p.steps.map((s,i)=>`<li><span>${i+1}</span><div>${s}</div></li>`).join("")}</ol>
          <div class="notice"><strong>Stretch challenge:</strong> ${p.stretch}</div>
          <button class="btn ${done ? "btn-secondary" : "btn-primary"} guided-complete" data-project="${p.id}" ${done ? "disabled" : ""}>${done ? "Completed ✓" : "Mark project completed"}</button>
        </div>
      </article>`;
    }).join("")}
  </div></section>`;
}
