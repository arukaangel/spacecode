export function header(user, profile = null) {
  const name = profile?.username ? `@${profile.username}` : user?.email;
  return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="#/"><span class="brand-mark">S</span><span>SpaceCode</span></a>
        <nav class="nav-links">
          ${user ? `<a class="nav-link" href="#/learn">Learn</a><a class="nav-link" href="#/guided-projects">Build Path</a><a class="nav-link" href="#/space-data">Space Data</a><a class="nav-link" href="#/projects">Project Lab</a><a class="nav-link" href="#/community">Community</a><a class="nav-link" href="#/profile">Profile</a>` : `<a class="nav-link" href="#/">About</a>`}
        </nav>
        <div class="nav-actions">${user ? `<a class="btn btn-secondary hide-mobile" href="#/profile">${name}</a><button class="btn btn-ghost" id="logoutBtn">Log out</button>` : `<a class="btn btn-primary" href="#/auth">Sign in to learn</a>`}</div>
      </div>
    </header>`;
}

export function footer() {
  return `<footer class="footer"><div class="container footer-grid"><div><strong>SpaceCode</strong><br><span>Learn CS & data science through real scientific problems.</span></div><div>Build. Share. Analyze. Improve.</div></div></footer>`;
}

export function aiWidget(user) {
  if (!user) return "";
  return `<button id="aiFab" class="ai-fab" aria-label="Open SpaceCode AI">✦</button><aside id="aiPanel" class="ai-panel hidden"><div class="ai-head"><div><strong>SpaceCode AI</strong><div class="muted">Programming & learning assistant</div></div><button class="btn btn-ghost" id="aiClose">×</button></div><div class="ai-messages" id="aiMessages"><div class="ai-msg assistant">Hi! Ask me about a lesson, bug, project idea, Python, JavaScript or data science.</div></div><form id="aiForm" class="ai-form"><textarea class="input textarea" id="aiInput" rows="2" maxlength="3000" placeholder="Ask for help..."></textarea><button class="btn btn-primary">Send</button></form></aside>`;
}

export function shell(content, user, profile = null) {
  return `${header(user, profile)}<main>${content}</main>${footer()}${aiWidget(user)}`;
}
