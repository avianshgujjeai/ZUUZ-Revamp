# 📖 SEO Content Engine — Usage Guide

Type these into Claude Code (or any LLM assistant operating against this repo).
Or just describe what you want — the assistant will read `.seo-engine/` before
acting.

---

## ✍️ Writing

| Command | What it does |
|---|---|
| `Write the next blog` | Picks the highest-priority `planned` item from `content-queue.yaml`, runs SERP research (asks you for Google SERP data unless an SEO MCP is connected), drafts, saves as `human-review`. |
| `Write a blog about [topic]` | Cannibalization check against `content-map.yaml`, then writes. |
| `Write a comparison: ZUUZ vs [Competitor]` | Uses data from `competitors.yaml`, follows `templates/comparison-template.md`. |
| `Write the pillar page for [cluster]` | Pillar for a topic cluster. Includes all mandatory sections (definition, types, why it matters, how-to, best practices, common mistakes, tools, FAQ). |
| `Approve blog [slug]` | Marks as `published`. |
| `Blog [slug] needs changes: [feedback]` | Revises, keeps in `human-review`. |

---

## 🔍 SERP Research — critical rule

Before every blog, the assistant needs **real** SERP data. It will not use its
own web search — that produces generic results and generic content.

- **If a dedicated SEO MCP is connected** (Semrush, Ahrefs) → it uses that.
- **Otherwise → the assistant asks YOU** to search Google for the target keyword
  and paste back:
  1. Top 3–5 ranking page titles + URLs
  2. People Also Ask questions (4–6)
  3. Related searches from bottom of Google
  4. Related keywords from your SEO tools (optional)

This gates pillar pages. Cluster pages can sometimes proceed without it but
it's strongly recommended.

---

## 🆕 New features and docs

| Command | What it does |
|---|---|
| `Scan new docs at [path]` | Reads docs, extracts features, updates `features.yaml`. |
| `New feature: [name] at [doc path]` | Adds one feature, generates seed keywords, assigns to cluster, queues blog ideas. |

---

## 🥊 Competitors

| Command | What it does |
|---|---|
| `Update competitor: [name] now supports [feature]` | Updates `competitors.yaml` with new confidence + verification date. |
| `[Competitor] raised pricing. Update.` | Updates pricing_model and notes. |

---

## 🔑 Keywords

| Command | What it does |
|---|---|
| `Import keywords: [paste data]` | Merges into `seo-keywords.csv` (no duplicates), maps to features, assigns clusters. |
| `Pull keywords via MCP for [topic]` | If SEO MCP is connected. |

---

## 🌐 Topic clusters

| Command | What it does |
|---|---|
| `Show topic cluster status` | Reports completion % per cluster. |
| `Create cluster for [topic]` | Designs pillar + cluster pages, asks for SERP data for pillar. |
| `What cluster pages to write next?` | Recommends from queue, accounting for cluster gaps. |

---

## 📊 Audits

| Command | What it does |
|---|---|
| `Run a content audit` | Full sweep: feature coverage, keyword gaps, cluster completion, cannibalization, stale content, E-E-A-T gaps, internal-linking gaps. |
| `Check keyword cannibalization` | Just the cannibalization check. |
| `What should I write next?` | Recommends top 3 from queue with reasoning. |
| `Which blogs need updating?` | Blogs 90+ days old or with stale competitor claims. |

---

## ⚙️ Config

Edit `.seo-engine/config.yaml` anytime to change:

- Author bio, social links
- Trust signals (testimonials, metrics, review links)
- CTA text and URL
- Word count limits
- Add/remove competitors
- Publishing cadence
- CMS path settings

The engine re-reads `config.yaml` before every action.

---

## 🧠 Decision shortcuts for ZUUZ specifically

These come from the strategic notes when this engine was initialized:

- **Lead RFP automation content first** — it's the lowest-competition cluster
  and ZUUZ's strongest moat. Nesto's 10:1 SKU matching metric is uncopyable.
- **Comparison content is the second priority** — bottom-funnel intent.
  `ZUUZ vs Lindy` first.
- **Don't fight "sales automation" SERPs** — owned by Apollo, HubSpot,
  ZoomInfo. Use long-tail, specific-use-case framings.
- **Always cite the customer (RA Technologies / Cloud Box / Nesto) by name**
  when the testimonial is in `config.yaml > trust_signals`. The names matter for
  trust.
- **Audit trail + human approval gates are SERP gaps.** Own this angle. Almost
  no one is writing about AI-sales-agent governance.

---

## 📍 First three blogs to write

From `content-queue.yaml`, in this order:

1. **`q_001`** — *RFP Automation for Distributors: From Inbox to Quote in Hours*
   (cluster 2 pillar — needs SERP data first)
2. **`q_002`** — *ZUUZ vs Lindy: Choosing Your AI Sales Agent*
   (highest commercial intent — verify Lindy's current site before drafting)
3. **`q_005`** — *Audit Trails for AI Sales Agents: What to Log and Why*
   (clear SERP gap — no pillar dependency, can draft anytime)

To start: say "Write the next blog" and the assistant will pick `q_001`.
