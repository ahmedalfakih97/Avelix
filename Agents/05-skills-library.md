# Agent 05 — AI Skills Library

## Goal
Build the AI Skills Library and Learning Paths. This is the most educational section of Avelix — it helps users learn what they need based on their goal, not random tutorials.

## Prerequisites
- Agents 01–02 complete
- `skills` and `learning_paths` tables populated

## Pages to Build

### `app/skills/page.tsx` — Skills Library Index

**Layout:** Category-first browsing (not just a flat list).

Display skills grouped by category:
- Prompt Engineering
- AI Content Creation
- AI Automation
- AI for Business
- AI Agents & MCP
- AI for Creators
- (etc. — from categories table)

**Toggle view:** Category browse ↔ Full list with filters

**Filter groups:**
```
difficulty      → beginner | intermediate | advanced
goal            → learn | build | automate | create | research
time_required   → '<1hr' | '1-3hrs' | '3-8hrs' | '8hrs+'
user_type       → creator | developer | business | beginner | freelancer
tools_needed    → tool slugs (multi-select)
related_models  → model slugs (multi-select)
```

---

### `app/skills/[slug]/page.tsx` — Individual Skill Page

**Page structure:**

1. **Hero Section**
   - Skill name
   - Difficulty badge (Beginner / Intermediate / Advanced) with color coding
   - Estimated learning time (e.g., "~3 hours")
   - Category tag
   - Short description
   - "Start Learning" anchor link

2. **What Is This Skill?**
   - Plain-language explanation
   - `who_should_learn` section
   - `why_it_matters` section

3. **Tools You'll Need**
   - ToolCard (compact) for each required tool
   - "Related tools" section below

4. **Learning Path** (core section)
   - Numbered step cards
   - Each step: title, description, estimated time, resources/links
   - Visual progress indicator (step 1 of 6, etc.)

5. **Practical Examples**
   - Real-world example cards
   - Each: scenario + how this skill applies

6. **Common Mistakes**
   - Warning list with explanations

7. **Recommended Prompts**
   - Copyable prompt blocks specific to this skill

8. **Related AI Models**
   - ModelCard (compact) with "best for this skill" label

9. **Related Workflows**
   - WorkflowCard (compact)

10. **Related Skills**
    - SkillCard (compact) — prerequisite skills + next skills

11. **Related Articles & Videos**
    - Article card list

12. **Done-for-You CTA**
    - "Need someone to build this for you?"
    - Link to relevant service page

---

### `app/guides/page.tsx` — Learning Paths Index

**Layout:** Card grid of learning paths, with "Who is this for?" as the primary navigation:
- I'm a beginner (→ Start Learning AI from Zero)
- I'm a business owner (→ AI for Business Owners)
- I'm a content creator (→ AI for Content Creators)
- I'm a developer (→ AI Automation with n8n)
- (etc.)

---

### `app/guides/[slug]/page.tsx` — Individual Learning Path

**Page structure:**

1. **Hero**
   - Path title and goal statement
   - Who it's for
   - Required level
   - Total estimated hours
   - Module count

2. **What You'll Achieve**
   - Outcome statement
   - Mini projects list

3. **Modules** (core content)
   - Numbered accordion or step list
   - Each module: title, description, skill cards, tool cards, estimated time

4. **Recommended Tools**
   - ToolCard grid (compact)

5. **Recommended Models**
   - ModelCard grid (compact)

6. **Practice Tasks**
   - Checklist of hands-on exercises

7. **Completion Checklist**
   - Interactive checklist (client component, localStorage)

8. **Related Articles & Videos**

9. **CTA: Need help implementing?**

---

## Components to Build

### `components/library/SkillCard.tsx`
```
Props: skill (partial)
Displays: name, difficulty badge, category, estimated_hours,
          short_description, required tools (icon list)
Variants: default (grid), compact (related), featured
```

### `components/library/LearningPathCard.tsx`
```
Props: path (partial)
Displays: title, who_its_for, required_level, estimated_hours,
          module count, skill count
```

### `components/pages/SkillPage.tsx`
Full skill page layout component.

### `components/shared/LearningStep.tsx`
```
Props: step (order, title, description, time, resources)
Displays: numbered card with expandable details
```

### `components/shared/ProgressIndicator.tsx`
```
Props: total, current
Displays: step X of Y with visual progress bar
```

### `components/shared/PromptBlock.tsx`
```
Props: prompt (text, title, variables)
Features: copy to clipboard, variable highlighting, model label
```

---

## SEO Requirements

Skill pages:
- Title: `How to {Skill Name} with AI — Step-by-Step Guide | Avelix`
- These pages target "how to use AI for X" searches — high intent

Guide pages:
- Title: `AI Learning Path for {Audience} — Start Here | Avelix`

---

## Done Criteria
- [ ] `/skills` page renders with category grouping and filter toggle
- [ ] `/skills/[slug]` renders all sections
- [ ] `/guides` page renders with audience-first layout
- [ ] `/guides/[slug]` renders module accordion
- [ ] SkillCard has 3 variants
- [ ] PromptBlock has clipboard copy
- [ ] LearningPathCard renders correctly
- [ ] Mobile responsive
- [ ] SEO metadata generated for all pages
