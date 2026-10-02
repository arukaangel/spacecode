import { getModule } from "../data/modules.js";

export function modulePage(moduleId, savedProgress = 0) {
  const m = getModule(moduleId);
  if (!m) return `<section class="section"><div class="container"><div class="empty">Module not found.</div></div></section>`;

  return `
    <section class="page-hero"><div class="container"><div class="eyebrow">${m.level} · ${m.estimated}</div><h1>${m.icon} ${m.title}</h1><p>${m.description}</p></div></section>
    <section class="section-tight"><div class="container module-layout">
      <aside class="sidebar"><div class="card"><strong>Module contents</strong>
        ${m.lessons.map((l,i)=>`<button class="sidebar-link" data-jump="lesson-${i}">${l.title}</button>`).join("")}
        <button class="sidebar-link" data-jump="resources">Resources</button>
        <button class="sidebar-link" data-jump="quiz">Mini quiz</button>
        <div style="margin:14px 8px 4px"><div class="progress"><span id="moduleProgressBar" style="width:${savedProgress}%"></span></div><small style="color:var(--muted)" id="moduleProgressLabel">${savedProgress}% complete</small></div>
      </div></aside>
      <div>
        ${m.lessons.map((l,i)=>`<section class="lesson" id="lesson-${i}"><h2>${l.title}</h2>${l.content}<button class="btn btn-secondary complete-lesson" data-lesson="${i}">Mark lesson complete</button></section>`).join("")}
        <section class="lesson" id="resources"><h2>Trusted resources</h2><p>Use these to go deeper after the core lesson.</p><div class="resource-list">${m.resources.map(r=>`<a class="resource" href="${r.url}" target="_blank" rel="noopener"><span><strong>${r.title}</strong><br><small>${r.type}</small></span><span>↗</span></a>`).join("")}</div></section>
        <section class="lesson" id="quiz"><h2>Mini quiz</h2><p>Complete the quiz to finish the module.</p><form class="quiz" id="quizForm" data-module="${m.id}">
          ${m.quiz.map((q,qi)=>`<div class="question"><h4>${qi+1}. ${q.q}</h4>${q.options.map((opt,oi)=>`<label class="option"><input type="radio" name="q${qi}" value="${oi}"> <span>${opt}</span></label>`).join("")}</div>`).join("")}
          <button class="btn btn-primary" type="submit">Submit quiz</button><div id="quizResult"></div>
        </form></section>
      </div>
    </div></section>`;
}
