import test from "node:test";
import assert from "node:assert/strict";
import { CONST_PRESETS, VAL_PRESETS } from "../js/ui/state.js";

test("CONST_PRESETS has bear base bull bag", () => {
  assert.ok(CONST_PRESETS.bear);
  assert.ok(CONST_PRESETS.base);
  assert.ok(CONST_PRESETS.bull);
  assert.ok(CONST_PRESETS.bag);
});

test("bag preset uses Jul 2026 anchor sats", () => {
  assert.equal(CONST_PRESETS.bag.sats, 10);
  assert.equal(CONST_PRESETS.bag.targetSats, 45);
});

test("bull preset has higher penetration than bear", () => {
  assert.ok(CONST_PRESETS.bull.penetration > CONST_PRESETS.bear.penetration);
});

test("VAL_PRESETS commercial bull exceeds bear EV inputs", () => {
  assert.ok(VAL_PRESETS.bull.v_pCommercial > VAL_PRESETS.bear.v_pCommercial);
  assert.ok(VAL_PRESETS.bull.v_mult > VAL_PRESETS.bear.v_mult);
  assert.ok(VAL_PRESETS.bull.v_platform > VAL_PRESETS.bear.v_platform);
  assert.equal(VAL_PRESETS.bull.v_arpuMonthly, 5);
  assert.equal(VAL_PRESETS.bull.v_coverageFrac, 0.6);
});

test("VAL_PRESETS has operating base and model optionality presets", () => {
  assert.equal(VAL_PRESETS.base.label, "Operating DCF (base)");
  assert.ok(VAL_PRESETS.constellation248.modelOnly);
  assert.ok(VAL_PRESETS.strategic.modelOnly);
  assert.ok(VAL_PRESETS.constellation248.v_platform > VAL_PRESETS.bull.v_platform);
});

test("coverage preset ramps sats to 45", () => {
  assert.equal(CONST_PRESETS.coverage.sats, 45);
});
