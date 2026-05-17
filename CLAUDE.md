# CLAUDE.md — Avelix Project

Last updated: 2026-05-17

## Project Overview

**Brand:** Avelix | **Domain:** avelix.ai | **Tagline:** "Navigate the AI Universe."

Avelix is a practical AI learning and discovery platform. It is NOT a news blog. It is a structured knowledge system for AI tools, models, skills, workflows, and services — designed to help beginners, creators, professionals, and businesses navigate the AI world.

**Core Mission:** Help users answer "What AI tool/model/skill do I need for this specific goal?" — and convert confused visitors into confident AI users or paying clients.

---

## Tech Stack (Canonical)

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 14 (App Router) | SEO, SSG/ISR, performance |
| Styling | Tailwind CSS + shadcn/ui | Speed, consistency |
| Database | Supabase (PostgreSQL) | Relational, real-time, free tier |
| Auth | Supabase Auth | Admin panel access |
| CMS/Content | Supabase + MDX files | Hybrid: structured data + rich content |
| Search | Algolia (or Supabase full-text) | Fast, filterable search |
| Automation | n8n (self-hosted or cloud) | Daily sync pipelines |
| Admin Panel | Custom Next.js /admin routes | Approval workflow |
| Deployment | Vercel | Zero-config Next.js |
| Storage | Supabase Storage | Screenshots, images |
| Email | Resend | Contact forms, notifications |

---

## Project Structure

```
avelix/
├── CLAUDE.md                    ← This file
├── .env.local                   ← Secrets (never commit)
├── next.config.js
├── tailwind.config.ts
├── package.json
│
├── app/                         ← Next.js App Router
│   ├── layout.tsx               ← Root layout
│   ├── page.tsx                 ← Homepage
│   ├── tools/
│   │   ├── page.tsx             ← Tools library index
│   │   └── [slug]/page.tsx      ← Individual tool page
│   ├── models/
│   │   ├── page.tsx             ← Models library index
│   │   └── [slug]/page.tsx      ← Individual model page
│   ├── skills/
│   │   ├── page.tsx             ← Skills library index
│   │   └── [slug]/page.tsx      ← Individual skill page
│   ├── compare/
│   │   ├── page.tsx             ← Comparison index
│   │   └── [slug]/page.tsx      ← Comparison page
│   ├── guides/
│   │   ├── page.tsx             ← Guides / learning paths index
│   │   └── [slug]/page.tsx      ← Individual guide
│   ├── glossary/
│   │   ├── page.tsx             ← Glossary index
│   │   └── [term]/page.tsx      ← Individual glossary term
│   ├── services/
│   │   └── page.tsx             ← Services page
│   ├── blog/
│   │   ├── page.tsx             ← Blog index
│   │   └── [slug]/page.tsx      ← Blog article
│   └── admin/                   ← Protected admin routes
│       ├── layout.tsx           ← Auth guard
│       ├── page.tsx             ← Admin dashboard
│       ├── queue/page.tsx       ← Approval queue
│       ├── tools/page.tsx       ← Manage tools
│       ├── models/page.tsx      ← Manage models
│       └── skills/page.tsx      ← Manage skills
│
├── components/
│   ├── ui/                      ← shadcn/ui base components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── library/
│   │   ├── ToolCard.tsx
│   │   ├── ModelCard.tsx
│   │   ├── SkillCard.tsx
│   │   ├── FilterBar.tsx
│   │   └── SearchBox.tsx
│   ├── pages/
│   │   ├── ToolPage.tsx
│   │   ├── ModelPage.tsx
│   │   ├── SkillPage.tsx
│   │   └── ComparisonPage.tsx
│   └── shared/
│       ├── CTABlock.tsx
│       ├── RelatedItems.tsx
│       ├── RatingBadge.tsx
│       └── TagList.tsx
│
├── lib/
│   ├── supabase.ts              ← Supabase client
│   ├── supabase-admin.ts        ← Admin client (server-side)
│   ├── algolia.ts               ← Search client
│   └── utils.ts
│
├── types/
│   ├── tool.ts
│   ├── model.ts
│   ├── skill.ts
│   └── shared.ts
│
├── hooks/
│   ├── useTools.ts
│   ├── useModels.ts
│   └── useSearch.ts
│
├── agents/                      ← Claude Code agent instruction files
│   ├── 01-scaffold.md
│   ├── 02-database.md
│   ├── 03-tools-library.md
│   ├── 04-models-library.md
│   ├── 05-skills-library.md
│   ├── 06-glossary.md
│   ├── 07-guides.md
│   ├── 08-search-filters.md
│   ├── 09-admin-panel.md
│   ├── 10-services-page.md
│   ├── 11-homepage.md
│   ├── 12-seo.md
│   └── 13-sync-pipeline.md
│
└── n8n/
    ├── workflows/
    │   ├── daily-sync.json
    │   ├── tool-discovery.json
    │   ├── model-monitor.json
    │   └── approval-notify.json
    └── README.md
```

---

## Database Schema (Supabase / PostgreSQL)

All tables use UUIDs. All public content has `status` field: `draft | review | approved | published | archived`.

### Core Tables

- **tools** — AI tool entries
- **models** — AI model entries
- **skills** — AI skill entries
- **categories** — Shared taxonomy
- **use_cases** — Reusable use case tags
- **learning_paths** — Guided sequences
- **workflows** — Step-by-step workflow guides
- **prompts** — Prompt templates
- **glossary_terms** — AI glossary
- **articles** — Blog/update articles
- **comparisons** — Tool or model comparison pages
- **services** — Service offerings
- **tags** — Flat tag taxonomy
- **sources** — Tracked source URLs with trust score
- **changelogs** — Per-item change history
- **social_posts** — Social content mapped to pages
- **approval_queue** — Pending human review items

### Key Fields (all tables)

```
id, title, slug, short_description, long_description,
category_id, tags[], use_cases[], status, confidence_score,
source_urls[], last_synced_at, last_reviewed_at,
published_at, created_at, updated_at, owner, review_notes
```

Full schema: see `agents/02-database.md`

### skills table — additional fields (new version)

The new Skills Library adds these fields beyond the base schema:

```
content_type          — 'skills.sh' | 'avelix-original' | 'community'
install_method_cli    — npx install command string (e.g. npx skills add <name>)
install_method_manual — GitHub folder URL for manual download
skill_md_content      — Full SKILL.md file content (text)
security_audit_badge  — badge label / status string
security_audit_url    — link to audit report
avelix_install_count  — integer; tracked on Avelix side only
related_models        — text[] of model names from the models table
```

### models table — additional fields (from avelix_models_import.csv)

All columns from the import file are authoritative. Key additions beyond the base schema:

```
avelix_display_name, avelix_category, avelix_overview, avelix_featured,
avelix_tags, avelix_data_flags, popularity_tier, confidence_score,
provider_logo_url, provider_country_norm, model_type_norm, modality_norm,
open_source_norm, proprietary_model_index, status_norm,
release_year, parameter_count, max_output_tokens, avg_response_latency,
has_free_tier, api_input_price_usd_per_1m, api_output_price_usd_per_1m,
price_summary, price_status, pricing_tier_label, consumer_url,
similar_cheaper_model, example_prompt_1, example_prompt_2, example_prompt_3
```

See **## Models Library — Data Schema** for the full 77-column list.

---

## Agent Development Workflow

Each agent file in `/agents/` is a self-contained instruction set for Claude Code. Run them in order for a clean build. Each agent:

1. Reads only its own `.md` file
2. Has a clear **Goal**, **Inputs**, **Outputs**, and **Done criteria**
3. Does not assume knowledge from other agents unless explicitly stated
4. Writes tests alongside code

**Execution order:**
```
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 11 → 12 → 13
```

**Important notes for specific libraries:**

- **Skills Library:** Before touching any file under `app/skills/`, `lib/queries/skills.ts`, or related components — read **## Skills Library — Current State** first. The library is temporarily hidden; changes must not re-expose it unintentionally.
- **Models Library:** `avelix_models_import.csv` is the source of truth for the models table schema. Any agent working on models must treat the column list in **## Models Library — Data Schema** as authoritative.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Email
RESEND_API_KEY=

# n8n webhook (for sync pipeline)
N8N_WEBHOOK_SECRET=
```

---

## Content Rules (enforced by agents and admin)

1. Every tool/model/skill MUST have at least one verified `source_url`
2. AI-generated descriptions must be flagged with `ai_generated: true` until human-reviewed
3. Pricing info must include `last_verified_date`
4. No item publishes without `status = approved`
5. Confidence score below 0.7 → blocked from publishing
6. Duplicate check runs on `slug` AND `title` before insert
7. Skills imported from skills.sh start as `status = draft` — never auto-publish
8. Models with `confidence_score < 0.7` must stay as `status = draft` — blocked from publishing
9. AI-generated fields (`avelix_overview`, `example_prompt_1/2/3`, enriched capabilities) must be flagged `ai_generated: true` until human-reviewed
10. Install count for skills (`avelix_install_count`) is tracked on Avelix side only — never pulled live from skills.sh

---

## SEO Conventions

- URLs: `/tools/[slug]`, `/models/[slug]`, `/skills/[slug]`, `/glossary/[term]`
- All pages have `generateMetadata()` with dynamic title, description, OG image
- Canonical URLs always set
- Sitemap auto-generated from published items
- Schema.org structured data on tool/model/skill pages
- `last_reviewed_at` exposed as `dateModified` in schema

---

## Coding Standards

- TypeScript strict mode
- All DB calls via typed Supabase client with `Database` types generated
- Server Components for data fetching, Client Components only for interactivity
- No `any` types
- Every component has a co-located `.test.tsx`
- Commits: `feat:`, `fix:`, `data:`, `agent:` prefixes

---

## MVP Scope (Phase 1)

- [ ] Homepage
- [ ] Tools Library (list + filter + individual pages)
- [x] Models Library (list + filter + individual pages) — data imported, 387 models
- [ ] Skills Library — temporarily hidden, new version in planning
- [ ] Glossary
- [ ] Services page
- [ ] Admin approval queue
- [ ] Basic search
- [ ] SEO foundations
- [ ] n8n daily sync (draft mode, human approval required)

## Advanced Scope (Phase 2+)

- [ ] AI tool finder chatbot
- [ ] Personalized learning path generator
- [ ] User accounts + saved items
- [ ] Comparison engine
- [ ] Community reviews
- [ ] Prompt library
- [ ] Workflow builder
- [ ] Arabic language support
- [ ] Newsletter + analytics dashboard
- [ ] Automated stale-page detection

---

## Skills Library — Current State

**Status: temporarily hidden from public frontend (as of 2026-05-17)**

- `/skills` → 307 temporary redirect to `/models`
- `/skills/[slug]` pages carry `noindex, nofollow` meta tags
- Skills removed from main nav, footer, and sitemap
- 15 skills remain in Supabase with `status = published` — data is intact and untouched
- Reason for hiding: the current library showed the wrong concept (learnable AI skills). The replacement concept (installable agent skills) is in planning.

**Do not:**
- Delete `app/skills/` page files
- Delete or modify any rows in the `skills` table
- Remove `lib/queries/skills.ts` or related types
- Re-expose the library in nav/sitemap/sitemap without explicit instruction

**Next step:** See **## Skills Library — New Version (Planned)** for the replacement concept.

---

## Skills Library — New Version (Planned)

The replacement Skills Library is a catalog of installable agent skills, modeled on [skills.sh](https://skills.sh).

### Concept

Users browse and install agent skills — packaged capability units that extend AI agents. Think npm for agent behaviors.

### Content types

| Type | Description |
|---|---|
| `skills.sh` | Imported from the skills.sh catalog |
| `avelix-original` | Created by Avelix admin or AI-drafted + human-reviewed |
| `community` | Submitted by community members, require admin approval |

### Install methods (per skill)

- **CLI:** `npx skills add <skill-name>`
- **Manual:** Download the skill folder directly from GitHub

### avelix-labs GitHub org

Not yet created. Placeholder for future CLI publishing of `avelix-original` skills. Do not reference a real URL until the org exists.

### Skill fields (schema additions)

```
content_type          — 'skills.sh' | 'avelix-original' | 'community'
install_method_cli    — npx command string
install_method_manual — GitHub folder URL
skill_md_content      — Full SKILL.md content
security_audit_badge  — badge label / status
security_audit_url    — link to audit report
avelix_install_count  — integer, tracked on Avelix side only (never pulled from skills.sh)
related_models        — text[] linking to model names in the models table
```

### Difficulty levels

`Beginner` | `Developer` | `Advanced`

### avelix_category values (skills)

`Agents` | `Browser` | `Coding` | `Data` | `Design` | `DevOps` | `Marketing` | `Multimodal` | `Product` | `Research` | `Safety` | `Writing`

### Install count logic

- Starting display count = floor(skills.sh count × 0.15)
- If skills.sh count is 0 → Avelix count stays 0
- All counts tracked and incremented on Avelix side only

### Content pipeline

1. Crawl and import all skills from skills.sh → `status = draft`
2. Admin reviews and approves individual skills before publishing
3. `avelix-original` skills drafted by AI, flagged `ai_generated: true`, human-reviewed before approval
4. Community submissions enter the approval queue at `status = review`

### Related models

Each skill links to recommended models via a `related_models` field (array of model names from the `models` table). Users navigate: skill → recommended models.

---

## Models Library — Data Schema

### Source files

| File | Description |
|---|---|
| `ai_models_library_2026_05_16.xlsx` | Source spreadsheet (Model Library + Model Library 2 sheets + Pricing URL Lookup sheet) |
| `avelix_models_import.csv` | Processed import file — 387 rows × 77 columns, ready for Supabase |

### Allowed values

**avelix_category:**
`Language` | `Reasoning` | `Coding` | `Vision` | `Multimodal` | `Audio` | `Video` | `Image Generation` | `Embeddings` | `Agents` | `Safety` | `On-Device`

**pricing_tier_label:**
`Free` | `Open Source / Free` | `Budget` | `Mid-Range` | `Premium` | `Unknown`

**open_source_norm:**
`Open Source` | `Closed Source` | `Mixed` | `Unknown`

**status_norm:**
`Active` | `Legacy` | `Retired` | `Research Preview`

### Data quality rules

- `confidence_score < 0.7` → `status = draft`, blocked from publishing
- Fields generated by AI (`avelix_overview`, `example_prompt_1/2/3`, enriched capabilities) → `avelix_data_flags` includes `ai_generated:true` until human-reviewed

### Full column list (77 columns)

**Avelix meta:**
`avelix_slug`, `avelix_display_name`, `avelix_featured`, `avelix_category`, `avelix_tags`, `popularity_tier`, `confidence_score`, `avelix_overview`, `avelix_data_flags`

**Provider:**
`Provider name`, `provider_logo_url`, `Provider country or region`, `provider_country_norm`

**Model identity:**
`Model family`, `Model name`, `Model version`, `release_year`, `Release date`, `Latest known version`

**Status / type:**
`Status`, `status_norm`, `model_type_norm`, `modality_norm`

**Capabilities / I/O:**
`Input types`, `Output types`, `Context window`, `max_output_tokens`, `parameter_count`, `Supported languages`

**Open source / licensing:**
`open_source_norm`, `proprietary_model_index`, `License type`

**Access / deployment:**
`API availability`, `has_free_tier`, `Deployment options`

**URLs:**
`Official model URL`, `Documentation URL`, `Pricing URL`, `Model card URL`, `GitHub or Hugging Face URL`, `consumer_url`, `Source links`

**Pricing:**
`price_summary`, `api_input_price_usd_per_1m`, `api_output_price_usd_per_1m`, `price_status`, `pricing_tier_label`, `Cost profile`

**Use cases / positioning:**
`Key capabilities`, `Limitations`, `Best use cases`, `Not recommended use cases`, `similar_cheaper_model`

**Technical feature flags:**
`Tool use support`, `Function calling support`, `Structured output support`, `JSON mode support`, `Vision support`, `Audio support`, `Video support`, `Image generation support`, `Fine-tuning support`, `RAG suitability`, `Embedding support`

**Performance:**
`avg_response_latency`, `Latency profile`, `Benchmark results`

**Enterprise / compliance:**
`Enterprise readiness`, `Compliance or security notes`, `Safety features`

**Training / ecosystem:**
`Training data notes`, `Known integrations`, `Primary competitors`

**Example prompts:**
`example_prompt_1`, `example_prompt_2`, `example_prompt_3`

**Meta:**
`Last verified date`

---

## Design Reference Files

Two files govern ALL visual decisions. Every frontend agent must read both:

**`DESIGN.md`** — The extracted design system from the Stitch-generated reference.
Covers: colors, typography, component patterns, naming conventions, layout rules, page-specific adaptations.

**`design/reference.html`** — The actual Stitch-generated HTML file.
Read this for exact component structure, Tailwind classes, and HTML patterns.

### Key design decisions locked in from Stitch:
- Border radius: ZERO everywhere
- Fonts: Syne (headings) + JetBrains Mono (labels/data) + Plus Jakarta Sans (body)
- Icons: Material Symbols Outlined only (not Lucide)
- Grid overlay: 20x20px #162544 lines on hero backgrounds
- Signal scan: animated teal line, hero sections only
- All labels: uppercase + font-mono
- All headings: uppercase + font-headline (Syne)
- Primary accent: #00D4B4 Electric Teal
- Background: #050A14 always

---

## Documentation Standard

Every agent produces documentation alongside code.
The standard is defined in `DOCS_STANDARD.md` — read it before running any agent.

### Output structure after all agents complete
```
docs/
├── 00-visual-identity.md
├── 01-scaffold.md
├── 02-database.md
├── 03-tools-library.md
├── 04-models-library.md
├── 05-skills-library.md
├── 06-glossary.md
├── 07-homepage.md
├── 08-search-filters.md
├── 09-admin-panel.md
├── 10-seo.md
├── 11-sync-pipeline.md
├── 12-seeding.md
├── 13-deployment.md
├── components/     ← one .md per custom component
├── api/            ← one .md per API route
├── database/       ← schema, RLS, queries
└── decisions/      ← ADRs for major decisions
```

### Rule
No agent is done until its documentation is written.
Code without docs = incomplete.
