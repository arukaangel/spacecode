export function authPage(configured) {
  return `<section class="auth-shell"><div class="card auth-card"><div class="eyebrow">Account</div><h1 style="font-family:'Space Grotesk';margin-bottom:8px">Sign in with an email code</h1><p style="color:var(--muted);line-height:1.6">Enter your email. SpaceCode will send a one-time code. No password required.</p>
    ${configured ? "" : `<div class="notice">Supabase is not configured yet. The interface is ready, but email login will work after you add your Supabase URL/key and run the provided SQL.</div>`}
    <form id="requestCodeForm"><div class="form-group"><label class="label">Email</label><input class="input" type="email" id="authEmail" required placeholder="you@example.com"></div><button class="btn btn-primary" type="submit">Send code</button></form>
    <form id="verifyCodeForm" class="hidden"><div class="form-group"><label class="label">6-digit code</label><input class="input" inputmode="numeric" id="authCode" required placeholder="123456"></div><button class="btn btn-primary" type="submit">Verify and sign in</button></form>
    <div id="authMessage"></div>
  </div></section>`;
}
