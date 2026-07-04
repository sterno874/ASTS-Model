/**
 * Commercial partnerships, catalysts, community DD — primary-sourced facts.
 */

export const MNO_PARTNERS = [
  {
    name: "AT&T",
    region: "US",
    role: "Spectrum + commercial D2D",
    investor: true,
    tag: "verified",
    sourceLabel: "SEC filing",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    name: "Verizon",
    region: "US",
    role: "Spectrum + commercial D2D",
    investor: true,
    tag: "verified",
    sourceLabel: "Business Wire",
    source: "https://www.businesswire.com/news/home/20240529905438/en/AST-SpaceMobile-and-Verizon-Announce-Definitive-Commercial-Agreement-for-Direct-to-Cellular-Service"
  },
  {
    name: "Vodafone",
    region: "Europe / global",
    role: "MNO partner + investor",
    investor: true,
    tag: "verified",
    sourceLabel: "Business Wire",
    source: "https://www.businesswire.com/news/home/20240617561861/en/AST-SpaceMobile-Announces-Strategic-Investment-by-AT-T-Verizon-Vodafone-and-Google"
  },
  {
    name: "Rakuten",
    region: "Japan",
    role: "MNO partner",
    investor: false,
    tag: "verified",
    sourceLabel: "AST IR",
    source: "https://ast-science.com/"
  },
  {
    name: "Bell / Telus",
    region: "Canada",
    role: "MNO partner",
    investor: false,
    tag: "verified",
    sourceLabel: "AST IR",
    source: "https://ast-science.com/"
  },
  {
    name: "stc Group",
    region: "MENA",
    role: "MNO partner",
    investor: false,
    tag: "verified",
    sourceLabel: "AST IR",
    source: "https://ast-science.com/"
  },
  {
    name: "Google",
    region: "Global",
    role: "Strategic partner",
    investor: false,
    tag: "verified",
    sourceLabel: "Business Wire",
    source: "https://www.businesswire.com/news/home/20240617561861/en/AST-SpaceMobile-Announces-Strategic-Investment-by-AT-T-Verizon-Vodafone-and-Google"
  },
  {
    name: "American Tower",
    region: "Global",
    role: "Ground infrastructure",
    investor: false,
    tag: "verified",
    sourceLabel: "AST IR",
    source: "https://ast-science.com/"
  }
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
  {
    sat: "BlueWalker 3",
    date: "2022-09-10",
    provider: "SpaceX Falcon 9",
    block: "Test",
    status: "deployed",
    count: 1,
    tag: "verified",
    source: "https://ast-science.com/"
  },
  {
    sat: "BlueBird 1–5",
    date: "2024-09-12",
    provider: "SpaceX Falcon 9",
    block: "Block 1",
    status: "deployed",
    count: 5,
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20240912021837/en/AST-SpaceMobile-Successfully-Launches-its-First-Five-Commercial-BlueBird-Satellites"
  },
  {
    sat: "BlueBird 6",
    date: "2025-12-06",
    provider: "ISRO LVM3",
    block: "Block 2",
    status: "deployed",
    count: 1,
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20251206121383/en/AST-SpaceMobile-Successfully-Launches-its-Sixth-BlueBird-Satellite"
  },
  {
    sat: "BlueBird 7",
    date: "2026-04-28",
    provider: "Blue Origin NG-3",
    block: "Block 2",
    status: "lost",
    count: 1,
    tag: "verified",
    source: "https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/"
  },
  {
    sat: "BlueBird 8–10",
    date: "2026-06-17",
    provider: "SpaceX Falcon 9",
    block: "Block 2",
    status: "deployed",
    count: 3,
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20260617420856/en/AST-SpaceMobile-Announces-Successful-Orbital-Launch-of-BlueBirds-8-9-and-10"
  }
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
  { label: "Daily Discussion Thread", author: "r/ASTSpaceMobile mods", url: "https://www.reddit.com/r/ASTSpaceMobile/", note: "Primary hub — launch tracking, FCC, dilution debate", reddit: true },
  { label: "ASTS IS DEFINITELY NOT A MEME STOCK", author: "u/Various", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=meme+stock&restrict_sr=1", note: "Recurring bull thesis — verify revenue math", reddit: true },
  { label: "Kook Report / SpaceMob DD", author: "u/TheKook (anon)", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=kook&restrict_sr=1", note: "Community DD series — influential, not primary source", reddit: true },
  { label: "BlueBird 8-10 Launch Meetup", author: "r/ASTSpaceMobile", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=BlueBird+8&restrict_sr=1", note: "Launch catalyst threads Jun 2026", reddit: true },
  { label: "Dilution / convertibles debate", author: "r/stocks, r/wallstreetbets", url: "https://www.reddit.com/r/stocks/search/?q=ASTS+dilution", note: "Cross-sub skeptic threads — check 10-Q notes", reddit: true },
  { label: "FCC DA 26-391 discussion", author: "r/ASTSpaceMobile", url: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=FCC&restrict_sr=1", note: "Regulatory parsing — compare to actual order PDF", reddit: true }
];

/** Kook Report / @thekookreport — full verification matrix (Apr–Jun 2026 weekly threads). */
export const KOOK_REPORT_CLAIMS = [
  {
    claim: "Launch cadence accelerating — mostly SpaceX, some Blue Origin",
    verdict: "partial",
    tag: "community",
    source: "https://threadreaderapp.com/thread/1914063374180323818.html",
    note: "BB8-10 on SpaceX Jun 2026 verified; BB7 Blue Origin loss Apr 2026 verified. Multi-provider strategy confirmed in IR — exact future mix forward-looking."
  },
  {
    claim: "BlueBirds 11–13 launch window Jul–Sep 2026",
    verdict: "partial",
    tag: "forward-looking",
    source: "https://www.businesswire.com/news/home/20260617420856/en/",
    note: "Company PR post-BB8-10 cites next batch timing — not yet launched as of Jul 4 2026."
  },
  {
    claim: "Government / Golden Dome / DoD revenue pipeline heating up",
    verdict: "partial",
    tag: "community",
    source: "https://threadreaderapp.com/thread/1914063374180323818.html",
    note: "Q1/Q3 gateway + gov milestone revenue verified in 10-Q. Scale of defense contracts not disclosed — lobbying filings exist but $ amounts partial."
  },
  {
    claim: "FirstNet / AT&T public-safety adjacency is a revenue wedge",
    verdict: "partial",
    tag: "community",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312",
    note: "AT&T partnership + investor stake verified; FirstNet integration scale not quantified in SEC filings reviewed."
  },
  {
    claim: "Vodafone–AST EU SatCo briefing to MEPs",
    verdict: "partial",
    tag: "community",
    source: "https://threadreaderapp.com/thread/1914063374180323818.html",
    note: "Vodafone partnership verified (IR + Jun 2025 agreement). MEP briefing is community-sourced — plausible but not in SEC primary docs reviewed."
  },
  {
    claim: "Google strategic partnership unlocks distribution",
    verdict: "partial",
    tag: "verified",
    source: "https://ast-science.com/",
    note: "Google agreement disclosed on IR; commercial rollout terms and revenue share not in 10-K detail."
  },
  {
    claim: "Ligado DA signed — spectrum value unlock",
    verdict: "verified",
    tag: "verified",
    source: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312",
    note: "10-K: Ligado transaction + up to 45 MHz lower mid-band US/Canada access subject to regulatory approval — verified filing language."
  },
  {
    claim: "FCC DA 26-391 removes last US regulatory hurdle",
    verdict: "partial",
    tag: "verified",
    source: "https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system",
    note: "248-sat NGSO + SCS authorized Apr 2026 — verified. Conditions (interference, debris, astronomy) remain ongoing compliance obligations."
  },
  {
    claim: "AST ozone impact << Starlink deorbit pollution",
    verdict: "partial",
    tag: "model",
    source: "https://threadreaderapp.com/thread/1914063374180323818.html",
    note: "Community calc citing Kevin Coulton thread — educational comparison, not AST IR disclosure. FCC debris conditions apply to both operators."
  },
  {
    claim: "Manufacturing scale — 500k sq ft Midland proves execution",
    verdict: "partial",
    tag: "verified",
    source: "https://www.businesswire.com/news/home/20260617420856/en/",
    note: "Facility size and in-house production cited in IR/press — BB1-37 production claim forward-looking; 248-sat scale unproven."
  },
  {
    claim: "M&A always has a price — buyout thesis",
    verdict: "rejected",
    tag: "community",
    source: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=Schedule+13D",
    note: "Speculation only. AT&T ~2.7% stake (Schedule 13D) and carrier investors verified — no acquisition offer or process disclosed."
  },
  {
    claim: "Fully funded — no dilution needed",
    verdict: "rejected",
    tag: "community",
    source: "https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf",
    note: "Rejected vs 10-K: $2.2B+ convertibles, Oct 2025 ATM, warrant exercises, share count 81.8M→256M FY2023–25."
  },
  {
    claim: "200 Mbps for every user at all times",
    verdict: "rejected",
    tag: "community",
    source: "https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/",
    note: "Block 2 ~200 Mbps is peak demo target (SatNews Jun 2026) — shared beam capacity; not per-subscriber SLA."
  },
  {
    claim: "FCC approval = near-term revenue inflection",
    verdict: "rejected",
    tag: "verified",
    source: "https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system",
    note: "FCC authorizes deployment + SCS; Q1 2026 revenue $14.7M was gateway/gov milestones — mass D2C still forward-looking."
  },
  {
    claim: "Starlink D2C makes AST obsolete by 2027",
    verdict: "partial",
    tag: "community",
    source: "https://threadreaderapp.com/user/thekookreport",
    note: "SpaceX D2D via T-Mobile is real competition — different architecture (small sats vs large arrays). Obsolescence unproven; MNO partnerships differ."
  },
  {
    claim: "Kook Bottom = reliable buy signal",
    verdict: "rejected",
    tag: "community",
    source: "https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back",
    note: "Meme sentiment marker only — Bloomberg May 2026 profile. Not a valuation or timing input."
  }
];

export const TOP_COMMUNITY_CONTRIBUTORS = [
  {
    user: "u/hyeonk",
    tier: "helpful",
    role: "High-signal filing & partner news aggregator",
    note: "Frequent Vodafone/AT&T/Google/13D posts with primary links — verify terms vs hype",
    source: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=author%3Ahyeonk&restrict_sr=1",
    reddit: true
  },
  {
    user: "u/EducatedFool1",
    tier: "helpful",
    role: "Technical milestone summaries",
    note: "Launch/integration threads citing IR — good starting point, still cross-check SEC",
    source: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=author%3AEducatedFool1&restrict_sr=1",
    reddit: true
  },
  {
    user: "u/ASTSpaceMobile mods + DD flair",
    tier: "helpful",
    role: "Daily thread + pinned catalyst calendars",
    note: "Best aggregation hub; separates launch meetups from revenue math errors in comments",
    source: "https://www.reddit.com/r/ASTSpaceMobile/",
    reddit: true
  },
  {
    user: "@thekookreport (The Kook)",
    tier: "mixed",
    role: "Weekly 'Kook Report' morale + regulatory sweep",
    note: "Influential SpaceMob chronicler — mix of verified FCC/launch facts and speculative gov/M&A threads. Not primary source.",
    source: "https://threadreaderapp.com/user/thekookreport",
    reddit: false
  },
  {
    user: "r/wallstreetbets ASTS dilution posts",
    tier: "misleading",
    role: "Meme framing + oversimplified revenue",
    note: "Often ignores wholesale rev-share; useful as sentiment thermometer only",
    source: "https://www.reddit.com/r/wallstreetbets/search/?q=ASTS",
    reddit: true
  },
  {
    user: "Stocktwits $ASTS",
    tier: "misleading",
    role: "Launch-hype temperature",
    note: "Frequent '$3×3B' revenue errors and FCC=profit conflation — do not use for models",
    source: "https://stocktwits.com/symbol/ASTS",
    reddit: false
  },
  {
    user: "Anonymous 'fully funded' bull threads",
    tier: "misleading",
    role: "Cash runway cheerleading",
    note: "Cites Q1 cash ~$3.46B but omits Q1 investing ~$379M and convertible overhang — partial at best",
    source: "https://www.reddit.com/r/ASTSpaceMobile/search/?q=fully+funded&restrict_sr=1",
    reddit: true
  }
];

export function catalystsInYear(year) {
  const y = Number(year);
  return CATALYSTS.filter((c) => {
    const startYear = Number(c.windowStart.slice(0, 4));
    const endYear = Number(c.windowEnd.slice(0, 4));
    return startYear <= y && y <= endYear;
  });
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

export function verdictMeta(verdict) {
  if (verdict === "verified") return { icon: "✅", cls: "val-ok", label: "verified" };
  if (verdict === "rejected") return { icon: "❌", cls: "val-no", label: "rejected" };
  return { icon: "⚠️", cls: "val-part", label: "partial" };
}

export function tagClass(tag) {
  if (tag === "verified") return "f";
  if (tag === "forward-looking") return "u";
  if (tag === "partial") return "a";
  if (tag === "model") return "m";
  return "c";
}

export function catalystBarClass(tag) {
  return tag === "verified" ? "cat-tl-bar--verified" : "cat-tl-bar--estimate";
}

export function packTimelineLanes(items) {
  const sorted = [...items].sort((a, b) => a.left - b.left || a.right - b.right);
  const laneRight = [];
  const out = sorted.map((item) => {
    let lane = laneRight.findIndex((right) => right <= item.left);
    if (lane === -1) {
      lane = laneRight.length;
      laneRight.push(item.right);
    } else {
      laneRight[lane] = item.right;
    }
    return { ...item, lane };
  });
  return { items: out, lanes: laneRight.length || 1 };
}

export function layoutTimeline(catalysts, year) {
  const base = catalysts.map((c) => {
    const startFrac = timelineFrac(c.windowStart, year);
    const endFrac = timelineFrac(c.windowEnd, year) + 1 / 12;
    const left = Math.max(0, Math.min(100, startFrac * 100));
    const right = Math.max(left, Math.min(100, endFrac * 100));
    return {
      ...c,
      left,
      right,
      width: Math.max(2, right - left),
      contLeft: Number(c.windowStart.slice(0, 4)) < year,
      contRight: Number(c.windowEnd.slice(0, 4)) > year
    };
  });
  const packed = packTimelineLanes(base);
  return {
    items: packed.items.map((c) => ({ ...c, width: Math.max(2, c.right - c.left) })),
    lanes: packed.lanes
  };
}

export function timelineMonthTicks(year) {
  return ["Jan", "Apr", "Jul", "Oct", "Dec"].map((label, idx) => ({
    label: idx === 4 ? `${label} ${year}` : label,
    left: idx === 4 ? 100 : idx * 25
  }));
}

export function todayMarkerFrac(year, now = new Date()) {
  if (now.getUTCFullYear() !== Number(year)) return null;
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  const frac = ((now.getTime() - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, frac));
}

export function launchOrbitTotal() {
  return LAUNCH_EVENTS.reduce((sum, event) => {
    const count = Number(event.count ?? 1);
    if (event.status === "lost") return sum;
    return sum + count;
  }, 0);
}

export function formatLaunchStatus(event) {
  if (!event || !event.status) return "deployed";
  if (event.status === "lost") return "lost — insertion error";
  if (event.status === "deployed") return "deployed";
  return event.status;
}

export const REDDIT_ATTRIBUTION = {
  subreddit: "r/ASTSpaceMobile",
  url: "https://www.reddit.com/r/ASTSpaceMobile/",
  note: "Community-sourced discussion only. Cross-check claims with SEC/FCC/IR before using in model assumptions."
};
