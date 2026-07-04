/**
 * Dilution / convertible path — FD share scenarios from 10-K note anchors.
 * Educational; not tax or securities advice.
 */

/** Verified / filing anchors — FY2025 10-K + Jul 2025 note PRs. */
export const CONVERTIBLE_NOTES = [
  {
    id: "2032_425",
    label: "4.25% Convertible Senior Notes due 2032",
    principalM: 460,
    conversionPrice: 120.12,
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20250729408729/en/"
  },
  {
    id: "2032_2375",
    label: "2.375% Convertible Senior Notes due 2032",
    principalM: 575,
    conversionPrice: 120.12,
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20250729408729/en/"
  },
  {
    id: "2036_200",
    label: "2.00% Convertible Senior Notes due 2036",
    principalM: 1000,
    conversionPrice: 85.0,
    tag: "verified",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    id: "warrants",
    label: "Private placement + penny warrants (outstanding)",
    principalM: 0,
    sharesM: 18,
    tag: "partial",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  }
];

export const SHARE_ANCHORS = {
  basicMar2026_M: 298.45,
  dilutedFY2025_M: 256,
  classA_M: 298.45,
  classB_M: 11.2,
  classC_M: 78.2,
  atmShelfActive: true,
  tag: "verified"
};

/**
 * Shares from convertible conversion at given stock price ($).
 * @param {number} principalM — note face ($M)
 * @param {number} conversionPrice — $/share conversion
 */
export function sharesFromConversionM(principalM, conversionPrice) {
  if (conversionPrice <= 0 || principalM <= 0) return 0;
  return (principalM * 1e6) / conversionPrice / 1e6;
}

/**
 * Fully diluted share count under conversion scenario.
 * @param {object} p
 * @param {number} p.baseSharesM — reported diluted shares (M)
 * @param {number} p.stockPrice — assumed conversion/ref price ($)
 * @param {number} [p.extraEquityM] — ATM / RSU / option dilution ($M notional)
 * @param {boolean} [p.convertAll] — assume all notes convert in-the-money
 */
export function computeFullyDilutedSharesM({
  baseSharesM = 256,
  stockPrice = 45,
  extraEquityM = 0,
  convertAll = true,
  notes = CONVERTIBLE_NOTES
}) {
  let addSharesM = 0;
  const rows = [];
  for (const n of notes) {
    if (n.sharesM) {
      addSharesM += n.sharesM;
      rows.push({ ...n, addedSharesM: n.sharesM, converts: true });
      continue;
    }
    const inMoney = stockPrice >= (n.conversionPrice ?? Infinity);
    const added = convertAll && inMoney ? sharesFromConversionM(n.principalM, n.conversionPrice) : 0;
    addSharesM += added;
    rows.push({ ...n, addedSharesM: added, converts: inMoney && convertAll });
  }
  const extraSharesM = stockPrice > 0 ? extraEquityM / stockPrice : 0;
  const fdSharesM = baseSharesM + addSharesM + extraSharesM;
  return {
    baseSharesM,
    fdSharesM,
    dilutionPct: baseSharesM > 0 ? ((fdSharesM - baseSharesM) / baseSharesM) * 100 : 0,
    addFromNotesM: addSharesM,
    addFromExtraM: extraSharesM,
    rows,
    stockPrice
  };
}

/** Preset FD stress scenarios (M shares). */
export const DILUTION_STRESS_PRESETS = {
  filing: { sharesM: 256, label: "FY2025 diluted ◆" },
  atm: { sharesM: 280, label: "ATM ramp ~280M" },
  convert: { sharesM: 320, label: "Partial convert ~320M" },
  full: { sharesM: 360, label: "Full convert + warrants ~360M" }
};

/**
 * EV per share under FD scenario.
 */
export function evPerShareFd(evM, cashM, debtM, fd) {
  if (!fd?.fdSharesM || fd.fdSharesM <= 0) return NaN;
  return (evM + cashM - debtM) / fd.fdSharesM;
}
