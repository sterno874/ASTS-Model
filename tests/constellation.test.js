import test from "node:test";
import assert from "node:assert/strict";
import {
  computeConstellationMetrics,
  coverageFraction,
  monthsToTarget,
  wholesaleRevenueProxyM,
  DEFAULT_OPERATIONAL_SATS,
  CONSTELLATION_ANCHORS
} from "../js/math/constellation.js";

test("DEFAULT_OPERATIONAL_SATS is 10 Jul 2026", () => {
  assert.equal(DEFAULT_OPERATIONAL_SATS, 10);
});

test("coverageFraction ramps to 1 at coverage sats", () => {
  assert.equal(coverageFraction(0), 0);
  assert.equal(coverageFraction(45, 45), 1);
  assert.ok(coverageFraction(10, 45) < 0.25);
});

test("computeConstellationMetrics returns positive rev proxy at base", () => {
  const m = computeConstellationMetrics({ sats: 10, targetSats: 45, coverageSats: 45, subsPerSat: 50000, mnoSubsM: 3000, penetration: 0.02, arpuMonthly: 3 });
  assert.ok(m.capacityM > 0);
  assert.ok(m.revProxyM > 0);
  assert.ok(m.pctToContinuous > 0 && m.pctToContinuous < 100);
});

test("monthsToTarget increases with fewer sats", () => {
  const near = monthsToTarget(40, 45, 3, 1.5);
  const far = monthsToTarget(10, 45, 3, 1.5);
  assert.ok(far > near);
});

test("coverageFraction caps at 1 above threshold", () => {
  assert.equal(coverageFraction(100, 45), 1);
  assert.equal(coverageFraction(90, 45), 1);
});

test("wholesaleRevenueProxyM annualizes ARPU by 12 months", () => {
  const m3 = wholesaleRevenueProxyM({ mnoSubsM: 1000, penetration: 0.01, arpuMonthly: 3, coverageFrac: 1 });
  const m6 = wholesaleRevenueProxyM({ mnoSubsM: 1000, penetration: 0.01, arpuMonthly: 6, coverageFrac: 1 });
  assert.equal(m6, m3 * 2);
  assert.equal(m3, 360);
});
