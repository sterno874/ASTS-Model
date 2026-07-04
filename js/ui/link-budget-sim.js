/**
 * Link budget sim — SVG geometry + gauge rendering (Technology tab).
 */
const SVG_W = 480;
const SVG_H = 300;
const COL = {
  bg: "#f8fafc",
  ink: "#141b26",
  muted: "#4f5866",
  line: "#dde2e8",
  accent: "#2f6fed",
  good: "#1f9d55",
  warn: "#d98a00",
  earth: "#94a3b8"
};

export function drawLinkSvg(svg, r) {
  if (!svg) return;
  const cx = SVG_W / 2;
  const groundY = 228;
  const earthR = 200;
  const satX = cx;
  const satY = 42;
  const elev = (r.elevDeg * Math.PI) / 180;
  const pathLen = Math.min(175, 80 + r.rangeKm * 0.18);
  const phoneX = satX - Math.cos(elev) * pathLen;
  const phoneY = groundY - Math.sin(elev) * pathLen;
  const arcR = 32;
  const arcStartX = phoneX + arcR;
  const arcEndX = phoneX + arcR * Math.cos(elev);
  const arcEndY = phoneY - arcR * Math.sin(elev);
  const midX = (satX + phoneX) / 2;
  const midY = (satY + phoneY) / 2;
  const blockW = r.blockLabel.includes("Block 1") ? 28 : 48;
  const blockH = 14;
  const beamW = 18 + r.arrayBoost * 0.4;

  svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.innerHTML = `
    <rect width="${SVG_W}" height="${SVG_H}" fill="${COL.bg}"/>
    <text x="${cx}" y="18" text-anchor="middle" font-size="11" fill="${COL.muted}" font-weight="600">LEO direct-to-cell link geometry (schematic)</text>
    <path d="M 20 ${groundY} Q ${cx} ${groundY + 28} ${SVG_W - 20} ${groundY}" fill="none" stroke="${COL.earth}" stroke-width="2.5"/>
    <text x="36" y="${groundY + 14}" font-size="9" fill="${COL.muted}">Earth surface</text>
    <line x1="${satX}" y1="${satY + blockH}" x2="${phoneX}" y2="${phoneY - 8}" stroke="${COL.accent}" stroke-width="2" stroke-dasharray="7 5" opacity=".85"/>
    <polygon points="${satX},${satY + blockH + 4} ${satX - beamW / 2},${phoneY} ${satX + beamW / 2},${phoneY}" fill="${COL.accent}" opacity=".12" stroke="${COL.accent}" stroke-width="1"/>
    <circle cx="${midX}" cy="${midY}" r="16" fill="#fff" stroke="${COL.line}"/>
    <text x="${midX}" y="${midY + 4}" text-anchor="middle" font-size="9" fill="${COL.accent}" font-weight="700">d=${r.rangeKm.toFixed(0)} km</text>
    <rect x="${satX - blockW / 2}" y="${satY}" width="${blockW}" height="${blockH}" fill="${COL.ink}" rx="3"/>
    <line x1="${satX - blockW / 4}" y1="${satY + 3}" x2="${satX + blockW / 4}" y2="${satY + 3}" stroke="#4f5866" stroke-width="1"/>
    <line x1="${satX - blockW / 4}" y1="${satY + 7}" x2="${satX + blockW / 4}" y2="${satY + 7}" stroke="#4f5866" stroke-width="1"/>
    <line x1="${satX - blockW / 4}" y1="${satY + 11}" x2="${satX + blockW / 4}" y2="${satY + 11}" stroke="#4f5866" stroke-width="1"/>
    <text x="${satX}" y="${satY + 30}" text-anchor="middle" font-size="10" fill="${COL.ink}" font-weight="600">${r.blockLabel}</text>
    <text x="${satX}" y="${satY + 42}" text-anchor="middle" font-size="9" fill="${COL.muted}">h=${r.altKm} km · ${r.arraySqM} m² array</text>
    <rect x="${phoneX - 10}" y="${phoneY - 18}" width="20" height="36" fill="${COL.good}" rx="5"/>
    <rect x="${phoneX - 6}" y="${phoneY - 14}" width="12" height="20" fill="#fff" opacity=".25" rx="2"/>
    <text x="${phoneX}" y="${groundY + 12}" text-anchor="middle" font-size="10" fill="${COL.ink}">Handset</text>
    <text x="${phoneX}" y="${groundY + 24}" text-anchor="middle" font-size="9" fill="${COL.warn}">ε=${r.elevDeg}° elev</text>
    <path d="M ${arcStartX} ${phoneY} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}" fill="none" stroke="${COL.warn}" stroke-width="1.8"/>
    <text x="${phoneX + 52}" y="${phoneY - 8}" font-size="9" fill="${COL.warn}">ε angle</text>
    <line x1="${satX}" y1="${satY + blockH + 4}" x2="${phoneX}" y2="${phoneY - 8}" stroke="${COL.accent}" stroke-width="1" opacity=".35"/>
    <rect x="12" y="${SVG_H - 54}" width="${SVG_W - 24}" height="42" rx="8" fill="#fff" stroke="${COL.line}"/>
    <text x="${cx}" y="${SVG_H - 40}" text-anchor="middle" font-size="10" fill="${COL.ink}" font-weight="600">Margin ${r.marginDb.toFixed(1)} dB · ${r.linkOk ? "Link closes" : "Below sensitivity"}</text>
    <text x="${cx}" y="${SVG_H - 26}" text-anchor="middle" font-size="9" fill="${COL.muted}">λ=${(r.lambdaM * 100).toFixed(1)} cm · Friis PL=20 log₁₀(4πd/λ)=${r.pathLossDb.toFixed(1)} dB</text>
    <text x="${cx}" y="${SVG_H - 14}" text-anchor="middle" font-size="9" fill="${COL.muted}">P_rx = EIRP + G_tx − PL − L_impl − L_atm → ${r.rxDbm.toFixed(1)} dBm</text>
    <g class="sim-legend" transform="translate(16,${SVG_H - 68})">
      <line x1="0" y1="4" x2="14" y2="4" stroke="${COL.accent}" stroke-width="2" stroke-dasharray="4 3"/><text x="18" y="7" font-size="8" fill="${COL.muted}">RF path</text>
      <rect x="78" y="0" width="12" height="8" fill="${COL.accent}" opacity=".15" stroke="${COL.accent}"/><text x="94" y="7" font-size="8" fill="${COL.muted}">Beam footprint</text>
    </g>`;
}

export function updateLinkGauge($, r) {
  const fill = $("lkGaugeFill"), marker = $("lkGaugeMarker"), val = $("lkGaugeVal"), status = $("lkGaugeStatus");
  if (fill) { fill.style.width = r.gaugePct + "%"; fill.className = "link-gauge-fill " + r.gaugeClass; }
  if (marker) marker.style.left = r.gaugePct + "%";
  if (val) val.textContent = r.marginDb.toFixed(1) + " dB";
  if (status) {
    status.textContent = r.linkOk ? "Above sensitivity" : r.marginDb > -5 ? "Near threshold" : "Below sensitivity";
    status.className = "link-gauge-status " + r.gaugeClass;
  }
}

export function updateFriisPanel($, r) {
  const eq = $("lkFriisEq"), budget = $("lkFriisBudget"), terms = $("lkFriisTerms");
  if (eq) eq.textContent = r.friis.equation;
  if (budget) budget.textContent = r.friis.budget;
  if (terms) terms.innerHTML = r.friis.terms.map((t) =>
    `<div class="friis-term"><span class="friis-term-label">${t.label}</span><span class="friis-term-val">${t.value}</span><span class="friis-term-note">${t.note}</span></div>`
  ).join("");
}

export function syncBlockPresetButtons(blockId) {
  document.querySelectorAll("[data-lk-block]").forEach((btn) => {
    const on = btn.dataset.lkBlock === blockId;
    btn.classList.toggle("p-def", on);
    btn.classList.toggle("active", on);
  });
}
