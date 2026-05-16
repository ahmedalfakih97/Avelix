# Agent 06 — Glossary

## Goal

Build the AI Glossary section: an alphabetical index page with client-side search and scroll-aware alphabet navigation, plus individual term detail pages with FAQ schema.org structured data.

---

## Routes Built

| Route | Type | Description |
|---|---|---|
| `/glossary` | Server Component + Client Island | Alphabetical index with search and A-Z nav |
| `/glossary/[term]` | Server Component | Term detail page with FAQ schema |

---

## Files Created

### Types

- `types/glossary.ts` — `GlossaryTerm`, `GlossaryFilters` interfaces

### Data Layer

- `lib/mock-glossary.ts` — 5 mock terms (llm, hallucination, rag, prompt-engineering, token)
- `lib/queries/glossary.ts` — `getAllGlossaryTerms`, `getGlossaryTermBySlug`, `getPublishedTermSlugs`, `getRelatedGlossaryTerms`; re-exports `groupTermsByLetter`
- `lib/glossary-utils.ts` — Pure `groupTermsByLetter` utility, safe for client imports

### Components

- `components/library/GlossaryTermCard.tsx` — Single glossary row (link to term page)
- `components/shared/TermPill.tsx` — Compact pill link to a related term
- `components/shared/AlphabetNav.tsx` — A-Z nav bar; disabled letters are dimmed
- `components/pages/GlossaryIndexClient.tsx` — Client island: search, IntersectionObserver, grouped term list

### Pages

- `app/glossary/page.tsx` — Server Component; fetches all published terms, renders hero + `GlossaryIndexClient`
- `app/glossary/[term]/page.tsx` — Server Component; `generateStaticParams`, `generateMetadata`, FAQ schema injection, parallel data fetches for related tools/skills/terms

---

## Architecture Notes

### Client/Server Split

`GlossaryIndexClient` is the interactive island (search box + alphabet nav). Data is fetched on the server and passed as props — the client component holds no async data fetching.

`groupTermsByLetter` lives in `lib/glossary-utils.ts` (not `lib/queries/glossary.ts`) so the client component can import it without pulling in `next/headers` through the server query module. The query file re-exports it for backward compatibility.

### FAQ Structured Data

Each term page injects an `application/ld+json` script with `@type: FAQPage`:

- Q1: "What is {term}?" → `simple_definition` + first paragraph of `full_explanation`
- Q2: "How does {term} work?" → remaining paragraphs of `full_explanation` (omitted if no `full_explanation`)

### Alphabet Navigation

- Sticky below the 64px header (`top-16 z-40`)
- IntersectionObserver watches `#letter-{X}` headings with `rootMargin: '-112px 0px -70% 0px'`
- Click scrolls to letter with 112px offset (header 64px + alphabet bar ~48px)
- Disabled while search is active (no active letter tracking)

### Related Terms Pattern

On the term detail page, related terms appear twice:
1. As `TermPill` components for quick scanning
2. As full rows with `simple_definition` preview for context before clicking

---

## Data Schema (Supabase)

Table: `glossary_terms`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | text | Term name, used for display and letter grouping |
| `slug` | text | URL segment, unique |
| `simple_definition` | text | One-sentence plain-English definition |
| `full_explanation` | text | Paragraphs separated by `\n\n` |
| `example` | text | Real-world usage example |
| `why_it_matters` | text | Business/practical relevance |
| `where_its_used` | text | Industries or tools where the term appears |
| `related_tool_slugs` | text[] | Cross-links to tools library |
| `related_skill_slugs` | text[] | Cross-links to skills library |
| `related_term_slugs` | text[] | Cross-links to other glossary terms |
| `status` | text | `published` required to appear |

---

## SEO

- `generateMetadata` produces title: `What is {term}? — AI Glossary | Avelix`
- Canonical: `/glossary/{slug}`
- OG type: `article`
- FAQ schema on every term page — eligible for Google FAQ rich results

---

## Done Criteria

- [x] `/glossary` renders with A-Z alphabet nav
- [x] Search filters terms client-side with no network call
- [x] `/glossary/[term]` renders all content sections
- [x] FAQ structured data present in every term page's HTML
- [x] TypeScript strict mode — zero errors
- [x] Mock data works with no Supabase env vars
- [x] Documentation written
