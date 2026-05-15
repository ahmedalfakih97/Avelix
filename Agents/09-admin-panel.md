# Agent 09 — Admin Panel & Approval Workflow

## Goal
Build the protected admin panel used for reviewing AI-generated content drafts, approving items for publishing, and managing the content database. This is the human-in-the-loop interface for the daily sync pipeline.

## Prerequisites
- Agents 01–02 complete
- Supabase Auth configured
- `approval_queue` table created

## Authentication

Use Supabase Auth with email + password (no OAuth for admin).

Admin users are stored in Supabase `auth.users` with a `role: admin` claim in their JWT metadata.

### Middleware: `middleware.ts`
```typescript
// Protect all /admin/* routes
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Check session and admin role
  // Redirect to /login if not authenticated
}
```

### `app/login/page.tsx`
Simple email/password login form. On success → redirect to `/admin`.

---

## Admin Layout: `app/admin/layout.tsx`

```
Left sidebar (desktop):
- Dashboard
- Approval Queue  [badge: pending count]
- Tools
- Models
- Skills
- Glossary
- Guides
- Sources
- Settings
- Logout

Top bar:
- Page title
- Last sync timestamp
- "Trigger Sync" button → POST to n8n webhook
```

---

## Admin Pages

### `app/admin/page.tsx` — Dashboard

Stats cards:
```
Total Tools Published | Tools Pending Review | Tools Drafts
Total Models Published | Models Pending Review
Total Skills Published | Skills Pending Review
Last Sync: [timestamp]  |  Next Sync: [timestamp]
```

Recent activity feed (last 20 changelog entries):
```
[2h ago] Tool: Runway updated — new pricing tier added
[5h ago] Model: Claude 4 — new model detected from Anthropic blog
[1d ago] Tool: Higgsfield AI — launched, added to queue
```

Quick action buttons:
- "Review Queue (N items)"
- "Trigger Manual Sync"
- "Flag All Tools for Review" (bulk action)

---

### `app/admin/queue/page.tsx` — Approval Queue

This is the most important admin page. Reviewers spend most time here.

**Layout:**

Filter tabs: `All | Pending | Needs Edit | Approved | Rejected`

Each queue item card shows:
```
[Content Type Badge]  [Action: Create / Update / Delete]
Title: ElevenLabs
Source: https://blog.elevenlabs.io/...
AI Confidence: 87%
Summary: "New pricing tier added: Creator Plan at $22/month. 
          API rate limits increased to 10,000 chars/request."

[Preview Draft] [Approve] [Reject] [Needs Edit]
```

**Preview Draft modal:**
- Side-by-side: AI-generated content (left) vs source URL (right)
- Editable fields in the preview (inline editing)
- "Approve with edits" button

**Bulk actions:**
- Select multiple items
- Bulk approve / bulk reject
- "Approve all high-confidence (>90%)" quick action

**On Approve:**
1. Set `approval_queue.status = 'approved'`, record `reviewed_by`, `reviewed_at`
2. Set content item `status = 'published'`
3. Set `published_at = NOW()`
4. Trigger Algolia re-index for this item
5. Add entry to `changelogs` table
6. (Optional) Generate social post draft

**On Reject:**
1. Set `approval_queue.status = 'rejected'`
2. Leave content item as `draft`
3. Record rejection reason

---

### `app/admin/tools/page.tsx` — Tools Management

Full data table of all tools (published + drafts + archived).

**Table columns:**
```
Checkbox | Title | Category | Status | Rating | Last Reviewed | Source Count | Actions
```

**Features:**
- Sort by any column
- Filter by status
- Inline edit for quick changes (status, rating)
- Bulk status change
- "Mark as stale" button (sets `needs_review` flag)
- Export to CSV

**Row actions:**
- Edit (opens full edit form)
- Preview (opens tool page in new tab)
- Archive
- Delete

### Tool Edit Form
Full form with all tool fields:
- All text fields
- Tag multi-select (create on type)
- Related items pickers (search by name)
- Source URL manager (add/remove/verify)
- Status selector
- Confidence score adjuster

Same form pattern for Models and Skills.

---

### `app/admin/sources/page.tsx` — Source Management

Manage trusted sources used by the sync pipeline.

**Table columns:**
```
Name | URL | Type | Trust Score | Last Checked | Active | Actions
```

**Source types:**
- official_blog
- product_hunt
- github
- huggingface
- newsletter
- rss_feed
- model_release_page
- youtube
- x_account

**Actions per source:**
- Edit trust score
- Toggle active/inactive
- Trigger immediate check
- View items synced from this source

---

### `app/admin/settings/page.tsx` — Settings

```
Sync Settings:
- Sync frequency (daily / twice daily / manual only)
- Minimum confidence score to auto-draft
- Sources to monitor (toggle each)
- Notification email for new queue items

Content Rules:
- Require source URL: YES/NO
- Block publish if confidence < [N]%
- Auto-archive if not reviewed in [N] days

Algolia:
- Sync status
- Index counts
- "Re-sync all" button
```

---

## Components to Build

### `components/admin/QueueItemCard.tsx`
The approval queue item card with confidence score, summary, and action buttons.

### `components/admin/DataTable.tsx`
Reusable sortable/filterable table used across admin pages.
Uses TanStack Table v8.

### `components/admin/ContentEditForm.tsx`
Generic edit form for tool/model/skill items.
Uses react-hook-form + zod validation.

### `components/admin/StatCard.tsx`
Dashboard stat card with icon, value, label, and trend.

### `components/admin/ActivityFeed.tsx`
Timeline of recent changelog entries.

---

## API Routes (Next.js Route Handlers)

### `app/api/admin/approve/route.ts`
POST — approve a queue item
```typescript
// Body: { queue_id, content_type, content_id, edits?: Partial<Tool|Model|Skill> }
// 1. Validate admin session
// 2. Apply edits to content table
// 3. Set content status = 'published'
// 4. Update queue status = 'approved'
// 5. Trigger Algolia upsert
// 6. Return success
```

### `app/api/admin/reject/route.ts`
POST — reject a queue item

### `app/api/admin/sync/trigger/route.ts`
POST — trigger n8n sync webhook

### `app/api/webhooks/sync/route.ts`
POST — receive new items from n8n pipeline
```typescript
// Validates N8N_WEBHOOK_SECRET header
// Upserts item to correct table as 'draft'
// Adds to approval_queue
// Returns 200
```

---

## Done Criteria
- [ ] `/login` works with Supabase Auth
- [ ] All `/admin/*` routes redirect to `/login` if not authenticated
- [ ] Dashboard shows correct live stats
- [ ] Approval queue shows pending items
- [ ] Approve action publishes item and triggers Algolia sync
- [ ] Reject action marks item rejected with reason
- [ ] Tool/Model/Skill edit forms save correctly
- [ ] Sources table displays and allows trust score editing
- [ ] n8n webhook endpoint receives and queues new items
- [ ] Bulk approve works for high-confidence items
