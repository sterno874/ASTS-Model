import test from "node:test";
import assert from "node:assert/strict";
import {
  parseQuotePayload,
  formatApproxPrice,
  formatApproxMarketCapM,
  buildQuoteMeta,
  computeVsMarketUpside,
  fetchLiveQuote,
  QUOTE_LABEL
} from "../js/ui/market-quote.js";
import { computeHeaderStrip, DEFAULT_STATE } from "../js/ui/state.js";
import { computeFullValuation } from "../js/math/valuation.js";
import { computeConstellationMetrics } from "../js/math/constellation.js";

test("parseQuotePayload accepts valid ASTS Yahoo quote", () => {
  const q = parseQuotePayload({
    symbol: "ASTS",
    price: 45.12,
    marketCapM: 11500,
    sharesOutstandingM: 256,
    source: "yahoo"
  });
  assert.equal(q.ok, true);
  assert.equal(q.price, 45.12);
});

test("computeHeaderStrip uses delayed quote for vs mkt", () => {
  const vm = computeFullValuation(DEFAULT_STATE.val);
  const cm = computeConstellationMetrics(DEFAULT_STATE.constellation);
  const live = { ok: true, price: 50, marketCapM: 12800, marketCapEstimated: false };
  const h = computeHeaderStrip(DEFAULT_STATE, vm, cm, live);
  assert.equal(h.refSource, "live");
  assert.equal(h.vsRefLabel, "vs mkt");
  assert.equal(h.mktCapM, 12800);
});

test("approx formatting and label", () => {
  assert.equal(formatApproxPrice(45.12), "~$45.12");
  assert.equal(formatApproxMarketCapM(11500), "~$11.5B");
  assert.equal(QUOTE_LABEL, "Approx · delayed");
  assert.match(buildQuoteMeta({ ok: true, marketCapM: 11500 }), /mkt cap ~\$11\.5B/);
});

test("fetchLiveQuote mocks fetch", async () => {
  const q = await fetchLiveQuote("ASTS", {
    fetchFn: async () => ({
      ok: true,
      json: async () => ({ symbol: "ASTS", price: 45, marketCapM: 11000, source: "yahoo" })
    })
  });
  assert.equal(q.ok, true);
});

test("computeVsMarketUpside", () => {
  const u = computeVsMarketUpside(5000, 11500);
  assert.ok(u.upsidePct < 0);
  assert.match(u.upsideLabel, /×/);
});
