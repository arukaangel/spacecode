export function spaceDataPage() {
  return `
    <section class="page-hero"><div class="container"><div class="eyebrow">Live scientific data</div><h1>Space Data Lab</h1><p>Explore live public data, then move from “interesting numbers” to questions, comparisons and evidence.</p></div></section>
    <section class="section-tight"><div class="container grid grid-2">
      <article class="card"><div class="icon-box">🖼️</div><h3>Astronomy Picture of the Day</h3><p>Load NASA's current astronomy image and explanation.</p><button class="btn btn-primary" id="loadApod">Load APOD</button><div id="apodResult" style="margin-top:18px"></div></article>
      <article class="card"><div class="icon-box">☄️</div><h3>Near-Earth Objects today</h3><p>Fetch today's near-Earth objects and compare estimated size, velocity and approach distance.</p><button class="btn btn-primary" id="loadNeo">Load NEO data</button><div id="neoResult" style="margin-top:18px"></div></article>
    </div></section>`;
}
