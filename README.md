# Avelix

**Your practical map for the AI world.**

Avelix is a learning, discovery, and guidance platform for AI tools, models, skills, and workflows. It helps users find the right AI tool, learn the right AI skills, understand AI models, and apply AI in real life — without getting lost.

---

## What's In This Repository

```
CLAUDE.md          ← Master project brief for Claude Code
SKILLS.md          ← Skills manifest (which skills each agent needs)
agents/            ← 13 Claude Code agent instruction files
  01-scaffold.md
  02-database.md
  03-tools-library.md
  04-models-library.md
  05-skills-library.md
  06-glossary.md
  07-homepage.md
  08-search-filters.md
  09-admin-panel.md
  10-seo.md
  11-sync-pipeline.md
  12-seeding.md
  13-deployment.md
```

---

## How to Use These Files

### Option A — Claude Code (Recommended)

1. Open Claude Code in your terminal: `claude`
2. Point it to `CLAUDE.md` as the project context
3. Run agents in order:
   ```
   /agent agents/01-scaffold.md
   /agent agents/02-database.md
   ... and so on
   ```

### Option B — Manual / Vibe Coding

1. Start a Claude conversation
2. Paste `CLAUDE.md` as context
3. Then paste individual agent `.md` files one at a time
4. Claude will build each section step by step

### Option C — Agentic Loop (Advanced)

Use Claude Code's `--continue` flag to chain agents automatically:
```bash
claude --file CLAUDE.md --file agents/01-scaffold.md --continue
claude --file CLAUDE.md --file agents/02-database.md --continue
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Search | Algolia |
| Automation | n8n |
| Admin | Custom Next.js /admin routes |
| Deployment | Vercel |
| Email | Resend |

---

## MVP Features

- AI Tools Library (searchable, filterable, 200+ tools)
- AI Models Library (with comparison pages)
- AI Skills Library (with learning paths)
- AI Glossary (30+ terms at launch)
- AI Automation Services page
- Admin approval panel for daily sync
- Daily n8n sync pipeline
- SEO-optimized (target: 100 Lighthouse SEO)

---

## Estimated Build Time

| Phase | Agent(s) | Est. Time with Claude Code |
|---|---|---|
| Scaffold + DB | 01, 02 | 1–2 hours |
| Libraries | 03, 04, 05 | 3–4 hours |
| Glossary + Guides | 06, 07 | 1–2 hours |
| Search + Admin | 08, 09 | 2–3 hours |
| SEO + Seeding | 10, 12 | 1–2 hours |
| n8n Pipeline | 11 | 2–3 hours |
| Deploy | 13 | 1 hour |
| **Total** | | **~12–17 hours** |

---

## Monthly Cost (MVP)

~$6/month (Vercel free + Supabase free + n8n self-hosted on Railway)

See `agents/13-deployment.md` for full cost breakdown and scaling thresholds.

---

## Content Strategy

Every page is designed to map to a social media asset:
- Tool review Reel → tool page
- Prompt carousel → skill page
- Model comparison video → comparison page
- AI news update → model changelog
- Workflow tutorial → workflow guide page

The daily sync pipeline (Agent 11) discovers new tools and updates automatically, but nothing publishes without human approval.

---

## Contact

Built by Fakih | Avelix  
Targeting: GCC/MENA market  
Languages: English (MVP) + Arabic (Phase 2)
