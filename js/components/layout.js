export function header(user) {
  return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="#/">
          <span class="brand-mark">S</span>
          <span>SpaceCode</span>
        </a>
        <nav class="nav-links">
          <a class="nav-link" href="#/learn">Learn</a>
          <a class="nav-link" href="#/space-data">Space Data</a>
          <a class="nav-link" href="#/projects">Projects</a>
          <a class="nav-link" href="#/community">Community</a>
          <a class="nav-link" href="#/profile">Profile</a>
        </nav>
        <div class="nav-actions">
          ${user
            ? `<a class="btn btn-secondary hide-mobile" href="#/profile">${user.email}</a><button class="btn btn-ghost" id="logoutBtn">Log out</button>`
            : `<a class="btn btn-primary" href="#/auth">Sign in</a>`}
        </div>
      </div>
    </header>`;
}

export function footer() {
  return `
    <footer class="footer">
      <div class="container footer-grid">
        <div><strong>SpaceCode</strong><br><span>Learn CS & data science through real scientific problems.</span></div>
        <div>Built as a long-term educational technology project.</div>
      </div>
    </footer>`;
}

export function shell(content, user) {
  return `${header(user)}<main>${content}</main>${footer()}`;
}
