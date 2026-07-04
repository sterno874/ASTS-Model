# ASTS-Model

Interactive due-diligence explorer for **AST SpaceMobile (NASDAQ: ASTS)** — constellation scale, MNO commercial path, link-budget pedagogy, and scenario valuation with primary-source tags.

**Live:** [asts-model-phi.vercel.app](https://asts-model-phi.vercel.app/)  
**Research memo:** [RESEARCH.md](./RESEARCH.md)

## Tabs

1. **Constellation / Coverage** — satellites vs targets, capacity & wholesale revenue proxy, **launch Monte Carlo**
2. **Commercial / Catalysts** — MNO partners, launch history, catalyst calendar, **Kook Report** community DD panel
3. **Valuation** — EV, $/sh, comparables, **convertible dilution path**, dilution stress, runway
4. **Explain** — ELI5 → PhD with citations
5. **The Technology** — phased-array context + Friis link-budget sim + **coverage footprint**

## Phase 2 models

| Model | Purpose |
|-------|---------|
| Wholesale revenue build | MNO subs × penetration × ARPU × coverage |
| Launch Monte Carlo | Post-BB7 failure-rate stress to 45 sats |
| Convertible dilution | 10-K note table → FD shares at assumed price |
| Coverage footprint | Overlap heuristic + milestone timeline |
| Segment EV | P(commercial) risk-adjusted bull/base/bear |

```bash
npm test          # 86 tests
npm run test:mutation  # 100% mutation kill rate on core math
```

## Deploy (Vercel)

Connect this repo; `vercel.json` enables clean URLs. Production domain: `asts-model-phi.vercel.app`. Deploys `api/quote.js` as `/api/quote` — Yahoo Finance only, no API keys.

### Delayed stock quote (header strip)

Header shows **~$ASTS price**, **~$XM / ~$XB mkt cap**, and **vs mkt** upside when available. Labeled **Approx · delayed**. Polls every 5 min via serverless proxy (avoids browser CORS).

## Data tags

| Tag | Meaning |
|-----|---------|
| **verified** | SEC, FCC, IR, or major press with link |
| **partial** | Directionally true but incomplete |
| **community** | Reddit/Stocktwits — cross-check |
| **rejected** | Contradicted by primary sources |
| **model** | App assumption / slider |

## License

AGPL-3.0 — see [LICENSE](./LICENSE).

## Disclaimer

Not investment advice. Scenario sliders are educational. Verify all material facts against [SEC CIK 1780312](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312) and company IR before decisions.
