import test from "node:test";
import assert from "node:assert/strict";
import { fsplDb, linkMarginDb, computeLinkBudget, arrayGainBoostDb, coverageRadiusKm } from "../js/math/link-budget.js";

test("fsplDb at 2M slant range is roughly 150+ dB at 800 MHz", () => {
  const pl = fsplDb(800e6, 2e6);
  assert.ok(pl > 145 && pl < 165);
});

test("fsplDb increases with distance", () => {
  const near = fsplDb(800e6, 500e3);
  const far = fsplDb(800e6, 2000e3);
  assert.ok(far > near);
});

test("Block 2 array gain boost vs Block 1 is positive", () => {
  assert.ok(arrayGainBoostDb(223, 64) > 4);
});

test("linkMarginDb returns finite margin", () => {
  const r = linkMarginDb({});
  assert.ok(Number.isFinite(r.marginDb));
  assert.ok(r.pathLossDb > 100);
});

test("computeLinkBudget marks link at typical params", () => {
  const r = computeLinkBudget({ altKm: 550, elevDeg: 30, arraySqM: 223 });
  assert.ok(r.radiusKm > 500);
  assert.ok(typeof r.linkOk === "boolean");
});

test("coverageRadiusKm grows with altitude", () => {
  assert.ok(coverageRadiusKm(700) > coverageRadiusKm(400));
});
