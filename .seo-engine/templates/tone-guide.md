# Tone Guide — ZUUZ Content

> The fastest way to lose a sales-ops reader is to sound like a SaaS marketing
> page. The second-fastest is to sound like AI filler. This guide is the
> antidote to both.

## Voice baseline

- **Founder voice, not marketing voice.** Avinash built Cloud Box from $0 to
  $25M ARR. He doesn't talk like a content marketer. The writing shouldn't either.
- **Opinionated.** "Two-week-behind CRM" is a take. Take more takes.
- **Specific over abstract.** "$120K of pipeline at RA Technologies in 30 days"
  beats "significant pipeline impact."
- **Anti-fluff.** Cut warm-up paragraphs. Get to the point.
- **Pragmatic, not hype-y.** ZUUZ is *in production* with three customers. That's
  honest. Don't overclaim.

## Forbidden language

These phrases get cut on review. No exceptions.

- "In today's fast-paced business environment…"
- "Revolutionary," "game-changing," "cutting-edge," "next-generation"
- "Leverage" as a verb (use "use")
- "Solutions" as a noun for products
- "Empower your team to…"
- "Unlock the power of…"
- "AI-powered" stuck in front of everything
- "Streamline" (overused)
- "Robust" (overused)
- "In conclusion…" / "To summarize…"
- "Imagine if…" as a hook
- "Studies show…" without a citation
- Em dashes used three times in one paragraph (calm down)

## Mandatory inclusions per blog

Every published blog **must** contain at least one of these, sourced from
`config.yaml > trust_signals`:

1. A named-customer testimonial (RA Technologies / Cloud Box / Nesto)
2. A concrete metric ($120K / 10:1 / $25M ARR / 60 days)
3. A first-person experience from the author (Avinash) tied to the topic
4. A review or third-party link (when these exist — none today)

If none of the above is included, the blog stays in `human-review` and
flags `eeat_signals: false`.

## Competitor mentions

- **Lead with their strengths.** If you trash-talk, readers discount everything
  else you say.
- **Verify or caveat.** If `competitors.yaml` confidence is `unverified` or older
  than 90 days, either re-verify or write "as of {date}, verify on their site."
- **Never claim a feature they don't have unless we can cite it.**
- **Link out to their site at least once.** Looks fair. Also good external-link
  hygiene.

## CTA hygiene

- **Soft. Once. At the end.** No mid-post "book a demo" interruptions.
- **The CTA from config.yaml is the canonical one** — use `cta_text` and `cta_url`
  literally unless there's a reason to vary.
- **Don't fake urgency** ("limited spots!"). ZUUZ doesn't run that play.

## On structure

- Headers should be readable as a table of contents — someone scanning should
  understand the argument from the H2s alone.
- One H1 per page (the title). Never two.
- Hierarchy: H1 → H2 → H3. Don't skip levels.
- Lists are fine when the content is genuinely listy. Don't bullet a paragraph
  that wanted to be a paragraph.
- Code blocks for code, tables for comparisons, blockquotes for quotes.

## On length

- Word count is from `config.yaml`. Don't pad to hit it. Don't truncate either.
- If a post is naturally 1,200 words and the floor is 1,500, the problem is
  shallow coverage — fix that before adding fluff.

## On unique angle

Every blog must answer: **"What does this say that the existing top-ranking
posts on this keyword don't?"**

"More comprehensive" is **not** an angle.
"Better written" is **not** an angle.

Real angles for ZUUZ:
- A specific customer story no one else has (Nesto, RA Tech, Cloud Box)
- A specific metric no one else can cite ($120K / 10:1)
- A specific founder experience ($0-$25M built while watching CRM lag)
- A specific feature framing (audit trails as reporting, not compliance)
- A specific buyer reframe (writes-to-HubSpot, not replaces-HubSpot)

If the angle isn't one of these, get one before drafting.

## On AI-detection signals

Cut these on review:

- Sentences that start with "Moreover," "Furthermore," "Additionally,"
- Triadic constructions everywhere ("X, Y, and Z" pattern in every sentence)
- Every paragraph starting with a topic sentence summary
- "It's not just X — it's Y" as a structure
- "Not only… but also…" repeated
- Closing sentence that restates the paragraph
- Generic "in summary" / "key takeaway" boxes

Read every draft aloud before approving. If a paragraph sounds like a LinkedIn
ghostwriter, rewrite it.
