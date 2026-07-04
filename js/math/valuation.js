/**
 * ASTS valuation — EV, cash, debt, dilution, comparables.
 */

import { evPerShare } from "./device.js";

export { evPerShare };

export const SEC_FILING_URLS = {
  edgar: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312",
  fy2025_10k: "https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf",
  q1_2026_10q: "https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/R21.htm"
};

export const P_COMMERCIAL_FRAMING = {
  label: "P(commercial scale)",
  definition:
    "Subjective probability AST reaches segment peak wholesale revenue (constellation deployed, MNO attach, regulatory clearance). Not P(stock up) or P(launch success alone).",
  intlHaircut: 0.85,
  govSeparate: true
};

export function computeRunwayMonths(cashM, burnQuarterlyM) {
  if (burnQuarterlyM <= 0) return Infinity;
  return (cashM / burnQuarterlyM) * 3;
}

export const COMPARABLES = [
  {
    name: "Iridium (IRDM)",
    evMultiple: "~4–6× revenue at maturity",
    note: "LEO narrowband + IoT; established subscriber base",
    tag: "assumption",
    source: "https://finance.yahoo.com/quote/IRDM/key-statistics/"
  },
  {
    name: "Globalstar (GSAT)",
    evMultiple: "~8–15× revenue (volatile)",
    note: "LEO MSS; Apple emergency partnership",
    tag: "assumption",
    source: "https://finance.yahoo.com/quote/GSAT/key-statistics/"
  },
  {
    name: "ViaSat (VSAT)",
    evMultiple: "~1–3× revenue",
    note: "GEO broadband; capital-intensive",
    tag: "assumption",
    source: "https://finance.yahoo.com/quote/VSAT/key-statistics/"
  },
  {
    name: "AST MNO wholesale model",
    evMultiple: "Rev-share / capacity fees",
    note: "AST sells to carriers, not direct consumer ARPU — verified IR",
    tag: "verified",
    source: "https://ast-science.com/"
  }
];

export const FILING_ANCHORS = {
  cashQ1_2026_M: 3460,
  debtLongTerm_M: 698,
  sharesBasic_M: 220,
  sharesDiluted_M: 256,
  q1Revenue_M: 14.7,
  q1NetLoss_M: 191,
  q1OpCashUsed_M: 48,
  q1InvestCashUsed_M: 379,
  structuralBurnFloor_M: 298
};

export function peakWholesaleRevenueM({ mnoSubsM, penetration, arpuMonthly, coverageFrac }) {
  const active = mnoSubsM * penetration * Math.max(0.05, coverageFrac);
  return active * arpuMonthly * 12;
}

export function segmentEvContrib(peakM, pSuccess, mult, weight) {
  return peakM * pSuccess * mult * weight;
}

export function computeEquityM(evM, cashM, debtM) {
  return evM + cashM - debtM;
}

export function verifyEvReconciliation(rows, platformM, evM, tol = 0.02) {
  const rowSum = rows.reduce((s, r) => s + r.evContrib, 0) + platformM;
  return Math.abs(rowSum - evM) <= tol;
}

export function computeFullValuation(val) {
  const risk = !!val.v_riskadj;
  const mult = val.v_mult ?? 5;
  const mnoSubsM = val.v_mnoSubsM ?? 3000;
  const penetration = val.v_penetration ?? 0.015;
  const arpuMonthly = val.v_arpuMonthly ?? 3;
  const coverageFrac = val.v_coverageFrac ?? 0.35;
  const pCommercial = risk ? (val.v_pCommercial ?? 0.45) : 1;

  const segments = [
    {
      id: "us_mno",
      label: "US MNO wholesale (AT&T / Verizon / FirstNet)",
      peak: peakWholesaleRevenueM({ mnoSubsM: 400, penetration: penetration * 1.2, arpuMonthly, coverageFrac }),
      pSuccess: pCommercial,
      weight: 0.45
    },
    {
      id: "intl_mno",
      label: "International MNO (Vodafone, Rakuten, stc, etc.)",
      peak: peakWholesaleRevenueM({
        mnoSubsM: mnoSubsM - 400,
        penetration,
        arpuMonthly,
        coverageFrac: coverageFrac * 0.8
      }),
      pSuccess: pCommercial * P_COMMERCIAL_FRAMING.intlHaircut,
      weight: 0.35
    },
    {
      id: "gov",
      label: "US Government / defense capacity",
      peak: val.v_govPeakM ?? 150,
      pSuccess: risk ? (val.v_govPs ?? 0.6) : 1,
      weight: 0.12
    },
    {
      id: "gateway",
      label: "Gateway hardware & engineering services",
      peak: val.v_gatewayPeakM ?? 80,
      pSuccess: 1,
      weight: 0.08
    }
  ];

  const rows = segments.map((s) => {
    const riskAdjPeak = s.peak * s.pSuccess;
    const evContrib = segmentEvContrib(s.peak, s.pSuccess, mult, s.weight);
    return { ...s, riskAdjPeak, evContrib };
  });

  const platform = val.v_platform ?? 500;
  const ev = rows.reduce((sum, r) => sum + r.evContrib, 0) + platform;
  const cash = val.v_cash ?? FILING_ANCHORS.cashQ1_2026_M;
  const debt = val.v_debt ?? FILING_ANCHORS.debtLongTerm_M;
  const shares = val.v_shares ?? FILING_ANCHORS.sharesDiluted_M;
  const perSh = evPerShare(ev, shares, cash, debt);
  const equityM = computeEquityM(ev, cash, debt);
  const totalPeak = rows.reduce((s, r) => s + r.riskAdjPeak, 0);
  const burnQ = val.v_burnQuarterly ?? 120;
  const runwayMo = computeRunwayMonths(cash, burnQ);

  return {
    ev,
    perSh,
    equityM,
    rows,
    platform,
    totalPeak,
    mult,
    cash,
    debt,
    shares,
    runwayMo,
    burnQ,
    pCommercial: risk ? pCommercial : 1,
    riskAdjusted: risk
  };
}
