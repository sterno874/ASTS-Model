import test from "node:test";
import assert from "node:assert/strict";
import { ALL_BANDS, bandCoversRange } from "../js/ui/bands.js";

test("ALL_BANDS includes constellation and valuation sliders", () => {
  assert.ok(ALL_BANDS.some((b) => b.id === "csats"));
  assert.ok(ALL_BANDS.some((b) => b.id === "vv_shares"));
});

test("bandCoversRange validates csats slider", () => {
  const cfg = ALL_BANDS.find((b) => b.id === "csats");
  assert.ok(bandCoversRange(cfg, 1, 80));
});
