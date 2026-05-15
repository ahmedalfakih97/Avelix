# Agent 01 — Project Scaffold

## Goal
Bootstrap the complete Avelix Next.js project with all configuration files, folder structure, base dependencies, and environment setup. No UI or database logic yet — pure scaffold.

## Prerequisites
- Node.js 18+
- npm or pnpm
- Git initialized

## Inputs
- Project name: `avelix`
- Stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui

## Steps

### 1. Initialize Next.js project
```bash
npx create-next-app@latest avelix \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
```

### 2. Install core dependencies
```bash
cd avelix

# Supabase
npm install @supabase/supabase-js @supabase/ssr

# UI
npx shadcn@latest init
npx shadcn@latest add button card badge input select tabs dialog sheet separator skeleton

# Search
npm install algoliasearch react-instantsearch

# Forms
npm install react-hook-form zod @hookform/resolvers

# Utils
npm install clsx tailwind-merge lucide-react date-fns slugify

# MDX (for rich content)
npm install @next/mdx @mdx-js/loader @mdx-js/react remark-gfm rehype-highlight

# Email
npm install resend

# Dev
npm install -D @types/node prettier prettier-plugin-tailwindcss
```

### 3. Create folder structure
Create all directories listed in CLAUDE.md exactly. Create a `.gitkeep` in each empty folder.

Key directories to create:
```
app/tools/[slug]/
app/models/[slug]/
app/skills/[slug]/
app/compare/[slug]/
app/guides/[slug]/
app/glossary/[term]/
app/services/
app/blog/[slug]/
app/admin/queue/
app/admin/tools/
app/admin/models/
app/admin/skills/
components/ui/
components/layout/
components/library/
components/pages/
components/shared/
lib/
types/
hooks/
agents/
n8n/workflows/
```

### 4. Create `.env.local`
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_key
ALGOLIA_ADMIN_KEY=your_admin_key

# Auth
NEXTAUTH_SECRET=generate_random_32_chars
NEXTAUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=your_resend_key

# n8n
N8N_WEBHOOK_SECRET=generate_random_secret
```

Also create `.env.example` with the same keys but empty values.

### 5. Configure `next.config.js`
```js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
    ],
  },
  experimental: {
    mdxRs: true,
  },
};

module.exports = withMDX(nextConfig);
```

### 6. Create base TypeScript types
Create `types/shared.ts`:
```typescript
export type Status = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type PricingModel = 'free' | 'freemium' | 'paid' | 'open-source' | 'enterprise';

export interface BaseEntity {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  long_description?: string;
  status: Status;
  tags: string[];
  source_urls: string[];
  last_synced_at?: string;
  last_reviewed_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  confidence_score?: number;
  ai_generated?: boolean;
}
```

### 7. Create Supabase client
Create `lib/supabase.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `lib/supabase-server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set(name, value, options) { cookieStore.set({ name, value, ...options }); },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );
}
```

### 8. Create root layout
`app/layout.tsx` — standard Next.js root layout with:
- Google Fonts (Inter)
- Tailwind dark mode support
- Metadata base
- Header and Footer components (stub them if not built yet)

### 9. Add `.gitignore` additions
Append to `.gitignore`:
```
.env.local
.env.*.local
n8n/credentials/
```

### 10. Create README.md
Brief project README with:
- What Avelix is
- How to run locally (`npm run dev`)
- How to run with agents
- Link to CLAUDE.md

## Done Criteria
- [ ] `npm run dev` starts without errors
- [ ] All folders exist
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] `.env.local` exists (values can be empty for now)
- [ ] `types/shared.ts` has `BaseEntity` and shared enums
- [ ] Supabase client files created
- [ ] README.md created

---

## Technical Writer Instructions

You are also the technical writer for this agent.
Documentation is not optional. It is part of the definition of done.

### Before you write any code
Create `docs/[this-agent-filename].md` using the template from `DOCS_STANDARD.md`.
Start with the skeleton — fill it in as you build.

### As you build each piece
- Every component created → immediately write `docs/components/[ComponentName].md`
- Every API route created → immediately write or update `docs/api/[route].md`
- Every significant decision → write `docs/decisions/ADR-[N]-[topic].md`
- Every env var used → add to the Environment Variables section of the agent doc

### When you finish
Review the agent doc. Ask yourself:
"Could a developer who has never seen this project use only this doc to understand, run, and extend what I built?"
If the answer is no — the documentation is not done.

### Minimum documentation this agent must produce
See `DOCS_STANDARD.md` for full templates.
At minimum: one agent summary doc in `docs/` covering files created, key decisions, how it works, how to test it.
