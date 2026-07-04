import test from "node:test";
import assert from "node:assert/strict";
import {
  sharesFromConversionM,
  computeFullyDilutedSharesM,
  CONVERTIBLE_NOTES,
  DILUTION_STRESS_PRESETS,
  evPerShareFd
} from "../js/math/dilution.js";

test("sharesFromConversionM at $120.12 for $575M note", () => {
  const sh = sharesFromConversionM(575, 120.12);
  assert.ok(sh > 4.5 && sh < 5.0);
});

test("FD shares increase when price above conversion", () => {
  const low = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 40 });
  const high = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 130 });
  assert.ok(high.fdSharesM > low.fdSharesM);
});

test("FD shares at $45 include partial conversion", () => {
  const fd = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 45 });
  assert.ok(fd.fdSharesM > 256);
  assert.ok(fd.dilutionPct > 0);
});

test("CONVERTIBLE_NOTES has 2036 note at $85 conversion", () => {
  const n = CONVERTIBLE_NOTES.find((x) => x.id === "2036_200");
  assert.ok(n);
  assert.equal(n.conversionPrice, 85);
  assert.equal(n.principalM, 1000);
});

test("DILUTION_STRESS_PRESETS filing anchor 256M", () => {
  assert.equal(DILUTION_STRESS_PRESETS.filing.sharesM, 256);
});

test("evPerShareFd decreases vs base when FD higher", () => {
  const fd = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 120 });
  const basePer = evPerShareFd(5000, 3460, 698, { fdSharesM: 256 });
  const fdPer = evPerShareFd(5000, 3460, 698, fd);
  assert.ok(fdPer < basePer);
});

test("warrants add fixed shares regardless of price", () => {
  const a = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 30 });
  const b = computeFullyDilutedSharesM({ baseSharesM: 256, stockPrice: 200 });
  const wa = a.rows.find((r) => r.id === "warrants");
  const wb = b.rows.find((r) => r.id === "warrants");
  assert.equal(wa.addedSharesM, wb.addedSharesM);
});
