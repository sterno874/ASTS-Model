import test from "node:test";
import assert from "node:assert/strict";
import {
  MNO_PARTNERS,
  CATALYSTS,
  LAUNCH_EVENTS,
  COMMUNITY_DD,
  BEAR_CASE,
  COMMUNITY_THREADS,
  TOP_COMMUNITY_CONTRIBUTORS,
  REDDIT_ATTRIBUTION,
  layoutTimeline,
  packTimelineLanes,
  catalystsInYear,
  launchOrbitTotal,
  formatLaunchStatus,
  verdictMeta,
  tagClass,
  todayMarkerFrac
} from "../js/math/commercial.js";

test("MNO partners have primary source links and labels", () => {
  assert.ok(MNO_PARTNERS.length >= 8);
  assert.ok(MNO_PARTNERS.every((p) => p.source && p.source.startsWith("http")));
  assert.ok(MNO_PARTNERS.every((p) => p.sourceLabel && p.sourceLabel.length > 2));
  const att = MNO_PARTNERS.find((p) => p.name === "AT&T");
  assert.ok(att?.investor);
  assert.match(att.source, /sec\.gov/);
});

test("launch history is accurate with sources and orbit count", () => {
  assert.equal(LAUNCH_EVENTS.length, 5);
  const bb7 = LAUNCH_EVENTS.find((e) => /BlueBird 7/.test(e.sat));
  assert.equal(bb7.status, "lost");
  assert.equal(bb7.provider, "Blue Origin NG-3");
  const bb810 = LAUNCH_EVENTS.find((e) => /8–10/.test(e.sat));
  assert.equal(bb810.count, 3);
  assert.equal(bb810.date, "2026-06-17");
  assert.ok(LAUNCH_EVENTS.every((e) => e.source));
  assert.equal(launchOrbitTotal(), 10);
  assert.equal(formatLaunchStatus(bb7), "lost — insertion error");
});

test("layoutTimeline assigns non-overlapping lanes", () => {
  const { items, lanes } = layoutTimeline(CATALYSTS, 2026);
  assert.ok(items.length >= 2);
  assert.ok(lanes >= 1);
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.lane === b.lane) {
        const overlap = a.left < b.right && b.left < a.right;
        assert.ok(!overlap, `lane ${a.lane}: "${a.label}" overlaps "${b.label}"`);
      }
    }
  }
});

test("packTimelineLanes handles adjacent windows on same lane", () => {
  const packed = packTimelineLanes([
    { left: 0, width: 20, right: 20, label: "a" },
    { left: 25, width: 10, right: 35, label: "b" },
    { left: 10, width: 10, right: 20, label: "c" }
  ]);
  assert.equal(packed.items.find((x) => x.label === "a").lane, 0);
  assert.equal(packed.items.find((x) => x.label === "b").lane, 0);
  assert.equal(packed.items.find((x) => x.label === "c").lane, 1);
});

test("catalystsInYear includes multi-year windows", () => {
  const y2027 = catalystsInYear(2027);
  assert.ok(y2027.some((c) => c.id === "commercial-us"));
  assert.ok(y2027.some((c) => c.id === "continuous"));
  const y2028 = catalystsInYear(2028);
  assert.ok(y2028.some((c) => c.id === "248-fcc"));
});

test("COMMUNITY_DD and BEAR_CASE have verdict coverage", () => {
  const verdicts = new Set(COMMUNITY_DD.map((r) => r.verdict));
  assert.ok(verdicts.has("verified"));
  assert.ok(verdicts.has("rejected"));
  assert.ok(verdicts.has("partial"));
  assert.ok(BEAR_CASE.every((r) => r.verdict && r.tag));
  assert.ok(COMMUNITY_DD.some((r) => r.verdict === "rejected" && /5\.4B|3B/i.test(r.theme)));
});

test("verdictMeta and tagClass helpers", () => {
  assert.equal(verdictMeta("verified").icon, "✅");
  assert.equal(verdictMeta("rejected").cls, "val-no");
  assert.equal(tagClass("verified"), "f");
  assert.equal(tagClass("forward-looking"), "u");
});

test("Reddit attribution on community threads and contributors", () => {
  assert.ok(REDDIT_ATTRIBUTION.url.includes("reddit.com"));
  assert.ok(COMMUNITY_THREADS.filter((t) => t.reddit).length >= 4);
  assert.ok(TOP_COMMUNITY_CONTRIBUTORS.filter((c) => c.reddit).length >= 4);
});

test("todayMarkerFrac returns null outside current year", () => {
  assert.equal(todayMarkerFrac(2025, new Date("2026-07-04")), null);
  const frac = todayMarkerFrac(2026, new Date("2026-07-04"));
  assert.ok(frac >= 40 && frac <= 60);
});
