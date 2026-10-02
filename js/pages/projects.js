import { projects } from "../data/projects.js";

export function projectsPage() {
  return `<section class="page-hero"><div class="container"><div class="eyebrow">Project lab</div><h1>Build things worth showing.</h1><p>Projects are designed to connect coding, data analysis and scientific thinking. Each one can grow from a small prototype into a serious portfolio piece.</p></div></section>
  <section class="section-tight"><div class="container"><div class="grid grid-2">${projects.map(p=>`<article class="card"><div class="icon-box">${p.icon}</div><h3>${p.title}</h3><p>${p.description}</p><div class="tag-row">${p.skills.map(s=>`<span class="tag">${s}</span>`).join("")}</div><p><strong>Deliverable:</strong> ${p.deliverable}</p><ol>${p.steps.map(s=>`<li style="color:var(--muted);margin:8px 0">${s}</li>`).join("")}</ol><div class="card-footer"><span class="tag">${p.level}</span><button class="btn btn-secondary project-start" data-project="${p.id}">Save to my roadmap</button></div></article>`).join("")}</div></div></section>`;
}
