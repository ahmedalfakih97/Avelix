# API — Webhooks & Sync Endpoints

## POST /api/webhooks/sync

Receives a new item from n8n (or any caller) and adds it to the approval queue as a draft.

### Authentication

Header: `x-webhook-secret: <N8N_WEBHOOK_SECRET>`

If `N8N_WEBHOOK_SECRET` is set in the environment, the header must match exactly. Returns `401` if it doesn't. Omitting the header is only allowed when `N8N_WEBHOOK_SECRET` is not configured (dev/mock mode).

### Gates (in order)

1. **Confidence gate** — `ai_confidence` must be ≥ 50. Rejects with 422 if lower.
2. **Source trust gate** — `source_url` domain must have trust score ≥ 0.5. Unknown domains are rejected with 422.

### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `content_type` | `"tool" \| "model" \| "skill"` | yes | Which table to write to |
| `title` | string | yes | Item title |
| `slug` | string | yes | URL slug (must be unique per table) |
| `short_description` | string | yes | One-line description (max 150 chars) |
| `source_url` | string | no | Primary source URL — used for trust scoring |
| `ai_confidence` | number (0–100) | no | AI classification confidence. Default: 0 (will fail gate) |
| `action` | `"create" \| "update" \| "delete"` | no | Default: `"create"` |
| `summary_of_changes` | string | no | Human-readable change summary for updates |
| `data` | object | no | Extra fields to merge into the table row (tags, pricing_model, etc.) |

### Responses

| Status | Meaning |
|---|---|
| `200` | Item upserted to draft table and added to approval queue |
| `400` | Invalid JSON |
| `401` | Wrong or missing webhook secret |
| `422` | Validation failed (missing fields, invalid content_type, low confidence, untrusted source) |
| `500` | Supabase write failed |

### Example — success

```bash
curl -X POST https://avelix.ai/api/webhooks/sync \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "tool",
    "title": "ElevenLabs Voice Clone",
    "slug": "elevenlabs-voice-clone",
    "short_description": "Clone any voice from a 1-minute sample.",
    "source_url": "https://elevenlabs.io/blog/voice-clone-v3",
    "ai_confidence": 88,
    "action": "create",
    "data": {
      "pricing_model": "freemium",
      "has_free_plan": true,
      "has_api": true,
      "tags": ["voice", "audio", "tts"]
    }
  }'

# Response 200:
{ "success": true, "message": "Item queued for review", "content_id": "uuid..." }
```

### Example — confidence rejected

```bash
curl -X POST https://avelix.ai/api/webhooks/sync \
  -H "x-webhook-secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"content_type":"tool","title":"Unknown Tool","slug":"unknown-tool","short_description":"?","ai_confidence":30}'

# Response 422:
{ "error": "Confidence too low", "detail": "ai_confidence must be >= 50 (received 30)", "rejected": true }
```

### Mock Mode

If `NEXT_PUBLIC_SUPABASE_URL` is not set, the route returns 200 but does not write to any database. Used in local development.

---

## POST /api/admin/notify

Receives the sync run summary from n8n and sends an HTML notification email via Resend.

### Authentication

Same `x-webhook-secret` header as the sync webhook.

### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `queued` | `SyncSummaryItem[]` | yes | Items successfully queued this run |
| `rejected_count` | number | yes | Items rejected (low confidence or untrusted source) |
| `run_at` | string (ISO date) | no | When the sync ran. Default: now |

`SyncSummaryItem` shape:
```ts
{
  title: string
  content_type: 'tool' | 'model' | 'skill'
  slug: string
  ai_confidence: number
  source_url?: string
  action: 'create' | 'update'
}
```

### Responses

| Status | Meaning |
|---|---|
| `200` | Email sent (or skipped — not configured) |
| `400` | Invalid JSON |
| `401` | Wrong or missing webhook secret |
| `502` | Resend API returned an error |

### Environment Variables Required

- `ADMIN_EMAIL` — recipient address
- `RESEND_API_KEY` — Resend API key

If either is missing, the endpoint returns `200` with `"message": "Notification skipped"` (soft failure — the sync still succeeded).

---

## POST /api/admin/sync/trigger

Triggers a manual n8n sync run from the admin dashboard. Calls n8n's webhook URL.

### Authentication

Must be called from an authenticated admin session (enforced by admin middleware).

### Response

```json
{ "success": true, "message": "Sync triggered successfully" }
```

Returns `503` if `N8N_WEBHOOK_URL` is not configured.

---

## POST /api/admin/approve

Approves a queue item — publishes the content and marks the queue entry as approved.

### Request Body

| Field | Type | Required |
|---|---|---|
| `queue_id` | string | yes |
| `content_type` | string | yes |
| `content_id` | string | yes |

---

## POST /api/admin/reject

Rejects a queue item with an optional reason.

### Request Body

| Field | Type | Required |
|---|---|---|
| `queue_id` | string | yes |
| `reason` | string | no |
