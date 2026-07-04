/**
 * Vercel serverless quote proxy — Finnhub (FINNHUB_API_KEY) or Yahoo v8 chart fallback.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const symbol = String(req.query.symbol || "")
    .toUpperCase()
    .replace(/[^A-Z0-9.-]/g, "");
  if (!symbol) return res.status(400).json({ error: "symbol required" });

  const sharesM = parseFloat(req.query.sharesM);
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");

  const finnhubKey = process.env.FINNHUB_API_KEY;
  if (finnhubKey) {
    try {
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${finnhubKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${finnhubKey}`)
      ]);
      const quote = await quoteRes.json();
      const profile = profileRes.ok ? await profileRes.json() : {};
      if (Number.isFinite(quote.c) && quote.c > 0) {
        return res.status(200).json({
          symbol,
          price: quote.c,
          previousClose: quote.pc,
          changePct: quote.dp,
          marketCapM: profile.marketCapitalization ?? null,
          marketCapEstimated: false,
          currency: profile.currency || "USD",
          asOf: quote.t ? new Date(quote.t * 1000).toISOString() : new Date().toISOString(),
          source: "finnhub"
        });
      }
    } catch (err) {
      console.error("Finnhub quote error:", err);
    }
  }

  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      "?range=1d&interval=1d";
    const yRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ASTS-Model/1.0)" }
    });
    const data = await yRes.json();
    const meta = data?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    if (!Number.isFinite(price) || price <= 0) return res.status(502).json({ error: "No quote data" });
    const prev = meta.chartPreviousClose ?? meta.previousClose ?? null;
    let marketCapM = null;
    let marketCapEstimated = false;
    if (Number.isFinite(sharesM) && sharesM > 0) {
      marketCapM = Math.round(price * sharesM);
      marketCapEstimated = true;
    }
    return res.status(200).json({
      symbol,
      price,
      previousClose: prev,
      changePct: prev ? ((price - prev) / prev) * 100 : null,
      marketCapM,
      marketCapEstimated,
      currency: meta.currency || "USD",
      asOf: meta.regularMarketTime
        ? new Date(meta.regularMarketTime * 1000).toISOString()
        : new Date().toISOString(),
      source: "yahoo"
    });
  } catch (err) {
    console.error("Yahoo quote error:", err);
    return res.status(502).json({ error: "Upstream quote failed" });
  }
}
