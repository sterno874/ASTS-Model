/**
 * Simplified orbital coverage model — footprint overlap vs satellite count.
 */
import { coverageRadiusKm } from "./link-budget.js";
import { CONSTELLATION_ANCHORS } from "./constellation.js";
const US_AREA_KM2 = 9.834e6;
export const US_COVERAGE_SOURCES = {
  min: CONSTELLATION_ANCHORS.continuousCoverageMin,
  max: CONSTELLATION_ANCHORS.continuousCoverageMax,
  target2026: CONSTELLATION_ANCHORS.target2026,
  asOf: "2026-04-21", tag: "verified",
  label: "45–60 sats continuous US coverage",
  cite: { href: "https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/", text: "SpaceNews Apr 2026" },
  note: "Company cites ~45 sats floor, ~60 upper end for continuous US service."
};
export const COVERAGE_MILESTONES = [
  { sats: 15, label: "Early expansion", tag: "model" },
  { sats: 25, label: "Mid-scale deploy", tag: "model" },
  { sats: 35, label: "Pre-coverage ramp", tag: "model" },
  { sats: 45, label: "Continuous floor", tag: "verified", source: US_COVERAGE_SOURCES.cite },
  { sats: 60, label: "Continuous upper", tag: "verified", source: US_COVERAGE_SOURCES.cite }
];
export function singleFootprintKm2(altKm = 550, minElevDeg = 25) {
  const r = coverageRadiusKm(altKm, minElevDeg);
  return Math.PI * r * r;
}
export function overlapCoverageFraction(satCount, { altKm = 550, minElevDeg = 25, regionAreaKm2 = US_AREA_KM2 } = {}) {
  if (satCount <= 0) return 0;
  const f = Math.min(1, singleFootprintKm2(altKm, minElevDeg) / regionAreaKm2);
  return Math.min(1, 1 - Math.pow(1 - f, satCount));
}
export function footprintAreaFraction({ altKm = 550, minElevDeg = 25, regionAreaKm2 = US_AREA_KM2 } = {}) {
  return Math.min(1, singleFootprintKm2(altKm, minElevDeg) / regionAreaKm2);
}
export function overlapHeuristicExplain(state = {}) {
  const altKm = state.altKm ?? 550, minElevDeg = state.minElevDeg ?? 25, satCount = state.sats ?? 1;
  const f = footprintAreaFraction({ altKm, minElevDeg });
  return { formula: "1 − (1 − f)^N", f, fPct: f * 100, satCount, overlapFrac: overlapCoverageFraction(satCount, { altKm, minElevDeg }), note: "Independent disk overlap — ignores Walker planes and latitude gaps." };
}
export function continuousCoverageFraction(satCount, continuousCoverageSats = US_COVERAGE_SOURCES.min) {
  if (satCount <= 0 || continuousCoverageSats <= 0) return 0;
  return Math.min(1, satCount / continuousCoverageSats);
}
export function formatTimelineMonth(month) {
  if (month <= 0) return "now";
  if (month < 12) return `~${month.toFixed(1)} mo`;
  return month / 12 >= 2 ? `~${(month / 12).toFixed(1)} yr` : `~${month.toFixed(0)} mo`;
}
export function monthsToSatCount(targetSats, { startSats = 10, satsPerLaunch = 3, launchIntervalMonths = 1.5 } = {}) {
  if (targetSats <= startSats) return 0;
  let sats = startSats, month = 0;
  while (sats < targetSats) { month += launchIntervalMonths; sats += satsPerLaunch; }
  return month;
}
export function constellationTimeline({ startSats = 10, milestones = COVERAGE_MILESTONES.map((m) => m.sats), satsPerLaunch = 3, launchIntervalMonths = 1.5, continuousSats = US_COVERAGE_SOURCES.min } = {}) {
  const meta = new Map(COVERAGE_MILESTONES.map((m) => [m.sats, m]));
  const events = [];
  let sats = startSats, month = 0;
  const sorted = [...new Set(milestones)].sort((a, b) => a - b);
  let mi = 0;
  while (mi < sorted.length) {
    if (sats >= sorted[mi]) {
      const m = meta.get(sorted[mi]);
      events.push({ sats, month, milestone: sorted[mi], label: m?.label ? `${sorted[mi]} sats · ${m.label}` : `${sorted[mi]} sats`, milestoneTag: m?.tag ?? "model", source: m?.source ?? null, monthLabel: formatTimelineMonth(month), continuousFrac: continuousCoverageFraction(sorted[mi], continuousSats), overlapFrac: overlapCoverageFraction(sorted[mi]), tag: "model" });
      mi += 1; continue;
    }
    month += launchIntervalMonths; sats += satsPerLaunch;
  }
  return events;
}
export function computeCoverageOrbit(state) {
  const altKm = state.altKm ?? 550, minElevDeg = state.minElevDeg ?? 25, sats = state.sats ?? 10, continuousSats = state.continuousSats ?? US_COVERAGE_SOURCES.min;
  const footprintKm2 = singleFootprintKm2(altKm, minElevDeg), radiusKm = Math.sqrt(footprintKm2 / Math.PI);
  const cadence = { startSats: sats, satsPerLaunch: state.satsPerLaunch ?? 3, launchIntervalMonths: state.launchIntervalMonths ?? 1.5 };
  const monthsTo45 = monthsToSatCount(US_COVERAGE_SOURCES.min, cadence), monthsTo60 = monthsToSatCount(US_COVERAGE_SOURCES.max, cadence);
  return { altKm, minElevDeg, sats, continuousSats, footprintKm2, radiusKm, overlapFrac: overlapCoverageFraction(sats, { altKm, minElevDeg }), continuousFrac: continuousCoverageFraction(sats, continuousSats), heuristic: overlapHeuristicExplain({ altKm, minElevDeg, sats }), timeline: constellationTimeline({ ...cadence, milestones: [...new Set([sats, ...COVERAGE_MILESTONES.map((m) => m.sats)])].sort((a, b) => a - b), continuousSats }), sources: US_COVERAGE_SOURCES, monthsTo45, monthsTo60, monthsTo45Label: formatTimelineMonth(monthsTo45), monthsTo60Label: formatTimelineMonth(monthsTo60) };
}
