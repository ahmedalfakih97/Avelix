# Avelix — Claude Code Skills Manifest

This file tells Claude Code which skills to load before running each agent.
**Always read every listed skill BEFORE executing agent instructions.**
Skills are loaded from your Claude Code skill library.

---

## How to Load Skills in Claude Code

```bash
# In your Claude Code prompt, say:
Read these skills first: frontend-design, next-best-practices, vercel-react-best-practices
Then execute agents/03-tools-library.md
```

---

## Master Skills Reference

All skills confirmed available in your library, mapped to Avelix needs:

| Skill | Category | Used By |
|---|---|---|
| `frontend-design` | UI | Agents 00, 03–09 |
| `frontend` | UI | Agents 03–09 |
| `web-design-guidelines` | UI | Agents 00, 03–09 |
| `ui-toolkit-web` | UI | Agents 03–09 |
| `design-system` | UI | Agents 00, 03–07 |
| `design-patterns` | UI | Agents 03–09 |
| `ux-principles` | UI | Agents 03–07 |
| `ux-copy` | Copy | Agents 00, 06, 07 |
| `design-handoff` | UI | Post-launch |
| `design-critique` | UI | Post-launch |
| `next-best-practices` | Next.js | Agents 01–10 |
| `next-cache-components` | Next.js | Agents 03, 04, 05 |
| `vercel-composition-patterns` | Next.js | Agents 01–09 |
| `vercel-react-best-practices` | Next.js | Agents 03–10 |
| `vercel-react-view-transitions` | Next.js | Agents 03, 05, 07 |
| `vercel-cli-with-tokens` | Deploy | Agent 13 |
| `deploy-to-vercel` | Deploy | Agent 13 |
| `deploy-checklist` | Deploy | Agent 13 |
| `devops-cicd` | Deploy | Agent 13 |
| `javascript-typescript` | Code | Agents 01–10 |
| `database` | DB | Agent 02 |
| `sql` | DB | Agents 02, 12 |
| `sql-queries` | DB | Agents 02, 12 |
| `validate-data` | DB | Agents 02, 09, 11, 12 |
| `search` | Search | Agent 08 |
| `search-strategy` | Search/SEO | Agents 08, 10 |
| `seo-audit` | SEO | Agents 10, 13 |
| `schema-markup` | SEO | Agents 06, 10 |
| `programmatic-seo` | SEO | Agents 06, 10 |
| `site-architecture` | SEO | Agents 01, 10 |
| `performance-optimization` | Perf | Agents 01, 08, 13 |
| `security-practices` | Security | Agents 02, 09, 11 |
| `testing-strategy` | Testing | Agents 03–09 |
| `testing-strategies` | Testing | Agents 03–09 |
| `webapp-testing` | Testing | Agents 03–09 |
| `form-cro` | CRO | Agent 07 |
| `page-cro` | CRO | Agent 07 |
| `onboarding-cro` | CRO | Agent 07 |
| `signup-flow-cro` | CRO | Agent 07 |
| `copywriting` | Copy | Agent 07 |
| `content-strategy` | Copy | Agents 00, 07 |
| `social-content` | Content | Agent 11 |
| `mcp-builder` | AI/n8n | Agent 11 |
| `mcp-integration` | AI/n8n | Agent 11 |
| `launch-strategy` | Launch | Agent 13 |
| `marketing-ideas` | Launch | Agents 07, 13 |
| `pricing-strategy` | Launch | Agent 07 |
| `free-tool-strategy` | Launch | Agent 07 |
| `directory-submissions` | Launch | Agent 13 |
| `data-visualization` | Admin | Agent 09 |
| `explore-data` | Admin | Agent 09 |
| `prd-development` | Product | Reference |
| `documentation` | Docs | All agents |

---

## Skills Per Agent — Full Map

### Agent 00 — Visual Identity
```
frontend-design          ← LOAD FIRST
web-design-guidelines
design-system
content-strategy
ux-copy
copywriting
```

### Agent 01 — Project Scaffold
```
next-best-practices      ← LOAD FIRST
vercel-composition-patterns
javascript-typescript
site-architecture
performance-optimization
documentation
```

### Agent 02 — Database Schema
```
database                 ← LOAD FIRST
sql
sql-queries
validate-data
javascript-typescript
security-practices
```

### Agent 03 — Tools Library
```
frontend-design          ← LOAD FIRST
frontend
web-design-guidelines
design-system
design-patterns
ui-toolkit-web
ux-principles
next-best-practices
next-cache-components
vercel-react-best-practices
vercel-react-view-transitions
vercel-composition-patterns
javascript-typescript
testing-strategy
webapp-testing
performance-optimization
```

### Agent 04 — Models Library
```
frontend-design          ← LOAD FIRST
frontend
web-design-guidelines
design-system
design-patterns
ui-toolkit-web
next-best-practices
next-cache-components
vercel-react-best-practices
vercel-composition-patterns
javascript-typescript
testing-strategy
webapp-testing
```

### Agent 05 — Skills Library
```
frontend-design          ← LOAD FIRST
frontend
web-design-guidelines
design-system
ui-toolkit-web
ux-principles
next-best-practices
next-cache-components
vercel-react-best-practices
vercel-react-view-transitions
javascript-typescript
testing-strategy
webapp-testing
```

### Agent 06 — Glossary
```
frontend-design          ← LOAD FIRST
frontend
web-design-guidelines
ux-principles
ux-copy
next-best-practices
vercel-react-best-practices
javascript-typescript
schema-markup
seo-audit
programmatic-seo
```

### Agent 07 — Homepage & Services
```
frontend-design          ← LOAD FIRST
frontend
web-design-guidelines
design-system
ui-toolkit-web
ux-principles
ux-copy
copywriting
content-strategy
form-cro
page-cro
onboarding-cro
signup-flow-cro
free-tool-strategy
pricing-strategy
marketing-ideas
next-best-practices
vercel-react-best-practices
vercel-react-view-transitions
javascript-typescript
testing-strategy
```

### Agent 08 — Search & Filters
```
frontend-design          ← LOAD FIRST
frontend
ui-toolkit-web
design-patterns
search
search-strategy
next-best-practices
vercel-react-best-practices
javascript-typescript
testing-strategy
webapp-testing
performance-optimization
```

### Agent 09 — Admin Panel
```
frontend-design          ← LOAD FIRST
frontend
ui-toolkit-web
design-patterns
security-practices
next-best-practices
vercel-react-best-practices
javascript-typescript
data-visualization
explore-data
validate-data
testing-strategy
webapp-testing
```

### Agent 10 — SEO
```
seo-audit                ← LOAD FIRST
schema-markup
search-strategy
programmatic-seo
site-architecture
next-best-practices
vercel-react-best-practices
javascript-typescript
```

### Agent 11 — Sync Pipeline (n8n)
```
mcp-builder              ← LOAD FIRST
mcp-integration
social-content
content-strategy
validate-data
security-practices
```

### Agent 12 — Data Seeding
```
database                 ← LOAD FIRST
sql
sql-queries
validate-data
```

### Agent 13 — Deployment & Launch
```
deploy-to-vercel         ← LOAD FIRST
deploy-checklist
vercel-cli-with-tokens
devops-cicd
performance-optimization
security-practices
seo-audit
launch-strategy
marketing-ideas
directory-submissions
```

---

## Phase 2 Skills (Post-Launch)

Load these when building advanced features after MVP launch:

| Skill | When |
|---|---|
| `design-critique` | After first user feedback round |
| `design-handoff` | When handing UI to another developer |
| `prd-development` | Writing PRDs for Phase 2 features |
| `roadmap-planning` | Phase 2 roadmap planning |
| `user-story` | Breaking down Phase 2 features |
| `content-creation` | Producing blog articles from sync data |
| `social-content` | Building social → website link pipeline |
| `lead-magnets` | Email capture and nurture setup |
| `email-sequence` | Newsletter launch |
| `paid-ads` | Paid acquisition campaigns |
| `referral-program` | Referral system on services page |
| `competitive-intelligence` | Ongoing competitor tracking |
| `free-tool-strategy` | Free tool lead magnets (Phase 2) |

---

## Avelix Design Contract

> Full design system is in `DESIGN.md` — always read it before building any UI.
> Stitch HTML reference is at `design/reference.html` — read it for exact component structure.


Applied by every frontend agent (03–09). Non-negotiable.

### Logo
```
> Avelix▌

>     = #1A5C3A  (dim terminal green, Fira Code)
Avel  = #E8F4F8  (off-white, Fira Code Bold)
ix    = #00D4B4  (Electric Teal, Fira Code Bold)
▌     = #00D4B4  (blinking cursor)
bg    = #050A14  always
```

### Colors
```css
:root {
  --bg-base:        #050A14;
  --surface-1:      #0A1628;
  --surface-2:      #0F1E38;
  --surface-3:      #162544;
  --accent-primary: #00D4B4;
  --accent-secondary:#F5A623;
  --accent-glow:    rgba(0,212,180,0.15);
  --text-primary:   #E8F4F8;
  --text-secondary: #7A9BB5;
  --text-ghost:     #3D5A72;
  --border:         #162544;
  --border-active:  #00D4B4;
  --success:        #00D4B4;
  --warning:        #F5A623;
  --danger:         #FF5E6C;
}
```

### Fonts
```
Headings : Syne 700/800       — Google Fonts
Body     : Plus Jakarta Sans  — Google Fonts
Mono     : Fira Code 400/500  — Google Fonts

NEVER: Inter, Roboto, DM Sans, Space Grotesk, system fonts
```

### Cards
```
bg            : var(--surface-1)
border        : 0.5px solid var(--border)
border-left   : 2px solid transparent → #00D4B4 on hover
border-radius : 8px
hover         : border-left + bg → --surface-2, 150ms ease
shadow        : none
transform     : none (never scale, never lift)
```

### Badges
```
Beginner     : rgba(0,212,180,0.12)  / #00D4B4
Intermediate : rgba(245,166,35,0.12) / #F5A623
Advanced     : rgba(255,94,108,0.12) / #FF5E6C
Free         : rgba(0,212,180,0.12)  / #00D4B4
Freemium     : rgba(99,102,241,0.12) / #818CF8
Paid         : rgba(168,85,247,0.12) / #C4B5FD
Open-source  : rgba(245,166,35,0.12) / #F5A623
```

### Animations
```
Signal Scan    : teal line sweeps top→bottom on page load, once, 1.2s
Section reveal : Framer Motion, x:-16→0, opacity:0→1, stagger 0.08s
Card hover     : border-left only, 150ms — NO scale, NO bounce, NO lift
Button hover   : fill-sweep left→right via ::after, 200ms
Search focus   : border traces corners in teal, 300ms
```

### Layout
```
Max width : 1280px
Sidebar   : 260px
Grid      : 1col → 2col → 3–4col
Icons     : Lucide React only
```

### Done Checklist (every agent)
```
□ npm run build  — zero errors
□ npm run lint   — zero warnings
□ No TypeScript any types
□ 375px / 768px / 1280px visual check
□ All states tested: hover, focus, loading, empty, error
□ Lighthouse: Performance > 90, SEO = 100
```
