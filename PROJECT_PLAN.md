# SMCI Research Website — Project Plan

**Created:** 2026-03-20
**Project:** Super Micro Computer, Inc. (NASDAQ: SMCI) Research Website
**Type:** Research & Analysis Website — GitHub Pages
**Priority:** High
**Owner:** Max

---

## 1. Project Objective

Build a professional, research-grade static website for Super Micro Computer, Inc. (NASDAQ: SMCI) covering:

1. **Company Profile** — Full history, leadership, technology, partnerships
2. **News Cycle** — 12-month timeline (March 2025 – March 2026) of factually relevant events
3. **Stock Analysis** — Interactive charts with news overlay, technical analysis
4. **12-Month Projection** — Bull/base/bear scenarios based on company workup + news cycle + analyst consensus
5. **Additional Research** — Further relevant topics for a complete company study

**Deliverable:** Live GitHub Pages URL with fully functional interactive website.

---

## 2. Technical Architecture

### Stack
- **Framework:** Vanilla HTML/CSS/JS (no build step — pure static, GitHub Pages compatible)
- **Charts:** Chart.js (CDN) for interactive stock/data visualization
- **Timeline:** Custom interactive news-timeline with chart overlay
- **Responsive:** Mobile-first, CSS Grid/Flexbox, @media breakpoints
- **Fonts:** Google Fonts (Inter, JetBrains Mono for data)
- **Icons:** Inline SVG or Phosphor Icons (CDN)

### Page Structure
```
index.html           — Landing / Overview
company.html         — Section 1: Company Profile
news.html            — Section 2: News Cycle (12 months)
stock.html           — Section 3: Stock Analysis + Charts
projection.html      — Section 4: 12-Month Projection
additional.html      — Section 5: Additional Research
css/
  style.css          — Global styles
  charts.css         — Chart-specific overrides
js/
  app.js             — Main application logic
  charts.js          — Chart.js configuration + data
  timeline.js        — News timeline + chart overlay logic
  projections.js     — Projection scenario calculator
data/
  smci-stock.json    — Historical price/volume data
  news.json          — 12-month news events with dates
  financials.json    — Revenue, EPS, margins
  analyst.json       — Analyst ratings & price targets
```

### Interactive Features
- **Stock chart** with selectable time ranges (6M, 1Y, 2Y, MAX)
- **News markers** overlaid on stock chart (vertical lines + tooltips)
- **Earnings call markers** on chart
- **Projection slider** — user-adjustable bull/base/bear scenarios
- **Revenue growth chart** (5-year trend)
- **Analyst price target visualization**

---

## 3. Section Specifications

### Section 1 — Company Profile

**Content:**
- Full founding story (1993, Charles Liang, Silicon Valley)
- IPO history (March 29, 2007)
- Core products: servers, AI/HPC platforms, GPU servers, storage, networking
- Technology partnerships: NVIDIA (Blackwell/HGX/MGX), AMD (Instinct MI350), Intel (Xeon 6)
- Manufacturing footprint: Silicon Valley campuses, global facilities, capacity figures (5,000 air-cooled racks/month, 2,000 liquid-cooled racks/month)
- Leadership: Charles Liang (CEO/President/Chairman), Sara Liu (insider/co-founder), Kenneth Cheung (CAO)
- Ownership: ~55% institutional, ~28% insider, ~17% retail
- Certifications: ISO 14001:2015

**Controversies:**
- Ernst & Young resignation (Oct 24, 2024) — governance/internal control concerns
- Special Committee investigation + accounting leadership changes
- Nasdaq listing compliance risk (delinquent filings)
- Note: DOJ/SEC matters from 2024 short-seller allegations noted as unresolved

**Design:** Hero section with company tagline, tabbed sub-sections for leadership/products/history

---

### Section 2 — News Cycle (March 2025 – March 2026)

**Events to include:**

| Date | Event |
|------|-------|
| Feb 28, 2025 | Silicon Valley Campus 3 expansion announced (up to ~3M sq ft, capacity figures) |
| May 6, 2025 | Q3 FY2025 results: $4.60B revenue, $0.17 EPS; FY25 guide $21.8B–$22.6B |
| Jun 12, 2025 | AMD MI350 GPU platform launch (liquid/air-cooled) |
| Jul 16, 2025 | Intel Xeon 6 4-socket X14 server launch |
| Aug 5, 2025 | Q4 FY2025 / FY2025 results: $22.0B revenue, $1.0B net income; FY26 guide ≥$33B |
| Nov 4, 2025 | Q1 FY2026 results: $5.0B revenue, $0.26 EPS; FY26 ≥$36B |
| Feb 3, 2026 | Q2 FY2026 results: $12.7B revenue, $0.60 EPS; FY26 ≥$40B; Q3 guide ≥$12.3B |
| Ongoing | EY resignation fallout, governance improvements, Nasdaq compliance |

**Design:** Vertical timeline with news markers, category filters (Earnings, Product, Governance, Manufacturing), clickable entries expand for detail

---

### Section 3 — Stock Analysis

**Charts to include:**
1. **Price history chart** — SMCI close price, selectable ranges (6M/1Y/2Y/MAX), with news overlay markers
2. **Revenue trend chart** — 5-year annual revenue bars (FY2021–FY2025)
3. **Net income chart** — 5-year annual net income bars
4. **Earnings surprise chart** — actual vs. estimated EPS per quarter
5. **Analyst ratings distribution** — buy/hold/sell gauge

**Key Metrics Panel:**
- Price: $30.79 | Market Cap: $18.44B
- P/E TTM: 22.86 | EPS TTM: $1.35
- Forward P/E: 10.39 | EPS Next Year: $2.96
- Short Float: 16.52% | Short Interest: 85.08M shares
- Institutional Ownership: 55.80%
- Dividend: None

**Technical Analysis Elements:**
- 50-day moving average overlay
- 200-day moving average overlay
- Volume bars below price chart
- Relative strength vs. NASDAQ (if data available)

**News-Chart Overlay:**
- Vertical markers on price chart for each major news event
- Hover tooltip shows headline + price at that date
- Color-coded by category (Earnings=green, Product=blue, Governance=red, Manufacturing=purple)

**Sources:** Finviz, Macrotrends, SEC filings, Supermicro earnings PDFs

---

### Section 4 — 12-Month Projection (March 2026 → March 2027)

**Projection Methodology:**

1. **Revenue Model** — anchored to company guidance
   - FY2026 guidance: ≥$40B (company-reported)
   - Growth driver analysis: AI server demand, GPU supply, rack-scale wins

2. **Scenario Framework:**

   | Scenario | FY2027 Revenue | Price Target | Assumption |
   |----------|---------------|--------------|------------|
   | **Bull** | ≥$55B–$60B | $60–$80 | AI rack-scale leadership, margin recovery, clean governance |
   | **Base** | ≥$45B–$52B | $40–$55 | Moderate execution, risk discount persists |
   | **Bear** | ≤$30B–$38B | $15–$25 | Governance relapse, competition, AI capex slowdown |

3. **Key Upside Catalysts:**
   - Sustained multi-quarter AI rack-scale growth with improving gross margins
   - Large design wins tied to NVIDIA/AMD platform launches
   - Auditor stability, clean filings, reduced governance risk

4. **Key Downside Risks:**
   - Further auditor turnover or restatements
   - Missing revenue guidance due to GPU supply/customer delays
   - Working capital strain during hypergrowth

5. **Analyst Consensus:**
   - ~13 analysts covering (Public.com)
   - Consensus: Hold
   - Average price target: ~$42.38 (Finviz ~$40.20)

**Interactive Feature:** Scenario selector/buttons to switch between Bull/Base/Bear with animated chart updates

---

### Section 5 — Additional Research

**Topics to cover:**

1. **Competitive Landscape**
   - Dell Technologies (DELL) — AI server division
   - HPE/Juniper Networks (HPE) — AI/infrastructure
   - Lenovo (Data Center Group)
   - Gigabyte / Inspur / Quanta (ODM direct bidders)
   - Comparison table: server product lines, GPU partnerships, manufacturing footprint

2. **AI Infrastructure Market Context**
   - Global AI server market size & growth (IDC/Gartner estimates)
   - Hyperscaler capex trends (Microsoft, Google, Meta, Amazon, Oracle)
   - NVIDIA GPU supply landscape (Blackwell allocation)

3. **Balance Sheet & Liquidity Analysis**
   - Cash position: $4.1B (Q2 FY2026)
   - Total debt + convertibles: $4.9B
   - Working capital volatility note: ($918M) operating cash flow in Q1 FY26

4. **Customer Concentration Risk**
   - Large AI infrastructure deals (unnamed hyperscale customers implied)
   - Revenue concentration risk (if >10%来自 single customer)

5. **Short-Seller Allegations Context (2024)**
   - Hindenburg Research allegations (March 2024 — referenced as context)
   - DOJ/SEC inquiry status as of March 2026 (noted as unresolved)
   - EY resignation connection noted

6. **Environmental/ESG**
   - ISO 14001:2015 certification (valid until Mar 21, 2026)
   - Liquid cooling energy efficiency messaging

7. **Options & Derivatives Market**
   - High short interest (16.52% float)
   - Put/call ratio context
   - Notable options activity (if accessible)

---

## 4. Data Sources

| Data Type | Source |
|-----------|--------|
| Stock price history | Yahoo Finance API (via lightweight backend) or Chart.js with static JSON |
| Revenue / Net income | Macrotrends, SEC filings |
| Earnings data | Supermicro earnings PDFs (Q4 CDN) |
| Analyst ratings | Finviz, Public.com |
| News timeline | SEC 8-K/10-K filings, Supermicro press releases, Reuters/Bloomberg |
| Ownership | WallStreetZen, SEC 13F filings |

> **Note:** For GitHub Pages (static-only), stock price data will be embedded as static JSON updated periodically, or sourced via a public API endpoint (e.g., Yahoo Finance public endpoint or a CORS-friendly alternative).

---

## 5. GitHub Repository Setup

**Repository name:** `smci-research-website`

**Steps:**
1. Create GitHub repo under appropriate org/user
2. Push all website code
3. Enable GitHub Pages (Settings → Pages → Source: main branch)
4. Deliver live URL

**GitHub Pages URL:** `https://<org>.github.io/smci-research-website/` (or custom domain)

---

## 6. Task Breakdown

| Task ID | Title | Status | Agent |
|---------|-------|--------|-------|
| TASK-039 | Project scaffolding & repo setup | Pending | Max |
| TASK-040 | Build base HTML/CSS/JS framework | Pending | Max |
| TASK-041 | Section 1 — Company Profile page | Pending | Max |
| TASK-042 | Section 2 — News Cycle page + timeline | Pending | Max |
| TASK-043 | Section 3 — Stock Analysis page + charts | Pending | Max |
| TASK-044 | Section 4 — 12-Month Projection page | Pending | Max |
| TASK-045 | Section 5 — Additional Research page | Pending | Max |
| TASK-046 | Interactive news-chart overlay feature | Pending | Max |
| TASK-047 | GitHub Pages deployment + QA | Pending | Max |
| TASK-048 | Final review + URL delivery | Pending | Max |

---

## 7. Design System

**Color Palette:**
```
--color-bg:         #0a0e17    (dark navy — primary background)
--color-surface:   #111827    (card/panel surface)
--color-border:    #1f2937    (borders)
--color-primary:   #3b82f6    (blue — SMCI brand accent)
--color-accent:    #10b981    (green — positive/growth)
--color-danger:    #ef4444    (red — negative/risk)
--color-warning:   #f59e0b    (amber — caution)
--color-text:      #f9fafb    (primary text)
--color-muted:     #9ca3af    (secondary text)
```

**Typography:**
- Headings: Inter (700, 600)
- Body: Inter (400, 500)
- Data/numbers: JetBrains Mono

**Chart Colors:**
```
--chart-price:     #3b82f6    (price line)
--chart-volume:    #6b7280    (volume bars)
--chart-revenue:   #10b981    (revenue bars)
--chart-earnings:  #8b5cf6    (earnings bars)
--chart-ma50:      #f59e0b    (50-day MA)
--chart-ma200:     #ef4444    (200-day MA)
```

---

## 8. Success Criteria

- [ ] GitHub repository created with all website code
- [ ] GitHub Pages live URL delivered
- [ ] All 5 sections complete and professionally presented
- [ ] Stock charts with news overlay fully functional
- [ ] 12-month projection methodology documented
- [ ] Responsive design verified on mobile/tablet/desktop
- [ ] Interactive elements (time range selector, scenario buttons, news markers) working
