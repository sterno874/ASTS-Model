# AST SpaceMobile (ASTS) — Due Diligence Memo

**As of:** 4 Jul 2026  
**Ticker:** **ASTS** — AST SpaceMobile, Inc. (NASDAQ)  
**CIK:** [0001780312](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312)  
**IR:** [ast-science.com](https://ast-science.com/)  
**Disclaimer:** Educational research for the ASTS-Model app. Not investment, legal, engineering, or telecom advice. Claims tagged **verified** / **partial** / **community** / **rejected** / **model** with links where possible.

---

## Executive summary

AST SpaceMobile is building a **space-based cellular broadband** network that connects **directly to unmodified smartphones** using large LEO **BlueBird** satellites with phased-array antennas. Unlike a traditional MVNO, AST partners with **mobile network operators (MNOs)** — AT&T, Verizon, Vodafone, Rakuten, Bell, Telus, stc, and ~60 agreements covering **3B+ subscribers** — to use partner-licensed **low-band spectrum** under **Supplemental Coverage from Space (SCS)** rules.

**Jul 2026 status:** ~**10 operational spacecraft** (BlueWalker 3 test + BlueBird 1–5 Block 1 + BlueBird 6 + BlueBirds 8–10); **BlueBird 7 lost** to low-orbit insertion (Apr 2026, insured). **FCC authorized 248 satellites** + commercial SCS (Order **DA 26-391**, Apr 2026). Company targets **~45 satellites in orbit during 2026** and **45–60 for continuous US coverage**. Initial commercial service guided toward **2027**.

**Bull case (verified elements):** Differentiated large-aperture D2D architecture; deep MNO strategic alignment (including carrier investors); FCC milestone; demonstrated peak speeds (Block 1 **98.9 Mbps**, Block 2 target **~200 Mbps**); **~$3.46B cash** (Mar 31, 2026); in-house manufacturing scale (500k sq ft Midland); 3,900+ patent claims.

**Bear case (verified elements):** Pre-scale consumer broadband revenue; **capital intensity** (Q1 investing ~$379M); **dilution** (diluted shares ~81.8M → **256M** FY2023–25); **~$2.2B+ convertibles**; launch-provider risk (BB7); **SpaceX Starlink D2D** competition; wholesale economics undisclosed; astronomy/interference FCC conditions.

---

## Company overview & business model

| Field | Value | Tag | Source |
|-------|-------|-----|--------|
| Legal name | AST SpaceMobile, Inc. | verified | [SEC CIK](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312) |
| Founded | 2017 | verified | Company IR |
| HQ | Midland, Texas (+ global ops) | verified | IR / 10-K |
| CEO | Abel Avellan (founder) | verified | SEC filings |
| Employees | 2,250+ (company cite) | verified | [Business Wire Jun 2026](https://www.businesswire.com/news/home/20260617420856/en/) |
| Manufacturing | ~500,000 sq ft | verified | SatNews / IR |
| Model | **Wholesale** capacity to MNOs + gov gateways | verified | IR, FCC SCS framing |
| Not | Consumer MVNO in most markets | verified | IR partnership structure |

### Revenue path (how money is supposed to flow)

1. **MNO wholesale:** Carriers buy satellite capacity / rev-share for coverage extension (dead zones, rural, emergency, maritime, aviation-adjacent). Consumer pricing set by **MNO**, not AST.
2. **Gateway & engineering:** Q3 2025 / Q1 2026 revenue included **gateway hardware** and **US government milestone** payments — **verified** partial revenue, not mass-market phone service.
3. **Government / defense:** FirstNet / public-safety adjacency via AT&T relationship — **partial** (trials and milestones; scale unverified).

**Community error (rejected):** “$3/month × 3 billion subscribers = $5.4B revenue to AST.” Even if consumer ARPU were $3, AST receives a **wholesale fraction**, only a **subset** of subs use space layer, and penetration ramps over years — not 100% attach day one.

---

## Technology deep dive

### Architecture: direct-to-cell (D2D)

Standard phones transmit ~23 dBm with **0 dBi** effective handset antenna gain. Terrestrial towers are close; LEO at ~550 km imposes **~150+ dB** free-space path loss at 700–800 MHz. AST’s approach: put **very large phased arrays in space** (high EIRP + beamforming gain) and use **MNO-licensed low-band** spectrum so phones use existing cellular chipsets where SCS rules allow.

| Generation | Array size | Peak demo speed | Status | Tag | Source |
|------------|------------|-----------------|--------|-----|--------|
| BlueWalker 3 | Test sat | 4G/5G calls; ~14 Mbps demos | Operational testbed | verified | IR / FCC experimental |
| Block 1 (BB1–5) | ~64 m² | **98.9 Mbps** peak DL | 5 sats launched Sep 2024 | verified | Company PR |
| Block 2 (BB6+) | **~223 m²** (~2,400 sq ft) | **~200 Mbps** peak target | BB6 + BB8-10 operational | verified | [SpaceNews](https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/) · [SatNews Jun 2026](https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/) |

**Partial:** Peak lab/demo speeds ≠ sustained sector throughput under loaded beams.

### Link budget (simplified)

Educational Friis model (see ASTS-Model Technology tab):

- `PL(dB) = 20 log₁₀(4πd/λ)` with slant range `d` from elevation angle and altitude.
- **Array gain** scales ~with aperture; Block 2 ≈ 3.5× Block 1 area → ~**5 dB** extra gain (model).
- Link closes when `P_rx ≥ sensitivity`; broadband QoS also needs **C/(N+I)**, beam scheduling, Doppler compensation, and core network integration — not captured in a one-line budget.

### Spectrum & regulatory

| Item | Detail | Tag | Source |
|------|--------|-----|--------|
| US spectrum model | **700 / 800 MHz** low-band via **MNO partners** (SCS) | verified | [DCD](https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/) |
| FCC NGSO auth | Up to **248** satellites | verified | [FCC DA 26-391](https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system) |
| Conditions | Interference, debris, NSF/NRAO coordination | verified | FCC order |
| Ex-US | Requires local approvals | verified | FCC / IR |

### Constellation & coverage

| Metric | Value | Tag | Source |
|--------|-------|-----|--------|
| FCC limit | 248 sats | verified | FCC |
| Continuous coverage (US) | **45–60** sats | verified | [SpaceNews Apr 2026](https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/) |
| 2026 target | **~45** in orbit | forward-looking | Company / SpaceNews |
| Launch cadence 2026 | ~every 1–2 months | forward-looking | IR post-FCC |
| Multi-launch | Stacked BB8-10 on Falcon 9 | verified | [Business Wire Jun 2026](https://www.businesswire.com/news/home/20260617420856/en/) |

### Launch history & risks

| Mission | Date | Provider | Outcome | Tag |
|---------|------|----------|---------|-----|
| BlueWalker 3 | Sep 2022 | SpaceX F9 | Success — test program | verified |
| BlueBird 1–5 | Sep 2024 | SpaceX F9 | Success — Block 1 | verified |
| BlueBird 6 | Dec 2025 | ISRO LVM3 | Success — first Block 2 | verified |
| BlueBird 7 | Apr 2026 | Blue Origin NG-3 | **Lost** — low orbit insertion | verified |
| BlueBird 8–10 | Jun 17 2026 | SpaceX F9 | Success — stacked deploy | verified |

**Verified:** BB7 failure was **launch vehicle insertion**, not payload power-on failure alone; insurance recovery expected per SEC filings cited in press.

---

## Pipeline / catalyst calendar

| Window | Catalyst | Tag | Source |
|--------|----------|-----|--------|
| Jul–Sep 2026 | BlueBirds 11–13 launch | forward-looking | Jun 2026 PR |
| Q4 2026 | ~45 sats in orbit | forward-looking | Company |
| H1 2027 | Initial US commercial service | forward-looking | Industry press / IR |
| 2027–2028 | Continuous coverage 45–60 sats | partial | SpaceNews |
| 2028+ | Scale toward 248 FCC cap | partial | FCC |

---

## Financials & capital structure

### Liquidity & burn (latest anchors)

| Item | Value | Period | Tag | Source |
|------|-------|--------|-----|--------|
| Cash & equivalents | **~$3.46B** | Mar 31, 2026 | verified | Q1 2026 10-Q (via IR summaries) |
| Prior cash | ~$1.2B | Sep 30, 2025 | verified | Q3 2025 10-Q |
| Q1 revenue | **$14.7M** | Q1 2026 | verified | 10-Q |
| Q1 net loss | **~$191M** | Q1 2026 | verified | 10-Q |
| Q1 op cash used | **~$48M** | Q1 2026 | verified | 10-Q |
| Q1 investing cash used | **~$379M** | Q1 2026 | verified | 10-Q (satellite CapEx) |
| Long-term debt | **~$698M** | Sep 30, 2025 | verified | Q3 2025 10-Q |

### Share count & dilution

| Item | Detail | Tag | Source |
|------|--------|-----|--------|
| Diluted shares FY2025 | **~256M** | verified | FY2025 10-K / analyses |
| FY2023 diluted | ~81.8M | verified | [MetricDuck 10-K analysis](https://www.metricduck.com/blog/asts-10k-analysis-revenue-backlog-funding-clock) |
| Convertible notes | **~$2.22B** outstanding (conversion rights) | verified | 10-K |
| Unvested equity awards | ~$173M | verified | 10-K |
| ATM / shelf | Active equity issuance pipeline | partial | 10-Q / 8-K |

**Partial:** “Fully funded to 248 sats” — cash is substantial but **CapEx + dilution** remain; convertibles and ATM can expand share count materially.

### Warrants & insider activity

Community tracks **Form 4** sales by executives (Q3 2025–Q1 2026). **Partial verdict:** disclosed sales ≠ fraud; can reflect 10b5-1, tax, diversification — check plan filings on SEC.

---

## Competitive landscape

| Competitor | Approach | vs AST | Tag |
|------------|----------|--------|-----|
| **SpaceX Starlink D2C** | Many small sats; T-Mobile US spectrum | Scale + launch cost advantage; different RF architecture | verified |
| **Lynk / Omnispace** | Smaller satellites; MSS / adj bands | Overlapping D2D narrative; different spectrum strategy | partial |
| **Apple / Globalstar** | Emergency SOS narrowband | Not broadband competitor today | verified |
| **Iridium NTN** | IoT / narrowband partnerships | Adjacent, not identical use case | verified |

**Community debate (partial):** “Starlink kills AST.” Starlink is a formidable competitor, but MNO partnerships and AST’s large-aperture approach are **differentiated** — outcome unproven.

---

## Community DD (Reddit & retail)

### Primary hub: r/ASTSpaceMobile

- **50+ daily discussion threads** (automated daily thread format).
- Deep tracking of **launch schedules**, **FCC filings**, **TLE/satellite position**, **Form 4**, **convertible notes**.
- Launch meetups and live webcast threads (e.g., BB8-10 Jun 2026).

### Top contributors & personas (identified)

| Persona | Role | Notes | Tag |
|---------|------|-------|-----|
| **u/TheKook** | Anonymous bullish “mascot”; morale + memes | “Kook Bottom” sentiment marker | community |
| **Daily thread mods** | Pinned calendars, rules | Primary aggregation | community |
| **Technical trackers** | FCC/TLE/SEC parsing | High signal when citing primary docs | community |
| **r/stocks / WSB** | Dilution skeptics | Cross-check vs 10-Q | community |
| **Stocktwits $ASTS** | Real-time launch sentiment | Temperature only | community |

### Recurring bull theses

1. **MNO alignment** — AST partners with carriers instead of competing (AT&T, Verizon, Vodafone investors).
2. **Coverage TAM** — dead zones, rural, emergency, FirstNet adjacency.
3. **Technology moat** — largest commercial comm arrays in LEO; patent wall.
4. **FCC approval** — regulatory de-risking for US market.
5. **Cash runway** — post-raise balance sheet vs early-stage space cos.

### Common errors (community vs primary)

| Claim | Verdict | Correction |
|-------|---------|------------|
| $3/mo × 3B = $5.4B to AST | **rejected** | Wholesale share; partial attach; ramp |
| FCC approval = revenue now | **rejected** | Deployment + integration still required |
| 200 Mbps for every user always | **rejected** | Peak demo; shared beam capacity |
| BB7 = satellite design failure | **rejected** | Launch insertion anomaly |
| 60 MOUs = locked revenue | **partial** | Commercial terms largely undisclosed |
| “Fully funded, no dilution” | **partial** | Convertibles + ATM + CapEx |

### Bear threads (valid scrutiny)

- Convertible note overhang and warrant volatility.
- Insider sales clusters.
- Starlink D2C speed to market.
- Launch cadence slip risk after BB7.
- Astronomy / interference regulatory friction.

---

## Bull / bear synthesis

### Bull case (scorecard)

| Driver | Strength | Tag |
|--------|----------|-----|
| MNO partnerships & spectrum access | High | verified |
| FCC 248-sat authorization | High | verified |
| Demonstrated Mbps progression B1→B2 | Medium | verified |
| Cash vs peers | High | verified |
| Manufacturing vertical integration | Medium | partial |

### Bear case (scorecard)

| Risk | Severity | Tag |
|------|----------|-----|
| Dilution / convertibles | High | verified |
| Launch & deployment | High | verified |
| Starlink competition | High | verified |
| Wholesale economics opacity | Medium | verified |
| Valuation ahead of commercial proof | Medium | community + market |

---

## Primary source index

| Type | Link |
|------|------|
| SEC EDGAR | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312 |
| FCC order DA 26-391 | https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system |
| Jun 2026 launch PR | https://www.businesswire.com/news/home/20260617420856/en/ |
| SpaceNews FCC + coverage | https://spacenews.com/fcc-clears-ast-spacemobile-constellation-as-launch-setback-clouds-ramp-up/ |
| Spaceflight Now BB8-10 | https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/ |
| SatNews Block 2 | https://satnews.com/2026/06/17/direct-to-device-momentum-ast-spacemobile-successfully-launches-giant-next-gen-bluebird-satellites-atop-spacex-falcon-9/ |
| Reddit hub | https://www.reddit.com/r/ASTSpaceMobile/ |
| MetricDuck 10-K analysis | https://www.metricduck.com/blog/asts-10k-analysis-revenue-backlog-funding-clock |

---

## Honest limitations (research & model)

- Wholesale **rev-share rates** and **consumer pricing** are not fully disclosed — revenue models use **assumption sliders**.
- **Orbital coverage** modeled linearly; real continuity needs simulation of planes, inclination, and elevation masks.
- **Link budget** in app is educational Friis only — not AST proprietary RF planning.
- **Market price** not fetched live; ref $/sh is illustrative.
- Reddit attribution is **sentiment & thesis tracking**, not verified financial data.

---

## Kook Report deep dive (Phase 2)

### Who is "The Kook"?

**@thekookreport** (X/Twitter) publishes weekly **"$ASTS WEEK IN REVIEW"** threads — the closest thing r/ASTSpaceMobile has to a recurring community DD newsletter. Bloomberg (May 2026) profiled the anonymous figure as the unofficial "morale engine" of the **SpaceMob** retail community. The subreddit also uses **"Kook Bottom"** slang: when The Kook panics during a selloff, some treat it as a contrarian bullish marker — **community sentiment only**, not a valuation input.

| Item | Detail | Tag |
|------|--------|-----|
| Platform | X / Thread Reader App | community |
| Reddit presence | u/TheKook search returns limited posts; primary content is X | community |
| Influence | High on sentiment; mixed on primary-source rigor | community |
| Weekly format | Regulatory sweep + launch calendar + macro FUD rebuttal | community |

**Source:** [Thread Reader — Apr 20 2026 weekly](https://threadreaderapp.com/thread/1914063374180323818.html) · [Bloomberg May 2026](https://www.bloomberg.com/news/features/2026-05-08/spacex-rival-ast-spacemobile-asts-proves-meme-stock-mania-is-back)

### Kook Report claims — full verification matrix

| # | Kook claim (paraphrased) | Verdict | Primary check | Source |
|---|--------------------------|---------|---------------|--------|
| 1 | Launch cadence accelerating (SpaceX + Blue Origin) | **partial** | BB8-10 SpaceX Jun 2026 verified; BB7 Blue Origin insertion loss Apr 2026 verified; future mix forward-looking | [Thread Reader Apr 2026](https://threadreaderapp.com/thread/1914063374180323818.html) |
| 2 | BlueBirds 11–13 launch Jul–Sep 2026 | **partial** | Company PR post-BB8-10 — not launched as of Jul 4 2026 | [Business Wire Jun 2026](https://www.businesswire.com/news/home/20260617420856/en/) |
| 3 | DoD / Golden Dome / gov revenue pipeline | **partial** | Q1/Q3 gateway + gov milestones in 10-Q verified; defense scale undisclosed | 10-Q |
| 4 | FirstNet / AT&T public-safety wedge | **partial** | AT&T partnership + 13D stake verified; FirstNet scale not quantified in SEC | 10-K / 13D |
| 5 | Vodafone EU / MEP SatCo briefing | **partial** | Vodafone partnership verified (IR); MEP briefing not in SEC | IR |
| 6 | Google partnership unlocks distribution | **partial** | Agreement on IR; rev-share terms undisclosed | IR |
| 7 | Ligado DA signed — spectrum unlock | **verified** | 10-K Ligado transaction + up to 45 MHz mid-band access (conditions apply) | [10-K](https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf) |
| 8 | FCC DA 26-391 = last US hurdle | **partial** | 248-sat + SCS authorized; ongoing compliance conditions remain | [FCC DA 26-391](https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system) |
| 9 | AST orbital debris/ozone << Starlink | **model** | Community calc via Kevin Coulton thread — not AST IR | Thread Reader |
| 10 | Midland 500k sq ft proves manufacturing scale | **partial** | Facility cited in IR; 248-sat production scale unproven | Business Wire |
| 11 | M&A / buyout inevitable | **rejected** | No offer; AT&T 13D ~2.7% stake verified but not control | SEC 13D |
| 12 | "Fully funded, no dilution" | **rejected** | Convertibles ~$2.2B+, ATM Oct 2025, shares 81.8M→256M | 10-K |
| 13 | 200 Mbps everywhere | **rejected** | Peak demo target; shared beam capacity | SatNews |
| 14 | FCC approval = revenue now | **rejected** | Deployment + integration still required; Q1 rev = gateway/gov | 10-Q |
| 15 | Starlink D2C makes AST obsolete | **partial** | Real competition; different architecture — outcome unproven | Industry |
| 16 | "Kook Bottom" = buy signal | **rejected** | Meme sentiment marker only — not valuation input | Bloomberg May 2026 |

**Matrix stats (Jul 2026):** 1 verified · 9 partial · 1 model · 5 rejected — out of 16 tracked claims.

**Usage guidance:** Treat rows 1–6 and 9–10 as **catalyst pointers** worth verifying each week against SEC 8-K and launch manifests. Rows 11–13 and 16 are **recurring errors** — safe to down-weight in revenue models.


---

## Patents & intellectual property

| Item | Value | Tag | Source |
|------|-------|-----|--------|
| Patent families worldwide | **36** | verified | FY2025 10-K |
| Patent + pending claims | **~3,700–3,900** | verified | 10-K / IR (count varies by filing date) |
| Granted / allowed | **~1,700** | verified | 10-K Jun 30 2025 cite |
| Core themes | Phased-array aperture, deployable structures, D2D ecosystem space-to-Earth | verified | 10-K |
| Inventor concentration | Abel Avellan + AST engineering team (multiple families) | partial | USPTO assignee search "AST SpaceMobile" |
| Assignee entity | AST & Science, LLC (predecessor) / AST SpaceMobile, Inc. | verified | USPTO records |

**Honest limit:** Patents support IP moat narrative but do **not** guarantee commercial success, freedom-to-operate vs Starlink/Lynk, or wholesale pricing power.

### USPTO assignee search portals

| Portal | URL | Notes |
|--------|-----|-------|
| Google Patents (assignee) | [AST SpaceMobile](https://patents.google.com/?assignee=AST+SpaceMobile) | Broad assignee search |
| Google Patents (legacy) | [AST & Science LLC](https://patents.google.com/?assignee=AST+%26+Science+LLC) | Pre-merger filings |
| USPTO Patent Public Search | [patentcenter.uspto.gov](https://patentcenter.uspto.gov/) | Official grant lookup |
| Justia assignee index | [AST & Science, LLC](https://patents.justia.com/assignee/ast-science-llc) | Browseable grant list |

### Representative granted patents (USPTO links)

| US Patent | Title (short) | Grant date | Theme | USPTO link |
|-----------|---------------|------------|-------|------------|
| **US 9,973,266** | Fractionated HTFS — large aperture from small sats | May 2018 | Core architecture | [Google Patents](https://patents.google.com/patent/US9973266) |
| **US 10,877,854** | Deployable phased-array satellite | Dec 2020 | Structure / aperture | [Google Patents](https://patents.google.com/patent/US10877854) |
| **US 11,683,009** | Solar + RF radiator for space array | Jun 2023 | Power / thermal | [Google Patents](https://patents.google.com/patent/US11683009) |
| **US 12,060,468** | Compensating oscillations in large-aperture array | Jun 2024 | Beam stability | [Google Patents](https://patents.google.com/patent/US12060468) |
| **US 12,166,568** | Phase array routing connectivity | Dec 2024 | Distributed routing | [Google Patents](https://patents.google.com/patent/US12166568) |
| **US 12,143,197** | Geolocation via spaceborne phased arrays | Nov 2024 | RF geolocation | [Google Patents](https://patents.google.com/patent/US12143197) |
| **US 12,155,608** | Dynamic TDD for satellite RAN | Nov 2024 | 3GPP integration | [Google Patents](https://patents.google.com/patent/US12155608) |
| **US 12,200,508** | Adaptive taper selection for beamforming | Jan 2025 | Interference mgmt | [Google Patents](https://patents.google.com/patent/US12200508) |
| **US 12,237,908** | Network access management (wide beam → active) | Feb 2025 | D2D access protocol | [Google Patents](https://patents.google.com/patent/US12237908) |
| **US 12,250,062** | Inactive/active beam transition in sat RAN | Mar 2025 | Beam handoff | [Google Patents](https://patents.google.com/patent/US12250062) |
| **US 12,261,678** | AOCS planarity for digital beamforming | Mar 2025 | Attitude control | [Google Patents](https://patents.google.com/patent/US12261678) |
| **US 12,263,962** | Momentum/reaction wheels for flat arrays | Apr 2025 | Spacecraft bus | [Google Patents](https://patents.google.com/patent/US12263962) |
| **US 12,267,116** | Mutual coupling calibration (OFDM-BPSK) | Apr 2025 | Array calibration | [Google Patents](https://patents.google.com/patent/US12267116) |
| **US 12,606,322** | Solar electronic RF radiator (continuation) | Apr 2026 | Block 2 hardware | [Google Patents](https://patents.google.com/patent/US12606322) |
| **D1,037,220** | Satellite antenna array (design) | Jul 2024 | Industrial design | [Google Patents](https://patents.google.com/patent/USD1037220) |

### Pending applications (selected)

| Publication | Title (short) | Filed | Theme | Link |
|-------------|---------------|-------|-------|------|
| **US 2025/0119203** | HTFS flight formations for D2D | Jul 2024 | Constellation scaling | [Google Patents](https://patents.google.com/patent/US20250119203) |
| **US 2025/0119204** | SATCOM GSM direct to phones | Aug 2024 | Legacy handset support | [Google Patents](https://patents.google.com/patent/US20250119204) |

### Patent theme clusters (for DD)

| Cluster | What it protects | Commercial relevance | Tag |
|---------|------------------|----------------------|-----|
| **Fractionated aperture** | Many small modules → one large phased array | Core BlueBird architecture | verified |
| **Beamforming / calibration** | Mutual coupling, adaptive taper, oscillation compensation | Link budget / interference | verified |
| **Satellite RAN / 3GPP** | DTDD, beam transition, network access mgmt | MNO integration path | verified |
| **Spacecraft bus** | AOCS, reaction wheels, solar-RF co-design | Deployment reliability | verified |
| **Geolocation** | Doppler + TOF from spaceborne arrays | Gov / emergency use cases | partial |

**Cross-check note:** Patent counts in IR (3,900+) include **pending** claims globally; granted US count is a subset. Competitors (SpaceX, Lynk) have their own D2D portfolios — FTO disputes are possible but none disclosed in 10-K as material litigation as of FY2025.


---

## SEC EDGAR — filing index & capital structure (Phase 2)

### SEC filing table (CIK 0001780312)

| Filing | Period / date | Key contents | Tag | Link |
|--------|---------------|--------------|-----|------|
| **10-K** (FY2025) | Year ended Dec 31 2025 | Audited financials; convertible notes; Ligado; patent count; risk factors | verified | [SEC PDF](https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf) |
| **10-Q** (Q1 2026) | Quarter ended Mar 31 2026 | Cash ~$3.46B; revenue $14.7M; net loss ~$191M; CapEx ~$379M investing | verified | [SEC filing](https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/) |
| **10-Q** (Q3 2025) | Quarter ended Sep 30 2025 | Prior cash ~$1.2B; long-term debt ~$698M | verified | [SEC EDGAR](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=10-Q&dateb=&owner=include&count=40) |
| **8-K** (BB7 anomaly) | Apr 2026 | Launch insertion failure disclosure; insurance | verified | [SEC EDGAR 8-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=8-K&dateb=&owner=include&count=40) |
| **8-K** ($575M notes) | Jul 2025 | Convertible senior notes pricing / close | verified | [Business Wire](https://www.businesswire.com/news/home/20250729408729/en/) |
| **S-3 / ATM** | Oct 2025 | Shelf / at-the-market equity program | verified | [SEC EDGAR S-3](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=S-3&dateb=&owner=include&count=20) |
| **DEF 14A** | 2026 proxy season | Exec comp; board; shareholder proposals | partial | [SEC EDGAR DEF 14A](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=DEF+14A&dateb=&owner=include&count=10) |
| **Form 4** cluster | Q3 2025 – Q1 2026 | Insider sales / option exercises | verified | [SEC Form 4 search](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=4&dateb=&owner=include&count=40) |
| **Schedule 13D** (AT&T) | 2025–2026 | ~2.7% beneficial ownership | partial | Community-parsed; verify on EDGAR |
| **EX-99 / IR 8-K** | Various | Launch milestones, partnership PR exhibits | partial | [SEC EDGAR 8-K](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312&type=8-K&dateb=&owner=include&count=40) |

**EDGAR master index:** [browse-edgar CIK 1780312](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312)

### Share count evolution

| Period | Diluted shares (approx) | Tag | Source |
|--------|-------------------------|-----|--------|
| FY2023 | ~81.8M | verified | 10-K / MetricDuck analysis |
| FY2025 | ~256M | verified | FY2025 10-K |
| Mar 31 2026 | Class A ~298.5M + Class B ~11.2M + Class C ~78.2M | verified | Q1 2026 10-Q equity footnote |

### Convertible notes (verified anchors)

| Instrument | Principal | Conv. price (eff.) | Maturity | Tag |
|------------|-----------|-------------------|----------|-----|
| 4.25% Convertible Senior Notes | ~$460M | ~$120.12/sh | 2032 | verified |
| 2.375% Convertible Senior Notes | ~$575M | ~$120.12/sh | 2032 | verified |
| 2.00% Convertible Senior Notes | ~$1.0B | ~$85/sh | 2036 | verified |

**Jul 2025 PR:** [Business Wire — $575M notes close](https://www.businesswire.com/news/home/20250729408729/en/) — Abel Avellan quote; effective conversion ~$120.12 cited.

### Cash vs CapEx vs GAAP loss (Q1 2026) — do not conflate

| Line item | Q1 2026 | Tag | Notes |
|-----------|---------|-----|-------|
| Cash & equivalents | ~$3.46B | verified | Liquidity anchor |
| Revenue | $14.7M | verified | Gateway + gov milestones, not mass D2C |
| Net loss | ~$191M | verified | GAAP bottom line |
| Net cash used in **operations** | ~$48M | verified | Structural opex burn |
| Net cash used in **investing** | ~$379M | verified | Satellite CapEx — dominant cash use |
| Long-term debt | ~$698M | verified | Sep 2025 10-Q carry-forward |

**Rejected error:** "Cash $3.46B = fully funded to 248 sats with no dilution." CapEx + convertibles + ATM can still expand share count materially.

---

## FCC & regulatory (expanded)

### FCC orders & filings table

| ID / docket | Date | Type | Summary | Tag | Source |
|-------------|------|------|---------|-----|--------|
| **DA 26-391** | Apr 21 2026 | Order | Authority for up to **248** NGSO satellites + commercial **SCS** | verified | [FCC](https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system) |
| **IBFS / NGSO mod** | 2024–2026 | Application | Constellation modification requests leading to 248 cap | verified | [FCC IBFS](https://licensing.fcc.gov/myibfs/) |
| **Experimental (BW3)** | 2022–2024 | Special temporary authority | BlueWalker 3 test campaign | verified | FCC experimental records |
| **SCS framework** | 2024+ | Rulemaking context | AST uses **partner MNO spectrum** (700/800 MHz) — not nationwide cellular license | verified | [DCD](https://www.datacenterdynamics.com/en/news/fcc-gives-ast-spacemobile-the-go-ahead-to-launch-satellite-broadband-service/) |
| **Interference conditions** | Apr 2026 | Order conditions | Protection of terrestrial networks, NGSO coordination | verified | DA 26-391 |
| **Debris mitigation** | Apr 2026 | Order conditions | Post-mission disposal, collision avoidance | verified | DA 26-391 |
| **NSF / NRAO coordination** | Apr 2026 | Order conditions | Radio astronomy protection requirements | verified | DA 26-391 |
| **Starlink D2C (SpaceX)** | 2024+ | Competing filing | T-Mobile spectrum D2D — overlapping market | verified | SpaceX FCC IBFS |
| **ITU / ex-US** | Ongoing | Filings per market | Separate approvals per country | verified | 10-K risk factors |
| **Ligado coordination** | 2025+ | Spectrum adjacency | Mid-band access subject to Ligado DA terms | partial | 10-K |

### Regulatory summary matrix

| Item | Detail | Tag | Source |
|------|--------|-----|--------|
| **DA 26-391** (Apr 2026) | Authority for up to **248** NGSO satellites + commercial SCS | verified | [FCC](https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system) |
| Conditions | Interference protection, debris mitigation, NSF/NRAO coordination | verified | FCC order |
| SCS framework | AST uses **partner MNO spectrum** (700/800 MHz low-band) — not AST-owned nationwide cellular license | verified | DCD / FCC |
| ITU / ex-US | Separate approvals required per market | verified | 10-K risk factors |
| Starlink D2C | Competing D2D via T-Mobile spectrum — different architecture | verified | SpaceX FCC filings |
| Lynk / Omnispace | Adjacent D2D / MSS players | partial | Industry status varies |


---

## Competitor snapshot

| Name | Architecture | US spectrum path | vs AST | Tag |
|------|--------------|------------------|--------|-----|
| **SpaceX Starlink D2C** | Many small LEO sats | T-Mobile partnership | Scale + launch cost; overlapping D2D | verified |
| **Lynk Global** | Smaller satellites | MSS / carrier deals | Overlapping narrative, less aperture | partial |
| **Omnispace** | S-band MSS | ITU priority rights | Spectrum strategy differs | partial |
| **Apple / Globalstar** | Emergency SOS | Narrowband | Not broadband competitor | verified |
| **Iridium NTN** | IoT / narrowband | Partner integrations | Adjacent | verified |

---

## Community DD — contributor scorecard (Phase 2)

### Scoring methodology

Contributors ranked on: (1) **primary-source citation rate**, (2) **correction responsiveness**, (3) **revenue-math accuracy**, (4) **recency** (Q2–Q3 2026 activity). Tiers: **helpful** (≥3/4), **mixed** (2/4), **misleading** (≤1/4). This is subjective community DD — not endorsement.

### Top 3 helpful (evidence-based)

| Rank | Contributor | Why helpful | Best use | Caveat |
|------|-------------|-------------|----------|--------|
| **1** | **u/hyeonk** | Frequent posts with primary links (Vodafone, AT&T 13D, Google agreement, FCC docket refs) | Partner news + filing alerts | Still verify deal **terms** vs headline |
| **2** | **u/EducatedFool1** | Milestone summaries tied to IR launches and integration timelines | Launch catalyst prep | Not a substitute for reading 10-Q footnotes |
| **3** | **r/ASTSpaceMobile mods + DD flair** | Daily aggregation, pinned calendars, launch meetup coordination | Hub for "what happened this week" | Comments section still has revenue math errors |

**Honorable mention:** Technical TLE/FCC parsers (anonymous accounts) — high signal when linking `.fcc.gov` or `.sec.gov` directly; low signal when speculating on defense contract $.

### Bottom 3 misleading (evidence-based)

| Rank | Source | Pattern | Typical error | Correction |
|------|--------|---------|---------------|------------|
| **1** | **Stocktwits $ASTS** | Launch-hype temperature | "$3×3B=$5.4B" revenue, FCC=profit | Wholesale fraction; deployment still required |
| **2** | **WSB / meme threads** | Cash screenshot → "no dilution" | Ignores convertibles + Q1 investing $379M | Read 10-K debt footnote + ATM |
| **3** | **Anonymous bull spam** | "200 Mbps day one" + "fully funded" | Peak demo ≠ SLA; cash ≠ zero CapEx | Block 2 peak is demo; CapEx dominates cash use |

### Mixed tier (use with filters)

| Contributor | Role | When useful | When to ignore |
|-------------|------|-------------|----------------|
| **@thekookreport (The Kook)** | Weekly regulatory sweep + morale | Catalyst calendar, FCC experimental pointers | M&A, Golden Dome windfall, mcap TAM threads |
| **r/stocks cross-posts** | Dilution skepticism | Stress-test bull thesis | Often stale share counts — verify 10-Q |

### Kook Report role

Useful for **catalyst calendar** and **regulatory pointer** (FCC experimental, lobbying filings). Treat **M&A**, **Golden Dome windfall**, and **TAM=$200B mcap** threads as **unverified** until in SEC 8-K or IR.

**Reddit search shortcuts:**

| Topic | Search URL |
|-------|------------|
| u/hyeonk posts | [reddit search](https://www.reddit.com/r/ASTSpaceMobile/search/?q=author%3Ahyeonk&restrict_sr=1) |
| Dilution threads | [reddit search](https://www.reddit.com/r/ASTSpaceMobile/search/?q=dilution&restrict_sr=1) |
| FCC parsing | [reddit search](https://www.reddit.com/r/ASTSpaceMobile/search/?q=FCC&restrict_sr=1) |
| Kook Report refs | [Thread Reader](https://threadreaderapp.com/user/thekookreport) |


---

## Modeling techniques implemented (ASTS-Model Phase 2)

| Technique | Tab | Decision value |
|-----------|-----|----------------|
| **Constellation coverage + wholesale revenue** | Constellation | Links sats → coverage % → rev proxy with slider bands |
| **Launch cadence Monte Carlo** | Constellation | Post-BB7 failure-rate stress; P50/P90 months to 45 sats |
| **Segment EV + P(commercial)** | Valuation | Risk-adjusted bull/base/bear; comparables panel |
| **Convertible dilution path** | Valuation | FD shares from 10-K note table at assumed price |
| **Link budget + footprint** | Technology | Friis margin vs elevation; overlap coverage heuristic |
| **Coverage orbit timeline** | Technology | Milestone months to 45/60 sats |

**Presets:** Bear · Base · Bull · **BAG** (best-available guess — Jul 2026 anchors) · Commercial bull (valuation).

---

## Primary source index (expanded)

| Type | Link |
|------|------|
| SEC EDGAR CIK 1780312 | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001780312 |
| FY2025 10-K | https://www.sec.gov/Archives/edgar/data/1780312/000149315226019390/formars.pdf |
| Q1 2026 10-Q equity footnote | https://www.sec.gov/Archives/edgar/data/1780312/000119312526216950/R21.htm |
| FCC DA 26-391 | https://www.fcc.gov/document/fcc-grants-ast-spacemobile-authority-deploy-and-operate-ngso-system |
| Jul 2025 $575M convert PR | https://www.businesswire.com/news/home/20250729408729/en/ |
| Jun 2026 BB8-10 launch | https://www.businesswire.com/news/home/20260617420856/en/ |
| BB7 / BB8-10 context | https://spaceflightnow.com/2026/06/16/live-coverage-spacex-to-launch-3-block-2-bluebird-satellites-for-ast-spacemobile/ |
| Kook Report (Thread Reader) | https://threadreaderapp.com/user/thekookreport |
| r/ASTSpaceMobile | https://www.reddit.com/r/ASTSpaceMobile/ |
| Google Patents assignee | https://patents.google.com/?assignee=AST+SpaceMobile |
| AT&T 13D (community parsed) | https://www.reddit.com/r/ASTSpaceMobile/search/?q=Schedule+13D |
| Vodafone EU agreement | https://www.reddit.com/r/ASTSpaceMobile/search/?q=Vodafone |

---

## Honest limitations (research & model)

- Wholesale **rev-share rates** and **consumer pricing** are not fully disclosed — revenue models use **assumption sliders**.
- **Orbital coverage** uses overlap heuristic `1−(1−f)^N` and linear continuous proxy — not Walker delta simulation.
- **Link budget** is educational Friis only — not AST proprietary RF planning or FCC EIRP compliance model.
- **Monte Carlo launch** uses constant failure rate — does not model provider-specific anomalies beyond BB7 preset.
- **Convertible dilution** assumes mechanical conversion at slider price — timing and capped-call overlays not modeled.
- **Market price** fetched via Yahoo delayed quote when API available; model $/sh is scenario math, not price target.
- **Kook Report / Reddit** = sentiment & thesis tracking, not verified financial data.

---

## Appendix A — MNO partner detail (Jul 2026)

| Partner | Region | Investor? | Verified role | Source |
|---------|--------|-----------|---------------|--------|
| AT&T | United States | Yes | Spectrum + commercial D2D; ~2.7% stake (13D) | IR / SEC |
| Verizon | United States | Yes | Spectrum + commercial D2D | IR |
| Vodafone | Europe / global | Yes | MNO partner + strategic investor | IR |
| Rakuten | Japan | No | MNO partner | IR |
| Bell / Telus | Canada | No | MNO partner | IR |
| stc Group | MENA | No | MNO partner | IR |
| Google | Global | No | Strategic technology partner | IR |
| American Tower | Global | No | Ground gateway infrastructure | IR |

**Count anchor:** ~60 agreements covering **3B+ addressable subscribers** — IR Jun 2026. **Partial:** MOU ≠ contracted wholesale revenue.

---

## Appendix B — Launch manifest & spacecraft inventory

| Spacecraft | Block | Status (Jul 2026) | Launch date | Provider | Notes |
|------------|-------|-------------------|-------------|----------|-------|
| BlueWalker 3 | Test | Operational (testbed) | Sep 10 2022 | SpaceX F9 | Experimental FCC campaign |
| BlueBird 1 | Block 1 | Operational | Sep 12 2024 | SpaceX F9 | Part of BB1-5 batch |
| BlueBird 2 | Block 1 | Operational | Sep 12 2024 | SpaceX F9 | Part of BB1-5 batch |
| BlueBird 3 | Block 1 | Operational | Sep 12 2024 | SpaceX F9 | Part of BB1-5 batch |
| BlueBird 4 | Block 1 | Operational | Sep 12 2024 | SpaceX F9 | Part of BB1-5 batch |
| BlueBird 5 | Block 1 | Operational | Sep 12 2024 | SpaceX F9 | Part of BB1-5 batch |
| BlueBird 6 | Block 2 | Operational | Dec 6 2025 | ISRO LVM3 | First Block 2 |
| BlueBird 7 | Block 2 | **Lost** | Apr 28 2026 | Blue Origin NG-3 | Low-orbit insertion; insured |
| BlueBird 8 | Block 2 | Operational | Jun 17 2026 | SpaceX F9 | Stacked deploy w/ 9-10 |
| BlueBird 9 | Block 2 | Operational | Jun 17 2026 | SpaceX F9 | Stacked deploy w/ 8,10 |
| BlueBird 10 | Block 2 | Operational | Jun 17 2026 | SpaceX F9 | Stacked deploy w/ 8-9 |
| BlueBird 11–13 | Block 2 | Planned | Jul–Sep 2026 (est.) | TBD | Forward-looking per IR |

**Operational count:** ~10 (excl. lost BB7). **2026 target:** ~45 in orbit by year-end.

---

## Appendix C — Convertible & dilution reference

| Instrument | Principal | Eff. conversion | Maturity | Tag |
|------------|-----------|-----------------|----------|-----|
| 4.25% Convertible Senior Notes | ~$460M | ~$120.12/sh | 2032 | verified |
| 2.375% Convertible Senior Notes | ~$575M | ~$120.12/sh | 2032 | verified |
| 2.00% Convertible Senior Notes | ~$1.0B | ~$85/sh | 2036 | verified |
| Warrants / equity awards | Various | Exercise-dependent | Various | partial |
| ATM / shelf (Oct 2025) | Open-ended | Market | Ongoing | verified |

**Share count trajectory:** FY2023 diluted ~81.8M → FY2025 ~256M → Q1 2026 class A/B/C per 10-Q footnote.

---

## Appendix D — Glossary (ASTS-Model)

| Term | Definition |
|------|------------|
| **D2D / D2C** | Direct-to-device / direct-to-cell — satellite connects to unmodified phone |
| **SCS** | Supplemental Coverage from Space — FCC framework for space-layer on MNO spectrum |
| **NGSO** | Non-geostationary orbit (LEO constellation) |
| **Block 1 / Block 2** | BlueBird generations (~64 m² vs ~223 m² array) |
| **Wholesale ARPU** | AST's share of MNO billing — not consumer price |
| **HTFS** | High Throughput Fractionated Satellite (patent terminology) |
| **Kook Bottom** | Community meme — contrarian sentiment when @thekookreport panics |
| **BAG preset** | Best-Available-Guess scenario in ASTS-Model (Jul 2026 anchors) |

---

## Appendix E — Data freshness & stale flags (ASTS-Model UI)

Facts in the app header grid carry `data-as-of` ISO dates. Items older than **90 days** vs the reference date (Jul 4 2026) display a **stale** badge — e.g., Q1 cash (Mar 31 2026) flags at ~95 days. Always verify against latest 10-Q / 8-K before decisions.

| Fact | As-of date | Stale at Jul 2026? | Primary source |
|------|------------|--------------------|----------------|
| Operational sats | 2026-06-17 | No | Business Wire |
| FCC 248-sat auth | 2026-04-21 | No | FCC DA 26-391 |
| Cash ~$3.46B | 2026-03-31 | **Yes** (~95d) | Q1 10-Q |
| Convertibles ~$2.2B | 2026-06-30 | No | FY2025 10-K |
| Patent claims ~3,900 | 2026-06-30 | No | 10-K / USPTO |

---

*End of RESEARCH.md — ASTS-Model Phase 2 / Workstream 8*

