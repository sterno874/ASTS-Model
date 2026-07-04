import test from "node:test";
import assert from "node:assert/strict";
import {
  fsplDb,
  linkMarginDb,
  computeLinkBudget,
  arrayGainBoostDb,
  coverageRadiusKm,
  slantRangeKm,
  marginGaugePercent,
  marginGaugeClass,
  friisBreakdown,
  resolveBlock,
  BLOCK_PRESETS,
  FCC_LIMITS
} from "../js/math/link-budget.js";

test("fsplDb at 2M slant range is roughly 150+ dB at 800 MHz", () => {
  const pl = fsplDb(800e6, 2e6);
  assert.ok(pl > 145 && pl < 165);
});

test("Block 2 array gain boost vs Block 1 is positive", () => {
  assert.ok(arrayGainBoostDb(223, 64) > 4);
});

test("computeLinkBudget Block 2 returns gauge and friis terms", () => {
  const r = computeLinkBudget({ blockId: "block2", elevDeg: 30 });
  assert.equal(r.blockId, "block2");
  assert.ok(r.friis.terms.length >= 6);
  assert.ok(r.gaugePct >= 0 && r.gaugePct <= 100);
});

test("Block 1 has lower EIRP than Block 2", () => {
  assert.ok(computeLinkBudget({ blockId: "block2" }).eirpDbw > computeLinkBudget({ blockId: "block1" }).eirpDbw);
});

test("marginGaugePercent maps 0 dB to center", () => {
  assert.equal(marginGaugePercent(0), 50);
});

test("slantRangeKm decreases with higher elevation", () => {
  assert.ok(slantRangeKm(550, 60) < slantRangeKm(550, 15));
});

test("FCC_LIMITS cites 25.114", () => {
  assert.match(FCC_LIMITS.eirpCfr, /25\.114/);
});

test("coverageRadiusKm grows with altitude", () => {
  assert.ok(coverageRadiusKm(700) > coverageRadiusKm(400));
});
