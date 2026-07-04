/**
 * Simplified orbital coverage model — footprint overlap vs satellite count.
 * Walker delta not simulated; uses overlap heuristic for pedagogy.
 */

import { coverageRadiusKm } from "./link-budget.js";

const US_AREA_KM2 = 9.834e6;

/**
 * Single-satellite instantaneous footprint area (km²).
 */
export function singleFootprintKm2(altKm = 550, minElevDeg = 25) {
  const r = coverageRadiusKm(altKm, minElevDeg);
  return Math.PI * r * r;
}

/**
 * Overlap-adjusted coverage fraction for N identical sats (heuristic).
 * Uses 1 - (1 - f)^N where f = footprint / US area, capped at 1.
 * Not a true Walker simulation — educational ramp to 45/60 threshold.
 */
export function overlapCoverageFraction(satCount, { altKm = 550, minElevDeg = 25, regionAreaKm2 = US_AREA_KM2 } = {}) {
  if (satCount <= 0) return 0;
  const footprint = singleFootprintKm2(altKm, minElevDeg);
  const f = Math.min(1, footprint / regionAreaKm2);
  const uncapped = 1 - Math.pow(1 - f, satCount);
  return Math.min(1, uncapped);
}

/**
 * Time-averaged continuous coverage proxy — requires min sats for 24/7 service.
 * Linear ramp between 0 and continuousCoverageSats, then capped.
 */
export function continuousCoverageFraction(satCount, continuousCoverageSats = 45) {
  if (satCount <= 0 || continuousCoverageSats <= 0) return 0;
  return Math.min(1, satCount / continuousCoverageSats);
}

/**
 * Constellation timeline — months from start to each sat milestone.
 */
export function constellationTimeline({
  startSats = 10,
  milestones = [15, 25, 35, 45, 60],
  satsPerLaunch = 3,
  launchIntervalMonths = 1.5
}) {
  const events = [];
  let sats = startSats;
  let month = 0;
  const sorted = [...milestones].sort((a, b) => a - b);
  let mi = 0;
  while (mi < sorted.length) {
    if (sats >= sorted[mi]) {
      events.push({
        sats,
        month,
        milestone: sorted[mi],
        label: `${sorted[mi]} sats`,
        continuousFrac: continuousCoverageFraction(sorted[mi]),
        overlapFrac: overlapCoverageFraction(sorted[mi]),
        tag: "model"
      });
      mi += 1;
      continue;
    }
    month += launchIntervalMonths;
    sats += satsPerLaunch;
  }
  return events;
}

/** Full sim output for Technology tab. */
export function computeCoverageOrbit(state) {
  const altKm = state.altKm ?? 550;
  const minElevDeg = state.minElevDeg ?? 25;
  const sats = state.sats ?? 10;
  const continuousSats = state.continuousSats ?? 45;
  const footprintKm2 = singleFootprintKm2(altKm, minElevDeg);
  const radiusKm = Math.sqrt(footprintKm2 / Math.PI);
  const overlapFrac = overlapCoverageFraction(sats, { altKm, minElevDeg });
  const continuousFrac = continuousCoverageFraction(sats, continuousSats);
  const timeline = constellationTimeline({
    startSats: sats,
    milestones: [sats, 15, 25, 35, 45, 60].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b),
    satsPerLaunch: state.satsPerLaunch ?? 3,
    launchIntervalMonths: state.launchIntervalMonths ?? 1.5
  });
  return {
    altKm,
    minElevDeg,
    sats,
    continuousSats,
    footprintKm2,
    radiusKm,
    overlapFrac,
    continuousFrac,
    timeline
  };
}
