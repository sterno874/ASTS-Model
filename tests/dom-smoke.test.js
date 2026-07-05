import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VALID_TABS, EXPLAIN_LEVELS } from "../js/ui/state.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const js = readFileSync(path.join(root, "js/main.js"), "utf8");

function matchAll(re, text) {
  const out = [];
  let m;
  const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = g.exec(text)) !== null) out.push(m);
  return out;
}

test("index.html links css and js module", () => {
  assert.match(html, /href="css\/main\.css"/);
  assert.match(html, /type="module" src="js\/main\.js"/);
});

test("tab buttons match VALID_TABS", () => {
  const tabs = matchAll(/class="tabbtn[^"]*"[^>]*data-tab="([^"]+)"/g, html).map((m) => m[1]);
  assert.deepEqual(tabs, VALID_TABS);
});

test("mobile nav panel exposes all tabs", () => {
  const nav = matchAll(/<div id="mobileNavPanel"[\s\S]*?<\/div>/g, html)[0][0];
  const navTabs = nav.match(/data-tab="([^"]+)"/g).map((s) => s.slice(10, -1));
  assert.deepEqual(navTabs, VALID_TABS);
});

test("hamburger nav toggle is accessible", () => {
  assert.match(html, /id="navToggle"/);
  assert.match(js, /function initMobileNav\(/);
});

test("six explain levels in HTML", () => {
  const levels = matchAll(/class="lvlb[^"]*"[^>]*data-lvl="([^"]+)"/g, html).map((m) => m[1]);
  assert.deepEqual(levels, EXPLAIN_LEVELS);
});

test("technology tab has link budget sim", () => {
  assert.match(html, /id="tab-technology"/);
  assert.match(html, /id="link-budget-sim"/);
  assert.match(html, /id="linkSvg"/);
});

test("technology tab has coverage orbit sim", () => {
  assert.match(html, /id="coverage-orbit-sim"/);
  assert.match(html, /id="coverageSvg"/);
  assert.match(html, /id="d2cArchSvg"/);
  assert.match(html, /co-overlap-explainer/);
});

test("technology tab wires block preset buttons", () => {
  assert.match(js, /data-lk-block/);
  assert.match(js, /applyLinkBlock/);
  assert.match(js, /\[data-lk-block\]/);
});

test("technology tab populates coverage milestone outputs", () => {
  assert.match(js, /coMonths45/);
  assert.match(js, /coFPct/);
});

test("technology tab has shared sim design tokens", () => {
  const css = readFileSync(path.join(root, "css/tech-sims.css"), "utf8");
  assert.match(css, /\.co-threshold-strip/);
  assert.match(css, /\.sim-legend/);
});

test("constellation tab has Monte Carlo controls", () => {
  assert.match(html, /id="mcFailureRate"/);
  assert.match(html, /data-mc-preset/);
});

test("valuation tab has dilution path table", () => {
  assert.match(html, /id="dilNotesBody"/);
  assert.match(html, /id="dilPrice"/);
  assert.match(html, /data-dilution-stress="280"/);
  assert.match(html, /id="vVsMkt"/);
  assert.match(html, /Q1 2026 filing anchors/);
  assert.match(html, /data-val-preset="constellation248"/);
  assert.match(html, /id="vOperatingEquity"/);
  assert.match(html, /id="verifiedMilestonesVal"/);
});

test("community DD expandable panel present", () => {
  assert.match(html, /id="communityDDPanel"/);
  assert.match(js, /KOOK_REPORT_CLAIMS/);
});

test("BAG preset button in constellation", () => {
  assert.match(html, /data-const-preset="bag"/);
});

test("Phase 2 badge in header", () => {
  assert.match(html, /Phase 2/);
});

test("SEC CIK cited", () => {
  assert.match(html, /CIK=0001780312/);
});

test("community DD tables present", () => {
  assert.match(html, /id="commDDBody"/);
  assert.match(html, /id="commContribBody"/);
  assert.match(html, /id="commRedditNote"/);
  assert.match(html, /Community DD/);
  assert.match(html, /comm-tab/);
  assert.match(js, /layoutTimeline/);
  assert.match(js, /REDDIT_ATTRIBUTION/);
});

test("prior bands on sliders", () => {
  assert.match(html, /id="band-csats"/);
  assert.match(html, /id="band-vv_shares"/);
});

test("og-image and vercel analytics", () => {
  assert.match(html, /og-image\.png/);
  assert.match(html, /_vercel\/insights/);
});

test("explain level click toggles active class", () => {
  assert.match(js, /function highlightExplainLevel\(/);
  assert.match(js, /classList\.toggle\("active", on\)/);
  assert.match(js, /querySelectorAll\("\.expl-lvlnav \.lvlb, \.expl-levels \.lvlb"\)/);
  assert.match(js, /setAttribute\("aria-pressed"/);
  assert.match(html, /class="expl-lvlnav"/);
  assert.match(html, /aria-pressed="true"/);
});

test("preset highlight toggles p-def class", () => {
  assert.match(js, /function highlightPresets\(/);
  assert.match(js, /classList\.toggle\("p-def", on\)/);
  assert.match(js, /highlightPresets\("\[data-const-preset\]"/);
  assert.match(js, /highlightPresets\("\[data-val-preset\]"/);
  assert.match(js, /highlightPresets\("\[data-mc-preset\]"/);
});

test("no duplicate element ids", () => {
  const ids = matchAll(/\bid="([^"]+)"/g, html).map((m) => m[1]);
  const seen = new Set();
  const dupes = [];
  for (const id of ids) {
    if (seen.has(id)) dupes.push(id);
    seen.add(id);
  }
  assert.deepEqual(dupes, []);
});
