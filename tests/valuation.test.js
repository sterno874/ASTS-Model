import test from "node:test";
import assert from "node:assert/strict";
import {
  computeFullValuation,
  peakWholesaleRevenueM,
  computeRunwayMonths,
  FILING_ANCHORS,
  segmentEvContrib,
  verifyEvReconciliation,
  computeEquityM,
  COMPARABLES,
  P_COMMERCIAL_FRAMING,
  splitOperatingOptionality
} from "../js/math/valuation.js";
import { DEFAULT_STATE, VAL_PRESETS } from "../js/ui/state.js";
import { computeVsMarketRange } from "../js/ui/market-quote.js";

test("segment rows sum to total EV", () => {
  const v = computeFullValuation(DEFAULT_STATE.val);
  assert.ok(verifyEvReconciliation(v.rows, v.platform, v.ev));
});

test("each row EV = peak × P(s) × mult × weight", () => {
  const v = computeFullValuation({ ...DEFAULT_STATE.val, v_mult: 5 });
  for (const row of v.rows) {
    assert.ok(Math.abs(row.evContrib - segmentEvContrib(row.peak, row.pSuccess, 5, row.weight)) < 0.02);
  }
});

test("golden base-case EV ~941M and $/sh ~14.46", () => {
  const v = computeFullValuation(DEFAULT_STATE.val);
  assert.ok(Math.abs(v.ev - 941) < 2);
  assert.ok(Math.abs(v.perSh - 14.46) < 0.1);
  assert.equal(computeEquityM(v.ev, v.cash, v.debt), v.equityM);
});

test("intl segment uses P commercial haircut", () => {
  const v = computeFullValuation(DEFAULT_STATE.val);
  const intl = v.rows.find((r) => r.id === "intl_mno");
  assert.ok(Math.abs(intl.pSuccess - DEFAULT_STATE.val.v_pCommercial * P_COMMERCIAL_FRAMING.intlHaircut) < 0.001);
});

test("COMPARABLES cites IRDM and VSAT", () => {
  assert.ok(COMPARABLES.find((c) => c.name.includes("Iridium"))?.source?.includes("IRDM"));
  assert.ok(COMPARABLES.find((c) => c.name.includes("ViaSat"))?.source?.includes("VSAT"));
});

test("FILING_ANCHORS match Q1 2026 10-Q", () => {
  assert.equal(FILING_ANCHORS.cashQ1_2026_M, 3460);
  assert.equal(FILING_ANCHORS.q1Revenue_M, 14.7);
});

test("peakWholesaleRevenueM scales with penetration", () => {
  const low = peakWholesaleRevenueM({ mnoSubsM: 3000, penetration: 0.01, arpuMonthly: 3, coverageFrac: 0.3 });
  const high = peakWholesaleRevenueM({ mnoSubsM: 3000, penetration: 0.03, arpuMonthly: 3, coverageFrac: 0.3 });
  assert.ok(high > low);
});

test("bull preset EV exceeds bear and reflects 45+ sats thesis", () => {
  const bull = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bull });
  const bear = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bear });
  assert.ok(bull.ev > bear.ev);
  assert.ok(bull.equityM > 15_000, "commercial bull should reach mid-teens $B equity");
  assert.ok(bull.operatingEquityM < bull.equityM);
  assert.ok(bull.platform >= 5000);
});

test("constellation248 preset equity exceeds commercial bull and is model-only", () => {
  const c248 = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.constellation248 });
  const bull = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bull });
  assert.ok(c248.equityM > bull.equityM);
  assert.ok(VAL_PRESETS.constellation248.modelOnly);
});

test("operating vs optionality split sums to combined equity", () => {
  const v = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.bull });
  const split = splitOperatingOptionality(v);
  assert.ok(Math.abs(split.operatingEquityM + split.optionalityM - split.totalEquityM) < 0.02);
  assert.equal(split.optionalityM, v.platform);
});

test("vs-mkt range spans operating to combined equity", () => {
  const v = computeFullValuation({ ...DEFAULT_STATE.val, ...VAL_PRESETS.base });
  const mktCapM = 33_000;
  const split = splitOperatingOptionality(v);
  const range = computeVsMarketRange(split.operatingEquityM, split.totalEquityM, mktCapM);
  assert.match(range.rangeLabel, /→/);
  assert.ok(range.total.upsideMult > range.operating.upsideMult);
});

test("runway uses quarterly-to-months factor of 3", () => {
  assert.equal(computeRunwayMonths(300, 100), 9);
});
