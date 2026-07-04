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
});

test("coverage preset ramps sats to 45", () => {
  assert.equal(CONST_PRESETS.coverage.sats, 45);
});
