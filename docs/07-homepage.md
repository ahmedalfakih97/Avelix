# Agent 07 — Homepage & Services Page

## What Was Built

The Avelix homepage (`/`) and AI Automation Services page (`/services`), plus a mobile navigation menu and a server-side contact form.

---

## Files Created / Modified

| File | Purpose |
|---|---|
| `app/page.tsx` | Homepage — 11 sections, replaces the old `/tools` redirect |
| `app/services/page.tsx` | Services page — 13 services, how-it-works, contact form |
| `app/services/actions.ts` | Server Action for contact form submission |
| `components/layout/MobileMenu.tsx` | Client component: hamburger + slide-down nav for mobile |
| `components/shared/ServiceCard.tsx` | Service offering card |
| `components/pages/ContactForm.tsx` | Client form: validates, calls Server Action, shows success/error |
| `lib/queries/tools.ts` | Added `getFeaturedTools(limit)` |
| `lib/queries/models.ts` | Added `getRecentModels(limit)` |
| `components/layout/Header.tsx` | Added mobile hamburger via `MobileMenu` import |

---

## Key Decisions

### Homepage sections order
Follows the agent spec exactly: Hero → Problem Statement → Features → Tools → Paths → Models → Quick Nav → Blog → Glossary → Services CTA → Trust Signals. Sections alternate between `bg-electromagnetic-ink` and `bg-surface-container-lowest` to create visual rhythm.

### `useTransition` instead of `useActionState`
Next.js 14 ships React 18 where `useActionState` (React 19+) and `useFormState` (React 18 canary, not reliably exported) are unavailable. The ContactForm uses `useState` + `useTransition` to call the Server Action and track pending state — no external form library needed.

### Server Action with graceful failures
`submitContactForm` attempts Supabase insert and Resend email inside separate try/catch blocks. Either can fail (table not created, API key missing) without blocking the user-facing success response. This lets the form work in all environments.

### MobileMenu as isolated client component
Header stays a Server Component. `MobileMenu` is a `'use client'` component that manages toggle state. This avoids making the entire header interactive just for a hamburger.

### Blog section as static teasers
The blog isn't implemented yet (Agent future scope). Three hardcoded article teasers demonstrate the section design and link to `/blog`. Replace with a real query when the blog agent runs.

---

## How It Works

### Homepage data fetching
All data is fetched in parallel on the server:
```ts
const [featuredTools, recentModels, { paths: allPaths }, glossaryTerms] = await Promise.all([
  getFeaturedTools(6),
  getRecentModels(3),
  getLearningPaths(),
  getAllGlossaryTerms(),
])
```
`learningPaths` is sliced to 4 after fetch. `glossaryTerms` is sliced to 6 for the preview section.

### Quick Nav section
The "I want to..." section renders terminal-style code labels (e.g. `WRITE_CONTENT`) as links, plus human-readable labels below. Links target pre-filtered `/tools?search=X` or `/skills/slug` routes for immediate context-switching.

### Contact form flow
1. User fills form → `handleSubmit` captures `FormData`
2. `useTransition` wraps the Server Action call so the button shows "Transmitting..."
3. Server Action validates, inserts into Supabase `leads` table, sends Resend email
4. Returns `{ status, message }` → component shows success or error state

---

## Environment Variables Used

| Variable | Used By | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All queries (mock detection) | Missing → mock data used |
| `SUPABASE_SERVICE_ROLE_KEY` | `submitContactForm` Supabase insert | Missing → insert silently skipped |
| `RESEND_API_KEY` | `submitContactForm` email send | Missing → email silently skipped |

---

## Dependencies Added

| Package | Version | Reason |
|---|---|---|
| `resend` | ^6.12.3 | Email notification on contact form submission |

---

## Known Limitations

- **Blog section**: 3 static placeholder articles. Replace with `getRecentArticles()` once Agent 08 (blog) is implemented.
- **`leads` Supabase table**: Must be created manually. The Server Action handles the missing table gracefully (silent catch), but no lead is persisted until the table exists.
- **Resend domain**: Email `from` address uses `no-reply@avelix.ai`. This requires Avelix domain to be verified in Resend before it will send.

---

## How to Test

1. `npm run dev`
2. Visit `http://localhost:3000` — verify all 11 sections render
3. Resize to 375px — verify mobile hamburger appears and expands nav
4. Click "Find My AI Tool" — verify it goes to `/tools`
5. Click "Start Learning AI" — verify it goes to `/guides`
6. Visit `http://localhost:3000/services` — verify 13 service cards render
7. Submit the contact form — verify success state appears
8. Visit `http://localhost:3000/services#contact` — verify page scrolls to form

---

## Related Agents

- **Requires**: Agents 01–06 (Header, Footer, ToolCard, ModelCard, SkillCard, LearningPathCard, GlossaryTermCard must exist)
- **Depended on by**: Agent 08 (blog query should replace static teasers)
