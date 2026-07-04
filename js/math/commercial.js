/**
 * Commercial partnerships, catalysts, community DD — primary-sourced facts.
 */

export const MNO_PARTNERS = [
  { name: "AT&T", region: "US", role: "Spectrum + commercial D2D", investor: true, tag: "verified", source: "https://ast-science.com/" },
  { name: "Verizon", region: "US", role: "Spectrum + commercial D2D", investor: true, tag: "verified", source: "https://ast-science.com/" },
  { name: "Vodafone", region: "Europe / global", role: "MNO partner + investor", investor: true, tag: "verified", source: "https://ast-science.com/" },
  { name: "Rakuten", region: "Japan", role: "MNO partner", investor: false, tag: "verified", source: "https://ast-science.com/" },
  { name: "Bell / Telus", region: "Canada", role: "MNO partner", investor: false, tag: "verified", source: "https://ast-science.com/" },
  { name: "stc Group", region: "MENA", role: "MNO partner", investor: false, tag: "verified", source: "https://ast-science.com/" },
  { name: "Google", region: "Global", role: "Strategic partner", investor: false, tag: "verified", source: "https://ast-science.com/" },
  { name: "American Tower", region: "Global", role: "Ground infrastructure", investor: false, tag: "verified", source: "https://ast-science.com/" }
];

export const CATALYSTS = [
  {
    id: "bb11-13",
    label: "BlueBirds 11–13 launch",
    windowStart: "2026-07",
    windowEnd: "2026-09",
    tag: "forward-looking",
    source: "https://www.businesswire.com/news/home/20260617420856/en/AST-SpaceMobile-Announces-Successful-Orbital-Launch-of-BlueBirds-8-9-and-10"
  },
  {
    id: "45-sats",
    label: "~45 sats in orbit (2026 target)",
    windowStart: "2026-10",
    windowEnd: "2026-12",
    tag: "forward-looking",
    source: "https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/"
  },
  {
    id: "commercial-us",
    label: "Initial US commercial service",
    windowStart: "2027-01",
    windowEnd: "2027-06",
    tag: "forward-looking",
    source: "https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/"
  },
  {
    id: "continuous",
    label: "Continuous coverage (45–60 sats)",
    windowStart: "2027-06",
    windowEnd: "2028-12",
    tag: "partial",
    source: "https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/"
  },
  {
    id: "248-fcc",
    label: "Full 248-sat FCC constellation",
    windowStart: "2028-01",
    windowEnd: "2030-12",
    tag: "partial",
    source: "https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system"
  }
];

export const LAUNCH_EVENTS = [
  { sat: "BlueWalker 3", date: "2022-09-10", provider: "SpaceX Falcon 9", block: "Test", tag: "verified" },
  { sat: "BlueBird 1–5", date: "2024-09-12", provider: "SpaceX Falcon 9", block: "Block 1", tag: "verified" },
  { sat: "BlueBird 6", date: "2025-12-06", provider: "ISRO LVM3", block: "Block 2", tag: "verified" },
  { sat: "BlueBird 7", date: "2026-04-28", provider: "Blue Origin NG-3", block: "Block 2", status: "lost", tag: "verified" },
  { sat: "BlueBird 8–10", date: "2026-06-17", provider: "SpaceX Falcon 9", block: "Block 2", tag: "verified" }
];

/** Community DD — cross-checked vs primary sources. */
export const COMMUNITY_DD = [
  {
    theme: "$3/mo × 3B subs = $5.4B revenue",
    verdict: "rejected",
    tag: "community",
    note: "Assumes 100% take-rate on all MNO subs at full ARPU to AST; wholesale rev-share is fraction of carrier billing — not gross consumer ARPU."
  },
  {
    theme: "AST is 'fully funded' to 248 sats",
    verdict: "partial",
    tag: "community",
    note: "~$3.46B cash Q1 2026 helps, but CapEx ~$379M/qtr Q1; convertibles + equity pipeline remain dilutive — verified 10-K/10-Q."
  },
  {
    theme: "Block 2 = 200 Mbps everywhere instantly",
    verdict: "partial",
    tag: "community",
    note: "Peak lab/demo speeds ≠ sustained sector capacity at scale; shared beam + loading limits apply — company cites peak, not SLA."
  },
  {
    theme: "FCC 248-sat approval = revenue now",
    verdict: "rejected",
    tag: "community",
    note: "FCC DA 26-391 authorizes deployment + SCS; commercial monetization requires sats in orbit + MNO integration — verified FCC order Apr 2026."
  },
  {
    theme: "~60 MNO MOUs = locked revenue",
    verdict: "partial",
    tag: "verified",
    note: "Agreements exist (~3B subs addressable per IR) but commercial terms / rev-share not fully disclosed in filings."
  },
  {
    theme: "Starlink D2C makes AST obsolete",
    verdict: "partial",
    tag: "community",
    note: "SpaceX pursuing D2D via T-Mobile spectrum; different architecture (smaller sats vs AST large arrays) — competition real, obsolescence unproven."
  },
  {
    theme: "BlueBird 7 loss breaks the thesis",
    verdict: "rejected",
    tag: "verified",
    note: "Launch-provider insertion error; insured; BB8-10 recovered cadence Jun 2026 — SEC 8-K."
  },
  {
    theme: "Insider selling = fraud signal",
    verdict: "partial",
    tag: "community",
    note: "Form 4 sales Q3 2025–Q1 2026 are disclosed; can be tax/liquidity — not proof of failure; verify against 10b5-1 plans."
  },
  {
    theme: "45 sats needed for US continuous coverage",
    verdict: "verified",
    tag: "verified",
    note: "Company stated 45–60 for continuous coverage in key markets — SpaceNews Apr 2026, FCC filing context."
  },
  {
    theme: "BW3 proved commercial readiness",
    verdict: "partial",
    tag: "verified",
    note: "BW3 demo'd 4G/5G calls + ~14 Mbps; Block 2 is production scale — test sat ≠ commercial constellation."
  }
];

export const BEAR_CASE = [
  { theme: "Capital intensity / dilution", verdict: "verified", tag: "verified", note: "Shares 81.8M→256M diluted FY2023–25; $2.2B+ convertibles; ATM/shelf active — 10-K." },
  { theme: "Launch & deployment risk", verdict: "verified", tag: "verified", note: "BB7 low-orbit loss Apr 2026; array deployment + commissioning failures remain possible." },
  { theme: "Competition (SpaceX, Lynk/Omnispace)", verdict: "verified", tag: "verified", note: "Starlink D2C + spectrum holders building overlapping capability." },
  { theme: "Regulatory conditions (FCC, ITU, astronomy)", verdict: "partial", tag: "verified", note: "FCC order includes interference, debris, NSF/NRAO coordination — conditions not trivial." },
  { theme: "Wholesale economics unproven", verdict: "verified", tag: "verified", note: "Pre-scale revenue mostly gateway/gov milestones; consumer pricing set by MNOs." },
  { theme: "Single-vendor manufacturing scale-up", verdict: "partial", tag: "verified", note: "500k sq ft Midland facility; BB1-37 in production claim — execution still unproven at 248 scale." }
];

export const COMMUNITY_THREADS = [
  { label: "Daily Discussion Thread", author: "r/ASTSpaceMobile mods", url: "https://www.reddit.com/r/ASTSpaceMobile/", note: "Primary hub — launch tracking, FCC, dilution debate" },
  { label: "ASTS IS DEFINITELY NOT A MEME STOCK", author: "u/Various", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=meme+stock&restrict_sr=1", note: "Recurring bull thesis — verify revenue math" },
  { label: "Kook Report / SpaceMob DD", author: "u/TheKook (anon)", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=kook&restrict_sr=1", note: "Community DD series — influential, not primary source" },
  { label: "BlueBird 8-10 Launch Meetup", author: "r/ASTSpaceMobile", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=BlueBird+8&restrict_sr=1", note: "Launch catalyst threads Jun 2026" },
  { label: "Dilution / convertibles debate", author: "r/stocks, r/wallstreetbets", url: "https://www.reddit.com/r/stocks/search/?q=ASTS+dilution", note: "Cross-sub skeptic threads — check 10-Q notes" },
  { label: "FCC DA 26-391 discussion", author: "r/ASTSpaceMobile", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=FCC&restrict_sr=1", note: "Regulatory parsing — compare to actual order PDF" }
];

export const TOP_COMMUNITY_CONTRIBUTORS = [
  { user: "u/TheKook", role: "Unofficial mascot / morale & DD posts", note: "Anonymous; 'Kook Bottom' meme — sentiment, not IR" },
  { user: "u/ASTSpaceMobile mods", role: "Daily thread maintainers", note: "Pinned launch calendars, rules" },
  { user: "r/ASTSpaceMobile power users", role: "FCC / TLE / Form 4 trackers", note: "High-signal technical posts; usernames rotate — search 'DD' flair" },
  { user: "r/stocks ASTS commentators", role: "Dilution & valuation skeptics", note: "Cross-check against SEC primary sources" },
  { user: "Stocktwits $ASTS", role: "Real-time launch sentiment", note: "Temperature check only — not diligence" }
];

export function catalystsInYear(year) {
  return CATALYSTS.filter((c) => c.windowStart.startsWith(String(year)) || c.windowEnd.startsWith(String(year)));
}

export function sortCatalysts(list) {
  return [...list].sort((a, b) => a.windowStart.localeCompare(b.windowStart));
}

export function formatCatalystMonth(iso) {
  const [y, m] = iso.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[parseInt(m, 10) - 1]} ${y}`;
}

export function timelineFrac(iso, year) {
  const [y, m] = iso.split("-").map(Number);
  if (y < year) return 0;
  if (y > year) return 1;
  return (m - 1) / 12;
}

export function layoutTimeline(catalysts, year) {
  return catalysts.map((c) => ({
    ...c,
    left: timelineFrac(c.windowStart, year) * 100,
    width: Math.max(2, (timelineFrac(c.windowEnd, year) - timelineFrac(c.windowStart, year)) * 100)
  }));
}
