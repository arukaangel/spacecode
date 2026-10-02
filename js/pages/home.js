import { modules } from "../data/modules.js";
import { projects } from "../data/projects.js";

export function homePage() {
  const moduleCards = modules.slice(0, 3).map((m) => `
    <article class="card">
      <div class="icon-box">${m.icon}</div>
      <h3>${m.title}</h3>
      <p>${m.description}</p>
      <div class="tag-row">${m.skills.slice(0,3).map(s => `<span class="tag">${s}</span>`).join("")}</div>
      <div class="card-footer"><span class="tag">${m.level}</span><a class="btn btn-secondary" href="#/module/${m.id}">Start module →</a></div>
    </article>`).join("");

  const projectCards = projects.slice(0, 3).map((p) => `
    <article class="card">
      <div class="icon-box">${p.icon}</div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tag-row">${p.skills.slice(0,4).map(s => `<span class="tag">${s}</span>`).join("")}</div>
    </article>`).join("");

  return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="eyebrow">Build skills through science</div>
          <h1 class="title">Learn code by solving <span style="color:var(--accent-2)">real</span> scientific problems.</h1>
          <p class="subtitle">SpaceCode combines programming, data science, space data and project-based learning. Learn the concept, test yourself, then build something you can show.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/learn">Start learning</a>
            <a class="btn btn-secondary" href="#/projects">Explore projects</a>
          </div>
          <div class="stats">
            <div class="stat"><strong>6</strong><span>learning modules</span></div>
            <div class="stat"><strong>18+</strong><span>mini lessons</span></div>
            <div class="stat"><strong>4</strong><span>real projects</span></div>
            <div class="stat"><strong>1</strong><span>growing community</span></div>
          </div>
        </div>
        <div class="hero-panel">
          <div class="mockbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <div class="code-window"><span class="c"># Your first data-science mission</span>\n<span class="k">import</span> pandas <span class="k">as</span> pd\n\ndf = pd.read_csv(<span class="s">"asteroids.csv"</span>)\n\nfast = df[df[<span class="s">"velocity"</span>] &gt; 20]\nprint(fast.describe())\n\n<span class="c"># Next: visualize, interpret, explain.</span></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><div><div class="eyebrow">Learning paths</div><h2>Start with foundations. End with projects.</h2></div><p>Each module includes explanations, trusted resources and a mini quiz. Progress can later sync to your account through Supabase.</p></div>
        <div class="grid grid-3">${moduleCards}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><div><div class="eyebrow">Project lab</div><h2>Turn knowledge into evidence.</h2></div><p>Projects connect CS, data science and real scientific questions. Start small, publish your work, then improve it from user feedback and analytics.</p></div>
        <div class="grid grid-3">${projectCards}</div>
      </div>
    </section>`;
}
