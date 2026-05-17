# Avelix — n8n Sync Pipeline

This directory contains all n8n workflow definitions for the Avelix daily sync pipeline.

## Overview

The pipeline runs daily to discover new AI tools, models, and updates from public sources.
**Nothing is ever published automatically.** Every item goes through the admin approval queue
at `/admin/queue` and must be manually approved before it becomes visible on the site.

```
Source Monitoring (06:00 UTC)
         ↓
   Deduplication Check
         ↓
   Claude Classification
         ↓
   Confidence Gate (≥ 50%)
         ↓
   Webhook → Supabase Draft
         ↓
   Approval Queue (pending)
         ↓
   Admin Notification Email
         ↓
   Human Review → Approve / Reject
```

---

## Workflows

| File | Schedule | Purpose |
|---|---|---|
| `daily-discovery.json` | 06:00 UTC daily | Fetch new AI tools from Product Hunt, HuggingFace, GitHub, and official blogs |
| `enrich-and-queue.json` | Triggered by discovery | Classify with Claude, apply confidence gate, post to webhook |
| `update-monitor.json` | 14:00 UTC daily | Check published items for page changes, queue updates |
| `stale-page-detector.json` | 08:00 UTC every Sunday | Flag content not reviewed in 30+ days |

---

## Prerequisites

1. **n8n instance** — self-hosted (Docker) or n8n.cloud account
2. **Avelix deployed** — webhook endpoint must be live at `https://avelix.ai/api/webhooks/sync`
3. **Anthropic API key** — for Claude enrichment and update detection
4. **Supabase credentials** — for deduplication queries
5. **Product Hunt API token** — for daily post discovery
6. **GitHub personal access token** — for repository search (read-only)

---

## Environment Variables (n8n)

Set these in **n8n Settings → Environment Variables**:

| Variable | Value | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Claude API for classification + change detection |
| `N8N_WEBHOOK_SECRET` | Matches `N8N_WEBHOOK_SECRET` in Avelix `.env.local` | Authenticates n8n → Avelix calls |
| `AVELIX_BASE_URL` | `https://avelix.ai` (or `https://localhost:3000` for dev) | Base URL for webhook calls |
| `ENRICH_WORKFLOW_ID` | n8n workflow ID of `enrich-and-queue.json` | Links discovery → enrichment |

---

## n8n Credentials to Create

Go to **n8n Settings → Credentials** and create:

### 1. Supabase
- Type: **Supabase** (built-in)
- Host: `https://[your-project].supabase.co`
- Service Key: `SUPABASE_SERVICE_ROLE_KEY` value from Avelix `.env.local`

### 2. HTTP Header Auth — Product Hunt
- Type: **Header Auth**
- Name: `producthunt_token`
- Value: Your Product Hunt API v2 token (get it at [producthunt.com/v2/oauth/applications](https://www.producthunt.com/v2/oauth/applications))

### 3. HTTP Header Auth — GitHub
- Type: **Header Auth**  
- Name: `github_token`
- Value: `ghp_...` — a read-only GitHub PAT with `public_repo` scope

---

## Import Workflows

1. Go to **n8n → Workflows → Import from file**
2. Import each JSON in this order:
   1. `enrich-and-queue.json` — import first, copy its workflow ID
   2. `daily-discovery.json` — set `ENRICH_WORKFLOW_ID` env var to the ID from step 2a
   3. `update-monitor.json`
   4. `stale-page-detector.json`
3. Open each workflow and assign credentials to the nodes that need them (Supabase, HTTP Header Auth)
4. Activate each workflow when ready (toggle in the workflow list)

---

## Testing Workflows

### Test the webhook manually

```bash
# Valid item — should return 200 and queue for review
curl -X POST https://avelix.ai/api/webhooks/sync \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "tool",
    "title": "Test Tool",
    "slug": "test-tool",
    "short_description": "A test AI tool for validation.",
    "source_url": "https://openai.com/blog/test",
    "ai_confidence": 85,
    "action": "create"
  }'

# Low confidence — should return 422
curl -X POST https://avelix.ai/api/webhooks/sync \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"content_type": "tool", "title": "Test", "slug": "test", "short_description": "test", "ai_confidence": 30}'

# Untrusted source — should return 422
curl -X POST https://avelix.ai/api/webhooks/sync \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"content_type": "tool", "title": "Test", "slug": "test", "short_description": "test", "source_url": "https://random-blog.example.com", "ai_confidence": 80}'
```

### Test the notification endpoint

```bash
curl -X POST https://avelix.ai/api/admin/notify \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "queued": [
      {"title": "New Tool", "content_type": "tool", "slug": "new-tool", "ai_confidence": 85, "action": "create"}
    ],
    "rejected_count": 2,
    "run_at": "2026-05-16T06:00:00Z"
  }'
```

### Trigger discovery manually (from admin)

Click **Trigger Manual Sync** on the admin dashboard or:

```bash
curl -X POST https://avelix.ai/api/admin/sync/trigger \
  -H "Cookie: <your-admin-session-cookie>"
```

---

## Security

| Control | Implementation |
|---|---|
| Webhook authentication | `x-webhook-secret` header checked on every inbound call |
| Confidence gate | Items with AI confidence < 50% are rejected before drafting |
| Source trust gate | Unknown domains (trust < 0.5) are rejected |
| No auto-publish | All items land in `approval_queue` with `status = pending` |
| Admin-only approval | Approval endpoint requires admin session (enforced by middleware) |
| n8n → Avelix auth | Same `N8N_WEBHOOK_SECRET` used bidirectionally |

---

## Monitoring & Debugging

| Problem | Check |
|---|---|
| Items not appearing in queue | Check n8n execution logs for the enrich workflow; verify webhook secret matches |
| Claude returning non-JSON | Check n8n "Parse Claude Response" node output; Claude prompt instructs JSON-only |
| Confidence always 0 | Claude parse error — add logging to "Parse Claude Response" code node |
| Source fetch failing | Many sites block headless requests; add a User-Agent header to "Fetch Source Page" |
| Email not sent | Verify `ADMIN_EMAIL` and `RESEND_API_KEY` are set in Avelix `.env.local` |
| Supabase permission error | Confirm the service role key is used (not the anon key) |

---

## Approval Workflow (Human Side)

1. Admin receives notification email with item list
2. Navigate to `/admin/queue`
3. For each pending item:
   - Review AI-generated content and source URL
   - Click **Approve** — item moves to `published` status, appears on site
   - Click **Reject** — item moved to `rejected`, never published
   - Click **Needs Edit** — item flagged for manual content editing before re-review
4. High-confidence items (≥90%) can be bulk-approved

---

## Data Flow Diagram

```
n8n (daily-discovery)
  ├── Product Hunt API
  ├── HuggingFace API
  ├── GitHub Search API
  └── RSS Feeds (6 sources)
         ↓ merge + deduplicate
n8n (enrich-and-queue) per item
  ├── Supabase: slug + title duplicate check
  │      └── duplicate → skip
  ├── Claude (classify): content_type, tags, confidence
  │      └── confidence < 50% → reject
  ├── POST /api/webhooks/sync
  │      ├── source trust check
  │      ├── upsert tools/models/skills (status=draft)
  │      └── insert approval_queue (status=pending)
  └── POST /api/admin/notify → Resend email to admin

Admin reviews at /admin/queue
  ├── Approve → status=published
  └── Reject  → status=rejected
```
