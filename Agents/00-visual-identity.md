# Agent 00 — Visual Identity & Animated Web Design (Avelix)

## Role
You are a world-class creative director and UI/UX designer specializing in AI-era web products.
Your job is NOT to write code yet. Your job is to:

1. Imagine and define the full visual identity for Avelix
2. Specify the animated, living aesthetic of the website
3. Produce a single master prompt that a code generator (v0, Bolt, Lovable, Cursor) can use to generate the full frontend

---

## Brand Name: Avelix
**Domain:** avelix.ai
**Tagline:** "Navigate the AI Universe."

The name Avelix is pure invention — two clean syllables, A-opening (approachable, global), hard X close (decisive, platform-grade). It carries no prior meaning, which means it becomes whatever the product makes it mean. The visual identity must fill that name with meaning from day one.

---

## Identity Concept: The Signal Layer

Avelix is not an observatory (too passive) and not a map (too static). Avelix is the **signal layer** — the clean frequency that cuts through AI noise and reaches you with exactly what you need.

The visual metaphor: **a precision signal field.** Think of how a radio telescope captures a single clean frequency from billions of light-years of noise. That is what Avelix does for AI — not by showing you everything, but by filtering to exactly what matters for you.

**Emotional register: Focused Velocity.** Not calm. Not chaotic. Moving with purpose. The feeling of a dashboard that knows what you need before you ask. Clean, fast, intentional.

---

## Design System

### Color Philosophy
Built around **deep electromagnetic ink** — `#050A14` — a blue-black that feels like signal space, not plain darkness. The accent is **Electric Teal** `#00D4B4` — not the generic teal of every AI startup, but a precise, scientific frequency. Cold and sharp like a laser. Warm enough to be inviting.

The secondary accent is **Avelix Amber** `#F5A623` — used sparingly for highlights, ratings, featured items. The amber creates tension against the teal that feels alive.

```css
:root {
  --bg-base: #050A14;
  --surface-1: #0A1628;
  --surface-2: #0F1E38;
  --surface-3: #162544;
  --accent-primary: #00D4B4;
  --accent-secondary: #F5A623;
  --accent-glow: rgba(0, 212, 180, 0.15);
  --text-primary: #E8F4F8;
  --text-secondary: #7A9BB5;
  --text-ghost: #3D5A72;
  --border: #162544;
  --border-active: #00D4B4;
  --success: #00D4B4;
  --warning: #F5A623;
  --danger: #FF5E6C;
}
```

### Typography
- **Display:** Syne (Google Fonts) — geometric, technical, futuristic without being cold. The "A" in Syne is distinctive and will anchor the Avelix wordmark.
- **Body:** Plus Jakarta Sans (Google Fonts) — modern, slightly wide, excellent dark-mode legibility. Not Inter. Not DM Sans.
- **Mono:** Fira Code (Google Fonts) — for model specs, context windows, API data. Ligatures on.

### Logo
A precision **signal waveform** compressed into a lettermark. The "A" of Avelix rendered in Syne Bold, with a single horizontal frequency line crossing through the midpoint of the A — like a signal scan. Clean. Geometric. The crossbar of the A IS the signal line. Color: #00D4B4 on dark, white on light.

### Animation Language
- **Hero background:** A slow-moving signal field — thin horizontal lines at varying opacity that drift upward at different speeds (parallax layers). Occasional bright pulse on a single line, like a signal ping. Pure CSS, no canvas needed.
- **Page load:** Content appears via a horizontal wipe from left — like a scan reading data. Duration 0.6s per element, staggered 0.08s.
- **Card hover:** Teal left-border glow intensifies (box-shadow: inset 3px 0 0 #00D4B4). Subtle background shift to --surface-3. No lift, no scale — this is a precision tool, not a toy.
- **Signature animation — "The Signal Scan":** When any library page loads, a single horizontal teal line sweeps top-to-bottom across the full viewport over 1.2s, then disappears. Like a radar sweep initializing. Happens once per page load.
- **Primary button:** Background is transparent with a teal border. On hover: fills with #00D4B4, text goes dark (#050A14). The fill sweeps in from left over 200ms.
- **Search focus:** The search bar border traces from corner to corner — a border-drawing animation in teal, 300ms.

### Component System
**Cards:**
- Background: --surface-1
- Border: 0.5px solid --border
- Border-left: 2px solid transparent (becomes --accent-primary on hover)
- Border-radius: 8px
- Hover: border-left color + background shifts to --surface-2, transition 150ms

**Badges:**
- Beginner: rgba(0,212,180,0.12) / #00D4B4
- Intermediate: rgba(245,166,35,0.12) / #F5A623
- Advanced: rgba(255,94,108,0.12) / #FF5E6C
- Free: rgba(0,212,180,0.12) / #00D4B4
- Freemium: rgba(99,102,241,0.12) / #818CF8
- Paid: rgba(168,85,247,0.12) / #C4B5FD
- Open Source: rgba(245,166,35,0.12) / #F5A623

---

## Master Frontend Code Generation Prompt

```
Build the homepage for Avelix (avelix.ai) — a practical AI learning and discovery platform. Not a SaaS landing page. Not a blog. A precision signal layer for the AI world.

BRAND CONCEPT:
Avelix cuts through AI noise like a signal through interference. The visual metaphor is a precision signal field — a radar/frequency aesthetic. The emotional register is Focused Velocity: purposeful, fast, intelligent. This should feel like a Bloomberg Terminal redesigned by a world-class product studio. Not dark mode for the sake of it — dark mode because this is a precision instrument.

TECH STACK:
- Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- Framer Motion for animations
- Google Fonts: Syne (display/headings) + Plus Jakarta Sans (body) + Fira Code (mono/data)

FONT IMPORTS:
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Fira+Code:wght@400;500&display=swap');

CSS VARIABLES — paste into globals.css:
:root {
  --bg-base: #050A14;
  --surface-1: #0A1628;
  --surface-2: #0F1E38;
  --surface-3: #162544;
  --accent-primary: #00D4B4;
  --accent-secondary: #F5A623;
  --accent-glow: rgba(0, 212, 180, 0.15);
  --text-primary: #E8F4F8;
  --text-secondary: #7A9BB5;
  --text-ghost: #3D5A72;
  --border: #162544;
  --border-active: #00D4B4;
  --success: #00D4B4;
  --warning: #F5A623;
  --danger: #FF5E6C;
}

GLOBAL STYLES:
background: #050A14
font-family: 'Plus Jakarta Sans', sans-serif
All headings: 'Syne', sans-serif
Data/specs: 'Fira Code', monospace
Zero white backgrounds anywhere.

SECTIONS TO BUILD:

1. NAVIGATION
Sticky. Height 60px. Background: rgba(5,10,20,0.9) + backdrop-blur(12px). Border-bottom: 0.5px solid #162544.
Logo left: SVG lettermark — "A" in Syne 800 weight, a single horizontal teal line (#00D4B4) crossing the midpoint of the A as the crossbar, with a small dot at the far right of the line like a signal endpoint. Wordmark "Avelix" in Syne 600 next to it, color #E8F4F8.
Nav center: Tools, Models, Skills, Guides, Glossary, Services — Plus Jakarta Sans 14px, color #7A9BB5, hover #E8F4F8, transition 150ms.
Right: search icon (teal) + "Get Started" button — transparent background, 0.5px solid #00D4B4, color #00D4B4, hover fills with #00D4B4 text goes #050A14, fill-sweep animation left-to-right 200ms.

2. HERO
Full-width, min-height 100vh.
Background: #050A14 base.
Signal field effect: 8 horizontal lines at y positions 15%, 25%, 38%, 50%, 62%, 74%, 85%, 93%. Each line: width 100%, height 0.5px, color rgba(0,212,180,0.08). Animate each line drifting upward at different speeds (CSS animation, 20s–40s loops, staggered). Occasional pulse: one line brightens to rgba(0,212,180,0.4) for 800ms then fades back. Stagger the pulses randomly across lines.
Large radial glow behind headline: radial-gradient(ellipse 600px 300px at 50% 45%, rgba(0,212,180,0.08) 0%, transparent 70%).
Top label: "AI Tools · Models · Skills · Guides · Workflows" — Fira Code 12px, color #00D4B4, letter-spacing 0.15em.
Headline: "Navigate the" line 1, "AI Universe." line 2 — Syne 800, 80px desktop. "AI Universe." in color #00D4B4.
Subheadline: "Find the right AI tool, learn the right skills, understand AI models — without the noise." — Plus Jakarta Sans 18px, color #7A9BB5, max-width 520px, centered.
Two CTAs: "Find My AI Tool" (primary: #00D4B4 border + fill-sweep hover) + "Start Learning →" (ghost: transparent, #3D5A72 border, hover border goes #00D4B4).
Load animation: signal field lines appear first at 0s. Radial glow fades in 0.2s. Label at 0.3s (horizontal wipe from left). Headline line 1 at 0.5s, line 2 at 0.65s. Subheadline at 0.8s. CTAs at 1.0s. All via Framer Motion with x: -20 → 0 + opacity 0 → 1.
Signature animation: on mount, a single teal line (height 1px, full viewport width, color #00D4B4, opacity 0.6) sweeps from top to bottom over 1.2s using Framer Motion, then fades out. This is the "Signal Scan" — initializing Avelix.

3. PROBLEM STATEMENT
Heading: "The AI world is noisy." — Syne 700, 36px, centered.
Subheading: "Avelix filters it to exactly what you need." — Plus Jakarta Sans, #7A9BB5.
Three columns, each with: small teal icon, bold problem stat, solution line.
Column 1: "10,000+ AI tools launched in 2024" / "We review and rank the ones worth your time."
Column 2: "20+ major AI models in active use" / "We compare them clearly so you pick the right one."
Column 3: "No clear path to learning AI" / "We guide you step by step from zero to applied."
Card background: --surface-1. Border-left: 2px solid #00D4B4. Border-radius 8px.

4. WHAT AVELIX DOES (4 cards)
Grid 2x2. Each card: number in Fira Code 11px teal, heading Syne 600, description Plus Jakarta Sans 14px.
Cards: 01 Find the Right Tool, 02 Learn AI Skills, 03 Understand AI Models, 04 Apply AI in Business.
Hover: border-left shifts to #00D4B4, background to --surface-2, 150ms.

5. FEATURED TOOLS (6 tool cards, 3-col grid)
Heading: "Top AI Tools" — Syne 700.
Each ToolCard: 32px logo square (--surface-2 bg, 6px radius), tool name Syne 500 14px, category Plus Jakarta Sans 11px #3D5A72, description 12px #7A9BB5, badge row.
Hover: left-border teal glow, background lift to --surface-2.

6. "I WANT TO..." QUICK NAV
Heading Syne 700: "What do you want to do?"
9 pill buttons: Write content, Build an AI agent, Automate my business, Generate images, Clone a voice, Build a chatbot, Research faster, Create videos, Learn prompt engineering.
Style: --surface-2 bg, 0.5px solid --border, Plus Jakarta Sans 13px #7A9BB5.
Hover: border-color #00D4B4, text #E8F4F8, transition 150ms.

7. LEARNING PATHS (4 cards)
Heading: "Where do you start?" — Syne 700.
Each card: path title Syne 600, who-its-for label, difficulty badge, estimated hours in Fira Code.

8. GLOSSARY TEASERS (6 terms)
Heading: "AI terms, actually explained." — Syne 700.
Six cards in 3-col grid. Term in Syne 600 16px. One-line definition in Plus Jakarta Sans 13px #7A9BB5.
Hover: border-left teal.

9. CTA BANNER
Full-width. Background: linear-gradient(135deg, #0A1628 0%, #050A14 100%).
Top border: 0.5px solid #162544.
Heading Syne 800 40px: "Skip the noise. Get it built."
Subtext Plus Jakarta Sans #7A9BB5.
Two buttons: "See Our Services" (primary teal) + "Book a Free Call" (ghost).

COMPONENT SPECS:

ToolCard:
- background: var(--surface-1)
- border: 0.5px solid var(--border)
- border-left: 2px solid transparent
- border-radius: 8px
- padding: 16px
- hover: border-left-color: #00D4B4, background: var(--surface-2), transition: 150ms

Primary Button:
- background: transparent
- border: 0.5px solid #00D4B4
- color: #00D4B4
- font-family: Plus Jakarta Sans 500
- hover: background sweeps in from left via ::after pseudo-element, text color #050A14

Badge system:
- Beginner: rgba(0,212,180,0.12) bg / #00D4B4 text
- Intermediate: rgba(245,166,35,0.12) bg / #F5A623 text
- Advanced: rgba(255,94,108,0.12) bg / #FF5E6C text
- Free: rgba(0,212,180,0.12) / #00D4B4
- Freemium: rgba(99,102,241,0.12) / #818CF8
- Paid: rgba(168,85,247,0.12) / #C4B5FD

ANIMATION RULES:
- Framer Motion whileInView with initial={{opacity:0, x:-16}} animate={{opacity:1, x:0}} for all section reveals
- Stagger children 0.08s
- NO scale animations — precision tools don't bounce
- NO purple gradients, NO cyan grids, NO holographic cards
- Signal scan runs once on mount — Framer Motion useEffect + motion.div with y animation

RESPONSIVE:
- 375px: single column, headline 42px, hide nav links (hamburger)
- 768px: 2-col grids, headline 56px
- 1280px: full layout as specified

AVOID AT ALL COSTS:
- Inter, Roboto, system fonts
- Purple-dominant schemes
- Generic "AI startup" purple-on-dark gradient hero
- Floating card 3D transforms
- Particle.js or similar heavy canvas effects
- Any component that could belong on a generic SaaS site

FEEL REFERENCE:
The precision of a trading terminal. The restraint of Linear. The technical depth of Vercel. The signal-layer aesthetic belongs only to Avelix — electric teal on deep blue-black, Syne headings, Fira Code data points, purposeful motion.

This is not a marketing website. It is a precision instrument for navigating AI.
```

---

## Logo Generation Prompt (Midjourney / Ideogram / Recraft)

```
minimalist logo for "Avelix", lettermark design, geometric sans-serif capital letter A in Syne font style, a single precise horizontal line in electric teal (#00D4B4) crossing through the middle of the A as its crossbar, small circular dot at the right end of the line like a signal endpoint, deep navy background (#050A14), no gradients, flat vector, ultra-precise geometry, professional tech brand identity, negative space, signal/frequency aesthetic, --ar 1:1 --style raw --v 6
```

---

## After This Agent

1. CSS variables block → paste into `app/globals.css`
2. Font imports → paste into `app/layout.tsx`
3. Master prompt → paste into v0.dev, Bolt.new, or Cursor Composer
4. Logo prompt → generate in Midjourney or Recraft
5. Design system → attach to Agents 03–07 as the visual contract
