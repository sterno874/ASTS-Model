/**
 * Simplified link-budget / coverage-radius educational model.
 * Friis + path loss to LEO — pedagogy only, not AST proprietary RF model.
 */

const C = 299792458; // m/s
const EARTH_RADIUS_KM = 6371;

/** Free-space path loss (dB). */
export function fsplDb(freqHz, distM) {
  if (distM <= 0 || freqHz <= 0) return 0;
  const lambda = C / freqHz;
  return 20 * Math.log10((4 * Math.PI * distM) / lambda);
}

/** Slant range (km) from satellite altitude and elevation angle (deg). */
export function slantRangeKm(altKm, elevDeg) {
  const elev = (elevDeg * Math.PI) / 180;
  const Re = EARTH_RADIUS_KM;
  const h = altKm;
  const cosE = Math.cos(elev);
  const under = Re * Re * cosE * cosE + 2 * Re * h + h * h;
  return Math.sqrt(under) - Re * cosE;
}

/**
 * Minimum elevation for service (deg) vs coverage footprint.
 * Returns approximate ground radius (km) visible above minElev from LEO.
 */
export function coverageRadiusKm(altKm = 550, minElevDeg = 25) {
  const Re = EARTH_RADIUS_KM;
  const h = altKm;
  const psi = Math.acos((Re / (Re + h)) * Math.cos((minElevDeg * Math.PI) / 180)) - (minElevDeg * Math.PI) / 180;
  return Re * psi;
}

/**
 * Educational link budget — received power margin (dB).
 * @param {object} p
 */
export function linkMarginDb({
  eirpDbw = 40,
  txAntennaGainDbi = 30,
  rxAntennaGainDbi = 0,
  freqMhz = 800,
  altKm = 550,
  elevDeg = 30,
  rxSensitivityDbm = -110,
  implLossDb = 3,
  atmosphericDb = 0.5
}) {
  const freqHz = freqMhz * 1e6;
  const rangeM = slantRangeKm(altKm, elevDeg) * 1000;
  const pl = fsplDb(freqHz, rangeM);
  const rxDbm = eirpDbw + txAntennaGainDbi + rxAntennaGainDbi - pl - implLossDb - atmosphericDb;
  return { rxDbm, marginDb: rxDbm - rxSensitivityDbm, pathLossDb: pl, rangeKm: rangeM / 1000 };
}

/**
 * Array gain boost from larger aperture (rough √A scaling for pedagogy).
 * Block 2 ~223 m² vs Block 1 ~64 m² → ~1.87× linear → ~2.7 dB.
 */
export function arrayGainBoostDb(block2SqM, block1SqM) {
  if (block1SqM <= 0) return 0;
  return 10 * Math.log10(block2SqM / block1SqM);
}

/** Full educational sim output for UI. */
export function computeLinkBudget(state) {
  const altKm = state.altKm ?? 550;
  const elevDeg = state.elevDeg ?? 30;
  const freqMhz = state.freqMhz ?? 800;
  const arraySqM = state.arraySqM ?? 223;
  const block1SqM = 64;
  const arrayBoost = arrayGainBoostDb(arraySqM, block1SqM);
  const eirpDbw = (state.eirpDbw ?? 35) + arrayBoost;

  const lb = linkMarginDb({
    eirpDbw,
    txAntennaGainDbi: state.txGainDbi ?? 28,
    rxAntennaGainDbi: state.rxGainDbi ?? 0,
    freqMhz,
    altKm,
    elevDeg
  });
  const radiusKm = coverageRadiusKm(altKm, state.minElevDeg ?? 25);
  const footprintKm2 = Math.PI * radiusKm * radiusKm;

  return {
    ...lb,
    radiusKm,
    footprintKm2,
    arrayBoost,
    eirpDbw,
    altKm,
    elevDeg,
    freqMhz,
    arraySqM,
    linkOk: lb.marginDb >= 0
  };
}
