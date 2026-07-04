/**
 * Launch cadence Monte Carlo — stress failure rate post-BB7, time to coverage target.
 * Educational; not a company forecast.
 */

import { monthsToTarget } from "./constellation.js";

/** Seeded PRNG (mulberry32) for reproducible tests. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Single deterministic launch path to target sats.
 * @returns {{ months: number, launches: number, failures: number, finalSats: number }}
 */
export function simulateLaunchPath({
  startSats = 10,
  targetSats = 45,
  satsPerLaunch = 3,
  launchIntervalMonths = 1.5,
  failureRate = 0.05,
  rng = Math.random,
  maxLaunches = 80
}) {
  let sats = startSats;
  let months = 0;
  let launches = 0;
  let failures = 0;
  while (sats < targetSats && launches < maxLaunches) {
    launches += 1;
    months += launchIntervalMonths;
    if (rng() < failureRate) {
      failures += 1;
      continue;
    }
    sats += Math.min(satsPerLaunch, targetSats - sats);
  }
  return { months, launches, failures, finalSats: sats, reached: sats >= targetSats };
}

/**
 * Monte Carlo distribution for months-to-target.
 */
export function runLaunchMonteCarlo({
  trials = 2000,
  seed = 42,
  startSats = 10,
  targetSats = 45,
  satsPerLaunch = 3,
  launchIntervalMonths = 1.5,
  failureRate = 0.05
} = {}) {
  const rng = mulberry32(seed);
  const months = [];
  let success = 0;
  let totalFailures = 0;
  for (let i = 0; i < trials; i++) {
    const r = simulateLaunchPath({
      startSats,
      targetSats,
      satsPerLaunch,
      launchIntervalMonths,
      failureRate,
      rng
    });
    months.push(r.months);
    totalFailures += r.failures;
    if (r.reached) success += 1;
  }
  months.sort((a, b) => a - b);
  const pct = (q) => months[Math.min(months.length - 1, Math.floor(q * (months.length - 1)))] ?? 0;
  const mean = months.reduce((s, m) => s + m, 0) / Math.max(1, months.length);
  const deterministic = monthsToTarget(startSats, targetSats, satsPerLaunch, launchIntervalMonths);
  return {
    trials,
    failureRate,
    pSuccess: success / trials,
    meanFailuresPerPath: totalFailures / trials,
    meanMonths: mean,
    p10Months: pct(0.1),
    p50Months: pct(0.5),
    p90Months: pct(0.9),
    deterministicMonths: deterministic,
    targetSats,
    startSats
  };
}

/** BB7-informed failure-rate presets (model). */
export const LAUNCH_MC_PRESETS = {
  optimistic: { failureRate: 0.02, label: "Optimistic — 2% fail/launch" },
  base: { failureRate: 0.05, label: "Base — 5% (post-BB7 stress)" },
  stressed: { failureRate: 0.12, label: "Stressed — 12% provider risk" },
  bb7: { failureRate: 0.25, label: "BB7 analog — 25% single-launch loss" }
};
