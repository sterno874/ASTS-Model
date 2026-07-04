/**
 * Simplified link-budget / coverage-radius educational model.
 * Friis + path loss to LEO — pedagogy only, not AST proprietary RF model.
 */

const C = 299792458;
const EARTH_RADIUS_KM = 6371;

export const BLOCK_PRESETS = {
  block1: { id: "block1", label: "Block 1", arraySqM: 64, peakMbps: 98.9 },
  block2: { id: "block2", label: "Block 2", arraySqM: 223, peakMbps: 200 }
};

export const FCC_LIMITS = {
  handsetTxDbm: 23,
  eirpCfr: "47 CFR § 25.114",
  eirpCfrUrl: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-25/subpart-C/section-25.114",
  astOrder: "FCC DA 26-391",
  astOrderUrl: "https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system"
};

export function fsplDb(freqHz, distM) {
  if (distM <= 0 || freqHz <= 0) return 0;
  return 20 * Math.log10((4 * Math.PI * distM) / (C / freqHz));
}

export function wavelengthM(freqHz) {
  return freqHz <= 0 ? 0 : C / freqHz;
}

export function slantRangeKm(altKm, elevDeg) {
  const Re = EARTH_RADIUS_KM;
  const h = altKm;
  const el = (Math.min(89.9, Math.max(0.1, elevDeg)) * Math.PI) / 180;
  const psi = Math.acos((Re / (Re + h)) * Math.cos(el)) - el;
  return Math.sqrt(Re * Re + (Re + h) ** 2 - 2 * Re * (Re + h) * Math.cos(psi));
}

export function coverageRadiusKm(altKm = 550, minElevDeg = 25) {
  const Re = EARTH_RADIUS_KM, h = altKm;
  const psi = Math.acos((Re / (Re + h)) * Math.cos((minElevDeg * Math.PI) / 180)) - (minElevDeg * Math.PI) / 180;
  return Re * psi;
}

export function linkMarginDb(p = {}) {
  const {
    eirpDbw = 40, txAntennaGainDbi = 30, rxAntennaGainDbi = 0, freqMhz = 800,
    altKm = 550, elevDeg = 30, rxSensitivityDbm = -110, implLossDb = 3, atmosphericDb = 0.5
  } = p;
  const freqHz = freqMhz * 1e6;
  const rangeKm = slantRangeKm(altKm, elevDeg);
  const rangeM = rangeKm * 1000;
  const lambdaM = wavelengthM(freqHz);
  const pathLossDb = fsplDb(freqHz, rangeM);
  const rxDbm = eirpDbw + txAntennaGainDbi + rxAntennaGainDbi - pathLossDb - implLossDb - atmosphericDb;
  return {
    rxDbm, marginDb: rxDbm - rxSensitivityDbm, pathLossDb, rangeKm, rangeM, lambdaM, freqHz,
    rxSensitivityDbm, implLossDb, atmosphericDb, txAntennaGainDbi, rxAntennaGainDbi, eirpDbw
  };
}

export function arrayGainBoostDb(block2SqM, block1SqM) {
  return block1SqM <= 0 ? 0 : 10 * Math.log10(block2SqM / block1SqM);
}

export function resolveBlock(state) {
  const preset = BLOCK_PRESETS[state.blockId];
  if (preset) return { ...preset, arraySqM: preset.arraySqM };
  const arraySqM = state.arraySqM ?? BLOCK_PRESETS.block2.arraySqM;
  const isBlock1 = Math.abs(arraySqM - BLOCK_PRESETS.block1.arraySqM) < 8;
  return {
    id: isBlock1 ? "block1" : "block2",
    label: isBlock1 ? "Block 1" : "Block 2 (custom)",
    arraySqM,
    peakMbps: isBlock1 ? BLOCK_PRESETS.block1.peakMbps : BLOCK_PRESETS.block2.peakMbps
  };
}

export function marginGaugePercent(marginDb, minDb = -15, maxDb = 15) {
  if (!Number.isFinite(marginDb)) return 50;
  return Math.min(100, Math.max(0, ((marginDb - minDb) / (maxDb - minDb)) * 100));
}

export function marginGaugeClass(marginDb) {
  if (marginDb >= 0) return "ok";
  if (marginDb > -5) return "warn";
  return "bad";
}

export function friisBreakdown(lb) {
  return {
    equation: "PL(dB) = 20 log₁₀(4πd/λ)",
    budget: "P_rx = EIRP + G_tx + G_rx − PL − L_impl − L_atm",
    terms: [
      { label: "Slant range d", value: `${lb.rangeKm.toFixed(0)} km`, note: `from ${lb.elevDeg}° elevation @ ${lb.altKm} km alt` },
      { label: "Wavelength λ", value: `${(lb.lambdaM * 100).toFixed(1)} cm`, note: `@ ${lb.freqMhz} MHz` },
      { label: "Path loss PL", value: `${lb.pathLossDb.toFixed(1)} dB`, note: "Friis free-space" },
      { label: "EIRP (model)", value: `${lb.eirpDbw.toFixed(1)} dBW`, note: "base + array boost" },
      { label: "G_tx (beam)", value: `${lb.txAntennaGainDbi} dBi`, note: "directional gain" },
      { label: "G_rx (phone)", value: `${lb.rxAntennaGainDbi} dBi`, note: "~0 dBi handset" },
      { label: "P_rx", value: `${lb.rxDbm.toFixed(1)} dBm`, note: "at sensitivity ref" },
      { label: "Margin", value: `${lb.marginDb.toFixed(1)} dB`, note: `vs ${lb.rxSensitivityDbm} dBm sensitivity` }
    ]
  };
}

export function computeLinkBudget(state) {
  const altKm = state.altKm ?? 550;
  const elevDeg = state.elevDeg ?? 30;
  const freqMhz = state.freqMhz ?? 800;
  const block = resolveBlock(state);
  const arrayBoost = arrayGainBoostDb(block.arraySqM, BLOCK_PRESETS.block1.arraySqM);
  const baseEirpDbw = state.eirpDbw ?? 35;
  const eirpDbw = baseEirpDbw + arrayBoost;
  const lb = linkMarginDb({
    eirpDbw, txAntennaGainDbi: state.txGainDbi ?? 28, rxAntennaGainDbi: state.rxGainDbi ?? 0,
    freqMhz, altKm, elevDeg
  });
  const radiusKm = coverageRadiusKm(altKm, state.minElevDeg ?? 25);
  return {
    ...lb, radiusKm, footprintKm2: Math.PI * radiusKm * radiusKm, arrayBoost, baseEirpDbw, eirpDbw,
    altKm, elevDeg, freqMhz, arraySqM: block.arraySqM, blockId: block.id, blockLabel: block.label,
    peakMbps: block.peakMbps, linkOk: lb.marginDb >= 0,
    gaugePct: marginGaugePercent(lb.marginDb), gaugeClass: marginGaugeClass(lb.marginDb),
    fcc: { handsetWithinLimit: true, modelEirpDbw: eirpDbw, ...FCC_LIMITS },
    friis: friisBreakdown({ ...lb, eirpDbw, altKm, elevDeg, freqMhz })
  };
}
