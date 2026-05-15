# CLAUDE.md — Avelix Project

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
- [ ] Models Library (list + filter + individual pages)
- [ ] Skills Library (list + filter + individual pages)
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
