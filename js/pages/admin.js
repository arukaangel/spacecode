export function adminPage(profile) {
  if (!profile || profile.role !== "admin") return `<section class="section"><div class="container"><div class="empty">Admin access only.</div></div></section>`;
  return `<section class="page-hero"><div class="container"><div class="eyebrow">Admin analytics</div><h1>Understand how people learn.</h1><p>Aggregate usage data can help you improve modules and identify where learners stop or struggle.</p></div></section>
  <section class="section-tight"><div class="container"><div class="kpi-grid" id="adminKpis"><div class="kpi"><span>Events</span><strong>—</strong></div><div class="kpi"><span>Module starts</span><strong>—</strong></div><div class="kpi"><span>Quiz submissions</span><strong>—</strong></div><div class="kpi"><span>Project saves</span><strong>—</strong></div></div><div class="card" style="margin-top:20px"><h3>Recent events</h3><div id="analyticsTable" class="empty">Loading analytics…</div></div></div></section>`;
}
