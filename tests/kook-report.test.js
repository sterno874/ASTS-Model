import test from "node:test";
import assert from "node:assert/strict";
import {
  KOOK_REPORT_CLAIMS,
  TOP_COMMUNITY_CONTRIBUTORS,
  COMMUNITY_DD,
  MNO_PARTNERS
} from "../js/math/commercial.js";

test("KOOK_REPORT_CLAIMS has ligado verified entry", () => {
  const lig = KOOK_REPORT_CLAIMS.find((k) => /ligado/i.test(k.claim));
  assert.ok(lig);
  assert.equal(lig.verdict, "verified");
});

test("KOOK rejects fully funded no dilution", () => {
  const rej = KOOK_REPORT_CLAIMS.filter((k) => k.verdict === "rejected");
  assert.ok(rej.some((k) => /dilution|funded/i.test(k.claim)));
});

test("TOP_COMMUNITY_CONTRIBUTORS has helpful and misleading tiers", () => {
  assert.ok(TOP_COMMUNITY_CONTRIBUTORS.some((c) => c.tier === "helpful"));
  assert.ok(TOP_COMMUNITY_CONTRIBUTORS.some((c) => c.tier === "misleading"));
});

test("COMMUNITY_DD rejects 5.4B revenue math", () => {
  assert.ok(COMMUNITY_DD.some((r) => r.verdict === "rejected" && /5\.4B|3B/i.test(r.theme)));
});

test("MNO_PARTNERS includes AT&T and Verizon investors", () => {
  const att = MNO_PARTNERS.find((p) => p.name === "AT&T");
  const vz = MNO_PARTNERS.find((p) => p.name === "Verizon");
  assert.ok(att?.investor);
  assert.ok(vz?.investor);
  assert.ok(att?.sourceLabel);
  assert.ok(vz?.sourceLabel);
});

test("Kook report claims have notes", () => {
  assert.ok(KOOK_REPORT_CLAIMS.every((k) => k.note && k.note.length > 10));
});
