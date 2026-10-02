export function communityPage(posts = [], profile = null) {
  const avatar = (p) => p?.avatar_url ? `<img class="avatar" src="${p.avatar_url}" alt="">` : `<div class="avatar avatar-fallback">${(p?.username || p?.display_name || "S").slice(0,1).toUpperCase()}</div>`;
  return `<section class="page-hero"><div class="container"><div class="eyebrow">Community</div><h1>Share what you build.</h1><p>Publish a project, GitHub repository or demo. Other learners can like it, discuss it and learn from your process.</p></div></section>
  <section class="section-tight"><div class="container community-layout">
    <aside><div class="card community-compose"><h3>Create a post</h3><form id="communityPostForm">
      <div class="form-group"><label class="label">Project title</label><input class="input" id="postTitle" maxlength="100" required placeholder="My first space dashboard"></div>
      <div class="form-group"><label class="label">What did you build?</label><textarea class="input textarea" id="postBody" maxlength="1500" required placeholder="Tell the community what you made, learned, and what feedback you want..."></textarea></div>
      <div class="form-group"><label class="label">GitHub URL (optional)</label><input class="input" id="postGithub" type="url" placeholder="https://github.com/..."></div>
      <div class="form-group"><label class="label">Live demo URL (optional)</label><input class="input" id="postDemo" type="url" placeholder="https://..."></div>
      <div class="form-group"><label class="label">Screenshot (optional)</label><input class="input" id="postImage" type="file" accept="image/png,image/jpeg,image/webp"></div>
      <button class="btn btn-primary" type="submit">Publish project</button><div id="communityMessage"></div>
    </form></div></aside>
    <div id="communityFeed" class="community-feed">${posts.length ? posts.map(p=>`<article class="card post" data-post="${p.id}">
      <div class="post-author">${avatar(p.profiles)}<div><strong>${p.profiles?.display_name || "SpaceCoder"}</strong><div class="muted">@${p.profiles?.username || "learner"} · ${new Date(p.created_at).toLocaleDateString()}</div></div></div>
      <h2>${escapeMarkup(p.title)}</h2><p>${escapeMarkup(p.body)}</p>
      ${p.image_url ? `<img class="post-image" src="${p.image_url}" alt="Project screenshot">` : ""}
      <div class="post-links">${p.github_url ? `<a class="btn btn-secondary" href="${p.github_url}" target="_blank" rel="noopener">GitHub ↗</a>` : ""}${p.demo_url ? `<a class="btn btn-secondary" href="${p.demo_url}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}</div>
      <div class="post-actions"><button class="btn btn-ghost like-post" data-post="${p.id}" data-liked="${p.liked_by_me}">${p.liked_by_me ? "♥" : "♡"} ${p.like_count}</button><button class="btn btn-ghost comments-toggle" data-post="${p.id}">💬 ${p.comment_count}</button></div>
      <div class="comments hidden" id="comments-${p.id}"><div class="comments-list"></div><form class="comment-form" data-post="${p.id}"><input class="input" maxlength="800" required placeholder="Write a helpful comment..."><button class="btn btn-secondary">Send</button></form></div>
    </article>`).join("") : `<div class="empty">No projects yet. Be the first person to publish one.</div>`}</div>
  </div></section>`;
}

function escapeMarkup(value = "") {
  return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
}
