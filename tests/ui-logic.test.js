import test from "node:test";
import assert from "node:assert/strict";
import { VALID_TABS, EXPLAIN_LEVELS, CONST_PRESETS, VAL_PRESETS } from "../js/ui/state.js";
import { COMMUNITY_DD, BEAR_CASE } from "../js/math/commercial.js";

test("five tabs defined", () => {
  assert.equal(VALID_TABS.length, 5);
  assert.ok(VALID_TABS.includes("technology"));
});

test("six explain levels", () => {
  assert.equal(EXPLAIN_LEVELS.length, 6);
});

test("const presets include base bear and bag", () => {
  assert.ok(CONST_PRESETS.base);
  assert.ok(CONST_PRESETS.bear);
  assert.ok(CONST_PRESETS.bag);
});

test("community DD has verdict tags", () => {
  assert.ok(COMMUNITY_DD.length >= 8);
  assert.ok(COMMUNITY_DD.every((r) => r.verdict && r.note));
});

test("bear case non-empty", () => {
  assert.ok(BEAR_CASE.length >= 4);
});
