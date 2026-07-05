import test from "node:test";
import assert from "node:assert/strict";
import { computeFullValuation } from "../js/math/valuation.js";
import { DEFAULT_STATE, formatShareDilutionSubtitle, REF_SHARES_M } from "../js/ui/state.js";

test("REF_SHARES_M matches default diluted FY25 anchor", () => {
  assert.equal(REF_SHARES_M, 256);
  assert.equal(DEFAULT_STATE.val.v_shares, 256);
});

test("dilution presets 256/280/320/360 scale $/sh inversely at fixed EV", () => {
  const evInputs = { ...DEFAULT_STATE.val };
  const at256 = computeFullValuation({ ...evInputs, v_shares: 256 });
  const at280 = computeFullValuation({ ...evInputs, v_shares: 280 });
  const at360 = computeFullValuation({ ...evInputs, v_shares: 360 });
  assert.ok(Math.abs(at280.ev - at256.ev) < 0.02);
  assert.ok(Math.abs(at360.ev - at256.ev) < 0.02);
  assert.ok(at280.perSh < at256.perSh);
  assert.ok(at360.perSh < at280.perSh);
  assert.ok(Math.abs(at360.perSh / at256.perSh - 256 / 360) < 0.001);
});

test("formatShareDilutionSubtitle highlights 360M vs 256M FY25", () => {
  assert.equal(formatShareDilutionSubtitle(256), "");
  assert.match(formatShareDilutionSubtitle(360), /256M FY25/);
  assert.match(formatShareDilutionSubtitle(360), /EV unchanged/);
});
