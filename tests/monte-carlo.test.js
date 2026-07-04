import test from "node:test";
import assert from "node:assert/strict";
import {
  mulberry32,
  simulateLaunchPath,
  runLaunchMonteCarlo,
  LAUNCH_MC_PRESETS
} from "../js/math/monte-carlo.js";

test("mulberry32 is deterministic for same seed", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  assert.equal(a(), b());
  assert.equal(a(), b());
});

test("simulateLaunchPath reaches target with zero failure", () => {
  const r = simulateLaunchPath({
    startSats: 10,
    targetSats: 45,
    satsPerLaunch: 3,
    launchIntervalMonths: 1.5,
    failureRate: 0,
    rng: () => 1
  });
  assert.equal(r.reached, true);
  assert.equal(r.failures, 0);
  assert.ok(r.months > 0);
});

test("100% failure rate yields zero pSuccess", () => {
  const mc = runLaunchMonteCarlo({ trials: 200, seed: 11, failureRate: 1, maxLaunches: 20 });
  assert.equal(mc.pSuccess, 0);
});

test("failure rate affects mean months at same seed", () => {
  const low = runLaunchMonteCarlo({ trials: 500, seed: 1, failureRate: 0.01 });
  const high = runLaunchMonteCarlo({ trials: 500, seed: 1, failureRate: 0.2 });
  assert.ok(high.meanMonths >= low.meanMonths);
});

test("runLaunchMonteCarlo pSuccess decreases with failure rate", () => {
  const base = runLaunchMonteCarlo({ trials: 1000, seed: 99, failureRate: 0.02 });
  const stress = runLaunchMonteCarlo({ trials: 1000, seed: 99, failureRate: 0.25 });
  assert.ok(stress.pSuccess <= base.pSuccess);
});

test("LAUNCH_MC_PRESETS includes base and bb7", () => {
  assert.ok(LAUNCH_MC_PRESETS.base);
  assert.ok(LAUNCH_MC_PRESETS.bb7);
  assert.ok(LAUNCH_MC_PRESETS.bb7.failureRate > LAUNCH_MC_PRESETS.base.failureRate);
});

test("p50 months between p10 and p90", () => {
  const mc = runLaunchMonteCarlo({ trials: 2000, seed: 7, failureRate: 0.08 });
  assert.ok(mc.p10Months <= mc.p50Months);
  assert.ok(mc.p50Months <= mc.p90Months);
});

test("deterministic months matches zero-failure heuristic", () => {
  const mc = runLaunchMonteCarlo({ trials: 100, seed: 3, failureRate: 0 });
  assert.equal(mc.pSuccess, 1);
  assert.ok(mc.deterministicMonths > 0);
});
