/**
 * Constellation scale model — satellites × capacity × utilization → revenue proxy.
 * Educational; not a company forecast.
 */

/** Verified / company-stated deployment milestones. */
export const SATELLITE_INVENTORY = [
  { id: "bw3", name: "BlueWalker 3", block: "Test", launched: "2022-09", status: "operational", tag: "verified" },
  { id: "bb1-5", name: "BlueBird 1–5", block: "Block 1", launched: "2024-09", count: 5, status: "operational", tag: "verified" },
  { id: "bb6", name: "BlueBird 6", block: "Block 2", launched: "2025-12", count: 1, status: "operational", tag: "verified" },
  { id: "bb7", name: "BlueBird 7", block: "Block 2", launched: "2026-04", count: 1, status: "lost — low orbit", tag: "verified" },
  { id: "bb8-10", name: "BlueBird 8–10", block: "Block 2", launched: "2026-06", count: 3, status: "operational", tag: "verified" }
];

/** Default operational count (excludes BB7). Source: company launch PRs Jun 2026. */
export const DEFAULT_OPERATIONAL_SATS = 10; // BW3 + 5 Block1 + BB6 + BB8-10

/** Company guidance anchors. */
export const CONSTELLATION_ANCHORS = {
  fccAuthorized: 248,
  /** Continuous US coverage — company range 45–60. */
  continuousCoverageMin: 45,
  continuousCoverageMax: 60,
  target2026: 45,
  block2ArraySqM: 223,
  block1ArraySqM: 64,
  block2PeakMbps: 200,
  block1PeakMbps: 98.9,
  dataAsOf: "2026-07-04"
};

/**
 * Estimate population coverage fraction from satellite count (heuristic).
 * Linear ramp to continuous coverage at `coverageSats`, capped at 1.
 */
export function coverageFraction(satCount, coverageSats = CONSTELLATION_ANCHORS.continuousCoverageMin) {
  if (satCount <= 0 || coverageSats <= 0) return 0;
  return Math.min(1, satCount / coverageSats);
}

/**
 * Concurrent subscriber capacity proxy (millions).
 * @param {number} sats — operational satellites
 * @param {number} subsPerSat — modeled concurrent users per sat (assumption)
 */

export function coverageMilestonePct(satCount) {
  const { continuousCoverageMin: min, continuousCoverageMax: max } = CONSTELLATION_ANCHORS;
  const pctToMin = Math.min(100, (satCount / min) * 100);
  const pctToMax = Math.min(100, (satCount / max) * 100);
  const status = satCount >= max ? "full" : satCount >= min ? "continuous" : "partial";
  return { pctToMin, pctToMax, status };
}

export function addressableWholesaleFrac(orbitalCoverage) {
  return Math.max(0.05, orbitalCoverage * 0.25 + 0.1);
}
export function subscriberCapacityM(sats, subsPerSat) {
  return (sats * subsPerSat) / 1e6;
}

/**
 * Addressable revenue proxy ($M/yr) from MNO wholesale model.
 * @param {object} p
 * @param {number} p.mnoSubsM — partner subscriber base (millions)
 * @param {number} p.penetration — fraction using space layer
 * @param {number} p.arpuMonthly — wholesale $/sub/month
 * @param {number} p.coverageFrac — fraction of addressable time in dead zones (0–1)
 */
export function wholesaleRevenueProxyM({ mnoSubsM, penetration, arpuMonthly, orbitalCoverage, coverageFrac, deadZoneFrac }) {
  const oc = orbitalCoverage ?? coverageFrac ?? 0;
  const addressableFrac = deadZoneFrac != null ? Math.max(0.05, oc * deadZoneFrac) : addressableWholesaleFrac(oc);
  const activeSubsM = mnoSubsM * penetration * addressableFrac;
  return { activeSubsM, addressableFrac, annualRevenueM: activeSubsM * arpuMonthly * 12 };
}

/**
 * Full constellation metrics from slider state.
 */
export function computeConstellationMetrics(state) {
  const sats = state.sats ?? DEFAULT_OPERATIONAL_SATS;
  const target = state.targetSats ?? CONSTELLATION_ANCHORS.target2026;
  const coverageSats = state.coverageSats ?? CONSTELLATION_ANCHORS.continuousCoverageMin;
  const subsPerSat = state.subsPerSat ?? 50000;
  const mnoSubsM = state.mnoSubsM ?? 3000;
  const penetration = state.penetration ?? 0.02;
  const arpuMonthly = state.arpuMonthly ?? 3;
  const coverageFrac = coverageFraction(sats, coverageSats);

  const capacityM = subscriberCapacityM(sats, subsPerSat);
  const milestones = coverageMilestonePct(sats);
  const rev = wholesaleRevenueProxyM({ mnoSubsM, penetration, arpuMonthly, orbitalCoverage: coverageFrac });
  const pctToTarget = Math.min(100, (sats / target) * 100);

  return {
    sats,
    target,
    coverageSats,
    coverageFrac,
    capacityM,
    revProxyM: rev.annualRevenueM, activeSubsM: rev.activeSubsM, addressableFrac: rev.addressableFrac,
    pctToContinuous: milestones.pctToMin, pctToFullCoverage: milestones.pctToMax, coverageStatus: milestones.status,
    pctToTarget,
    subsPerSat,
    mnoSubsM,
    penetration,
    arpuMonthly
  };
}

/**
 * Launch cadence timeline — months to reach target sats.
 * @param {number} currentSats
 * @param {number} targetSats
 * @param {number} launchesPerMonth — avg sats launched per month (stacked launches)
 */
export function monthsToTarget(currentSats, targetSats, satsPerLaunch = 3, launchIntervalMonths = 1.5) {
  if (currentSats >= targetSats) return 0;
  const remaining = targetSats - currentSats;
  const launchesNeeded = Math.ceil(remaining / satsPerLaunch);
  return launchesNeeded * launchIntervalMonths;
}

/** Quarterly launch schedule heuristic for calendar display. */
export function launchSchedule({ startSats = DEFAULT_OPERATIONAL_SATS, targetSats = 45, satsPerLaunch = 3, intervalMonths = 1.5, year = 2026 }) {
  const events = [];
  let sats = startSats;
  let month = 7; // Jul 2026 post BB8-10
  while (sats < targetSats && month <= 12) {
    const add = Math.min(satsPerLaunch, targetSats - sats);
    events.push({
      label: `Launch (+${add} sats)`,
      month,
      year,
      satsAfter: sats + add,
      tag: "model"
    });
    sats += add;
    month += intervalMonths;
  }
  return events;
}
