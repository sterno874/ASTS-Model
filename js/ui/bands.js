/**
 * Prior / implausible / anchor bands for constellation and valuation sliders.
 */

export function pctB(v, mn, mx) {
  return Math.min(100, Math.max(0, ((v - mn) / (mx - mn)) * 100));
}

export const CONST_BANDS = [
  {
    id: "csats",
    min: 1,
    max: 80,
    sig: { b1: [8, 20], b2: [5, 35], b3: [1, 80] },
    anchor: 10,
    why: "Operational sats Jul 2026 — BW3 + BB1-5 + BB6 + BB8-10 (excl. lost BB7)."
  },
  {
    id: "ctargetSats",
    min: 20,
    max: 100,
    sig: { b1: [40, 50], b2: [35, 55], b3: [20, 100] },
    anchor: 45,
    why: "Company 2026 deployment target ~45 sats — SpaceNews Apr 2026."
  },
  {
    id: "ccoverageSats",
    min: 30,
    max: 80,
    sig: { b1: [45, 55], b2: [40, 65], b3: [30, 80] },
    anchor: 45,
    why: "Continuous US coverage — company range 45–60 sats."
  },
  {
    id: "cpenetration",
    min: 0.005,
    max: 0.08,
    sig: { b1: [0.015, 0.04], b2: [0.008, 0.06], b3: [0.005, 0.08] },
    imp: [0.06, 0.08],
    why: "Wholesale space-layer attach rate — undisclosed; community bull cases often 3–5%+."
  },
  {
    id: "carpuMonthly",
    min: 1,
    max: 10,
    sig: { b1: [2.5, 5], b2: [1.5, 7], b3: [1, 10] },
    anchor: 3,
    why: "Wholesale $/sub/month to AST — assumption; MNO sets consumer price."
  },
  {
    id: "csubsPerSat",
    min: 10000,
    max: 150000,
    sig: { b1: [30000, 80000], b2: [15000, 120000], b3: [10000, 150000] },
    why: "Concurrent users per sat — model assumption; beam capacity not disclosed."
  }
];

export const VAL_BANDS = [
  {
    id: "vv_penetration",
    min: 0.005,
    max: 0.06,
    sig: { b1: [0.01, 0.03], b2: [0.008, 0.04], b3: [0.005, 0.06] },
    why: "Global space-layer penetration — pre-commercial assumption."
  },
  {
    id: "vv_pCommercial",
    min: 0.1,
    max: 0.9,
    sig: { b1: [0.35, 0.55], b2: [0.2, 0.7], b3: [0.1, 0.9] },
    why: "P(commercial scale success) — subjective; execution + competition risk."
  },
  {
    id: "vv_shares",
    min: 150,
    max: 400,
    sig: { b1: [240, 280], b2: [200, 320], b3: [150, 400] },
    anchor: 256,
    why: "Diluted shares (M) — ◆ FY2025 ~256M; convertibles + ATM can increase."
  },
  {
    id: "vv_cash",
    min: 500,
    max: 5000,
    sig: { b1: [2800, 3600], b2: [1500, 4000], b3: [500, 5000] },
    anchor: 3460,
    why: "Cash ($M) — ◆ Q1 2026 ~$3.46B per 10-Q."
  },
  {
    id: "vv_burnQuarterly",
    min: 50,
    max: 500,
    sig: { b1: [80, 180], b2: [60, 250], b3: [50, 500] },
    imp: [350, 500],
    why: "Quarterly cash burn incl. CapEx — Q1 investing ~$379M; structural floor ~$75M/qtr ex-CapEx."
  },
  {
    id: "vv_mult",
    min: 2,
    max: 12,
    sig: { b1: [4, 7], b2: [3, 9], b3: [2, 12] },
    why: "EV / peak revenue multiple — satellite infra comps 3–8×."
  }
];

export const ALL_BANDS = [...CONST_BANDS, ...VAL_BANDS];

export function buildBands(getEl) {
  ALL_BANDS.forEach((c) => {
    const host = getEl("band-" + c.id);
    if (!host) return;
    host.style.position = "relative";
    host.style.height = "12px";
    host.innerHTML = "";
    const strip = document.createElement("div");
    strip.className = "strip sigma";
    strip.style.top = "1px";
    strip.title = c.why || "Prior plausibility band.";
    const seg = (lohi, op) => {
      const s = document.createElement("div");
      s.className = "seg";
      s.style.left = pctB(lohi[0], c.min, c.max) + "%";
      s.style.width = pctB(lohi[1], c.min, c.max) - pctB(lohi[0], c.min, c.max) + "%";
      s.style.background = "rgba(47,111,237," + op + ")";
      return s;
    };
    strip.appendChild(seg(c.sig.b3, 0.14));
    strip.appendChild(seg(c.sig.b2, 0.28));
    strip.appendChild(seg(c.sig.b1, 0.5));
    if (c.imp) {
      const im = document.createElement("div");
      im.className = "seg imp";
      im.title = "Hard to defend — " + (c.why || "");
      im.style.left = pctB(c.imp[0], c.min, c.max) + "%";
      im.style.width = pctB(c.imp[1], c.min, c.max) - pctB(c.imp[0], c.min, c.max) + "%";
      strip.appendChild(im);
    }
    host.appendChild(strip);
    if (c.anchor != null) {
      const a = document.createElement("div");
      a.style.position = "absolute";
      a.style.top = "-3px";
      a.style.left = "calc(" + pctB(c.anchor, c.min, c.max) + "% - 4px)";
      a.style.fontSize = "9px";
      a.style.color = "#111";
      a.textContent = "◆";
      a.title = "Reported anchor: " + c.anchor;
      host.appendChild(a);
    }
    const mk = document.createElement("div");
    mk.className = "marker";
    mk.id = "mk-" + c.id;
    mk.style.height = "12px";
    host.appendChild(mk);
  });
}

export function renderBands(getEl, getValue) {
  ALL_BANDS.forEach((c) => {
    const m = getEl("mk-" + c.id);
    if (!m) return;
    const raw = getValue(c.id);
    const v = raw != null ? +raw : c.min;
    m.style.left = "calc(" + pctB(v, c.min, c.max) + "% - 1px)";
  });
}

export function bandCoversRange(cfg, min, max) {
  return cfg.min <= min && cfg.max >= max && cfg.sig.b3[0] >= min && cfg.sig.b3[1] <= max;
}
