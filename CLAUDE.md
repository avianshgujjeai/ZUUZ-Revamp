# ZUUZ Project — Assistant Instructions

## SEO Content Engine

The SEO engine lives in `.seo-engine/`. Use it for all blog, content, and SEO tasks.

**Universal rule:** For any task involving blogs, content, SEO, keywords,
competitors, or documentation in this project — **always** read
`.seo-engine/config.yaml` and the relevant data files **first** before
responding. This includes writing, evaluating, reviewing, editing, auditing,
planning, or answering questions about content. Never rely on default behavior.

**Sub-agent rule:** Parallelize independent tasks. Don't do sequentially what
can run simultaneously.

---

## File reference

| File | Purpose | When to read |
|---|---|---|
| `.seo-engine/config.yaml` | Project config, author, trust signals | Before any task |
| `.seo-engine/data/features.yaml` | Feature registry | Before writing |
| `.seo-engine/data/competitors.yaml` | Competitor matrix | Before comparisons |
| `.seo-engine/data/seo-keywords.csv` | Keywords + SERP data | Before choosing topics |
| `.seo-engine/data/content-map.yaml` | Blog ↔ feature ↔ keyword map | Before writing |
| `.seo-engine/data/content-queue.yaml` | Prioritized ideas | When deciding what to write |
| `.seo-engine/data/topic-clusters.yaml` | Pillar/cluster architecture | Before writing |
| `.seo-engine/templates/blog-frontmatter.yaml` | Frontmatter template | When generating |
| `.seo-engine/templates/blog-structures.yaml` | Outlines by type | When structuring |
| `.seo-engine/templates/comparison-template.md` | Comparison post template | For vs-competitor content |
| `.seo-engine/templates/tone-guide.md` | Style + E-E-A-T rules | Before writing |
| `.seo-engine/logs/changelog.md` | Audit trail | After every action |

---

## Core rules

1. **Read before writing.** Always read config, features, content-map,
   content-queue, topic-clusters, tone-guide.
2. **Never fabricate features.** Only reference what's in `features.yaml`.
3. **Competitor claims need confidence.** If `unverified` or 90+ days old → caveat or
   direct reader to the competitor's page.
4. **No web search for SERP data.** Never use built-in web search to research
   keywords or SERP results. It produces generic data. Ask the user for real
   Google SERP data (top results, PAA, related searches). The only exception is
   if a dedicated SEO MCP tool (Semrush, Ahrefs) is connected.
5. **Cannibalization check before every blog.** Search content-map for
   overlapping keywords. If conflict → recommend updating existing blog. Only
   proceed if angle is genuinely different.
6. **Every blog needs a unique angle.** Define what's different from what
   ranks. "More comprehensive" is not an angle.
7. **E-E-A-T mandatory.** Every blog must include at least one: testimonial,
   metric, experience, or review link from `config.trust_signals`. If config has
   no trust signals yet, ask the user to provide one before publishing.
8. **Human review required.** Save all blogs as `status: "human-review"`.
   Never auto-publish. Alert the user to review.
9. **Respect pillar/cluster linking.** Cluster pages → link to pillar.
   Pillar → link to all cluster pages. Non-negotiable.
10. **Update all files after writing:**
    - `content-map.yaml` (register blog)
    - `features.yaml` (blog_refs)
    - `seo-keywords.csv` (mapped_blog_slugs)
    - `content-queue.yaml` (status)
    - `topic-clusters.yaml` (if cluster blog)
    - `changelog.md` (log action)
11. **Never delete data.** Add or update only.
12. **Log everything** to `changelog.md`.

---

## SERP Intent Interpretation Rules

Classify intent before deciding content structure:

- **All product/tool/template pages in top results** → Transactional. Lead with
  tool/template/CTA, then educational depth.
- **Mix of guides + product pages** → Blended. Comprehensive guide with
  embedded tool/template CTAs.
- **All informational guides/blogs** → Informational. Thorough guide. Product
  mentions natural, not forced.
- **All comparison/listicle pages** → Commercial investigation. Comparison or
  listicle, not how-to.

**Never fight the SERP.** Match the dominant intent, then add unique value on top.

---

## Blog Writing Workflow

### Step 1: Pre-Writing Research (parallel sub-agents)

1. Read all data files
2. Pick topic: highest-priority `planned` item from queue or user request
3. **Cannibalization check** against content-map
4. **SERP analysis:**
   - If SEO MCP connected → use it
   - Otherwise → ask user for SERP data, **wait** for response
5. **Define unique angle** from SERP gaps. One sentence.

### Step 2: Draft (sub-agents for long sections)

1. Select structure from `blog-structures.yaml`. **Pillar pages must include
   all of:** definition, why it matters, types/categories (link to cluster
   pages), how-to, best practices, common mistakes, tools (include ZUUZ
   naturally), FAQ from PAA.
2. Read `tone-guide.md` — use correct voice for blog type
3. Build frontmatter: title ≤ 60 chars, description ≤ 160 chars, slug ≤ 5 words
4. Write blog:
   - Primary keyword in: title, first paragraph, one H2, description, slug
   - Secondary keywords natural
   - FAQ from People Also Ask data
   - Internal links: pillar first (if cluster page), then relevant blogs.
     Varied anchor text.
   - External links: 1–2 authoritative (not competitors)
5. **Inject E-E-A-T:** author name (Avinash Gujje), one or more from
   `config.trust_signals`
6. Ask the user: "Before I finalize, want to add anything? Personal experience,
   user feedback, external sources? Say 'skip' if ready."

### Step 3: Post-Writing (parallel sub-agents)

1. Save blog with `status: "human-review"` in `/blog/{slug}.md` (or detected CMS path)
2. Update content-map, features, keywords, queue, clusters, changelog
3. Alert the user with title, file path, word count, link count, and
   "Review required — say 'Approve blog {slug}' or give feedback."

---

## Evaluate / Review Blog Workflow

When asked to evaluate, review, analyze, or give feedback:

1. Read the blog file
2. Read config, features, competitors, content-map, topic-clusters, tone-guide
3. Evaluate against:
   - **SEO:** Primary keyword in title, first paragraph, one H2, description,
     slug? Title ≤ 60? Description ≤ 160?
   - **Cannibalization:** Another blog target the same keyword?
   - **Feature accuracy:** Mentioned features in `features.yaml`? Fabrication?
   - **Competitor accuracy:** Claims backed by `competitors.yaml`? Confidence
     level?
   - **E-E-A-T:** Testimonial, metric, experience, or review link present?
   - **Cluster alignment:** In a cluster? Links to pillar? Pillar links back?
   - **Internal linking:** ≥ 2 other blogs? Varied anchor text?
   - **Unique angle:** Genuinely different from what ranks?
   - **Tone/voice:** Matches `blog-structures.yaml` for this type?
   - **Content quality:** Specific or vague? AI filler?
   - **Word count:** Meets minimum?
   - **Pillar completeness (if pillar):** All mandatory sections?
   - **SERP intent match:** Format matches what Google rewards?
   - **FAQ quality:** From real PAA or generic?
4. Output: score (out of 10), strengths, issues, specific fixes
5. If `status: "human-review"`: clear approve/reject recommendation

---

## Create Topic Cluster Workflow

1. Read `features.yaml` and existing `topic-clusters.yaml`
2. Design cluster pages from features + topic knowledge (no SERP needed)
3. **Before finalizing the pillar:** ask user for SERP data on the pillar keyword
4. **Wait** for response
5. Apply SERP Intent Rules to choose pillar format
6. Ensure pillar includes all mandatory sections
7. Save cluster to `topic-clusters.yaml`
8. Add all pages to `content-queue.yaml` with cannibalization check
9. Add keywords to `seo-keywords.csv`
10. Log to `changelog.md`

---

## ZUUZ-specific guardrails

These are project-specific and override generic SEO best-practice when they conflict:

1. **Apollo, ZoomInfo, Salesloft, Outreach are not competitors.** They are
   outbound prospecting. Don't add them to `competitors.yaml`. Don't write
   "vs" content against them.
2. **Avoid SERPs owned by 9-figure-ARR incumbents.** "Sales automation," "best
   CRM," "outbound prospecting" — not worth fighting. The `seo > avoid_terms`
   list in `config.yaml` is authoritative.
3. **RFP automation cluster is priority #1.** Lowest competition, strongest
   moat (Nesto 10:1).
4. **Audit trail / human approval gates are unique angles.** Cite them whenever
   relevant. SERP gap.
5. **Founder voice matters.** Avinash's $0-$25M ARR story is on-brand and gives
   E-E-A-T weight. Don't write generic third-person content.
6. **Three customers, in production.** Don't overclaim scale. The honesty is
   part of the positioning.
