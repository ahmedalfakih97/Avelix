# Agent 08 — Search & Filters System

## Goal
Build the global search system and all filtering logic for the Tools, Models, and Skills libraries. Search must be fast, filterable, and mobile-friendly.

## Prerequisites
- Agents 01–07 complete
- Algolia account set up (or Supabase FTS as fallback)
- All library pages built (Agents 03–05)

## Architecture Decision

**Primary: Algolia** (recommended for production)
- Instant search with typo tolerance
- Faceted filtering
- Relevance tuning per content type
- Free tier: up to 10,000 search requests/month

**Fallback: Supabase Full-Text Search** (for MVP/cost saving)
- Use `pg_trgm` extension + `to_tsvector` indexes
- Sufficient for < 50,000 records and moderate traffic
- Switch to Algolia when traffic grows

The agent should implement both and use an environment variable to switch:
```env
SEARCH_PROVIDER=algolia  # or 'supabase'
```

---

## Part 1: Algolia Setup

### Index Structure

Create three Algolia indexes:
1. `avelix_tools`
2. `avelix_models`
3. `avelix_skills`

**Tool index record shape:**
```json
{
  "objectID": "uuid",
  "title": "ElevenLabs",
  "slug": "elevenlabs",
  "short_description": "AI voice generation platform...",
  "category": "AI Voice Tools",
  "tags": ["voice", "tts", "automation"],
  "pricing_model": "freemium",
  "has_free_plan": true,
  "has_api": true,
  "user_types": ["creator", "business"],
  "best_for": ["voice generation", "UGC automation"],
  "avelix_rating": 4.5
}
```

**Facets to enable per index:**
```
tools:  category, pricing_model, has_free_plan, has_api, user_types, is_no_code
models: provider, model_type, is_open_source, has_api, pricing_model
skills: difficulty, user_types, category
```

### Sync script
Create `scripts/sync-algolia.ts`:
- Reads all `published` items from Supabase
- Upserts to Algolia indexes
- Run manually or via n8n webhook after item is published

---

## Part 2: Global Search Component

### `components/library/GlobalSearch.tsx`

A command-palette style search (like Linear or Vercel's search).

**Behavior:**
- Triggered by: search icon in header, or keyboard shortcut `Cmd+K` / `Ctrl+K`
- Renders as: full-screen modal overlay on mobile, floating popover on desktop
- Input: single text field with debounce (200ms)
- Results: grouped by type (Tools / Models / Skills / Glossary)
- Each result: icon/logo + title + short_description + category badge
- Keyboard navigation: up/down arrows, Enter to navigate
- "See all results for '{query}'" at bottom → `/search?q=...`

**Implementation using Algolia React InstantSearch:**
```typescript
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);
```

---

## Part 3: Page-Level Filter System

### `hooks/useFilters.ts`
A custom hook that:
- Reads filter state from URL search params
- Provides typed filter values
- Provides `setFilter(key, value)` and `clearFilters()` functions
- Syncs state to URL (replaces history, doesn't push)

```typescript
export function useFilters<T extends Record<string, string | string[] | boolean>>(
  defaults: T
): {
  filters: T;
  setFilter: (key: keyof T, value: any) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}
```

### `components/library/FilterSidebar.tsx`
Desktop sidebar implementation:
- Sticky positioned
- Each filter group as a collapsible `<details>` element (or Radix Accordion)
- Checkbox groups for multi-select
- Toggle switches for boolean filters
- "Clear all" button
- Active filter count badge on each group

### `components/library/FilterSheet.tsx`
Mobile bottom sheet implementation:
- Renders same filter groups as sidebar
- Opens via "Filters (N)" button
- Close via swipe down or X button
- Apply button confirms selection

### `components/library/ActiveFilterTags.tsx`
Shows active filters as dismissible pills above the results:
```
[Category: AI Voice Tools ×] [Free Plan ×] [Creator ×]  Clear all
```

---

## Part 4: Search Results Page

### `app/search/page.tsx`

Full search results page (for `?q=...` deep links):
- Tabs: All | Tools | Models | Skills | Glossary | Articles
- Results per tab
- Active query highlighted
- Filter panel on left
- "No results" state with suggestions

---

## Part 5: URL-Based Filter State

All library pages must support URL-based filter state so users can share filtered views and the Back button works correctly.

Pattern to implement on `/tools`, `/models`, `/skills`:
```
/tools?category=ai-voice&pricing=freemium&has_free_plan=true&sort=rating
/models?provider=anthropic&type=llm&input=text
/skills?difficulty=beginner&goal=automation&time=1-3hrs
```

Use Next.js `useSearchParams` on client and `searchParams` prop on server components.

---

## Done Criteria
- [ ] `Cmd+K` opens global search modal
- [ ] Search returns results from all content types
- [ ] Results grouped by type with navigation
- [ ] `useFilters` hook reads/writes URL params
- [ ] FilterSidebar renders on desktop at `/tools`, `/models`, `/skills`
- [ ] FilterSheet renders on mobile
- [ ] ActiveFilterTags shows and dismisses correctly
- [ ] `/search?q=...` page renders results with tabs
- [ ] Algolia sync script works (`npx ts-node scripts/sync-algolia.ts`)
- [ ] Supabase FTS fallback works when `SEARCH_PROVIDER=supabase`
- [ ] Keyboard navigation works in search modal
