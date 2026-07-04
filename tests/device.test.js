import test from "node:test";
import assert from "node:assert/strict";
import { evPerShare, lerp, clamp } from "../js/math/device.js";

test("evPerShare includes cash and subtracts debt", () => {
  const withCash = evPerShare(1000, 100, 200, 50);
  const bare = evPerShare(1000, 100, 0, 50);
  assert.ok(withCash > bare);
});

test("evPerShare returns NaN for zero shares", () => {
  assert.ok(Number.isNaN(evPerShare(100, 0)));
});

test("lerp interpolates midpoint", () => {
  assert.equal(lerp(0, 10, 0.5), 5);
});

test("clamp bounds value", () => {
  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(clamp(-1, 0, 10), 0);
});

test("evPerShare formula matches filing math", () => {
  const per = evPerShare(5000, 256, 3460, 698);
  assert.ok(per > 30 && per < 35);
});
