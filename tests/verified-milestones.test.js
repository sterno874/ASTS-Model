import test from "node:test";
import assert from "node:assert/strict";
import {
  VERIFIED_MILESTONES,
  applyVerifiedNudges,
  renderMilestoneStripHtml,
  PRESET_NUDGES
} from "../js/math/verified-milestones.js";
import { VAL_PRESETS } from "../js/ui/state.js";

test("VERIFIED_MILESTONES seeds FCC 248 and pending wholesale terms", () => {
  assert.ok(VERIFIED_MILESTONES.find((m) => m.id === "fcc-248" && m.status === "verified"));
  assert.ok(VERIFIED_MILESTONES.find((m) => m.id === "wholesale-terms" && m.status === "pending"));
  assert.ok(VERIFIED_MILESTONES.find((m) => m.id === "orbit-10" && m.status === "verified"));
});

test("applyVerifiedNudges applies FCC nudge to constellation248 when verified", () => {
  assert.ok(PRESET_NUDGES.constellation248);
  const nudged = applyVerifiedNudges("constellation248", VAL_PRESETS.constellation248);
  assert.equal(nudged.v_coverageFrac, PRESET_NUDGES.constellation248.v_coverageFrac);
});

test("renderMilestoneStripHtml includes status tags", () => {
  const html = renderMilestoneStripHtml(VERIFIED_MILESTONES.slice(0, 2));
  assert.match(html, /verified/);
  assert.match(html, /vm-item/);
});
