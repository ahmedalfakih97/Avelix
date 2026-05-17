# Agent 10 — SEO

## Goal

Implement complete SEO infrastructure across all Avelix pages. Every page has correct metadata, structured data, canonical URLs, OG images, sitemap entry, and breadcrumbs.

---

## Files Created / Modified

### New files

| File | Purpose |
|---|---|
| `components/shared/JsonLd.tsx` | Renders JSON-LD `<script>` tag safely via `dangerouslySetInnerHTML` |
| `components/shared/Breadcrumbs.tsx` | Visible breadcrumb nav + BreadcrumbList JSON-LD schema |
| `app/robots.ts` | Next.js `MetadataRoute.Robots` — allows all except `/admin/` and `/api/` |
| `app/sitemap.ts` | Next.js `MetadataRoute.Sitemap` — dynamic sitemap from all published content |
| `lib/queries/seo.ts` | Supabase/mock queries for sitemap slug lists |
| `app/api/og/tool/route.tsx` | Edge OG image for tools (1200×630) |
| `app/api/og/model/route.tsx` | Edge OG image for models |
| `app/api/og/skill/route.tsx` | Edge OG image for skills |
| `app/api/og/glossary/route.tsx` | Edge OG image for glossary terms |

### Modified files

| File | Changes |
|---|---|
| `app/layout.tsx` | Full root metadata: keywords, OG (website), Twitter card, robots (googleBot), canonical |
| `app/tools/[slug]/page.tsx` | Dynamic metadata, SoftwareApplication JSON-LD, Breadcrumbs, OG image |
| `app/models/[slug]/page.tsx` | Dynamic metadata, SoftwareApplication JSON-LD, Breadcrumbs, OG image |
| `app/skills/[slug]/page.tsx` | Dynamic metadata, HowTo JSON-LD, Breadcrumbs, OG image |
| `app/glossary/[term]/page.tsx` | Dynamic metadata, FAQPage JSON-LD, Breadcrumbs, OG image |
| `app/page.tsx` | Organization + WebSite JSON-LD with SearchAction |
| `app/tools/page.tsx` | canonical + openGraph |
| `app/models/page.tsx` | canonical + openGraph |
| `app/skills/page.tsx` | canonical + openGraph |
| `app/glossary/page.tsx` | canonical + openGraph |

---

## Metadata Strategy

### Root layout (`app/layout.tsx`)

```ts
metadataBase: new URL('https://avelix.ai')
title: { default: 'Avelix — Navigate the AI Universe', template: '%s | Avelix' }
openGraph: { type: 'website', siteName: 'Avelix', locale: 'en_US' }
twitter: { card: 'summary_large_image', site: '@avelix_ai' }
robots: { googleBot: { maxImagePreview: 'large', maxSnippet: -1 } }
alternates: { canonical: 'https://avelix.ai' }
```

### Content page titles

| Page | Title pattern |
|---|---|
| Tool | `{tool.title} — {best_for[0]} AI Tool Review` |
| Model | `{model.title} by {provider} — AI Model Review` |
| Skill | `How to {skill.title} with AI — Step-by-Step Guide` |
| Glossary | `What is {term.title}? — AI Glossary` |

---

## Structured Data (JSON-LD)

All rendered via the `<JsonLd>` component placed before `<main>`.

### Homepage — Organization + WebSite

```json
{
  "@type": "Organization",
  "name": "Avelix",
  "url": "https://avelix.ai",
  "sameAs": ["https://twitter.com/avelix_ai"]
}
```

Also includes `WebSite` with `SearchAction` pointing to `/search?q={search_term_string}`.

### Tools + Models — SoftwareApplication

Key fields: `name`, `description`, `applicationCategory`, `url`, `dateModified`, optional `aggregateRating` (if `avelix_rating` present), optional `offers` (if `has_free_plan`).

### Skills — HowTo

```json
{
  "@type": "HowTo",
  "name": "How to {title} with AI",
  "totalTime": "PT{estimated_hours}H",
  "step": [ { "@type": "HowToStep", "position": 1, "name": "...", "text": "..." } ]
}
```

### Glossary terms — FAQPage

Each glossary page produces a FAQ with the term as the question and `simple_definition` as the answer.

---

## OG Image Generation (`app/api/og/*/route.tsx`)

All routes run on the **edge runtime** for fast cold starts.

- Size: **1200 × 630 px**
- Background: `#050A14` (electromagnetic-ink)
- Grid overlay: `rgba(22,37,68,0.6)` stripes at 20px intervals (CSS background-image)
- Accent: `#00D4B4` electric teal
- Font: system sans-serif (loaded at edge)

Each route fetches the item by `?slug=` or `?term=` query param and uses `ImageResponse` from `next/og`.

---

## Breadcrumbs (`components/shared/Breadcrumbs.tsx`)

Props:
```ts
crumbs: { label: string; href?: string }[]
```

Renders:
1. A `BreadcrumbList` JSON-LD schema block
2. A visible `<nav>` row with chevron separators

All labels are uppercase font-mono. The last crumb has no `href` and renders in primary color.

---

## Sitemap (`app/sitemap.ts`)

Queries `getSitemapTools()`, `getSitemapModels()`, `getSitemapSkills()`, `getSitemapGlossaryTerms()` in parallel.

| Section | Priority | changeFrequency |
|---|---|---|
| Homepage | 1.0 | weekly |
| /tools, /models, /skills | 0.9 | weekly |
| /glossary, /services | 0.8 | monthly |
| Tool pages | 0.8 | weekly |
| Model pages | 0.8 | weekly |
| Skill pages | 0.7 | weekly |
| Glossary term pages | 0.6 | monthly |

In mock mode (no Supabase URL), returns seed slugs from mock data.

---

## Robots (`app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://avelix.ai/sitemap.xml
```

---

## Admin RSC Fixes (related — required for build)

During this agent run, pre-existing RSC boundary violations in admin pages were also fixed:

- **`app/admin/layout.tsx`** — `<a onClick>` in Server Component extracted to `components/admin/SyncTriggerButton.tsx` (`'use client'`)
- **`app/admin/page.tsx`** — `<button onClick={() => {}}` replaced with `<SyncTriggerButton />`
- **`app/admin/tools/page.tsx`** — column `render` functions moved to `components/admin/AdminToolsTable.tsx` (`'use client'`)
- **`app/admin/models/page.tsx`** — moved to `components/admin/AdminModelsTable.tsx`
- **`app/admin/skills/page.tsx`** — moved to `components/admin/AdminSkillsTable.tsx`

---

## Validation

```bash
npm run build  # ✓ 84 pages, zero errors
```

All pages prerender successfully. OG image routes use edge runtime (excluded from static generation — expected).
