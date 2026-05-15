# DESIGN.md — Avelix Design Reference

This file is extracted from the Stitch-generated `design/reference.html`.
Every agent that builds UI must read this file before writing any component.
This is the single source of truth for all visual decisions.

---

## Source File
`design/reference.html` — Stitch-generated homepage reference.
Read it directly when you need exact HTML structure or Tailwind class names.

---

## Core Aesthetic

- Name: Avelix | Domain: avelix.ai | Tagline: Navigate the AI Universe.
- Feeling: High-velocity terminal. Precision instrument. No decoration.
- Dark mode: Always. No light mode. Background never pure black — always #050A14.
- Border radius: ZERO everywhere. No rounded corners on anything.
- Grid overlay: 20x20px grid lines in #162544 on hero/section backgrounds.
- Signal scan: Animated teal line sweeping top to bottom, 4s loop, hero only.

---

## Colors

Tailwind class names from reference.html config:

  bg-electromagnetic-ink        #050A14   page background
  bg-surface                    #0e131e   default surface
  bg-surface-container          #1a202a
  bg-surface-container-low      #161c26
  bg-surface-container-lowest   #080e18
  bg-surface-container-high     #242a35
  bg-surface-container-highest  #2f3540
  text-electric-teal            #00D4B4   primary accent
  text-primary                  #46f1cf   lighter teal
  text-signal-orange            #F5A623   secondary accent
  text-on-surface               #dde2f1   primary text
  text-on-surface-variant       #bacac4   secondary text
  text-data-dim                 #4A5568   muted labels
  border-terminal-border        #162544   all borders
  border-primary                #46f1cf

---

## Typography

  Display/Headlines : Syne 700/800 — font-headline or font-display — ALWAYS UPPERCASE
  Mono/Labels/Data  : JetBrains Mono 500/700 — font-mono
  Body/Description  : Plus Jakarta Sans 400/500 — font-body

Font sizes:
  text-display-lg   48px weight-800 tracking--0.02em  (hero headline)
  text-headline-md  24px weight-700                   (section headings)
  text-label-caps   11px weight-700 tracking-0.08em   (tags, labels)
  text-data-mono    13px weight-500 tracking--0.01em  (data, metadata)
  text-body-lg      16px weight-400                   (main body)
  text-body-sm      14px weight-400                   (smaller body)

Google Fonts import for layout.tsx:
  Syne:wght@700;800
  JetBrains+Mono:wght@500;700
  Plus+Jakarta+Sans:wght@400;500
  Material+Symbols+Outlined:wght,FILL@100..700,0..1

---

## Tailwind Config (tailwind.config.ts)

colors:
  electromagnetic-ink: '#050A14'
  electric-teal: '#00D4B4'
  signal-orange: '#F5A623'
  terminal-border: '#162544'
  data-dim: '#4A5568'
  primary: '#46f1cf'
  primary-container: '#00d4b4'
  surface: '#0e131e'
  surface-container: '#1a202a'
  surface-container-low: '#161c26'
  surface-container-lowest: '#080e18'
  surface-container-high: '#242a35'
  surface-container-highest: '#2f3540'
  on-surface: '#dde2f1'
  on-surface-variant: '#bacac4'
  secondary: '#ffb955'

borderRadius: { DEFAULT: '0px', lg: '0px', xl: '0px', full: '0px' }

fontFamily:
  display: ['Syne', 'sans-serif']
  headline: ['Syne', 'sans-serif']
  mono: ['JetBrains Mono', 'monospace']
  body: ['Plus Jakarta Sans', 'sans-serif']

---

## Global CSS (globals.css)

body { background-color: #050A14; color: #dde2f1; }

.grid-bg {
  background-image: linear-gradient(#162544 1px, transparent 1px), linear-gradient(90deg, #162544 1px, transparent 1px);
  background-size: 20px 20px;
}

.signal-scan {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 1px;
  background-color: #00D4B4;
  animation: scan 4s linear infinite;
}

@keyframes scan {
  0%   { top: 0%;   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.custom-scrollbar::-webkit-scrollbar { width: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #050A14; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #162544; }

---

## Component Patterns

### Header
fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-terminal-border h-16 px-4
Logo: > symbol in text-primary + AVELIX in font-headline text-primary uppercase
CTA button: border border-electric-teal text-electric-teal font-mono text-[10px] px-3 py-1.5 hover:bg-electric-teal/10

### Section Label
font-mono text-label-caps text-primary uppercase
Format: [SECTION_NAME] or SECTION_NAME_V01

### Version Tag (hero)
inline-block border border-primary px-2 py-0.5
font-mono text-label-caps text-primary uppercase
Example: Signal_Layer_v.1.04

### Primary Button (fill-sweep hover)
relative group bg-transparent border border-electric-teal text-electric-teal font-mono py-4 overflow-hidden
::after: absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300
Label duplicated: opacity-0 group-hover:opacity-100 text-electromagnetic-ink z-20

### Secondary Button
bg-transparent border border-terminal-border text-on-surface font-mono py-4 px-6 uppercase hover:border-primary transition-all

### Standard Card
border border-terminal-border p-5 bg-electromagnetic-ink hover:border-l-2 hover:border-primary transition-all

### Left-Border Accent Card (problem statement style)
border-l-2 border-primary pl-4 py-2
Metadata: font-mono text-label-caps text-data-dim uppercase — "01 // Label"
Title: font-headline text-headline-md text-on-surface uppercase
Body: font-body text-body-sm text-on-surface-variant
Inactive: border-l-2 border-terminal-border, hover:border-primary transition-colors

### Tool Grid
Container: grid grid-cols-2 gap-px bg-terminal-border border border-terminal-border
Cell: bg-electromagnetic-ink p-4 flex flex-col items-center text-center
Icon: material-symbols-outlined text-on-surface-variant mb-2
Label: font-mono text-[9px] text-primary uppercase

### Filter Pills
Inactive: border border-terminal-border px-4 py-2 font-mono text-[10px] text-on-surface hover:border-primary uppercase
Active:   border border-primary px-4 py-2 font-mono text-[10px] text-primary bg-primary/5 uppercase

### Progress Bar
Container: h-1 w-full bg-surface-container
Fill: h-full bg-primary (width set by progress %)

### Glossary Row
Container: grid grid-cols-1 gap-px bg-terminal-border
Row: bg-surface-container-lowest p-4 flex justify-between items-center hover:bg-surface-container-low
Term: font-mono text-on-surface uppercase
Arrow: text-data-dim text-xs — north_east icon

### Divider with Label
flex items-center gap-4
Left/right: h-px flex-1 bg-terminal-border
Center: font-mono text-label-caps text-on-surface-variant uppercase

### Metadata Row (inside cards)
flex justify-between items-start mb-4
Left:  font-mono text-[10px] text-primary  — PATH_01
Right: font-mono text-[10px] text-data-dim — LVL: EXPERT

### Icons
Material Symbols Outlined only.
className: material-symbols-outlined
Common: terminal, radar, query_stats, hub, security, memory, dataset, code,
        monitoring, webhook, settings_input_component, arrow_forward, north_east, rss_feed

---

## Page Layout Rules

All pages:
  <header> fixed h-16 z-50
  <main className="pt-16">
    sections stacked vertically, each border-t border-terminal-border
  <footer>

Section padding:
  py-12 px-4  compact (problem statement, quick nav)
  py-16 px-4  standard (features, tool grid, glossary)
  py-20 px-4  hero and CTA banner

Section backgrounds alternate:
  bg-electromagnetic-ink
  bg-surface-container-lowest
  bg-surface-container
  bg-surface

---

## Naming Convention (terminal style)

Apply across all pages:
  Section labels  : [TOOL_DIRECTORY], [MODEL_INDEX], [SKILL_MATRIX]
  Metadata        : CATEGORY: AI_VOICE | PLAN: FREEMIUM | API: TRUE
  Status tags     : Signal_Layer_v.1.04, SYNC: 2025-05-14
  Action buttons  : INITIATE_PROTOCOL, DECODE_LLM, TRACE_PATH
  Data fields     : font-mono uppercase text-[10px] text-data-dim

Per page:
  /tools    → [TOOL_DIRECTORY]   CATEGORY: X | PLAN: X | API: TRUE/FALSE
  /models   → [MODEL_INDEX]      PROVIDER: X | TYPE: X | CTX: 200K
  /skills   → [SKILL_MATRIX]     LVL: X | EST: X.XH | TOOLS: N
  /glossary → [GLOSSARY_V01]     CATEGORY: X | RELATED: N
  /compare  → [COMPARE_PROTOCOL] MODEL_A vs MODEL_B
  /admin    → [ADMIN_CONSOLE]    STATUS: PENDING | CONF: 87%
  /services → [SERVICE_CATALOG]  TIMELINE: 2W | STACK: N8N+SUPABASE

---

## Rules Every Frontend Agent Must Follow

1. Read DESIGN.md (this file) FIRST
2. Read design/reference.html for exact HTML structure
3. Zero border radius — everywhere, no exceptions
4. No shadows, no gradients, no blur on content elements
5. No Inter, Roboto, or system fonts
6. All labels and tags: font-mono uppercase
7. All headings: font-headline uppercase
8. All body text: font-body
9. All borders: border-terminal-border (#162544)
10. Primary accent: electric-teal (#00D4B4) — hover states, active borders, CTAs
11. Never invent new design patterns — extend from this file only
12. Material Symbols Outlined for all icons — never Lucide, never custom SVG

---

## Logo

**File:** `design/logo.png`
**Usage:** This is the canonical Avelix logo. Use it across all pages and components.

### Implementation

```tsx
import Image from 'next/image'

// Header logo
<Image
  src="/design/logo.png"
  alt="Avelix"
  width={120}
  height={32}
  priority
/>

// Favicon — reference in app/layout.tsx metadata
export const metadata = {
  icons: {
    icon: '/design/logo.png',
  },
}
```

### Copy to public folder (required for Next.js)

The logo must be copied to the `public/` folder so Next.js can serve it:

```bash
cp design/logo.png public/logo.png
```

Then reference it as `/logo.png` in all components.

### Usage Rules

- Header: logo.png at height 32px, width auto
- Footer: logo.png at height 24px, width auto, opacity-60
- OG images: logo.png embedded in `/api/og/*` route responses
- Favicon: logo.png referenced in `app/layout.tsx` metadata icons
- Never stretch, recolor, or add effects to the logo
- Always on `#050A14` background — never on light backgrounds
- Minimum clear space: 16px on all sides
