import test from "node:test";
import assert from "node:assert/strict";
import { computeFullValuation, peakWholesaleRevenueM, FILING_ANCHORS } from "../js/math/valuation.js";
import { DEFAULT_STATE, VAL_PRESETS } from "../js/ui/state.js";

test("peakWholesaleRevenueM scales with penetration", () => {
  const low = peakWholesaleRevenueM({ mnoSubsM: 3000, penetration: 0.01, arpuMonthly: 3, coverageFrac: 0.3 });
  const high = peakWholesaleRevenueM({ mnoSubsM: 3000, penetration: 0.03, arpuMonthly: 3, coverageFrac: 0.3 });
  assert.ok(high > low);
});

test("base valuation EV is positive and $/sh plausible", () => {
  const v = computeFullValuation(DEFAULT_STATE.val);
  assert.ok(v.ev > 100);
  assert.ok(v.perSh > 0 && v.perSh < 500);
});

test("bull preset EV exceeds bear", () => {
  const bull = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bull });
  const bear = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bear });
  assert.ok(bull.ev > bear.ev);
});

test("runway decreases with higher burn", () => {
  const low = computeFullValuation({ ...DEFAULT_STATE.val, v_burnQuarterly: 80 });
  const high = computeFullValuation({ ...DEFAULT_STATE.val, v_burnQuarterly: 200 });
  assert.ok(low.runwayMo > high.runwayMo);
});

test("FILING_ANCHORS cash matches Q1 2026", () => {
  assert.equal(FILING_ANCHORS.cashQ1_2026_M, 3460);
});
