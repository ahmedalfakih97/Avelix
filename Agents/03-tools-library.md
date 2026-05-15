# Agent 03 — AI Tools Library

## Goal
Build the complete AI Tools Library: listing page with filters, individual tool pages, and all supporting components.

## Prerequisites
- Agent 01 and 02 complete
- Database has `tools` and `categories` tables populated

## Pages to Build

### `app/tools/page.tsx` — Tools Library Index

**Features:**
- Responsive grid of ToolCard components
- Left sidebar with filters (on desktop) / bottom sheet (on mobile)
- Search bar (live search via Supabase full-text or Algolia)
- Filter state managed in URL params (for shareable filtered URLs)
- Pagination or infinite scroll (infinite scroll preferred)
- Total count display: "247 AI tools"
- Sort options: "Most Relevant", "Newest", "Top Rated", "Free First"

**Filter groups (all URL-param driven):**
```
category        → select from categories table
use_case        → multi-select
user_type       → creator | developer | business | beginner
pricing         → free | freemium | paid | open-source
has_free_plan   → boolean toggle
has_api         → boolean toggle
no_code         → boolean toggle
arabic_support  → boolean toggle
platform        → web | ios | android | desktop
```

**URL example:**
`/tools?category=ai-writing&pricing=freemium&has_free_plan=true`

---

### `app/tools/[slug]/page.tsx` — Individual Tool Page

Generate static pages with `generateStaticParams()` for all published tools.

**Page structure (in order):**

1. **Hero Section**
   - Tool logo (from Clearbit or stored screenshot)
   - Tool name + provider
   - Short description
   - "Best for" tags (colored badges)
   - "Try Tool" button (external link)
   - "Need help building with this?" CTA button
   - Last reviewed date

2. **What is [Tool]?**
   - Long description rendered as rich text

3. **Best Use Cases**
   - Grid of use case cards with icons

4. **Who Should Use It**
   - User type tags with explanation

5. **Main Features**
   - Bullet list or feature cards

6. **Pros & Cons**
   - Two-column layout

7. **Pricing**
   - Pricing model badge
   - Free plan indicator
   - Pricing summary
   - Link to official pricing page

8. **Avelix Rating**
   - Star rating + recommendation text

9. **Related Skills**
   - SkillCard components (compact)

10. **Similar Tools / Best Alternatives**
    - ToolCard components (compact)

11. **Example Prompts**
    - Copyable prompt blocks

12. **Related Articles**
    - Article card list

13. **CTA Block**
    - "Need help building with [Tool]?"
    - Book a call / contact form link

14. **Changelog**
    - Timeline of updates from `changelogs` table

---

## Components to Build

### `components/library/ToolCard.tsx`
```
Props: tool (partial tool object)
Displays: logo, name, short_description, category, pricing badge, 
          "best for" tags, free plan indicator, Avelix rating
Variants: default (grid), compact (related items list), featured (homepage)
```

### `components/library/FilterBar.tsx`
```
Props: filters (object), onChange (callback), totalCount
Displays: all filter groups, active filter count, "Clear all" button
Mobile: renders as collapsible accordion
Desktop: renders as sticky sidebar
```

### `components/library/SearchBox.tsx`
```
Props: value, onChange, placeholder
Features: debounced input (300ms), clear button, search icon
```

### `components/shared/CTABlock.tsx`
```
Props: title, description, primaryCTA, secondaryCTA
Variants: tool-cta, service-cta, guide-cta
```

### `components/shared/RelatedItems.tsx`
```
Props: title, items[], itemType ('tool' | 'model' | 'skill')
Displays: horizontal scroll on mobile, grid on desktop
```

---

## Data Fetching Pattern

All tool pages use React Server Components for data fetching:
```typescript
// app/tools/[slug]/page.tsx
export async function generateStaticParams() {
  const tools = await getPublishedToolSlugs(); // all published slugs
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const tool = await getToolBySlug(params.slug);
  return {
    title: `${tool.title} — Avelix`,
    description: tool.short_description,
    openGraph: { ... }
  };
}

export default async function ToolPage({ params }) {
  const tool = await getToolBySlug(params.slug);
  const relatedTools = await getRelatedTools(tool.related_tool_slugs);
  const relatedSkills = await getRelatedSkills(tool.related_skill_slugs);
  const changelog = await getToolChangelog(tool.id);
  
  return <ToolPageContent tool={tool} relatedTools={relatedTools} relatedSkills={relatedSkills} changelog={changelog} />;
}
```

---

## SEO Requirements

Each tool page must have:
- `<title>`: `{Tool Name} Review — Best for {use_case} | Avelix`
- `<meta description>`: derived from short_description
- Open Graph image: auto-generated with tool name + category
- Schema.org `SoftwareApplication` or `WebApplication` structured data
- Canonical URL
- `dateModified` = `last_reviewed_at`

---

## Done Criteria
- [ ] `/tools` page renders with filter sidebar and tool grid
- [ ] Filters update URL params and re-filter results
- [ ] `/tools/[slug]` renders all sections for a test tool
- [ ] `generateStaticParams` works for all published tools
- [ ] `generateMetadata` returns correct SEO fields
- [ ] ToolCard component has 3 variants (default, compact, featured)
- [ ] Mobile responsive (test at 375px)
- [ ] No TypeScript errors
