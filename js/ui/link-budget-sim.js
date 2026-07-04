/**
 * Link budget sim — SVG geometry + gauge rendering (Technology tab).
 */
const SVG_W = 480, SVG_H = 260;

export function drawLinkSvg(svg, r) {
  if (!svg) return;
  const cx = SVG_W / 2, groundY = 210, satX = cx, satY = 36;
  const elev = (r.elevDeg * Math.PI) / 180, pathLen = 130;
  const phoneX = satX - Math.cos(elev) * pathLen, phoneY = groundY - Math.sin(elev) * pathLen;
  const arcR = 28, arcStartX = phoneX + arcR;
  const arcEndX = phoneX + arcR * Math.cos(elev), arcEndY = phoneY - arcR * Math.sin(elev);
  const midX = (satX + phoneX) / 2, midY = (satY + phoneY) / 2;
  const blockW = r.blockLabel.includes("Block 1") ? 22 : 34;
  svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.innerHTML = `<rect width="${SVG_W}" height="${SVG_H}" fill="#f8fafc"/>
    <text x="${cx}" y="16" text-anchor="middle" font-size="11" fill="#4f5866" font-weight="600">LEO link geometry (not to scale)</text>
    <path d="M 40 ${groundY} Q ${cx} ${groundY + 18} ${SVG_W - 40} ${groundY}" fill="none" stroke="#94a3b8" stroke-width="2"/>
    <line x1="${satX}" y1="${satY + 12}" x2="${phoneX}" y2="${phoneY - 6}" stroke="#2f6fed" stroke-width="2.5" stroke-dasharray="7 5"/>
    <circle cx="${midX}" cy="${midY}" r="14" fill="#fff" stroke="#dde2e8"/>
    <text x="${midX}" y="${midY + 4}" text-anchor="middle" font-size="9" fill="#2f6fed" font-weight="700">${r.rangeKm.toFixed(0)} km</text>
    <rect x="${satX - blockW / 2}" y="${satY - 4}" width="${blockW}" height="14" fill="#141b26" rx="2"/>
    <text x="${satX}" y="${satY + 28}" text-anchor="middle" font-size="10" fill="#141b26" font-weight="600">${r.blockLabel} · ${r.altKm} km</text>
    <rect x="${phoneX - 9}" y="${phoneY - 16}" width="18" height="32" fill="#1f9d55" rx="4"/>
    <text x="${phoneX}" y="${groundY + 14}" text-anchor="middle" font-size="10" fill="#141b26">${r.elevDeg}° elev</text>
    <path d="M ${arcStartX} ${phoneY} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}" fill="none" stroke="#d98a00" stroke-width="1.5"/>
    <rect x="12" y="${SVG_H - 38}" width="${SVG_W - 24}" height="28" rx="6" fill="#fff" stroke="#dde2e8"/>
    <text x="${cx}" y="${SVG_H - 26}" text-anchor="middle" font-size="10" fill="#141b26">Margin ${r.marginDb.toFixed(1)} dB · ${r.linkOk ? "Link closes" : "Below sensitivity"}</text>
    <text x="${cx}" y="${SVG_H - 14}" text-anchor="middle" font-size="9" fill="#4f5866">λ = ${(r.lambdaM * 100).toFixed(1)} cm · Friis PL = 20 log₁₀(4πd/λ)</text>`;
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
    btn.classList.toggle("active", btn.dataset.lkBlock === blockId);
  });
}
