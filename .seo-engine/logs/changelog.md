# SEO Content Engine — Changelog

All material changes to engine state are logged here in reverse chronological order.

---

## 2026-05-10 — Engine initialized for ZUUZ

**Action:** Bootstrap of `.seo-engine/` for zuuz.ai.

**Performed by:** Claude (acting as SEO expert) during a brainstorming session with the ZUUZ team.

**Source material:** Live homepage at https://zuuz.ai (no codebase access, no public docs site).

**Files created:**

- `.seo-engine/config.yaml` — Project config with author (Avinash Gujje), 3 customer testimonials (RA Technologies, Cloud Box, Nesto), 5 metrics, 7 primary topics, 5 competitors (Lindy, Regie.ai, HubSpot Sales Hub, Salesforce Agentforce, Conversica).
- `.seo-engine/data/features.yaml` — 23 features across 7 categories (Inbox Intelligence, Next-Action Drafting, RFP & Quoting, CRM Integration, Pipeline Visibility & Reporting, Governance & Audit, Enterprise) extracted from the live homepage.
- `.seo-engine/data/competitors.yaml` — 5 competitors with strategic positioning notes. Feature matrix covers 9 features × 5 competitors. All competitor support marked `supported: null, confidence: unverified` per engine rules. HubSpot Sales Hub and Salesforce Agentforce native-CRM rows pre-filled as verified (trivially true).
- `.seo-engine/data/seo-keywords.csv` — 22 seed keywords. Volume/KD/CPC all 0 — no SERP MCP connected. To be populated by user-provided SERP data or by connecting an SEO MCP tool.
- `.seo-engine/data/topic-clusters.yaml` — 4 strategic clusters: AI Sales Inbox, RFP Automation, Pipeline Visibility, AI Sales Agents. RFP Automation flagged as the strongest wedge (lowest competition, strongest customer proof).
- `.seo-engine/data/content-map.yaml` — Empty. No existing blog content on zuuz.ai.
- `.seo-engine/data/content-queue.yaml` — 10 prioritized blog ideas. 5 high-priority, 5 medium-priority. Sequenced to start with RFP cluster pillar + first comparison post.
- `.seo-engine/templates/blog-frontmatter.yaml` — Frontmatter template with character limits.
- `.seo-engine/templates/blog-structures.yaml` — 6 blog type structures with voice variation and E-E-A-T injection points.
- `.seo-engine/templates/comparison-template.md` — Reusable ZUUZ vs X template with E-E-A-T checklist.
- `.seo-engine/templates/tone-guide.md` — Voice rules, forbidden language list, AI-detection avoidance.
- `.seo-engine/USAGE-GUIDE.md` — Operator manual.
- `CLAUDE.md` — Engine instructions for Claude Code (or any LLM assistant operating against this project).

**Notable strategic decisions (worth revisiting):**

1. **Apollo and ZoomInfo are NOT competitors.** They are outbound prospecting. ZUUZ is an inbound sales-inbox agent. Listing them would distort comparison content and target the wrong SERPs.
2. **RFP Automation cluster is the primary wedge.** Lowest SERP competition; strongest customer proof (Nesto 10:1 SKU matching); aligns with the distribution-heavy customer mix.
3. **Audit trail / human approval gates are SERP gaps.** Almost no one in the AI-sales-agent space writes about observability and governance. ZUUZ should own this angle.
4. **"Sales automation," "best CRM," etc. are explicitly avoided.** Owned by 9-figure-ARR incumbents. Not worth fighting.
5. **All pillar pages require user-provided SERP data before drafting.** Cluster pages can be drafted without SERP data; pillars cannot.

**Open items requiring user input:**

- Confirm CMS / blog directory structure (template assumes Next.js + `/blog`)
- Add review links to `config.yaml > trust_signals.review_links` as listings are created
- Provide SERP data for each pillar keyword before pillar drafting begins
- Confirm SOC 2 / ISO certification status (homepage says "Enterprise plan" — TODO note left in features.yaml)
- Connect a dedicated SEO MCP (Ahrefs / Semrush) for keyword data, or commit to providing user-side SERP data for each blog
