import test from "node:test";
import assert from "node:assert/strict";
import { buildShareHash, decodeShareHash, DEFAULT_STATE } from "../js/ui/state.js";

test("share hash round-trip preserves constellation sats", () => {
  const s = structuredClone(DEFAULT_STATE);
  s.constellation.sats = 25;
  s.tab = "value";
  const hash = buildShareHash(s);
  const decoded = decodeShareHash(hash);
  assert.equal(decoded.constellation.sats, 25);
  assert.equal(decoded.tab, "value");
});

test("decodeShareHash returns null for bad hash", () => {
  assert.equal(decodeShareHash("#bad"), null);
});
