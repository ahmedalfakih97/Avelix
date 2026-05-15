# Agent 04 — AI Models Library

## Goal
Build the AI Models Library: listing page, individual model pages, and model comparison pages. The goal is not technical depth — it is practical guidance: "which model should I use for this task?"

## Prerequisites
- Agent 01 and 02 complete
- `models` table populated with seed data

## Pages to Build

### `app/models/page.tsx` — Models Library Index

Same layout pattern as Tools Library (from Agent 03).

**Filter groups:**
```
provider        → OpenAI | Anthropic | Google | Meta | Mistral | etc.
model_type      → llm | reasoning | image | video | audio | embedding | coding
use_case        → writing | coding | research | automation | agents | etc.
input_type      → text | image | audio | video | code
output_type     → same as input
is_open_source  → boolean toggle
has_api         → boolean toggle
pricing         → free | paid | open-source
```

**Sort options:** "Most Used", "Newest Release", "Best for Beginners", "Best Context Window"

---

### `app/models/[slug]/page.tsx` — Individual Model Page

**Page structure:**

1. **Hero Section**
   - Provider logo + model name
   - Model type badge (LLM, Image, Video, etc.)
   - Current status badge (Active / Preview / Deprecated)
   - Short description
   - "View Official Docs" link
   - Release date
   - Last reviewed date

2. **What is [Model]?**
   - Plain-language explanation (no jargon)

3. **Best For**
   - Practical task cards: Writing, Coding, Research, Reasoning, Agents, etc.
   - Each card: icon + label + brief note

4. **Technical Specs** (presented simply)
   - Context window: "Can read/remember up to X,000 words at once"
   - Input types: icon badges
   - Output types: icon badges
   - Speed: Fast / Medium / Slow badge
   - Open source: Yes/No badge

5. **Strengths & Weaknesses**
   - Two columns, plain language

6. **Pricing**
   - Pricing model
   - Summary (e.g., "Free via ChatGPT, paid via API")
   - Link to pricing page

7. **Compared With Similar Models**
   - Inline mini-comparison table
   - Links to full comparison pages

8. **Use in Avelix Tools**
   - Which tools in the Tools Library use or support this model

9. **Example Prompts**
   - 3–5 copyable prompts demonstrating model strengths

10. **Related Skills**
    - E.g., "Prompt Engineering for Claude", "AI Research with Gemini"

11. **Changelog**
    - Timeline of version updates and feature additions

---

### `app/compare/page.tsx` — Comparisons Index

Grid of comparison pages, organized by:
- Popular comparisons
- By use case
- By provider

Pre-built comparison slugs to support:
```
chatgpt-vs-claude
chatgpt-vs-gemini
claude-vs-gemini
perplexity-vs-chatgpt
best-model-for-writing
best-model-for-coding
best-model-for-research
best-model-for-content-creation
best-model-for-ai-agents
best-model-for-business-automation
open-source-vs-closed-source
```

---

### `app/compare/[slug]/page.tsx` — Comparison Page

**For head-to-head (e.g., ChatGPT vs Claude):**

1. Hero: "ChatGPT vs Claude — Which Should You Use?"
2. Quick verdict (3 sentences, user type based)
3. Side-by-side comparison table:
   - Best for
   - Not ideal for
   - Pricing
   - Context window
   - Speed
   - API availability
   - Open source
   - Strengths
   - Weaknesses
4. Real use case examples (3 scenarios)
5. Final recommendation by user type:
   - For beginners: [recommendation]
   - For content creators: [recommendation]
   - For developers: [recommendation]
   - For businesses: [recommendation]
6. Related tools that use each model
7. CTA: "Need help choosing? Book a free consultation"

**For "Best model for X" pages:**
- Ranked list with brief rationale
- Same structured comparison table
- Use case examples

---

## Components to Build

### `components/library/ModelCard.tsx`
```
Props: model (partial)
Displays: provider logo, name, model_type badge, short_description,
          input/output type icons, best_for tags, pricing badge
Variants: default, compact, featured
```

### `components/pages/ComparisonPage.tsx`
```
Props: comparison (full comparison object)
Handles both: head-to-head and "best for" comparison formats
```

### `components/shared/ComparisonTable.tsx`
```
Props: items[], fields[]
Displays: responsive comparison table (horizontal scroll on mobile)
Features: highlight "winner" per row
```

### `components/shared/SpecBadge.tsx`
```
Props: type ('speed' | 'context' | 'open-source' | 'api'), value
Displays: icon + label badge
```

---

## SEO Requirements

Model pages:
- Title: `{Model Name} by {Provider} — Use Cases, Pricing & Review | Avelix`
- Schema.org: no direct schema type, use `Article` or `TechArticle`

Comparison pages:
- Title: `{Model A} vs {Model B} — Which is Better in {year}? | Avelix`
- These pages have high search intent — optimize descriptions carefully

---

## Done Criteria
- [ ] `/models` page renders with filters
- [ ] `/models/[slug]` renders all sections
- [ ] `/compare` index page renders
- [ ] `/compare/[slug]` renders comparison table correctly
- [ ] ComparisonTable highlights differences
- [ ] ModelCard has 3 variants
- [ ] Mobile responsive
- [ ] All SEO metadata generated
