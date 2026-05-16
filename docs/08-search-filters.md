# Agent 08 — Search & Filters System

## What Was Built

A global Cmd+K command palette search, an `/api/search` endpoint with Algolia + mock fallback, a dedicated `/search` results page with tabs, an `ActiveFilterTags` dismissible pill bar, a generic `useFilters` URL-aware hook, and a search trigger button in the header.

---

## Files Created / Modified

| File | Purpose |
|---|---|
| `hooks/useFilters.ts` | Generic URL-aware filter hook (reads/writes search params) |
| `app/api/search/route.ts` | GET `/api/search?q=...` — Algolia multi-index search with mock fallback |
| `components/library/GlobalSearch.tsx` | Cmd+K command palette modal, mounted in root layout |
| `components/library/ActiveFilterTags.tsx` | Dismissible filter pill bar above results |
| `components/layout/SearchButton.tsx` | Header button that opens GlobalSearch via custom DOM event |
| `app/search/page.tsx` | Full search results page with All/Tools/Models/Skills/Glossary tabs |
| `app/layout.tsx` | Added `<GlobalSearch />` at root so Cmd+K works on every page |
| `components/layout/Header.tsx` | Added `<SearchButton />` |
| `components/pages/ToolsLibraryClient.tsx` | Wired in `ActiveFilterTags` |

---

## Key Decisions

### GlobalSearch mounts in layout — uses custom DOM event for header trigger
GlobalSearch needs to be available on every page (Cmd+K works anywhere). It lives in `app/layout.tsx`. The Header's `SearchButton` is a small client component that fires `window.dispatchEvent(new Event('avelix:search-open'))`. GlobalSearch listens for this event. No global state store needed.

### Search API route (server-side) with two modes
`/api/search` checks for Algolia env vars at runtime:
- **Algolia**: `algoliasearch` v5 `client.search({ requests: [...] })` multi-index query across `tools`, `models`, `skills`
- **Mock**: in-memory substring filter across MOCK_TOOLS, MOCK_MODELS, MOCK_SKILLS, MOCK_GLOSSARY

The Algolia glossary index isn't synced (only tools/models/skills are in sync-algolia script). Glossary search always uses mock/Supabase path; Algolia path returns empty `terms: []`.

### Keyboard navigation in GlobalSearch
Results are flattened to a single `allResults` array. The `activeIdx` state tracks position across all groups. Each result's flat index is computed via group offsets. ArrowUp/ArrowDown move through items; Enter navigates; Escape closes.

### `useFilters` hook signature
Generic — not tied to any content type. Requires three callbacks:
1. `toParams` — serialize filter object to URLSearchParams
2. `fromParams` — deserialize URLSearchParams back to filter object
3. `countActive` (optional) — count non-default active filters for badge display

Existing library pages use their own inline state management (which works well). `useFilters` is available as a shared option for future pages or for refactoring.

### Search page data strategy
Server Component fetches from the same query functions as the library pages. Conditionally skips fetch for hidden tabs to reduce latency:
```ts
show('tools') ? getTools({ search: q }) : Promise.resolve({ tools: [], total: 0 })
```
All four fetches still run in parallel via `Promise.all`.

---

## Architecture

```mermaid
graph TD
  A[User types Cmd+K] --> B[SearchButton dispatches avelix:search-open]
  B --> C[GlobalSearch opens modal]
  C --> D[User types query with 200ms debounce]
  D --> E[GET /api/search?q=...]
  E --> F{Algolia configured?}
  F -- yes --> G[Algolia multi-index search]
  F -- no --> H[Mock in-memory search]
  G & H --> I[Return grouped results]
  I --> C
  C --> J[User clicks See all results]
  J --> K[/search?q=...]
  K --> L[Server: parallel getTools + getModels + getSkills + getAllGlossaryTerms]
```

---

## Environment Variables Used

| Variable | Required | Fallback |
|---|---|---|
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | For Algolia search | Mock mode |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | For Algolia search | Mock mode |

---

## How to Test

1. `npm run dev`
2. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) — GlobalSearch modal opens
3. Type "chat" — results from Tools, Models appear
4. Press ↑↓ to navigate, Enter to open a result
5. Click "See all results" → `/search?q=chat` page loads
6. On `/search`, switch between tabs: All, Tools, Models, Skills, Glossary
7. Go to `/tools`, set a category filter — ActiveFilterTags pills appear above results
8. Click the × on a pill — that filter clears
9. Click "Clear all" — all filters reset
10. Test `GET /api/search?q=chatgpt` directly — verify JSON response with grouped results

---

## Known Limitations

- Glossary is not indexed in Algolia — always uses mock/Supabase path
- Search page shows up to 6 results per section; full results available via "See all →" links
- `useFilters` hook is built but not yet wired into the library pages (they use their existing inline state); available for future use
- `/search` page is not paginated — shows first page only from each query
