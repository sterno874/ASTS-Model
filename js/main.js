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
  catalystsInYear,
  sortCatalysts,
  layoutTimeline,
  formatCatalystMonth
} from "./math/commercial.js";
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
  startLiveQuotePoll
} from "./ui/market-quote.js";

const $ = (id) => document.getElementById(id);

let state = structuredClone(DEFAULT_STATE);
let activeTab = "constellation";
let curLvl = "eli5";
let restoringState = false;
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
  eli5: `<h3>What is AST SpaceMobile ($ASTS)?</h3>
<p><span class="tag f">Fact</span> <b>AST SpaceMobile</b> builds huge satellites that act like cell towers in space — so your normal phone can get signal where there are no ground towers (<a href="https://ast-science.com/" target="_blank" rel="noopener">company site</a>).</p>
<p><span class="tag f">Fact</span> They partner with carriers like <b>AT&T</b> and <b>Verizon</b> instead of selling phone plans themselves. AST provides the space network; your carrier bills you (<a href="https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system" target="_blank" rel="noopener">FCC authorization</a>).</p>
<h4>The satellites</h4>
<p><span class="tag f">Fact</span> <b>BlueWalker 3</b> was the test satellite (2022). Production <b>BlueBird</b> satellites have massive phased-array antennas — Block 2 arrays are ~223 m² (~2,400 sq ft) (<a href="https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/" target="_blank" rel="noopener">SpaceNews</a>).</p>
<p><span class="tag f">Fact</span> As of Jun 2026, <b>BlueBirds 8–10</b> launched on SpaceX Falcon 9 after BlueBird 7 was lost to a low-orbit insertion error (<a href="https://www.businesswire.com/news/home/20260617420856/en/" target="_blank" rel="noopener">Business Wire</a>).</p>
<h4>What this model does</h4>
<p><span class="tag m">Model</span> Sliders let you ask “what if we have X satellites and Y% of subscribers pay $Z/month wholesale?” Blue bands = plausible guesses. Facts come from SEC, FCC, and IR — not Reddit hype.</p>`,

  ms: `<h3>Direct-to-cell architecture</h3>
<p><span class="tag f">Fact</span> AST uses <b>Supplemental Coverage from Space (SCS)</b> — satellites transmit on MNO-licensed low-band spectrum (700/800 MHz) so phones don't need new chips for basic integration (<a href="https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/" target="_blank" rel="noopener">DCD</a>).</p>
<p><span class="tag f">Fact</span> FCC authorized up to <b>248 satellites</b> (Order DA 26-391, Apr 2026). Company cites <b>45–60 sats</b> for continuous US coverage (<a href="https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/" target="_blank" rel="noopener">SpaceNews</a>).</p>
<p><span class="tag f">Fact</span> ~<b>60 MNO agreements</b> covering <b>3B+ subscribers</b> — MOUs/partnerships, not all commercial contracts yet (<a href="https://ast-science.com/" target="_blank" rel="noopener">IR</a>).</p>
<h4>Revenue path</h4>
<p><span class="tag u">Assumption</span> Wholesale capacity fees / rev-share with MNOs and government gateway contracts. Q1 2026 revenue ~$14.7M was largely gateway hardware + gov milestones — not consumer broadband at scale.</p>
<p>→ Try the <a href="#link-budget-sim" onclick="document.querySelector('.tabbtn[data-tab=technology]').click();return true;">link budget sim</a> on the Technology tab.</p>`,

  hs: `<h3>Phased arrays &amp; link budget</h3>
<p><span class="tag f">Fact</span> Large aperture phased arrays increase EIRP and gain, closing the link to a handset with ~0 dBi antenna and ≤23 dBm TX power. Block 2 arrays are ~3.5× Block 1 area → ~5 dB gain boost (rough √A scaling).</p>
<p><span class="tag f">Fact</span> Demonstrated peaks: Block 1 <b>98.9 Mbps</b>; Block 2 target <b>~200 Mbps</b> peak — shared beam capacity, not per-user SLA (<a href="https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/" target="_blank" rel="noopener">SatNews</a>).</p>
<p><span class="tag m">Model</span> Technology tab uses Friis path loss to LEO (~550 km) at 700–800 MHz with adjustable elevation — educational, not AST proprietary RF planning.</p>
<h4>Competition</h4>
<p><span class="tag f">Fact</span> <b>SpaceX Starlink D2C</b> (T-Mobile partnership), <b>Lynk/Omnispace</b>, Apple/Globalstar emergency — overlapping D2D spectrum strategies. AST bets on fewer, larger satellites vs Starlink's distributed small-sat approach.</p>`,

  col: `<h3>Constellation economics</h3>
<p><span class="tag m">Model</span> Revenue proxy: <code>activeSubs = MNO_subs × penetration × coverageFraction</code>; <code>rev = activeSubs × ARPU_monthly × 12</code>. Penetration is space-layer attach rate, not total MNO subs.</p>
<p><span class="tag c">Community</span> Reddit thesis "$3/mo × 3B = $5.4B" is <b>rejected</b> — assumes 100% attach and full ARPU to AST; wholesale rev-share is a fraction of carrier pricing.</p>
<h4>Capital structure</h4>
<p><span class="tag f">Fact</span> Q1 2026 cash ~$3.46B; Q1 investing cash outflow ~$379M (satellite CapEx). Diluted shares ~256M FY2025; convertibles ~$2.2B outstanding — dilution remains structural (<a href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312" target="_blank" rel="noopener">SEC CIK 1780312</a>).</p>`,

  pro: `<h3>Regulatory &amp; spectrum</h3>
<p><span class="tag f">Fact</span> FCC DA 26-391 (Apr 2026): NGSO deployment + SCS authority for 248 sats; conditions on interference, debris, NSF/NRAO coordination. ITU / local approvals still required ex-US.</p>
<p><span class="tag f">Fact</span> AST holds 3,900+ patents/patent-pending per IR — IP supports beamforming, deployment, spectrum coordination; patents ≠ commercial moat alone.</p>
<h4>Launch cadence risk</h4>
<p><span class="tag f">Fact</span> Multi-provider strategy: SpaceX, Blue Origin, ISRO. BB7 failure (NG-3 insertion) insured; demonstrates launch-specific risk distinct from payload failure.</p>
<p><span class="tag m">Model</span> Valuation uses segment-weighted EV = Σ (peakRev × P(commercial) × EV/Revenue × weight) + platform optionality. Treat $/sh as scenario math, not price target.</p>`,

  phd: `<h3>Link budget &amp; system capacity</h3>
<p><span class="tag m">Model</span> Friis: <code>PL(dB) = 20 log₁₀(4πd/λ)</code>. Slant range from elevation angle ε and altitude h. Handset link: budget margin = P_rx − sensitivity; positive margin necessary but not sufficient for broadband QoS.</p>
<p><span class="tag f">Fact</span> LEO Doppler and handoff require ground gateway integration with MNO core; AST builds gateways + uses partner spectrum — not standalone MVNO in most markets.</p>
<p><span class="tag u">Assumption</span> Concurrent users/sat bounded by beamforming sectors, spectrum reuse, and backhaul — model uses subs/sat slider as opaque capacity proxy. See Technology tab for margin vs elevation sensitivity.</p>
<p><span class="tag f">Fact</span> Continuous coverage requires time-averaged satellite availability across orbits — company cites 45–60 sats; exact geometry depends on inclination, planes, and min elevation angle.</p>`
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
  updateHeader();
}

function updateCommercialUI() {
  const year = +($("ccalendarYear")?.value ?? 2026);
  const cats = sortCatalysts(catalystsInYear(year));
  const host = $("commCalendar");
  if (host) {
    host.innerHTML = layoutTimeline(cats.length ? cats : CATALYSTS, year)
      .map(
        (c) =>
          `<div class="cat-tl-bar" style="left:${c.left}%;width:${Math.max(c.width, 3)}%" title="${c.label}"><span>${c.label}</span><span class="tag ${c.tag === "verified" ? "f" : c.tag === "forward-looking" ? "u" : "p"}">${c.tag}</span></div>`
      )
      .join("");
  }
  const sum = $("commSummary");
  if (sum) sum.textContent = `${MNO_PARTNERS.length} named strategic MNO partners · ${LAUNCH_EVENTS.length} verified launch milestones through Jun 2026 · FCC 248-sat authorization Apr 2026.`;
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
          `<tr><td>${r.label}</td><td>${fmtM(r.peak)}</td><td>${(r.pSuccess * 100).toFixed(0)}%</td><td>${fmtM(r.evContrib)}</td></tr>`
      )
      .join("");
  }
  renderBands($, (id) => {
    const key = id.replace("mk-vv_", "vv_").replace("mk-", "");
    if (key.startsWith("vv_")) return val["v_" + key.slice(3)];
    return null;
  });
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
  if (t === "commercial" && tabsDirty.commercial) updateCommercialUI();
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

function initFactsAsOf() {
  document.querySelectorAll(".fact[data-as-of]").forEach((el) => {
    const d = el.dataset.asOf;
    if (d) el.setAttribute("title", "Data as of " + d);
  });
}

function renderStaticPanels() {
  const mno = $("mnoGrid");
  if (mno) {
    mno.innerHTML = MNO_PARTNERS.map(
      (p) =>
        `<div class="fact" data-as-of="2026-06-17"><b>${p.name}</b> — ${p.region}<br/>${p.role}${p.investor ? " · <span class='tag f'>investor</span>" : ""}<br/><span class="cite"><a href="${p.source}" target="_blank" rel="noopener">IR</a></span></div>`
    ).join("");
  }
  const launches = $("launchTableBody");
  if (launches) {
    launches.innerHTML = LAUNCH_EVENTS.map(
      (e) =>
        `<tr><td>${e.sat}</td><td>${e.date}</td><td>${e.provider}</td><td>${e.block}</td><td>${e.status || "deployed"}</td><td><span class="tag f">${e.tag}</span></td></tr>`
    ).join("");
  }
  const ddRow = (row) => {
    const cls = row.verdict === "verified" ? "val-ok" : row.verdict === "rejected" ? "val-no" : "val-part";
    const icon = row.verdict === "verified" ? "✅" : row.verdict === "rejected" ? "❌" : "⚠️";
    return `<tr><td>${row.theme}</td><td><span class="${cls}">${icon}</span> ${row.verdict}</td><td><span class="tag ${row.tag === "verified" ? "f" : "c"}">${row.tag}</span></td><td>${row.note}</td></tr>`;
  };
  const dd = $("commDDBody");
  if (dd) dd.innerHTML = COMMUNITY_DD.map(ddRow).join("");
  const bear = $("commBearBody");
  if (bear) bear.innerHTML = BEAR_CASE.map(ddRow).join("");
  const threads = $("commThreadsBody");
  if (threads) {
    threads.innerHTML = COMMUNITY_THREADS.map(
      (t) => `<tr><td><a href="${t.url}" target="_blank" rel="noopener">${t.label}</a></td><td>${t.author}</td><td>${t.note}</td></tr>`
    ).join("");
  }
  const contribs = $("commContribBody");
  if (contribs) {
    contribs.innerHTML = TOP_COMMUNITY_CONTRIBUTORS.map(
      (c) => `<tr><td>${c.user}</td><td>${c.role}</td><td>${c.note}</td></tr>`
    ).join("");
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
