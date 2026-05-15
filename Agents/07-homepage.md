# Agent 07 — Homepage & Services Page

## Goal
Build the Avelix homepage and the AI Automation Services page. The homepage is the primary conversion and orientation surface. The services page converts confused visitors into paying clients.

## Prerequisites
- Agents 01–05 complete (or component stubs ready)
- Layout components (Header, Footer) ready

---

## Homepage: `app/page.tsx`

The homepage answers one question above all: **"Where do I start?"**
It also clearly communicates what Avelix is for each visitor type.

### Section 1 — Hero
```
Headline: "Your Practical Map for the AI World"
Subheadline: "Find the right AI tool, learn the right skills, 
              and understand AI models — without getting lost."

Primary CTA button: "Find My AI Tool"  → /tools
Secondary CTA button: "Start Learning AI" → /guides

Background: subtle animated mesh gradient or particle field
```

### Section 2 — "Are you lost in AI?" Problem Statement
Three-column layout of common pain points:
```
Icon + "Too many AI tools"  → "We review and rank them for you"
Icon + "Don't know which model"  → "We compare them clearly"
Icon + "Not sure where to start"  → "We guide you step by step"
```

### Section 3 — What Avelix Helps You Do
Four cards with icons and CTAs:
```
1. Find the Right Tool     → /tools
2. Learn AI Skills         → /skills
3. Understand AI Models    → /models
4. Apply AI in Business    → /services
```

### Section 4 — Featured Tools
- Heading: "Top AI Tools This Month"
- 6 ToolCards (featured variant) — manually curated or highest-rated
- "Browse all 200+ tools →" link

### Section 5 — Popular AI Skill Paths
- Heading: "Where do you want to start?"
- 4–6 LearningPathCards
- "See all learning paths →" link

### Section 6 — Recently Updated Models
- Heading: "AI Model Updates"
- 3–4 ModelCards (compact) — most recently updated
- "Explore all models →" link

### Section 7 — "I want to..." Quick Navigation
```
A dropdown or button grid: "I want to..."
[ Write content ] [ Build an AI agent ] [ Automate my business ]
[ Generate images ] [ Clone a voice ] [ Build a chatbot ]
[ Research faster ] [ Create videos ] [ Learn prompt engineering ]
```
Each button links to filtered `/tools` or `/skills` page.

### Section 8 — From the Avelix Blog
- 3 latest articles (ArticleCard components)
- "Read all articles →" link

### Section 9 — AI Terms Explained
- 6 GlossaryTermCards in a grid
- "Browse full AI glossary →" link

### Section 10 — "Need Help Building?"
Full-width CTA banner:
```
Heading: "Skip the learning curve. We'll build it for you."
Subtext: "From AI workflow automation to custom AI agents — we design, 
          build, and deploy AI solutions for your business."
CTA: "See Our Services" → /services
Secondary: "Book a Free Call" → calendly link
```

### Section 11 — Social Proof / Trust Signals
- Number badges: "X tools reviewed", "Y AI models tracked", "Z skills available"
- Latest content updates (last sync date)

---

## Services Page: `app/services/page.tsx`

**Positioning statement (hero):**
```
"Lost between AI tools, models, and prompts?
Avelix helps you choose the right path. 
If you need it built — we build it."
```

### Section 1 — Hero
- Headline + subheadline
- CTA: "Book a Free Strategy Call"
- Trust: "Trusted by businesses in Saudi Arabia & UAE"

### Section 2 — Services Grid
Each service as a card with:
- Icon + service name
- One-line description
- "Who it's for" note
- CTA: "Learn More" → `/services/[slug]`

Services to display:
```
1. AI Workflow Consultation
2. AI Tool Selection & Strategy
3. n8n Workflow Development
4. UGC Content Automation System
5. AI Content Automation
6. AI Customer Support Agent
7. AI Sales Assistant
8. AI Research Automation
9. AI Reporting & Analytics Automation
10. AI Chatbot / Agent Setup
11. MCP & Tool Integration
12. Business Process Automation
13. Custom AI Solution Design
```

### Section 3 — How It Works
4-step process:
```
1. Discovery Call (free)
2. Strategy & Tool Selection
3. Build & Test
4. Deploy & Train
```

### Section 4 — Who This Is For
```
Business Owners → save time on manual tasks
Marketing Teams → automate content pipelines
Operations Teams → streamline repetitive workflows
Founders → build AI-powered products faster
```

### Section 5 — Common Problems We Solve
Problem/solution card pairs:
```
"I don't know which AI tools are right for my business" 
→ We audit your workflow and recommend the exact stack

"I tried n8n but got stuck"
→ We build and deploy the workflow for you

"I want to automate my customer support"
→ We build a custom AI agent trained on your data
```

### Section 6 — Contact / Book a Call
```
Embedded Calendly widget OR simple contact form:
- Name
- Business / Role
- What do you want to automate?
- Budget range
- Submit button
```

Form submits to Supabase (leads table) + Resend notification email to admin.

---

## Components to Build

### `components/layout/Header.tsx`
```
Logo | Nav links: Tools, Models, Skills, Guides, Glossary, Services
Right: Search icon + "Book a Call" CTA button
Mobile: hamburger → slide-out menu
Sticky on scroll, subtle backdrop blur
```

### `components/layout/Footer.tsx`
```
Columns: About Avelix | Libraries | Learn | Services | Social links
Bottom bar: "Kept up to date daily. Powered by Avelix."
Last sync timestamp
```

### `components/shared/ServiceCard.tsx`
```
Props: service (title, description, who_its_for, slug)
Displays: icon, name, description, who_its_for, CTA link
```

---

## Done Criteria
- [ ] Homepage renders all 11 sections
- [ ] "I want to..." quick nav links work correctly
- [ ] Hero CTAs link to correct pages
- [ ] Services page renders all service cards
- [ ] Contact form submits to Supabase `leads` table
- [ ] Admin receives Resend email on form submission
- [ ] Header navigation works on mobile
- [ ] Footer renders with correct links
- [ ] Mobile responsive (test at 375px, 768px, 1280px)
- [ ] Lighthouse performance score > 90
