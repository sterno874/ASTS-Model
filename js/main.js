"use strict";

import { computeConstellationMetrics, monthsToTarget, launchSchedule, CONSTELLATION_ANCHORS } from "./math/constellation.js";
import { computeLinkBudget } from "./math/link-budget.js";
import { computeFullValuation, COMPARABLES, FILING_ANCHORS } from "./math/valuation.js";
import {
  MNO_PARTNERS,
  CATALYSTS,
  LAUNCH_EVENTS,
  COMMUNITY_DD,
  BEAR_CASE,
  COMMUNITY_THREADS,
  TOP_COMMUNITY_CONTRIBUTORS,
  KOOK_REPORT_CLAIMS,
  catalystsInYear,
  sortCatalysts,
  layoutTimeline,
  formatCatalystMonth,
  timelineMonthTicks,
  todayMarkerFrac,
  verdictMeta,
  tagClass,
  catalystBarClass,
  launchOrbitTotal,
  formatLaunchStatus,
  REDDIT_ATTRIBUTION
} from "./math/commercial.js";
import { runLaunchMonteCarlo, LAUNCH_MC_PRESETS } from "./math/monte-carlo.js";
import { computeFullyDilutedSharesM, CONVERTIBLE_NOTES, CONVERTIBLE_TOTAL_PRINCIPAL_M, evPerShareFd } from "./math/dilution.js";
import { computeCoverageOrbit } from "./math/coverage-orbit.js";
import {
  VALID_TABS,
  EXPLAIN_LEVELS,
  DEFAULT_STATE,
  CONST_PRESETS,
  VAL_PRESETS,
  buildShareHash,
  decodeShareHash,
  parseEmbedMode,
  computeValuationMetrics,
  computeHeaderStrip
} from "./ui/state.js";
import { buildBands, renderBands } from "./ui/bands.js";
import {
  DEFAULT_TICKER,
  QUOTE_LABEL,
  formatApproxPrice,
  buildQuoteMeta,
  computeVsMarketUpside,
  startLiveQuotePoll
} from "./ui/market-quote.js";
import { EXPLAIN_FOUNDATION } from "./content/explain-foundation.js";

const $ = (id) => document.getElementById(id);

let state = structuredClone(DEFAULT_STATE);
let activeTab = "constellation";
let curLvl = "eli5";
let communityDDLoaded = false;
let restoringState = false;

function communityDDHtml() {
  const helpful = TOP_COMMUNITY_CONTRIBUTORS.filter((c) => c.tier === "helpful");
  const mixed = TOP_COMMUNITY_CONTRIBUTORS.filter((c) => c.tier === "mixed");
  const misleading = TOP_COMMUNITY_CONTRIBUTORS.filter((c) => c.tier === "misleading");
  const kookRows = KOOK_REPORT_CLAIMS.map((k) => {
    const cls = k.verdict === "verified" ? "val-ok" : k.verdict === "rejected" ? "val-no" : "val-part";
    const icon = k.verdict === "verified" ? "✅" : k.verdict === "rejected" ? "❌" : "⚠️";
    return `<li><span class="${cls}">${icon}</span> <b>${k.claim}</b> — <span class="tag ${k.tag === "verified" ? "f" : k.tag === "model" ? "m" : "c"}">${k.tag}</span> ${k.note}${k.source ? ` <a href="${k.source}" target="_blank" rel="noopener">source ↗</a>` : ""}</li>`;
  }).join("");
  const contribBlock = (list, title) =>
    list
      .map(
        (c) =>
          `<div class="contrib"><h4>${c.user}</h4><p><b>Role:</b> ${c.role}</p><p>${c.note}</p>${c.source ? `<p><a href="${c.source}" target="_blank" rel="noopener">Profile / search ↗</a></p>` : ""}</div>`
      )
      .join("");
  return (
    `<p class="cw-note">Synthesis of r/ASTSpaceMobile and <a href="https://threadreaderapp.com/user/thekookreport" target="_blank" rel="noopener">@thekookreport</a> weekly threads. Factual bullets cross-checked vs SEC CIK 1780312, <a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC DA 26-391</a>, and IR. Tags: <span class="val-ok">✅ verified</span> · <span class="val-part">⚠️ partial</span> · <span class="val-no">❌ rejected</span> · <span class="val-model">🔬 model</span></p>` +
    `<h3>Kook Report — verified vs rejected claims</h3><ul class="ref-list">${kookRows}</ul>` +
    `<h3>Top helpful contributors</h3>${contribBlock(helpful, "helpful")}` +
    (mixed.length ? `<h3>Mixed signal</h3>${contribBlock(mixed, "mixed")}` : "") +
    `<h3>Often misleading — use with caution</h3>${contribBlock(misleading, "misleading")}` +
    `<p class="field-note"><span class="tag c">Community</span> "Kook Bottom" = meme marker when @thekookreport panics during selloffs (<a href="https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back" target="_blank" rel="noopener">Bloomberg May 2026</a>) — sentiment only, not a valuation input.</p>`
  );
}

function loadCommunityDD() {
  if (communityDDLoaded) return;
  communityDDLoaded = true;
  const host = $("communityDDHost");
  if (host) host.innerHTML = communityDDHtml();
}

let updateRaf = null;
let liveQuote = null;
let stopQuotePoll = null;
const tabsDirty = { constellation: true, commercial: true, value: true, explain: true, technology: true };

const TAB_SHORT_LABELS = {
  constellation: "Constellation",
  commercial: "Commercial",
  value: "Valuation",
  explain: "Explain",
  technology: "Technology"
};

function debounce(fn, ms) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

const EXPL = {
  ...EXPLAIN_FOUNDATION,

  col: `<h3>FCC Supplemental Coverage from Space (SCS)</h3>
<p><span class="tag f">Fact</span> AST does <b>not</b> own nationwide cellular spectrum. Under the FCC's <b>Supplemental Coverage from Space (SCS)</b> framework, satellites re-use <b>MNO-licensed low-band</b> (700/800 MHz) so standard phones can connect without new chips (<a href="https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/" target="_blank" rel="noopener">DCD</a> · <a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC DA 26-391</a>).</p>
<p><span class="tag f">Fact</span> Order <b>DA 26-391</b> (Apr 2026) authorizes up to <b>248 NGSO satellites</b> plus commercial SCS operations, with conditions on interference, debris mitigation, and NSF/NRAO coordination (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC order</a> · <a href="https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/" target="_blank" rel="noopener">SpaceNews</a>).</p>
<h4>Wholesale MNO model</h4>
<p><span class="tag f">Fact</span> AST is a <b>wholesale capacity provider</b> — AT&T, Verizon, Vodafone, and ~60 agreements covering <b>3B+ subscribers</b> are MOUs/partnerships, not all binding commercial contracts (<a href="https://ast-science.com/" target="_blank" rel="noopener">IR</a>).</p>
<p><span class="tag f">Fact</span> Carriers set consumer pricing; AST receives capacity fees or rev-share. Q1 2026 revenue <b>$14.7M</b> was largely gateway hardware and government milestones — not mass-market phone broadband (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC 10-Q</a>).</p>
<p><span class="tag m">Model</span> This app's revenue proxy: <code>activeSubs = MNO_subs × penetration × coverageFraction</code>; <code>rev = activeSubs × ARPU_monthly × 12</code>. Penetration = space-layer attach rate, not total MNO subs.</p>
<p><span class="tag c">Community</span> Reddit thesis "$3/mo × 3B = $5.4B to AST" is <b>rejected</b> — assumes 100% attach and full consumer ARPU to AST; wholesale share is a fraction of carrier billing (<a href="https://www.reddit.com/r/ASTSpaceMobile/" target="_blank" rel="noopener">r/ASTSpaceMobile</a>).</p>
<h4>Dilution &amp; convertibles</h4>
<p><span class="tag f">Fact</span> Diluted shares rose ~<b>81.8M → 256M</b> FY2023–25; ~<b>$2.2B+ convertible notes</b> outstanding with conversion prices ~$85–$120/sh (<a href="https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf" target="_blank" rel="noopener">FY2025 10-K</a> · <a href="https://www.businesswire.com/news/home/20250729408729/en/" target="_blank" rel="noopener">Jul 2025 note PR</a>).</p>
<p><span class="tag f">Fact</span> Q1 2026 cash ~$3.46B, but Q1 investing cash outflow ~$379M (satellite CapEx) — liquidity ≠ zero dilution (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC CIK 1780312</a> · <a href="https://www.metricduck.com/blog/asts-10k-analysis-revenue-backlog-funding-clock" target="_blank" rel="noopener">MetricDuck 10-K analysis</a>).</p>
<h4>Launch risk — BlueBird 7</h4>
<p><span class="tag f">Fact</span> BlueBird 7 (Apr 2026, Blue Origin NG-3) was lost to a <b>low-orbit insertion error</b> — launch vehicle anomaly, not payload power-on failure; insured per filings (<a href="https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/" target="_blank" rel="noopener">Spaceflight Now</a> · <a href="https://www.businesswire.com/news/home/20260617420856/en/" target="_blank" rel="noopener">BB8-10 recovery PR</a>).</p>
<h4>Starlink D2C vs AST</h4>
<p><span class="tag f">Fact</span> <b>SpaceX Starlink D2C</b> (T-Mobile US partnership) uses many small LEO sats vs AST's fewer, large-aperture BlueBirds — overlapping D2D spectrum strategy, different RF architecture and scale economics (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC filings context</a> · <a href="https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/" target="_blank" rel="noopener">SatNews Block 2</a>).</p>
<h4>Kook Report — use with caveats</h4>
<p><span class="tag c">Community</span> <b>@thekookreport</b> weekly threads are useful for catalyst calendars and FCC pointers, but mix verified launch facts with speculative M&A/Golden Dome threads — cross-check every dollar claim vs SEC (<a href="https://threadreaderapp.com/user/thekookreport" target="_blank" rel="noopener">Thread Reader</a> · <a href="https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back" target="_blank" rel="noopener">Bloomberg May 2026</a>).</p>`,

  pro: `<h3>SCS regulatory stack &amp; deployment conditions</h3>
<p><span class="tag f">Fact</span> <b>DA 26-391</b> grants NGSO deployment authority for 248 satellites and commercial SCS using partner MNO spectrum — AST holds no standalone nationwide cellular license (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC order</a> · <a href="https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/" target="_blank" rel="noopener">DCD</a>).</p>
<p><span class="tag f">Fact</span> Conditions include interference protection, orbital debris mitigation, and NSF/NRAO coordination — not a rubber stamp (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC DA 26-391</a>). Ex-US markets require ITU filings and local approvals per 10-K risk factors (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC 10-K</a>).</p>
<p><span class="tag f">Fact</span> Company cites <b>45–60 satellites</b> for continuous US coverage; 2026 target ~45 in orbit — forward-looking, not yet achieved (<a href="https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/" target="_blank" rel="noopener">SpaceNews Apr 2026</a>).</p>
<h4>Wholesale economics — what we can and cannot model</h4>
<p><span class="tag f">Fact</span> Revenue today: Q1 2026 <b>$14.7M</b> (gateway + gov milestones). Wholesale rev-share rates and per-MNO pricing are <b>not disclosed</b> in SEC filings (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">10-Q</a>).</p>
<p><span class="tag u">Assumption</span> ~60 MNO agreements covering 3B+ subs are addressable TAM, not contracted ARR — commercial terms largely undisclosed (<a href="https://ast-science.com/" target="_blank" rel="noopener">IR</a>).</p>
<p><span class="tag m">Model</span> Valuation tab uses segment-weighted EV = Σ (peakRev × P(commercial) × EV/Revenue × weight). Constellation tab ARPU slider is wholesale $/sub/month proxy — not carrier consumer pricing.</p>
<h4>Capital structure &amp; dilution path</h4>
<p><span class="tag f">Fact</span> Three convertible tranches (~$460M + $575M + $1.0B) at effective conversion ~$85–$120/sh; Jul 2025 $575M close documented (<a href="https://www.businesswire.com/news/home/20250729408729/en/" target="_blank" rel="noopener">Business Wire</a> · <a href="https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf" target="_blank" rel="noopener">10-K</a>).</p>
<p><span class="tag f">Fact</span> Q1 2026 equity footnote: Class A ~298.5M + Class B ~11.2M + Class C ~78.2M shares — multi-class structure complicates per-share math (<a href="https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/R21.htm" target="_blank" rel="noopener">Q1 2026 10-Q equity note</a>).</p>
<p><span class="tag f">Fact</span> ATM/shelf equity issuance pipeline active; "fully funded, no dilution" is <b>rejected</b> vs filings (<a href="https://www.metricduck.com/blog/asts-10k-analysis-revenue-backlog-funding-clock" target="_blank" rel="noopener">MetricDuck</a> · <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC</a>).</p>
<h4>Launch cadence &amp; BB7 failure anatomy</h4>
<p><span class="tag f">Fact</span> Multi-provider strategy: SpaceX (BB1-5, BB8-10), ISRO (BB6), Blue Origin (BB7 loss). BB7 Apr 2026: NG-3 delivered to low orbit — insertion failure, insured (<a href="https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/" target="_blank" rel="noopener">Spaceflight Now</a>).</p>
<p><span class="tag m">Model</span> Constellation Monte Carlo presets stress post-BB7 failure rates (5–25%) — educational, not company forecast. Provider-specific anomalies not fully captured.</p>
<h4>Competitive landscape — Starlink D2C</h4>
<p><span class="tag f">Fact</span> Starlink D2C via T-Mobile US spectrum: distributed small-sat architecture vs AST large-aperture (~223 m² Block 2 arrays). Starlink advantages: launch cadence, vertical integration; AST advantages: MNO partnership depth, aperture/EIRP (<a href="https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/" target="_blank" rel="noopener">SatNews</a> · <a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC</a>).</p>
<p><span class="tag c">Community</span> "Starlink kills AST" is <b>partial</b> — competition is real and formidable; differentiated architecture and carrier alignment mean obsolescence is unproven (<a href="https://www.reddit.com/r/ASTSpaceMobile/" target="_blank" rel="noopener">r/ASTSpaceMobile</a>).</p>
<h4>Kook Report verification matrix</h4>
<p><span class="tag c">Community</span> <b>Verified:</b> Ligado DA / mid-band access (10-K). <b>Partial:</b> launch cadence mix, DoD pipeline, Vodafone MEP briefing. <b>Rejected:</b> "fully funded no dilution," "200 Mbps everywhere," M&A inevitability (<a href="https://threadreaderapp.com/thread/1914063374180323818.html" target="_blank" rel="noopener">Apr 2026 weekly sample</a> · <a href="https://threadreaderapp.com/user/thekookreport" target="_blank" rel="noopener">@thekookreport</a>).</p>
<p><span class="tag c">Community</span> "Kook Bottom" = meme contrarian marker when @thekookreport panics during selloffs — sentiment only (<a href="https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back" target="_blank" rel="noopener">Bloomberg</a>).</p>`,

  phd: `<h3>Revenue identifiability — what SEC filings actually disclose</h3>
<p><span class="tag f">Fact</span> Q1 2026 revenue <b>$14.7M</b> is identifiable: gateway hardware deliveries and US government milestone payments — disclosed in 10-Q, not extrapolatable to consumer D2D ARPU (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC 10-Q</a>).</p>
<p><span class="tag f">Fact</span> SEC filings disclose: cash (~$3.46B Mar 2026), CapEx cadence (Q1 investing ~$379M), debt/convertible terms, share classes, customer concentration risk factors — but <b>do not</b> disclose wholesale rev-share %, per-MNO pricing, attach-rate forecasts, or segment-level space-broadband revenue (<a href="https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf" target="_blank" rel="noopener">FY2025 10-K</a> · <a href="https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/R21.htm" target="_blank" rel="noopener">Q1 2026 10-Q</a>).</p>
<p><span class="tag u">Assumption</span> Any model tying $/sh to "$3 × 3B subs" is <b>non-identifiable</b> from filings — penetration, wholesale take-rate, and coverage fraction are exogenous sliders, not extractable parameters.</p>
<h4>SCS as a spectrum-access regime</h4>
<p><span class="tag f">Fact</span> SCS lets NGSO systems operate on terrestrial partner licenses in 700/800 MHz — AST's US path is AT&T/Verizon spectrum, not AST-owned nationwide cellular (<a href="https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/" target="_blank" rel="noopener">DCD</a> · <a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC DA 26-391</a>).</p>
<p><span class="tag f">Fact</span> FCC conditions (interference, debris, NSF/NRAO) create ongoing compliance obligations — authorization ≠ unconstrained EIRP or unlimited beam density (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC order</a>).</p>
<h4>Wholesale MNO model — structural limits</h4>
<p><span class="tag f">Fact</span> AST builds gateways integrating with MNO core networks; consumer billing stays with carriers. ~60 agreements / 3B+ subs = partnership footprint, not revenue backlog (<a href="https://ast-science.com/" target="_blank" rel="noopener">IR</a> · <a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">10-K risk factors</a>).</p>
<p><span class="tag m">Model</span> Peak demo speeds (Block 1 <b>98.9 Mbps</b>, Block 2 target <b>~200 Mbps</b>) are shared-beam capacity — not per-user SLA. Revenue identifiability requires disclosed wholesale $/GB or $/sub/month; neither exists in filings (<a href="https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/" target="_blank" rel="noopener">SatNews</a>).</p>
<h4>Dilution mechanics — convertibles, classes, ATM</h4>
<p><span class="tag f">Fact</span> Convertible overhang ~$2.2B+ across three tranches ($460M @ ~$120.12, $575M @ ~$120.12, $1.0B @ ~$85) — mechanical conversion adds ~30–40M+ shares if in-the-money (<a href="https://www.businesswire.com/news/home/20250729408729/en/" target="_blank" rel="noopener">Jul 2025 PR</a> · <a href="https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf" target="_blank" rel="noopener">10-K</a>).</p>
<p><span class="tag f">Fact</span> Share count trajectory 81.8M → 256M diluted FY2023–25; Q1 2026 multi-class equity (A/B/C) — GAAP diluted EPS denominator ≠ simple Class A count (<a href="https://www.metricduck.com/blog/asts-10k-analysis-revenue-backlog-funding-clock" target="_blank" rel="noopener">MetricDuck</a> · <a href="https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/R21.htm" target="_blank" rel="noopener">Q1 10-Q footnote</a>).</p>
<p><span class="tag u">Assumption</span> Valuation tab FD dilution model assumes mechanical conversion at slider price — ignores capped-call overlays, conversion timing, and ATM issuance path. Cash $3.46B does not eliminate dilution when CapEx ~$379M/qtr and notes remain outstanding.</p>
<h4>Launch risk — BB7 as provider-specific tail event</h4>
<p><span class="tag f">Fact</span> BB7 (Apr 28 2026, Blue Origin NG-3): payload delivered to insufficient orbit — launch insertion anomaly, insured; BB8-10 recovered cadence Jun 17 2026 on SpaceX F9 (<a href="https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/" target="_blank" rel="noopener">Spaceflight Now</a> · <a href="https://www.businesswire.com/news/home/20260617420856/en/" target="_blank" rel="noopener">Business Wire</a>).</p>
<p><span class="tag m">Model</span> Monte Carlo uses constant per-launch failure rate — does not distinguish SpaceX vs Blue Origin vs ISRO reliability; BB7 preset (25%) is stress scenario, not empirical λ.</p>
<h4>Starlink D2C — architectural &amp; economic comparison</h4>
<p><span class="tag f">Fact</span> Starlink: thousands of small LEO sats, T-Mobile US spectrum partnership, SpaceX vertical launch integration. AST: fewer satellites, ~223 m² Block 2 phased arrays, deep MNO investor alignment (AT&T, Verizon, Vodafone) (<a href="https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/" target="_blank" rel="noopener">SatNews</a> · <a href="https://ast-science.com/" target="_blank" rel="noopener">IR</a>).</p>
<p><span class="tag f">Fact</span> Neither operator discloses D2D wholesale economics in SEC filings — competitive outcome is exogenous to any filing-derived model.</p>
<h4>Kook Report — epistemic status (no sugar)</h4>
<p><span class="tag c">Community</span> @thekookreport is a <b>sentiment aggregator</b>, not a primary source. Useful: FCC filing pointers, launch calendar, regulatory sweep. Unreliable without SEC cross-check: Golden Dome revenue sizing, M&A inevitability, "fully funded" claims, per-user 200 Mbps SLA (<a href="https://threadreaderapp.com/thread/1914063374180323818.html" target="_blank" rel="noopener">Apr 2026 thread</a> · <a href="https://threadreaderapp.com/user/thekookreport" target="_blank" rel="noopener">archive</a> · <a href="https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back" target="_blank" rel="noopener">Bloomberg</a>).</p>
<p><span class="tag c">Community</span> Ligado DA claim is filing-verified; ozone-vs-Starlink debris claim is community model (Kevin Coulton thread), not AST IR — treat as hypothesis (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">10-K Ligado</a>).</p>
<h4>Link budget &amp; capacity — system-level bounds</h4>
<p><span class="tag m">Model</span> Friis: <code>PL(dB) = 20 log₁₀(4πd/λ)</code>; slant range from elevation ε and altitude h. Positive link margin necessary but insufficient — C/(N+I), Doppler, handoff, and beam scheduling determine usable throughput.</p>
<p><span class="tag u">Assumption</span> subs/sat slider is an opaque capacity proxy; continuous coverage requires 45–60 sats (company cite) with geometry depending on inclination, planes, min elevation — app uses overlap heuristic, not Walker delta simulation (<a href="https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/" target="_blank" rel="noopener">SpaceNews</a>).</p>
<p><span class="tag f">Fact</span> 3,700–3,900 patent claims support IP narrative but do not disclose revenue, wholesale pricing, or freedom-to-operate vs Starlink/Lynk (<a href="https://patents.google.com/?assignee=AST+SpaceMobile" target="_blank" rel="noopener">USPTO assignee search</a> · <a href="https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf" target="_blank" rel="noopener">10-K</a>).</p>`

};

function readConstState() {
  const s = {};
  for (const k of Object.keys(DEFAULT_STATE.constellation)) {
    const el = $("c" + k);
    if (el) s[k] = +el.value;
  }
  return s;
}

function readValState() {
  const s = { v_riskadj: $("v_riskadj")?.checked ?? true };
  for (const k of Object.keys(DEFAULT_STATE.val)) {
    if (k === "v_riskadj") continue;
    const id = k.replace(/^v_/, "");
    const node = $("vv_" + id);
    if (node) s[k] = +node.value;
  }
  return s;
}

function readLinkState() {
  const s = {};
  for (const k of Object.keys(DEFAULT_STATE.link)) {
    const el = $("lk_" + k);
    if (el) s[k] = +el.value;
  }
  return s;
}

function fmtM(v, d = 1) {
  if (!Number.isFinite(v)) return "—";
  if (Math.abs(v) >= 1000) return "$" + (v / 1000).toFixed(2) + "B";
  return "$" + v.toFixed(d) + "M";
}

function fmtPct(v) {
  return Number.isFinite(v) ? v.toFixed(1) + "%" : "—";
}

function updateConstUI() {
  const c = readConstState();
  state.constellation = { ...state.constellation, ...c };
  const m = computeConstellationMetrics(c);
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("cCovFrac", fmtPct(m.coverageFrac * 100));
  set("cCapacity", m.capacityM.toFixed(2) + "M concurrent");
  set("cRevProxy", fmtM(m.revProxyM));
  set("cPctContinuous", fmtPct(m.pctToContinuous));
  set("cMonthsTarget", monthsToTarget(m.sats, m.target, c.satsPerLaunch || 3, c.launchInterval || 1.5).toFixed(1) + " mo");
  const cal = $("cLaunchCal");
  if (cal) {
    const evts = launchSchedule({ startSats: m.sats, targetSats: m.target, satsPerLaunch: c.satsPerLaunch, intervalMonths: c.launchInterval });
    cal.innerHTML = evts.map((e) => `<div class="fact"><b>${e.label}</b><br/>~${formatCatalystMonth(`${e.year}-${String(Math.round(e.month)).padStart(2, "0")}`)} · ${e.satsAfter} sats<br/><span class="tag m">model</span></div>`).join("");
  }
  renderBands($, (id) => {
    const key = id.replace("mk-", "");
    const map = {
      csats: c.sats,
      ctargetSats: c.targetSats,
      ccoverageSats: c.coverageSats,
      cpenetration: c.penetration,
      carpuMonthly: c.arpuMonthly,
      csubsPerSat: c.subsPerSat
    };
    return map[key];
  });
  updateMonteCarloUI(c);
  updateHeader();
}

function updateMonteCarloUI(c) {
  const failureRate = +($("mcFailureRate")?.value ?? state.monteCarlo.failureRate ?? 0.05);
  state.monteCarlo.failureRate = failureRate;
  const mc = runLaunchMonteCarlo({
    startSats: c.sats ?? 10,
    targetSats: c.targetSats ?? 45,
    satsPerLaunch: c.satsPerLaunch ?? 3,
    launchIntervalMonths: c.launchInterval ?? 1.5,
    failureRate
  });
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("mcPSuccess", fmtPct(mc.pSuccess * 100));
  set("mcP50", mc.p50Months.toFixed(1) + " mo");
  set("mcP90", mc.p90Months.toFixed(1) + " mo");
  set("mcDet", mc.deterministicMonths.toFixed(1) + " mo");
}

function updateDilutionUI(valMetrics) {
  const price = +($("dilPrice")?.value ?? 45);
  const fd = computeFullyDilutedSharesM({
    baseSharesM: state.val.v_shares ?? 256,
    stockPrice: price,
    convertAll: true
  });
  const ev = valMetrics?.ev ?? computeFullValuation(state.val).ev;
  const perShFd = evPerShareFd(ev, state.val.v_cash, state.val.v_debt, fd);
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("dilFdShares", fd.fdSharesM.toFixed(1) + "M");
  set("dilPct", "+" + fd.dilutionPct.toFixed(1) + "%");
  set("dilFdPerSh", "$" + perShFd.toFixed(2));
  const tbody = $("dilNotesBody");
  if (tbody) {
    tbody.innerHTML = fd.rows
      .map(
        (r) =>
          `<tr><td>${r.label}${r.source ? ` · <a href="${r.source}" target="_blank" rel="noopener">source</a>` : ""}</td><td>${r.principalM ? "$" + r.principalM + "M" : "—"}</td><td>${r.conversionPrice ? "$" + r.conversionPrice : "—"}</td><td>${r.addedSharesM.toFixed(1)}</td><td><span class="tag ${r.tag === "verified" ? "f" : "p"}">${r.tag}</span></td></tr>`
      )
      .join("");
  }
  const foot = $("dilNotesFoot");
  if (foot) {
    foot.innerHTML = `<tr><td colspan="2"><b>Total note principal</b></td><td colspan="3">$${CONVERTIBLE_TOTAL_PRINCIPAL_M}M · FD ${fd.fdSharesM.toFixed(1)}M @ $${price}</td></tr>`;
  }
  syncDilutionPresetButtons(state.val.v_shares);
}

function syncDilutionPresetButtons(sharesM) {
  document.querySelectorAll("[data-dilution-stress]").forEach((b) => {
    const target = Number(b.dataset.dilutionStress);
    const active = Math.abs(sharesM - target) < 0.01;
    b.classList.toggle("active", active);
    b.classList.toggle("p-def", active);
  });
}

function updateValMarketBlock(valMetrics) {
  const set = (id, txt) => {
    const el = $(id);
    if (el) el.textContent = txt;
  };
  set("vQuoteLabel", QUOTE_LABEL);
  const equityM = valMetrics?.equityM ?? 0;
  set("vEquity", fmtM(equityM));
  if (liveQuote?.loading) {
    set("vMktPrice", "…");
    set("vMktMeta", "fetching delayed quote…");
    set("vVsMkt", "—");
    return;
  }
  const refPrice =
    liveQuote?.ok && liveQuote.price != null ? liveQuote.price : state.val?.v_refPrice ?? 45;
  const shares = state.val?.v_shares ?? 256;
  const mktCapM =
    liveQuote?.ok && liveQuote.marketCapM != null && liveQuote.marketCapM > 0
      ? liveQuote.marketCapM
      : shares * refPrice;
  if (liveQuote?.ok) {
    set("vMktPrice", formatApproxPrice(liveQuote.price, liveQuote.currency));
    set("vMktMeta", buildQuoteMeta(liveQuote));
  } else {
    set("vMktPrice", formatApproxPrice(refPrice));
    set("vMktMeta", liveQuote && !liveQuote.ok ? "quote unavailable — using illustrative ref" : "illustrative ref price");
  }
  const u = computeVsMarketUpside(equityM, mktCapM);
  set("vVsMkt", u.upsideLabel);
  const note = $("vVsMktNote");
  if (note) {
    note.textContent = `Model equity ${fmtM(equityM)} vs mkt cap ${fmtM(mktCapM)} — scenario math, not investment advice.`;
  }
}

function updateCoverageOrbitUI() {
  const co = {
    sats: +($("coSats")?.value ?? state.coverageOrbit.sats ?? 10),
    continuousSats: +($("coContinuousSats")?.value ?? 45),
    minElevDeg: +($("coMinElev")?.value ?? 25),
    altKm: state.link.altKm ?? 550,
    satsPerLaunch: state.constellation.satsPerLaunch ?? 3,
    launchIntervalMonths: state.constellation.launchInterval ?? 1.5
  };
  state.coverageOrbit = { ...state.coverageOrbit, ...co };
  const r = computeCoverageOrbit(co);
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("coRadius", r.radiusKm.toFixed(0) + " km");
  set("coOverlap", fmtPct(r.overlapFrac * 100));
  set("coContinuous", fmtPct(r.continuousFrac * 100));
  const tl = $("coTimeline");
  if (tl) {
    tl.innerHTML = r.timeline
      .map(
        (e) =>
          `<div class="fact"><b>${e.label}</b><br/>~${e.month.toFixed(1)} mo · overlap ${fmtPct(e.overlapFrac * 100)}<br/><span class="tag m">model</span></div>`
      )
      .join("");
  }
  drawCoverageSvg(r);
}

function drawCoverageSvg(r) {
  const svg = $("coverageSvg");
  if (!svg) return;
  const cx = 200,
    cy = 110;
  const scale = 0.35;
  const rPx = Math.min(90, r.radiusKm * scale);
  const n = Math.min(r.sats, 12);
  const circles = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const ox = Math.cos(ang) * 40;
    const oy = Math.sin(ang) * 25;
    circles.push(`<circle cx="${cx + ox}" cy="${cy + oy}" r="${rPx}" fill="rgba(47,111,237,0.12)" stroke="#2f6fed" stroke-width="1"/>`);
  }
  svg.innerHTML = `<rect width="400" height="220" fill="#f8fafc"/>
    <ellipse cx="${cx}" cy="${cy}" rx="120" ry="70" fill="none" stroke="#94a3b8" stroke-dasharray="4 3"/>
    <text x="${cx}" y="18" text-anchor="middle" font-size="10" fill="#4f5866">US footprint schematic (${r.sats} sats)</text>
    ${circles.join("")}
    <text x="${cx}" y="210" text-anchor="middle" font-size="10" fill="#141b26">Overlap ${(r.overlapFrac * 100).toFixed(1)}% · Continuous proxy ${(r.continuousFrac * 100).toFixed(1)}%</text>`;
}


function ddRow(row) {
  const verdict = verdictMeta(row.verdict);
  return `<tr><td>${row.theme}</td><td><span class="${verdict.cls}">${verdict.icon}</span> <span class="verdict-badge verdict-badge--${row.verdict}">${verdict.label}</span></td><td><span class="tag ${tagClass(row.tag)}">${row.tag}</span></td><td>${row.note}</td></tr>`;
}

function updateCommercialUI() {
  const year = +($("ccalendarYear")?.value ?? 2026);
  const cats = sortCatalysts(catalystsInYear(year));
  const timeline = layoutTimeline(cats.length ? cats : CATALYSTS, year);
  const host = $("commCalendar");
  if (host) {
    const ticks = timelineMonthTicks(year)
      .map((t) => `<span class="cat-tl-tick" style="left:${t.left}%">${t.label}</span>`)
      .join("");
    const today = todayMarkerFrac(year);
    const todayHtml = today == null ? "" : `<div class="cat-tl-today" style="left:${today}%"><span>Today</span></div>`;
    const bars = timeline.items
      .map((c) => {
        const contCls = `${c.contLeft ? " cat-tl-bar--cont-left" : ""}${c.contRight ? " cat-tl-bar--cont-right" : ""}`;
        const short = c.label.length > 28 ? `${c.label.slice(0, 26)}...` : c.label;
        return `<div class="cat-tl-bar ${catalystBarClass(c.tag)}${contCls}" style="left:${c.left}%;width:${Math.max(c.width, 3)}%;--lane:${c.lane}" title="${c.label}"><span class="cat-tl-bar-label">${short}</span>${c.contRight ? '<span class="cat-tl-bar-arrow">→</span>' : ""}</div>`;
      })
      .join("");
    const list = timeline.items
      .map((c) => {
        const dotClass = c.tag === "verified" ? "cat-tl-dot--verified" : "cat-tl-dot--estimate";
        const win = `${c.contLeft ? "← " : ""}${formatCatalystMonth(c.windowStart)} - ${formatCatalystMonth(c.windowEnd)}${c.contRight ? " →" : ""}`;
        const src = c.source ? `<a class="cat-tl-source" href="${c.source}" target="_blank" rel="noopener">source ↗</a>` : "";
        return `<li class="cat-tl-item"><span class="cat-tl-dot ${dotClass}"></span><div class="cat-tl-card"><div class="cat-tl-card-head"><span class="cat-tl-label">${c.label}</span><span class="tag ${tagClass(c.tag)}">${c.tag}</span>${src}</div><div class="cat-tl-window">${win}</div></div></li>`;
      })
      .join("");
    host.innerHTML = `<div class="cat-timeline"><div class="cat-tl-legend"><span class="cat-tl-leg"><span class="cat-tl-leg-swatch cat-tl-leg-swatch--verified"></span> verified / achieved</span><span class="cat-tl-leg"><span class="cat-tl-leg-swatch cat-tl-leg-swatch--estimate"></span> forward-looking / partial</span>${today == null ? "" : '<span class="cat-tl-leg"><span class="cat-tl-leg-today"></span> today</span>'}<span class="cat-tl-leg"><span class="cat-tl-leg-cont">→</span> continues beyond year</span></div><div class="cat-tl-chart"><div class="cat-tl-ticks">${ticks}</div><div class="cat-tl-track" style="--lanes:${timeline.lanes}"><div class="cat-tl-line"></div>${todayHtml}${bars}</div></div><ul class="cat-tl-list">${list}</ul></div>`;
  }
  const sum = $("commSummary");
  if (sum) {
    sum.textContent = `${MNO_PARTNERS.length} named strategic MNO partners · ${launchOrbitTotal()} spacecraft in orbit (verified launches) · ${LAUNCH_EVENTS.length} launch milestones through Jun 2026 · FCC 248-sat authorization Apr 2026.`;
  }
}

function updateValUI() {
  const val = readValState();
  state.val = val;
  const v = computeFullValuation(val);
  const set = (id, txt) => {
    const el = $(id);
    if (el) el.textContent = txt;
  };
  set("vEv", fmtM(v.ev));
  set("vPerSh", "$" + v.perSh.toFixed(2));
  set("vPeak", fmtM(v.totalPeak) + "/yr");
  set("vRunway", v.runwayMo === Infinity ? "∞" : v.runwayMo.toFixed(0) + " mo");
  const tbody = $("vRowsBody");
  if (tbody) {
    tbody.innerHTML = v.rows
      .map(
        (r) =>
          `<tr><td>${r.label}</td><td>${fmtM(r.peak)}</td><td>${(r.pSuccess * 100).toFixed(0)}%</td><td>${(r.weight * 100).toFixed(0)}%</td><td>${fmtM(r.evContrib)}</td></tr>`
      )
      .join("");
  }
  const tfoot = $("vRowsFoot");
  if (tfoot) {
    const rowSum = v.rows.reduce((s, r) => s + r.evContrib, 0);
    tfoot.innerHTML = `<tr><td colspan="4"><b>Platform + segments</b></td><td>${fmtM(rowSum)} + ${fmtM(v.platform)} = ${fmtM(v.ev)}</td></tr>`;
  }
  renderBands($, (id) => {
    const key = id.replace("mk-vv_", "vv_").replace("mk-", "");
    if (key.startsWith("vv_")) return val["v_" + key.slice(3)];
    return null;
  });
  updateValMarketBlock(v);
  updateDilutionUI(v);
  syncDilutionPresetButtons(val.v_shares);
  updateHeader();
}

function updateLinkUI() {
  const lk = readLinkState();
  state.link = { ...state.link, ...lk };
  const r = computeLinkBudget(lk);
  const set = (id, v) => {
    const el = $(id);
    if (el) el.textContent = v;
  };
  set("lkMargin", r.marginDb.toFixed(1) + " dB");
  set("lkRx", r.rxDbm.toFixed(1) + " dBm");
  set("lkPl", r.pathLossDb.toFixed(1) + " dB");
  set("lkRadius", r.radiusKm.toFixed(0) + " km");
  set("lkFootprint", (r.footprintKm2 / 1e6).toFixed(2) + " M km²");
  set("lkArrayBoost", "+" + r.arrayBoost.toFixed(1) + " dB vs Block 1");
  const fill = $("lkGaugeFill");
  if (fill) {
    const pct = Math.min(100, Math.max(0, 50 + r.marginDb * 3));
    fill.style.width = pct + "%";
    fill.className = "link-gauge-fill " + (r.linkOk ? "ok" : r.marginDb > -5 ? "warn" : "bad");
  }
  drawLinkSvg(r);
  updateCoverageOrbitUI();
}

function drawLinkSvg(r) {
  const svg = $("linkSvg");
  if (!svg) return;
  const w = 400,
    h = 200;
  const satY = 30,
    groundY = 170;
  const elev = (r.elevDeg * Math.PI) / 180;
  const phoneX = 200 - Math.cos(elev) * 120;
  const phoneY = groundY - Math.sin(elev) * 120;
  svg.innerHTML = `<rect width="${w}" height="${h}" fill="#f8fafc"/>
    <line x1="200" y1="${satY}" x2="${phoneX}" y2="${phoneY}" stroke="#2f6fed" stroke-width="2" stroke-dasharray="6 4"/>
    <rect x="185" y="15" width="30" height="20" fill="#141b26" rx="2"/>
    <text x="200" y="12" text-anchor="middle" font-size="9" fill="#4f5866">BlueBird @ ${r.altKm} km</text>
    <rect x="${phoneX - 8}" y="${phoneY - 14}" width="16" height="28" fill="#1f9d55" rx="3"/>
    <text x="${phoneX}" y="${groundY + 14}" text-anchor="middle" font-size="9" fill="#4f5866">${r.elevDeg}° elev</text>
    <text x="200" y="${h - 8}" text-anchor="middle" font-size="10" fill="#141b26">Margin ${r.marginDb.toFixed(1)} dB · ${r.linkOk ? "Link closes" : "Below sensitivity"}</text>`;
}

function updateHeader() {
  const strip = $("headerStrip");
  if (!strip || !state.ui.showHeaderStrip) return;
  const cm = computeConstellationMetrics(state.constellation);
  const vm = computeFullValuation(state.val);
  const h = computeHeaderStrip(state, vm, cm, liveQuote?.ok ? liveQuote : null);
  let quoteBlock = "";
  if (liveQuote?.loading) {
    quoteBlock = `<span class="best-est-sep">·</span><span class="best-est-item market-live"><span class="best-est-label">${QUOTE_LABEL} <span class="tag f">market</span></span><span class="best-est-val best-est-val--loading">…</span><span class="best-est-sub">fetching…</span></span>`;
  } else if (liveQuote?.ok) {
    const meta = buildQuoteMeta(liveQuote);
    quoteBlock = `<span class="best-est-sep">·</span><span class="best-est-item market-live" title="${meta}"><span class="best-est-label">${QUOTE_LABEL} <span class="tag f">market</span></span><span class="best-est-val">${formatApproxPrice(liveQuote.price, liveQuote.currency)}</span>${meta ? `<span class="best-est-sub">${meta}</span>` : ""}</span>`;
  } else if (liveQuote && !liveQuote.ok) {
    quoteBlock = `<span class="best-est-sep">·</span><span class="best-est-item market-live"><span class="best-est-label">${QUOTE_LABEL} <span class="tag f">market</span></span><span class="best-est-val best-est-val--error">—</span><span class="best-est-sub">unavailable</span></span>`;
  }
  const upsideTitle = `Model equity ${fmtM(h.equity)} vs mkt cap ${fmtM(h.mktCapM)}. Not investment advice.`;
  strip.innerHTML = `<span class="best-est-item best-est-item--scenario"><span class="best-est-label">Scenario</span><span class="best-est-val best-est-val--scenario">${CONST_PRESETS[h.preset]?.label || h.preset}</span></span>
    <span class="best-est-sep">·</span><span class="best-est-item"><span class="best-est-label">Sats</span><span class="best-est-val">${h.sats}</span></span>
    <span class="best-est-sep">·</span><span class="best-est-item"><span class="best-est-label">→ Continuous</span><span class="best-est-val">${h.cov.toFixed(0)}%</span></span>
    <span class="best-est-sep">·</span><span class="best-est-item"><span class="best-est-label">EV</span><span class="best-est-val">${fmtM(h.ev)}</span></span>
    <span class="best-est-sep">·</span><span class="best-est-item"><span class="best-est-label">$/sh</span><span class="best-est-val">$${h.perSh.toFixed(2)}</span></span>` +
    quoteBlock +
    `<span class="best-est-sep">·</span><span class="best-est-item" title="${upsideTitle}"><span class="best-est-label">${h.vsRefLabel} <span class="tag m">model</span></span><span class="best-est-val">${h.upsideLabel}</span></span>`;
}

function initLiveQuote() {
  if (parseEmbedMode() || typeof fetch === "undefined") return;
  if (stopQuotePoll) stopQuotePoll();
  stopQuotePoll = startLiveQuotePoll(
    DEFAULT_TICKER,
    (q) => {
      liveQuote = q;
      updateHeader();
      if (activeTab === "value") updateValMarketBlock(computeFullValuation(state.val));
    },
    { sharesM: state.val.v_shares }
  );
}

function updateNow(forceHash) {
  if (activeTab === "constellation" || forceHash) updateConstUI();
  if (activeTab === "commercial" || forceHash) updateCommercialUI();
  if (activeTab === "value" || forceHash) updateValUI();
  if (activeTab === "technology" || forceHash) updateLinkUI();
}

const scheduleUpdate = debounce(() => updateNow(false), 80);

function updateHashQuiet() {
  if (restoringState) return;
  history.replaceState(null, "", buildShareHash(state));
}

function applyConstPreset(name) {
  const p = CONST_PRESETS[name];
  if (!p) return;
  state.activeConstPreset = name;
  for (const [k, v] of Object.entries(p)) {
    if (k === "label") continue;
    state.constellation[k] = v;
    const el = $("c" + k);
    if (el) el.value = v;
    const lbl = $("c" + k + "Val");
    if (lbl) lbl.textContent = v;
  }
  document.querySelectorAll("[data-const-preset]").forEach((b) => b.classList.toggle("active", b.dataset.constPreset === name));
  updateNow(false);
  if (!restoringState) updateHashQuiet();
}

function applyValPreset(name) {
  const p = VAL_PRESETS[name];
  if (!p) return;
  state.activeValPreset = name;
  for (const [k, v] of Object.entries(p)) {
    if (k === "label") continue;
    state.val[k] = v;
    const id = k.replace(/^v_/, "");
    const el = $("vv_" + id);
    if (el) el.value = v;
    const lbl = $("vv_" + id + "Val");
    if (lbl) lbl.textContent = typeof v === "number" && v < 1 ? v : v;
  }
  document.querySelectorAll("[data-val-preset]").forEach((b) => b.classList.toggle("active", b.dataset.valPreset === name));
  updateNow(false);
  if (!restoringState) updateHashQuiet();
}

function applyDilutionStress(sharesM) {
  state.val.v_shares = sharesM;
  const el = $("vv_shares");
  if (el) el.value = sharesM;
  const lbl = $("vv_sharesVal");
  if (lbl) lbl.textContent = sharesM;
  syncDilutionPresetButtons(sharesM);
  updateValUI();
  if (!restoringState) updateHashQuiet();
}

function applyState(next) {
  restoringState = true;
  state = next;
  for (const [k, v] of Object.entries(state.constellation)) {
    const el = $("c" + k);
    if (el) el.value = v;
    const lbl = $("c" + k + "Val");
    if (lbl) lbl.textContent = v;
  }
  for (const [k, v] of Object.entries(state.val)) {
    if (k === "v_riskadj") {
      const cb = $("v_riskadj");
      if (cb) cb.checked = v;
      continue;
    }
    const id = k.replace(/^v_/, "");
    const el = $("vv_" + id);
    if (el) el.value = v;
    const lbl = $("vv_" + id + "Val");
    if (lbl) lbl.textContent = v;
  }
  switchTab(state.tab, true);
  showLevel(state.ui.explainLvl || "eli5");
  if (state.activeConstPreset) applyConstPreset(state.activeConstPreset);
  if (state.activeValPreset) applyValPreset(state.activeValPreset);
  restoringState = false;
  updateNow(true);
}

function openMobileNav() {
  $("mobileNavPanel")?.classList.add("is-open");
  $("mobileNavPanel")?.removeAttribute("hidden");
  $("mobileNavBackdrop")?.removeAttribute("hidden");
  $("navToggle")?.setAttribute("aria-expanded", "true");
}

function closeMobileNav() {
  $("mobileNavPanel")?.classList.remove("is-open");
  $("mobileNavPanel")?.setAttribute("hidden", "");
  $("mobileNavBackdrop")?.setAttribute("hidden", "");
  $("navToggle")?.setAttribute("aria-expanded", "false");
}

function syncMobileNav(t) {
  document.querySelectorAll(".mobile-nav-item").forEach((b) => {
    const on = b.dataset.tab === t;
    b.classList.toggle("active", on);
    b.toggleAttribute("aria-current", on);
  });
  const lbl = $("hdrActiveTab");
  if (lbl && TAB_SHORT_LABELS[t]) lbl.textContent = TAB_SHORT_LABELS[t];
}

function initMobileNav() {
  const panel = $("mobileNavPanel");
  const toggle = $("navToggle");
  const backdrop = $("mobileNavBackdrop");
  if (!panel || !toggle) return;
  toggle.onclick = () => (panel.classList.contains("is-open") ? closeMobileNav() : openMobileNav());
  if (backdrop) backdrop.onclick = closeMobileNav;
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
  panel.querySelectorAll(".mobile-nav-item").forEach((btn) => {
    btn.onclick = () => {
      switchTab(btn.dataset.tab);
      closeMobileNav();
      if (!restoringState) window.scrollTo(0, 0);
    };
  });
}

function switchTab(t, fromRestore = false) {
  if (!VALID_TABS.includes(t)) return;
  activeTab = t;
  document.querySelectorAll(".tabbtn").forEach((x) => {
    const on = x.dataset.tab === t;
    x.classList.toggle("active", on);
    x.setAttribute("aria-selected", on ? "true" : "false");
  });
  syncMobileNav(t);
  closeMobileNav();
  VALID_TABS.forEach((id) => {
    const el = $("tab-" + id);
    if (el) el.hidden = id !== t;
  });
  if (t === "constellation" && tabsDirty.constellation) updateConstUI();
  if (t === "commercial" && tabsDirty.commercial) {
    updateCommercialUI();
    loadCommunityDD();
  }
  if (t === "value" && tabsDirty.value) updateValUI();
  if (t === "technology" && tabsDirty.technology) updateLinkUI();
  if (t === "explain" && tabsDirty.explain) showLevel(curLvl);
  tabsDirty[t] = false;
  if (!restoringState) {
    state.tab = t;
    if (!fromRestore) updateHashQuiet();
  }
}

function showLevel(l) {
  curLvl = l;
  state.ui.explainLvl = l;
  document.querySelectorAll(".lvlb").forEach((b) => b.classList.toggle("active", b.dataset.lvl === l));
  const body = $("explbody");
  if (body) body.innerHTML = EXPL[l] || "";
  if (!restoringState) updateHashQuiet();
}

const FACTS_STALE_DAYS = 90;
const FACTS_REFERENCE = new Date("2026-07-04T12:00:00Z");

function formatAsOfLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

function daysSinceAsOf(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const then = Date.UTC(y, m - 1, d);
  return Math.floor((FACTS_REFERENCE.getTime() - then) / 86400000);
}

function initFactsAsOf() {
  document.querySelectorAll(".fact[data-as-of]").forEach((el) => {
    const d = el.dataset.asOf;
    if (!d) return;
    el.setAttribute("title", "Data as of " + d);
    const b = el.querySelector("b");
    if (b && !b.querySelector(".as-of")) {
      const span = document.createElement("span");
      span.className = "as-of";
      span.textContent = " · as of " + formatAsOfLabel(d);
      b.appendChild(span);
    }
    const age = daysSinceAsOf(d);
    if (age > FACTS_STALE_DAYS && !el.querySelector(".stale-badge")) {
      const badge = document.createElement("span");
      badge.className = "stale-badge";
      badge.title = `${age} days since source date — verify for updates`;
      badge.textContent = "stale";
      el.querySelector("b")?.appendChild(badge);
    }
  });
}

function renderStaticPanels() {
  const mno = $("mnoGrid");
  if (mno) {
    mno.innerHTML = MNO_PARTNERS.map(
      (p) =>
        `<div class="fact mno-card" data-as-of="2026-06-17"><b>${p.name}</b> — ${p.region}<br/>${p.role}${p.investor ? " · <span class='tag f'>investor</span>" : ""}<br/><span class="tag ${tagClass(p.tag)}">${p.tag}</span><br/><span class="cite"><a href="${p.source}" target="_blank" rel="noopener">${p.sourceLabel || "source"} ↗</a></span></div>`
    ).join("");
  }
  const launches = $("launchTableBody");
  if (launches) {
    launches.innerHTML = LAUNCH_EVENTS.map(
      (e) =>
        `<tr><td>${e.sat}${e.count > 1 ? ` <span class="tag m">${e.count} sats</span>` : ""}</td><td>${e.date}</td><td>${e.provider}</td><td>${e.block}</td><td>${formatLaunchStatus(e)}</td><td><span class="tag f">${e.tag}</span>${e.source ? ` · <a href="${e.source}" target="_blank" rel="noopener">source</a>` : ""}</td></tr>`
    ).join("");
  }
  const dd = $("commDDBody");
  if (dd) dd.innerHTML = COMMUNITY_DD.map(ddRow).join("");
  const bear = $("commBearBody");
  if (bear) bear.innerHTML = BEAR_CASE.map(ddRow).join("");
  const threads = $("commThreadsBody");
  if (threads) {
    threads.innerHTML = COMMUNITY_THREADS.map(
      (t) =>
        `<tr><td><a href="${t.url}" target="_blank" rel="noopener">${t.label}</a></td><td>${t.reddit ? '<span class="reddit-tag">Reddit</span> ' : ""}${t.author}</td><td>${t.note}</td></tr>`
    ).join("");
  }
  const contribs = $("commContribBody");
  if (contribs) {
    contribs.innerHTML = TOP_COMMUNITY_CONTRIBUTORS.map(
      (c) =>
        `<tr><td>${c.reddit ? '<span class="reddit-tag">Reddit</span> ' : ""}${c.source ? `<a href="${c.source}" target="_blank" rel="noopener">${c.user}</a>` : c.user}</td><td>${c.role} <span class="tag ${c.tier === "helpful" ? "f" : c.tier === "misleading" ? "c" : "u"}">${c.tier || "—"}</span></td><td>${c.note}</td></tr>`
    ).join("");
  }
  const redditNote = $("commRedditNote");
  if (redditNote) {
    redditNote.innerHTML = `<span class="reddit-tag">Reddit</span> ${REDDIT_ATTRIBUTION.note} <a href="${REDDIT_ATTRIBUTION.url}" target="_blank" rel="noopener">${REDDIT_ATTRIBUTION.subreddit} ↗</a>`;
  }
  const cmp = $("vCompBody");
  if (cmp) {
    cmp.innerHTML = COMPARABLES.map(
      (c) =>
        `<tr><td>${c.name}${c.source ? ` · <a href="${c.source}" target="_blank" rel="noopener">source</a>` : ""}</td><td>${c.evMultiple}</td><td>${c.note}</td><td><span class="tag ${c.tag === "verified" ? "f" : "a"}">${c.tag}</span></td></tr>`
    ).join("");
  }
  const vdd = $("vDDBody");
  if (vdd) vdd.innerHTML = COMMUNITY_DD.filter((r) => /dilution|revenue|funded|Starlink/i.test(r.theme)).map(ddRow).join("");
}

function toast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

window.toggleMethod = (id) => {
  const el = $(id);
  if (el) el.hidden = !el.hidden;
};

function bindRange(id, valId, onInput) {
  const el = $(id);
  if (!el) return;
  el.addEventListener("input", () => {
    if (valId) {
      const v = $(valId);
      if (v) v.textContent = el.value;
    }
    onInput?.();
    scheduleUpdate();
  });
}

function init() {
  if (parseEmbedMode()) document.body.classList.add("embed-mode");

  buildBands($);
  renderStaticPanels();
  initFactsAsOf();

  document.querySelectorAll(".tabbtn").forEach((b) => {
    b.onclick = () => {
      switchTab(b.dataset.tab);
      if (!restoringState) window.scrollTo(0, 0);
    };
  });
  initMobileNav();
  document.querySelectorAll(".lvlb").forEach((b) => (b.onclick = () => showLevel(b.dataset.lvl)));
  document.querySelectorAll("[data-const-preset]").forEach((b) => (b.onclick = () => applyConstPreset(b.dataset.constPreset)));
  document.querySelectorAll("[data-val-preset]").forEach((b) => (b.onclick = () => applyValPreset(b.dataset.valPreset)));
  document.querySelectorAll("[data-dilution-stress]").forEach((b) => {
    b.onclick = () => applyDilutionStress(Number(b.dataset.dilutionStress));
  });
  document.querySelectorAll("[data-mc-preset]").forEach((b) => {
    b.onclick = () => {
      const p = LAUNCH_MC_PRESETS[b.dataset.mcPreset];
      if (!p) return;
      const el = $("mcFailureRate");
      if (el) el.value = p.failureRate;
      $("mcFailureRateVal").textContent = p.failureRate;
      document.querySelectorAll("[data-mc-preset]").forEach((x) => x.classList.toggle("active", x.dataset.mcPreset === b.dataset.mcPreset));
      scheduleUpdate();
    };
  });
  $("communityDDPanel")?.addEventListener("toggle", (e) => {
    if (e.target.open) loadCommunityDD();
  });

  bindRange("mcFailureRate", "mcFailureRateVal");
  bindRange("dilPrice", "dilPriceVal", () => updateDilutionUI(computeFullValuation(readValState())));
  bindRange("coSats", "coSatsVal");
  bindRange("coContinuousSats", "coContinuousSatsVal");
  bindRange("coMinElev", "coMinElevVal");

  Object.keys(DEFAULT_STATE.constellation).forEach((k) => bindRange("c" + k, "c" + k + "Val"));
  Object.keys(DEFAULT_STATE.val).forEach((k) => {
    if (k === "v_riskadj") return;
    const id = k.replace(/^v_/, "");
    bindRange("vv_" + id, "vv_" + id + "Val");
  });
  Object.keys(DEFAULT_STATE.link).forEach((k) => bindRange("lk_" + k, "lk_" + k + "Val"));
  $("v_riskadj")?.addEventListener("change", scheduleUpdate);
  $("ccalendarYear")?.addEventListener("input", () => {
    $("ccalendarYearVal").textContent = $("ccalendarYear").value;
    updateCommercialUI();
  });

  $("btnShare")?.addEventListener("click", async () => {
    updateNow(true);
    const url = location.origin + location.pathname + buildShareHash(state);
    try {
      await navigator.clipboard.writeText(url);
      toast("Share link copied");
    } catch {
      prompt("Copy share URL:", url);
    }
  });
  $("btnPrint")?.addEventListener("click", () => window.print());

  const decoded = decodeShareHash(location.hash);
  if (decoded) applyState(decoded);
  else {
    applyConstPreset("base");
    applyValPreset("base");
    switchTab("constellation", true);
    showLevel("eli5");
    updateNow(true);
  }
  initLiveQuote();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

export { updateNow, applyConstPreset, switchTab, state };
