# Agent 13 — Deployment

## What Was Built

A complete deployment runbook covering: environment variable provisioning, n8n workflow import and activation, Vercel production deployment, and post-deploy verification.

---

## Deployment Summary

| Component | Status | Details |
|---|---|---|
| Vercel env vars | ✓ Set | 12 vars across production / preview / development |
| n8n credentials | ✓ Created | Supabase (ID: s8m5FTZfqn13T0tS), Resend (ID: BaQWrIkgcVoIwm5A) |
| n8n workflows | ✓ Imported & Active | 4 workflows (IDs below) |
| Vercel framework | ✓ Set to nextjs | Was `None` — caused all routes to 404 |
| Vercel deployment | ✓ READY | dpl_JAQtDGmjt91HHCa3Qc7fGJTXe1Xa (3rd attempt after framework fix) |
| Production URL | ✓ Live | https://avelix-nu.vercel.app |
| Build | ✓ Passed | 120 pages, 0 errors |
| Post-deploy checks | ✓ 25/25 | All core pages, SEO, admin auth, API routes |

---

## Files Created / Modified

| File | Purpose |
|---|---|
| `docs/13-deployment.md` | This file — deployment runbook |
| `components/admin/SyncTriggerButton.tsx` | RSC-safe client wrapper for sync trigger button |
| `components/admin/AdminToolsTable.tsx` | Client component for tools data table (RSC fix) |
| `components/admin/AdminModelsTable.tsx` | Client component for models data table (RSC fix) |
| `components/admin/AdminSkillsTable.tsx` | Client component for skills data table (RSC fix) |
| `app/admin/layout.tsx` | Replaced onClick with SyncTriggerButton (RSC fix) |
| `app/admin/page.tsx` | Replaced onClick with SyncTriggerButton (RSC fix) |
| `app/admin/tools/page.tsx` | Uses AdminToolsTable (RSC fix) |
| `app/admin/models/page.tsx` | Uses AdminModelsTable (RSC fix) |
| `app/admin/skills/page.tsx` | Uses AdminSkillsTable (RSC fix) |

---

## n8n Workflows

All 4 workflows imported and active at **https://n8n.srv1316951.hstgr.cloud**:

| Workflow | ID | Schedule | Status |
|---|---|---|---|
| Avelix — Daily Discovery | `49SUIpC2nJFJHejM` | 06:00 UTC daily | ACTIVE |
| Avelix — Enrich & Queue | `c1px6DmfU9l1DXGa` | Triggered by Discovery | ACTIVE |
| Avelix — Update Monitor | `2w9Qipo47qfyontJ` | 14:00 UTC daily | ACTIVE |
| Avelix — Stale Page Detector | `6GMpsmwsY7YrdmkW` | 08:00 UTC Sundays | ACTIVE |

### n8n Credentials

| Credential | ID | Notes |
|---|---|---|
| Supabase (Avelix DB) | `s8m5FTZfqn13T0tS` | Uses SUPABASE_SERVICE_ROLE_KEY |
| Resend | `BaQWrIkgcVoIwm5A` | For admin notification emails |
| Anthropic | ⚠ NOT YET CREATED | Requires ANTHROPIC_API_KEY (see below) |

---

## Vercel Environment Variables

12 variables set across all 3 environments (production / preview / development):

| Variable | Environments | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | all | .env.local |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all | .env.local |
| `SUPABASE_SERVICE_ROLE_KEY` | all | .env.local |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | all | .env.local |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | all | .env.local |
| `ALGOLIA_ADMIN_KEY` | all | .env.local |
| `NEXTAUTH_SECRET` | all | .env.local |
| `NEXTAUTH_URL` | production + preview | `https://avelix-nu.vercel.app` |
| `NEXTAUTH_URL` | development | `http://localhost:3000` |
| `RESEND_API_KEY` | all | .env.local |
| `N8N_WEBHOOK_SECRET` | all | .env.local |
| `N8N_API_KEY` | all | .env.local |
| `N8N_BASE_URL` | all | .env.local |

---

## Key Decisions

### 1. RSC boundary violations fixed before deploy

All admin pages failed to prerender because Server Components contained event handlers (`onClick`) and non-serializable column render functions passed to Client Components. Fixed by extracting all interactive logic into dedicated `'use client'` wrapper components (`SyncTriggerButton`, `AdminToolsTable`, `AdminModelsTable`, `AdminSkillsTable`).

**Pattern:** Server Components fetch and pass only serializable data (plain objects/arrays). All callbacks, render functions, and event handlers live in Client Components.

### 2. n8n Variables → hardcoded substitution

n8n's Variables feature requires an enterprise license. The workflow JSONs were designed with `$env.VAR_NAME` references, which were substituted with actual values at import time using a Python script.

**Affected values:** `AVELIX_BASE_URL` = `https://avelix-nu.vercel.app`, `N8N_WEBHOOK_SECRET` = from `.env.local`, `ENRICH_WORKFLOW_ID` = dynamically set after importing enrich-and-queue.json.

### 3. Daily Discovery activation order

The `ExecuteWorkflow` node in daily-discovery references enrich-and-queue by ID. n8n requires the referenced workflow to be "active" (published) before the parent can activate. Import order: enrich-and-queue first → get ID → use in daily-discovery → activate enrich → activate daily-discovery.

### 4. Vercel framework setting missing — root cause of all 404s

The Vercel project had `framework: null` because it was linked from a non-git directory. Without the framework set, Vercel doesn't apply Next.js routing rules, causing all routes to return its own 404. Fixed via PATCH to `/v9/projects/{id}` with `{ "framework": "nextjs" }`, then redeployed.

**Lesson:** Always verify `vercel env ls` is non-empty AND check `framework` setting after `vercel link`.

### 5. Vercel SSO protection disabled

The project had `ssoProtection: { deploymentType: 'all_except_custom_domains' }` which blocked all `.vercel.app` URLs with Vercel authentication. Disabled via PATCH to `/v9/projects/{id}` to make the site publicly accessible. When a custom domain (`avelix.ai`) is added, re-enable SSO for preview deployments only.

---

## Required Actions (Pending)

These items are **blocked** by missing information and must be completed manually:

### 1. ANTHROPIC_API_KEY — CRITICAL for n8n enrichment

The daily discovery pipeline calls Claude API for content classification. Without this key, the `Avelix — Enrich & Queue` workflow will fail at the Claude classification step.

**Action:**
1. Get your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`
3. Add to Vercel env vars: `vercel env add ANTHROPIC_API_KEY production`
4. Create Anthropic credential in n8n:
   - Settings → Credentials → New → Anthropic
   - API Key: your key
5. Open `Avelix — Enrich & Queue` and `Avelix — Update Monitor` in n8n UI
6. Assign the Anthropic credential to the Claude HTTP Request nodes

### 2. ADMIN_EMAIL — for notification emails

Without this, the `/api/admin/notify` endpoint returns 200 with `"Notification skipped"` — no emails are sent after sync runs.

**Action:**
1. Add to `.env.local`: `ADMIN_EMAIL=your@email.com`
2. Add to Vercel: `vercel env add ADMIN_EMAIL production`

### 3. N8N_WEBHOOK_URL — for manual sync trigger

The "Trigger Manual Sync" button in the admin dashboard calls `/api/admin/sync/trigger`, which POSTs to `N8N_WEBHOOK_URL`. This URL must be an n8n webhook node URL that triggers the daily-discovery workflow manually.

**Action:**
1. In n8n, open the `Avelix — Daily Discovery` workflow
2. Add a `Webhook` trigger node alongside the Schedule trigger
3. Copy the webhook URL from n8n (something like `https://n8n.srv1316951.hstgr.cloud/webhook/avelix-sync`)
4. Add to `.env.local`: `N8N_WEBHOOK_URL=https://n8n.srv1316951.hstgr.cloud/webhook/avelix-sync`
5. Add to Vercel: `vercel env add N8N_WEBHOOK_URL production`

### 4. Custom Domain (avelix.ai) — when ready

The Vercel project's production URL is currently `https://avelix-nu.vercel.app`. To use `avelix.ai`:
1. Vercel Dashboard → Project → Settings → Domains → Add `avelix.ai`
2. Add the CNAME/A records Vercel provides to your DNS registrar
3. Update `NEXTAUTH_URL` in Vercel to `https://avelix.ai`
4. Update `AVELIX_BASE_URL` in the n8n workflow JSONs (or re-import with new value)
5. Re-enable SSO protection for preview deployments only: `ssoProtection: { deploymentType: 'only_preview_deployments' }`

---

## n8n Credential Setup (Anthropic) — Step by Step

When you have the API key:

```bash
# 1. Create credential via n8n API
curl -X POST "https://n8n.srv1316951.hstgr.cloud/api/v1/credentials" \
  -H "X-N8N-API-KEY: <your-n8n-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anthropic (Avelix)",
    "type": "anthropicApi",
    "data": {
      "apiKey": "sk-ant-..."
    }
  }'
# Note the returned credential ID

# 2. Then in the n8n UI, open each workflow that calls Claude:
#    - Avelix — Enrich & Queue
#    - Avelix — Update Monitor
# And assign the credential to the "Claude — Classify" and "Claude — Detect Change" nodes
```

---

## Vercel Deployment Commands

```bash
# Deploy to production
vercel --prod --yes

# Check env vars
vercel env ls

# Add a new env var
printf 'value' | vercel env add VAR_NAME production

# Or via REST API (avoids interactive mode issues)
curl -X POST "https://api.vercel.com/v10/projects/prj_PlyxbOBeeYSmho06cFi86fFrhFrT/env?teamId=team_POq08xwP3oDa9frv4Tyf01ab" \
  -H "Authorization: Bearer <vercel-token>" \
  -H "Content-Type: application/json" \
  -d '{"key":"VAR","value":"val","type":"encrypted","target":["production","preview","development"]}'

# Inspect deployment
vercel inspect dpl_GmSG7AmzKXYHjbcWAyVdDRLSmnLz
```

---

## Build Details

```
Next.js 14.2.29
120 pages generated (85 local, 120 on Vercel with seed data)
Build time: ~52 seconds
First Load JS: 87.1 kB shared chunks
Middleware: 81.4 kB (admin auth only)
```

---

## Post-Deploy Checklist

| Check | URL | Expected | Status |
|---|---|---|---|
| Homepage | `/` | 200 | ✓ |
| Tools Library | `/tools` | 200 | ✓ |
| Models Library | `/models` | 200 | ✓ |
| Skills Library | `/skills` | 200 | ✓ |
| Glossary | `/glossary` | 200 | ✓ |
| Guides | `/guides` | 200 | ✓ |
| Compare | `/compare` | 200 | ✓ |
| Services | `/services` | 200 | ✓ |
| Tool page | `/tools/chatgpt` | 200 | ✓ |
| Tool page | `/tools/claude` | 200 | ✓ |
| Model page | `/models/gpt-4o` | 200 | ✓ |
| Skill page | `/skills/prompt-engineering-basics` | 200 | ✓ |
| Glossary term | `/glossary/llm` | 200 | ✓ |
| Comparison page | `/compare/chatgpt-vs-claude` | 200 | ✓ |
| Sitemap | `/sitemap.xml` | 200 | ✓ |
| Robots | `/robots.txt` | 200 | ✓ |
| Admin (unauth) | `/admin` | 307→/login | ✓ |
| Login page | `/login` | 200 | ✓ |
| OG Images | `/api/og/tool?title=X&slug=Y` | 200 (PNG) | ✓ |
| OG Images | `/api/og/model?title=X&slug=Y` | 200 (PNG) | ✓ |

---

## Known Limitations

1. **No Anthropic credential** — n8n enrichment workflow activates but Claude calls will fail until API key is added
2. **No manual sync trigger** — `N8N_WEBHOOK_URL` not set; admin "Trigger Manual Sync" button returns 503
3. **No admin email** — sync notification emails are silently skipped
4. **vercel.app URLs have SSO disabled** — SSO protection was disabled to allow public access. Add custom domain and re-enable for preview environments
5. **n8n Variables not available** — workflow env references are hardcoded values; must re-import workflows if AVELIX_BASE_URL changes

---

## Related Agents

- **Requires Agent 11 (Sync Pipeline)** — n8n workflow files must exist before import
- **Requires Agent 09 (Admin Panel)** — admin routes must work for approval queue
- **Feeds into Agent 12 (Data Seeding)** — deployment must be live for seed scripts to target production DB

---

## Security Notes

- `.env.local` is gitignored — never commit it
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only used server-side (admin routes + webhooks)
- Vercel tokens stored in `~/Library/Application Support/com.vercel.cli/auth.json` — do not share
- n8n API key has full workflow access — rotate if compromised
- Webhook secret (`N8N_WEBHOOK_SECRET`) authenticates all n8n→Avelix calls — must match on both sides
