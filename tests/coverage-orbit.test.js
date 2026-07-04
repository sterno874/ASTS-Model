import test from "node:test";
import assert from "node:assert/strict";
import {
  singleFootprintKm2,
  overlapCoverageFraction,
  continuousCoverageFraction,
  constellationTimeline,
  computeCoverageOrbit
} from "../js/math/coverage-orbit.js";

test("singleFootprintKm2 positive at LEO", () => {
  const a = singleFootprintKm2(550, 25);
  assert.ok(a > 1e5);
});

test("overlapCoverageFraction increases with sat count", () => {
  const a = overlapCoverageFraction(5);
  const b = overlapCoverageFraction(20);
  assert.ok(b > a);
});

test("continuousCoverageFraction hits 1 at threshold", () => {
  assert.equal(continuousCoverageFraction(45, 45), 1);
  assert.ok(continuousCoverageFraction(10, 45) < 0.3);
});

test("constellationTimeline includes 45 sat milestone", () => {
  const tl = constellationTimeline({ startSats: 10, milestones: [45], satsPerLaunch: 3, launchIntervalMonths: 1.5 });
  assert.ok(tl.some((e) => e.milestone === 45));
});

test("computeCoverageOrbit returns timeline and fractions", () => {
  const r = computeCoverageOrbit({ sats: 10, continuousSats: 45, altKm: 550, minElevDeg: 25 });
  assert.ok(r.overlapFrac > 0 && r.overlapFrac < 1);
  assert.ok(r.continuousFrac > 0);
  assert.ok(r.timeline.length > 0);
});

test("overlap capped at 1", () => {
  assert.equal(overlapCoverageFraction(500), 1);
});
