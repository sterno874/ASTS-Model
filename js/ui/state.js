import { computeFullValuation } from "../math/valuation.js";
import { computeConstellationMetrics } from "../math/constellation.js";
import { computeVsMarketUpside } from "./market-quote.js";

export const VALID_TABS = ["constellation", "commercial", "value", "explain", "technology"];
export const EXPLAIN_LEVELS = ["eli5", "ms", "hs", "col", "pro", "phd"];

export function b64urlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin =
    typeof atob !== "undefined"
      ? atob(str)
      : Buffer.from(str, "base64").toString("binary");
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export const DEFAULT_STATE = {
  v: 1,
  tab: "constellation",
  activeConstPreset: "base",
  activeValPreset: "base",
  embed: false,
  constellation: {
    sats: 10,
    targetSats: 45,
    coverageSats: 45,
    subsPerSat: 50000,
    mnoSubsM: 3000,
    penetration: 0.02,
    arpuMonthly: 3,
    launchInterval: 1.5,
    satsPerLaunch: 3
  },
  commercial: {
    calendarYear: 2026
  },
  val: {
    v_mnoSubsM: 3000,
    v_penetration: 0.015,
    v_arpuMonthly: 3,
    v_coverageFrac: 0.35,
    v_pCommercial: 0.45,
    v_govPeakM: 150,
    v_govPs: 0.6,
    v_gatewayPeakM: 80,
    v_platform: 500,
    v_mult: 5,
    v_shares: 256,
    v_cash: 3460,
    v_debt: 698,
    v_burnQuarterly: 120,
    v_refPrice: 45,
    v_riskadj: true
  },
  link: {
    altKm: 550,
    elevDeg: 30,
    freqMhz: 800,
    arraySqM: 223,
    blockId: "block2",
    eirpDbw: 35,
    txGainDbi: 28,
    minElevDeg: 25
  },
  monteCarlo: {
    failureRate: 0.05,
    trials: 2000,
    targetSats: 45,
    satsPerLaunch: 3,
    launchIntervalMonths: 1.5
  },
  coverageOrbit: {
    sats: 10,
    continuousSats: 45,
    altKm: 550,
    minElevDeg: 25,
    satsPerLaunch: 3,
    launchIntervalMonths: 1.5
  },
  ui: { explainLvl: "eli5", showHeaderStrip: true }
};

export const CONST_PRESETS = {
  base: { sats: 10, targetSats: 45, penetration: 0.02, arpuMonthly: 3, label: "Base — 10 sats today" },
  ramp: { sats: 25, targetSats: 45, penetration: 0.025, arpuMonthly: 3.5, label: "Ramp — mid-2026 target" },
  coverage: { sats: 45, targetSats: 60, penetration: 0.03, arpuMonthly: 4, label: "Coverage — 45 sats" },
  bull: { sats: 45, penetration: 0.05, arpuMonthly: 5, mnoSubsM: 3000, label: "Bull — high pen / ARPU" },
  bear: { sats: 10, penetration: 0.008, arpuMonthly: 2, label: "Bear — slow ramp" },
  bag: { sats: 10, targetSats: 45, penetration: 0.02, arpuMonthly: 3, subsPerSat: 50000, label: "Best-available guess — Jul 2026 anchors" }
};

export const VAL_PRESETS = {
  base: { v_penetration: 0.015, v_pCommercial: 0.45, v_mult: 5, v_platform: 500, label: "Base" },
  bull: {
    v_penetration: 0.05,
    v_pCommercial: 0.75,
    v_mult: 10,
    v_platform: 5000,
    v_arpuMonthly: 5,
    v_coverageFrac: 0.6,
    label: "Commercial bull — 45+ sats scale"
  },
  bear: { v_penetration: 0.008, v_pCommercial: 0.25, v_mult: 3, v_platform: 200, label: "Bear" }
};

const CONST_KEYS = Object.keys(DEFAULT_STATE.constellation);
const VAL_KEYS = Object.keys(DEFAULT_STATE.val);

export function buildShareHash(state) {
  const c = CONST_KEYS.map((k) => state.constellation[k]).join(",");
  const vv = VAL_KEYS.map((k) => state.val[k]).join(",");
  const payload = JSON.stringify({
    v: state.v,
    t: state.tab,
    c,
    vv,
    rp: state.activeConstPreset,
    vp: state.activeValPreset,
    l: state.ui.explainLvl
  });
  return "#s=" + b64urlEncode(payload);
}

export function decodeShareHash(hash) {
  if (!hash || !hash.startsWith("#s=")) return null;
  try {
    const raw = JSON.parse(b64urlDecode(hash.slice(3)));
    const cParts = raw.c.split(",").map(Number);
    const vParts = (raw.vv || raw.v).split(",").map(Number);
    const next = structuredClone(DEFAULT_STATE);
    CONST_KEYS.forEach((k, i) => {
      next.constellation[k] = cParts[i];
    });
    VAL_KEYS.forEach((k, i) => {
      next.val[k] = vParts[i];
    });
    if (VALID_TABS.includes(raw.t)) next.tab = raw.t;
    if (raw.rp) next.activeConstPreset = raw.rp;
    if (raw.vp) next.activeValPreset = raw.vp;
    if (EXPLAIN_LEVELS.includes(raw.l)) next.ui.explainLvl = raw.l;
    return next;
  } catch {
    return null;
  }
}

export function parseEmbedMode() {
  const p = new URLSearchParams(location.search);
  return p.get("embed") === "1";
}

export function computeValuationMetrics(val) {
  return computeFullValuation(val);
}

export function computeHeaderStrip(state, valMetrics, constMetrics, liveQuote = null) {
  const preset = state.activeConstPreset || "base";
  const ev = valMetrics?.ev ?? 0;
  const perSh = valMetrics?.perSh ?? 0;
  const sats = constMetrics?.sats ?? 0;
  const cov = constMetrics?.pctToContinuous ?? 0;
  const shares = state.val?.v_shares ?? 256;
  const equity = valMetrics?.equityM ?? 0;
  const refPrice =
    liveQuote?.ok && liveQuote.price != null ? liveQuote.price : state.val?.v_refPrice ?? 45;
  const refSource = liveQuote?.ok && liveQuote.price != null ? "live" : "illustrative";
  const mktCapM =
    liveQuote?.ok && liveQuote.marketCapM != null && liveQuote.marketCapM > 0
      ? liveQuote.marketCapM
      : shares * refPrice;
  const vsMkt = computeVsMarketUpside(equity, mktCapM);
  return {
    preset,
    ev,
    perSh,
    sats,
    cov,
    refSource,
    vsRefLabel: refSource === "live" ? "vs mkt" : "vs-ref",
    equity,
    mktCapM,
    marketCapEstimated: !!(liveQuote?.ok && liveQuote.marketCapEstimated),
    upsideLabel: vsMkt.upsideLabel,
    upsidePct: vsMkt.upsidePct,
    upsideMult: vsMkt.upsideMult,
    vsMktDirection: vsMkt.direction
  };
}

export function paramsFromPreset(preset, map) {
  return map[preset] ? { ...map[preset] } : null;
}

export function inferActivePresets(state, presets, keys, tol = 0.001) {
  for (const [name, p] of Object.entries(presets)) {
    if (name === "label") continue;
    let match = true;
    for (const k of keys) {
      if (p[k] == null) continue;
      if (Math.abs((state[k] ?? 0) - p[k]) > tol) {
        match = false;
        break;
      }
    }
    if (match) return name;
  }
  return null;
}
