import test from "node:test";
import assert from "node:assert/strict";
import { computeConstellationMetrics, coverageFraction, coverageMilestonePct, addressableWholesaleFrac, wholesaleRevenueProxyM, CONSTELLATION_ANCHORS } from "../js/math/constellation.js";
test("45/60 anchors", () => { assert.equal(CONSTELLATION_ANCHORS.continuousCoverageMin, 45); assert.equal(CONSTELLATION_ANCHORS.continuousCoverageMax, 60); });
test("coverageMilestonePct", () => { assert.equal(coverageMilestonePct(45).status, "continuous"); assert.equal(coverageMilestonePct(60).status, "full"); });
test("addressableWholesaleFrac", () => assert.equal(addressableWholesaleFrac(1), 0.35));
test("wholesaleRevenueProxyM", () => { const r = wholesaleRevenueProxyM({ mnoSubsM: 1000, penetration: 0.01, arpuMonthly: 3, orbitalCoverage: 1 }); assert.equal(r.annualRevenueM, 126); });
test("base metrics", () => { const m = computeConstellationMetrics({ sats: 10, coverageSats: 45, penetration: 0.02, arpuMonthly: 3, mnoSubsM: 3000 }); assert.equal(m.coverageStatus, "partial"); });
test("coverageFraction caps at 1", () => { assert.equal(coverageFraction(90, 45), 1); assert.ok(coverageFraction(90, 45) < 90 / 45); });
test("wholesale revenue annualizes monthly ARPU", () => {
  const r = wholesaleRevenueProxyM({ mnoSubsM: 100, penetration: 0.1, arpuMonthly: 5, orbitalCoverage: 1 });
  assert.equal(r.annualRevenueM, r.activeSubsM * 5 * 12);
});
