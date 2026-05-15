# Agent 06 — AI Glossary

## Goal
Build the AI Glossary: an alphabetically organized, SEO-optimized reference for AI terminology. Each term must be beginner-friendly, practically explained, and cross-linked to tools, skills, and guides.

## Prerequisites
- Agents 01–02 complete
- `glossary_terms` table populated with initial terms

## Pages to Build

### `app/glossary/page.tsx` — Glossary Index

**Layout:**
- Alphabet navigation bar (A–Z, sticky on desktop)
- Terms grouped by first letter
- Search bar (filters visible terms instantly, client-side)
- Total term count: "127 AI terms explained"

**Each term in the index list:**
- Term name (link to term page)
- One-line simple definition
- Category/type badge (optional)

---

### `app/glossary/[term]/page.tsx` — Individual Glossary Term Page

These pages rank well for "[term] meaning", "[term] explained", "what is [term] in AI" searches.

**Page structure:**

1. **Term & Quick Definition**
   - Large term heading
   - Simple 1–2 sentence definition (the "plain language" version)
   - Type badge (e.g., "Technical Concept", "Model Type", "Technique")

2. **Full Explanation**
   - 2–4 paragraphs, zero jargon, aimed at a curious non-developer
   - Use analogies where helpful

3. **Example**
   - Concrete, real-world example
   - Code example if relevant (with syntax highlighting)

4. **Why It Matters**
   - Why should someone care about this term?
   - "If you're using AI tools daily, you'll encounter this when..."

5. **Where It's Used**
   - List of contexts: tools, workflows, models, skills

6. **Related Tools**
   - ToolCard (compact) — tools where this term is relevant

7. **Related Skills**
   - SkillCard (compact) — skills to learn more

8. **Related Terms**
   - Term pill links (e.g., "RAG" page links to "Vector Database", "Embedding", "LLM")

9. **Go Deeper**
   - Related article cards
   - External resource links (official docs)

---

## Seed Glossary Terms

The following terms must be seeded in the database at launch:

```
AI Agent, MCP (Model Context Protocol), RAG (Retrieval-Augmented Generation),
LLM (Large Language Model), Token, Context Window, Fine-tuning,
Function Calling, Tool Calling, API, Embeddings, Vector Database,
Prompt Engineering, System Prompt, Chain of Thought, Multimodal AI,
Sub-agent, Workflow, Automation, Model, Dataset, Hallucination,
Inference, Reasoning Model, Temperature, Top-P, Zero-shot, Few-shot,
Grounding, Guardrails, Transformer, Attention Mechanism, RLHF,
Instruction Tuning, Quantization, LoRA, Sampling, Latency,
Throughput, Rate Limit, Webhook, n8n, Make, Zapier (as concepts),
AI Avatar, Voice Cloning, Text-to-Speech, Image Generation,
Stable Diffusion, Diffusion Model, Prompt, Negative Prompt,
Seed, CFG Scale, ControlNet, Inpainting
```

Create a seed file at `supabase/seeds/glossary.sql` with at least 30 terms fully populated.

---

## Components to Build

### `components/library/GlossaryTermCard.tsx`
```
Props: term (id, title, slug, simple_definition)
Displays: term name + simple definition
Used in: index page, related terms sections
```

### `components/shared/AlphabetNav.tsx`
```
Props: activeLetter, availableLetters[]
Displays: A-Z row, grays out letters with no terms
On click: scrolls to that letter section
Behavior: sticks to top on desktop scroll
```

### `components/shared/TermPill.tsx`
```
Props: term (title, slug)
Displays: small clickable pill linking to term page
Used in: related terms, inline cross-links
```

---

## SEO Requirements

- Title: `What is {Term}? — AI Glossary | Avelix`
- Description: derived from `simple_definition`
- URL: `/glossary/[term-slug]` (slugified, lowercase, hyphens)
- FAQ structured data: question = "What is {term}?", answer = `simple_definition` + first paragraph
- Terms with multiple names (e.g., "Function Calling" also known as "Tool Calling") → canonical on one, redirect from the other

---

## Done Criteria
- [ ] `/glossary` page renders with alphabet nav
- [ ] Alphabet nav scrolls to correct section
- [ ] Search box filters visible terms instantly (client-side, no network call)
- [ ] `/glossary/[term]` renders all sections
- [ ] At least 30 terms seeded in database
- [ ] Related terms show as clickable pills
- [ ] FAQ structured data present on each term page
- [ ] Mobile responsive
