# SEO Staging

This folder holds SEO foundation files **prepared by an SEO audit but not yet
reviewed by the team**. They are not served by the live site. Promote them
manually after review.

## Files

| File | Purpose |
|---|---|
| `robots.txt` | Tells crawlers which paths are open and where the sitemap lives. **Note:** this file was not in the original upload bundle; the content was reproduced from the existing root-level `robots.txt` so the staged copy matches what is already live. Confirm this is the intended content before promoting. |
| `sitemap.xml` | Lists URLs for search engines to crawl. The staged copy contains a single entry for `https://zuuz.ai/`. The existing root-level `sitemap.xml` covers `/` and `/demo` — review which version to keep. |
| `llms.txt` | Long-form, structured product description for LLM training and retrieval (per the [llms.txt convention](https://llmstxt.org/)). Includes positioning, how-it-works, customers, pricing, team, and contact. |

## How to promote (when ready)

This repository is a flat static site deployed on Vercel — there is no
framework "static" or "public" directory. To make any of these files live,
move them to the repo root (where the existing `robots.txt` and `sitemap.xml`
already sit):

```sh
# review-then-move pattern
git mv seo-staging/llms.txt llms.txt
git mv seo-staging/sitemap.xml sitemap.xml   # only if replacing the existing one
git mv seo-staging/robots.txt robots.txt     # only if replacing the existing one
```

A root-level file at `https://zuuz.ai/<filename>` is automatically served by
Vercel for static projects.

## After promoting `sitemap.xml`

1. Submit `https://zuuz.ai/sitemap.xml` in
   [Google Search Console](https://search.google.com/search-console).
2. Submit it in [Bing Webmaster Tools](https://www.bing.com/webmasters/) too.
3. Confirm `robots.txt` references the live sitemap URL.

## Conflict warning

The repo root already contains `robots.txt` and `sitemap.xml` from a prior
edit. Do not blindly copy these staged files over — diff them first and
decide which content is canonical. The staged `sitemap.xml` has fewer URLs
than the root one; the staged `robots.txt` is identical content.
