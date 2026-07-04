# ASTS-Model

Interactive due-diligence explorer for **AST SpaceMobile (NASDAQ: ASTS)** — constellation scale, MNO commercial path, link-budget pedagogy, and scenario valuation with primary-source tags.

**Live (placeholder):** [asts-model.vercel.app](https://asts-model.vercel.app/)  
**Research memo:** [RESEARCH.md](./RESEARCH.md)

## Tabs

1. **Constellation / Coverage** — satellites vs targets, capacity & wholesale revenue proxy
2. **Commercial / Catalysts** — MNO partners, launch history, catalyst calendar, community DD
3. **Valuation** — EV, $/sh, comparables, dilution stress, runway
4. **Explain** — ELI5 → PhD with citations
5. **The Technology** — phased-array context + Friis link-budget sim

## Quick start

```bash
# Static site — open index.html or:
npx serve .

npm test
```

## Deploy (Vercel)

Connect this repo; `vercel.json` enables clean URLs. Set production domain to `asts-model.vercel.app`.

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
