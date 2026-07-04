import test from "node:test";
import assert from "node:assert/strict";
import {
  sharesFromConversionM,
  computeFullyDilutedSharesM,
  CONVERTIBLE_TOTAL_PRINCIPAL_M,
  DILUTION_STRESS_PRESETS,
  SEC_10K_URL,
  CONVERTIBLE_NOTES,
  evPerShareFd
} from "../js/math/dilution.js";

test("sharesFromConversionM at $120.12 for $575M note", () => {
  assert.ok(sharesFromConversionM(575, 120.12) > 4.5);
});

test("FD shares at $45 include warrants only", () => {
  const fd = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 45 });
  assert.ok(fd.fdSharesM > 256 && fd.fdSharesM < 280);
});

test("CONVERTIBLE_TOTAL_PRINCIPAL_M is $2035M", () => {
  assert.equal(CONVERTIBLE_TOTAL_PRINCIPAL_M, 2035);
});

test("DILUTION_STRESS_PRESETS 256/280/320/360M", () => {
  assert.equal(DILUTION_STRESS_PRESETS.filing.sharesM, 256);
  assert.equal(DILUTION_STRESS_PRESETS.atm.sharesM, 280);
  assert.equal(DILUTION_STRESS_PRESETS.convert.sharesM, 320);
  assert.equal(DILUTION_STRESS_PRESETS.full.sharesM, 360);
});

test("evPerShareFd decreases when FD higher", () => {
  const fd = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 120 });
  assert.ok(evPerShareFd(5000, 3460, 698, fd) < evPerShareFd(5000, 3460, 698, { fdSharesM: 256 }));
});

test("CONVERTIBLE_NOTES sourced from 10-K", () => {
  assert.ok(SEC_10K_URL.includes("1780312"));
  assert.ok(CONVERTIBLE_NOTES.every((n) => n.source));
});
