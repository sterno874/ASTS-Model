import test from "node:test";
import assert from "node:assert/strict";
import { overlapCoverageFraction, constellationTimeline, computeCoverageOrbit, US_COVERAGE_SOURCES, overlapHeuristicExplain, formatTimelineMonth } from "../js/math/coverage-orbit.js";
test("US 45-60", () => { assert.equal(US_COVERAGE_SOURCES.min, 45); assert.equal(US_COVERAGE_SOURCES.max, 60); });
test("heuristic", () => { assert.ok(overlapHeuristicExplain({ sats: 10 }).fPct > 0); });
test("timeline45", () => { assert.equal(constellationTimeline({ startSats: 10, milestones: [45] }).find((x) => x.milestone === 45).milestoneTag, "verified"); });
test("months", () => { assert.ok(computeCoverageOrbit({ sats: 10 }).monthsTo45 > 0); });
test("format", () => { assert.equal(formatTimelineMonth(0), "now"); });
test("overlap up", () => { assert.ok(overlapCoverageFraction(20) > overlapCoverageFraction(5)); });
