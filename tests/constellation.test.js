import test from "node:test";
import assert from "node:assert/strict";
import {
  computeConstellationMetrics,
  coverageFraction,
  monthsToTarget,
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

test("FCC authorized constellation is 248", () => {
  assert.equal(CONSTELLATION_ANCHORS.fccAuthorized, 248);
});
