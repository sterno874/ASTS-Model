/**
 * Verified facts registry — extensible for future PR/filings.
 * When status=verified and affectsPreset is set, preset bands may nudge (see PRESET_NUDGES).
 */

export const VERIFIED_MILESTONES = [
  {
    id: "fcc-248",
    claim: "FCC authorized up to 248 NGSO satellites (DA 26-391)",
    status: "verified",
    asOf: "2026-04-01",
    sourceUrl: "https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system",
    affectsPreset: "constellation248"
  },
  {
    id: "orbit-10",
    claim: "~10 operational BlueBird spacecraft in orbit (Jul 2026)",
    status: "verified",
    asOf: "2026-07-04",
    sourceUrl: "https://www.businesswire.com/news/home/20260617420856/en/AST-SpaceMobile-Announces-Successful-Orbital-Launch-of-BlueBirds-8-9-and-10"
  },
  {
    id: "bb7-loss",
    claim: "BlueBird 7 lost to low-orbit insertion (Apr 2026, insured)",
    status: "verified",
    asOf: "2026-04-28",
    sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    id: "q1-cash",
    claim: "Q1 2026 cash ~$3.46B; Q1 revenue $14.7M (gateway + gov)",
    status: "verified",
    asOf: "2026-03-31",
    sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    id: "q1-loss",
    claim: "Q1 2026 GAAP net loss ~$191M; investing cash ~$379M/qtr",
    status: "verified",
    asOf: "2026-03-31",
    sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    id: "us-commercial-2027",
    claim: "US commercial broadband service target ~2027",
    status: "pending",
    asOf: "2026-07-04",
    sourceUrl: "https://ast-science.com/",
    affectsPreset: "base"
  },
  {
    id: "wholesale-terms",
    claim: "Per-MNO wholesale rev-share / capacity pricing disclosed",
    status: "pending",
    asOf: "2026-07-04",
    sourceUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312"
  },
  {
    id: "constellation-rev-248",
    claim: "248-sat full-scale wholesale revenue run-rate",
    status: "model",
    asOf: "2026-07-04",
    sourceUrl: "https://github.com/sterno874/ASTS-Model/blob/main/RESEARCH.md#valuation-methodology",
    affectsPreset: "constellation248"
  },
  {
    id: "strategic-nav",
    claim: "Strategic / platform NAV from MNO stakes & pre-commercial premium",
    status: "model",
    asOf: "2026-07-04",
    sourceUrl: "https://github.com/sterno874/ASTS-Model/blob/main/RESEARCH.md#valuation-methodology",
    affectsPreset: "strategic"
  }
];

/** Documented nudges when a linked milestone is verified — applied in applyValPreset. */
export const PRESET_NUDGES = {
  constellation248: {
    milestoneId: "fcc-248",
    // FCC scale authorized — allow higher coverage fraction floor in model preset
    v_coverageFrac: 0.85
  }
};

export function milestoneTagClass(status) {
  if (status === "verified") return "f";
  if (status === "partial") return "p";
  if (status === "model") return "m";
  return "u";
}

export function milestoneStatusLabel(status) {
  const map = { verified: "verified", partial: "partial", model: "model", pending: "pending" };
  return map[status] || status;
}

export function applyVerifiedNudges(presetKey, presetValues, milestones = VERIFIED_MILESTONES) {
  const nudge = PRESET_NUDGES[presetKey];
  if (!nudge) return presetValues;
  const ms = milestones.find((m) => m.id === nudge.milestoneId);
  if (!ms || ms.status !== "verified") return presetValues;
  const next = { ...presetValues };
  for (const [k, v] of Object.entries(nudge)) {
    if (k === "milestoneId") continue;
    next[k] = v;
  }
  return next;
}

export function renderMilestoneStripHtml(milestones = VERIFIED_MILESTONES) {
  return milestones
    .map((m) => {
      const tag = milestoneTagClass(m.status);
      const src = m.sourceUrl
        ? ` <a href="${m.sourceUrl}" target="_blank" rel="noopener">source ↗</a>`
        : "";
      return `<span class="vm-item" data-milestone-id="${m.id}"><span class="tag ${tag}">${milestoneStatusLabel(m.status)}</span> ${m.claim}${src}</span>`;
    })
    .join("");
}
