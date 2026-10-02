export function authPage(configured) {
  return `
  <section class="auth-shell">
    <div class="card auth-card">
      <div class="eyebrow">Account</div>

      <h1 style="font-family:'Space Grotesk';margin-bottom:8px">
        Welcome to SpaceCode
      </h1>

      <p style="color:var(--muted);line-height:1.6">
        Sign in to continue learning and keep your progress.
      </p>

      ${
        configured
          ? ""
          : `<div class="notice">
              Supabase is not configured yet.
            </div>`
      }

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:24px 0">
        <button class="btn btn-primary auth-tab" data-mode="login">
          Log in
        </button>

        <button class="btn auth-tab" data-mode="signup">
          Create account
        </button>

        <button class="btn auth-tab" data-mode="otp">
          Email code
        </button>
      </div>

      <!-- LOGIN -->
      <form id="loginForm">
        <div class="form-group">
          <label class="label">Email</label>
          <input
            class="input"
            type="email"
            id="loginEmail"
            required
            placeholder="you@example.com"
          >
        </div>

        <div class="form-group">
          <label class="label">Password</label>
          <input
            class="input"
            type="password"
            id="loginPassword"
            required
            minlength="6"
            placeholder="Your password"
          >
        </div>

        <button class="btn btn-primary" type="submit">
          Log in
        </button>
      </form>

      <!-- SIGN UP -->
      <form id="signupForm" class="hidden">
        <div class="form-group">
          <label class="label">Email</label>
          <input
            class="input"
            type="email"
            id="signupEmail"
            required
            placeholder="you@example.com"
          >
        </div>

        <div class="form-group">
          <label class="label">Password</label>
          <input
            class="input"
            type="password"
            id="signupPassword"
            required
            minlength="8"
            placeholder="At least 8 characters"
          >
        </div>

        <div class="form-group">
          <label class="label">Confirm password</label>
          <input
            class="input"
            type="password"
            id="signupPasswordConfirm"
            required
            minlength="8"
            placeholder="Repeat password"
          >
        </div>

        <button class="btn btn-primary" type="submit">
          Create account
        </button>
      </form>

      <!-- OTP -->
      <div id="otpArea" class="hidden">
        <form id="requestCodeForm">
          <div class="form-group">
            <label class="label">Email</label>
            <input
              class="input"
              type="email"
              id="authEmail"
              required
              placeholder="you@example.com"
            >
          </div>

          <button class="btn btn-primary" type="submit">
            Send code
          </button>
        </form>

        <form id="verifyCodeForm" class="hidden">
          <div class="form-group">
            <label class="label">6-digit code</label>
            <input
              class="input"
              inputmode="numeric"
              id="authCode"
              required
              placeholder="123456"
            >
          </div>

          <button class="btn btn-primary" type="submit">
            Verify and sign in
          </button>
        </form>
      </div>

      <div id="authMessage"></div>
    </div>
  </section>`;
}