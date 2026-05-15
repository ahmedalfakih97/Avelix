# Agent 11 — Daily Sync Pipeline (n8n)

## Goal
Design and document the complete n8n automation pipeline for daily discovery, enrichment, deduplication, and queuing of new AI tools, models, and updates. The pipeline must NEVER auto-publish — everything goes through the approval queue.

## Prerequisites
- Agent 09 complete (admin panel + webhook endpoint live)
- n8n instance running (self-hosted or n8n.cloud)
- Supabase credentials in n8n credentials store
- Anthropic/OpenAI API key in n8n for enrichment step
- Webhook endpoint: `POST /api/webhooks/sync` deployed

---

## Pipeline Overview

```
SOURCE MONITOR
    ↓
EXTRACT & NORMALIZE
    ↓
DEDUPLICATE CHECK (Supabase lookup)
    ↓
ENRICH (Claude API)
    ↓
VERIFY (confidence score + source check)
    ↓
DRAFT (create Supabase record)
    ↓
QUEUE (add to approval_queue)
    ↓
NOTIFY (email admin)
```

---

## Workflow 1: `daily-discovery.json`

**Schedule:** Every day at 06:00 UTC

### Nodes:

**1. Schedule Trigger**
- Cron: `0 6 * * *`

**2. HTTP Request — Product Hunt Today**
```
GET https://api.producthunt.com/v2/api/graphql
Query: posts from today in "Artificial Intelligence" category
Auth: Product Hunt API token
Extract: name, tagline, url, topics
```

**3. HTTP Request — Hugging Face New Models**
```
GET https://huggingface.co/api/models?sort=createdAt&limit=20&filter=text-generation
Extract: id, modelId, pipeline_tag, downloads, likes, lastModified
```

**4. HTTP Request — GitHub AI Releases**
```
GET https://api.github.com/search/repositories
Query: "AI" OR "LLM" OR "agent" created:>{yesterday} language:python stars:>50
Extract: name, description, html_url, topics, stargazers_count
```

**5. RSS Feed — Batch Read**
Use n8n RSS Feed node for each source:
```
https://openai.com/blog/rss.xml
https://anthropic.com/blog/rss
https://blog.google/technology/ai/rss
https://mistral.ai/news/rss.xml
https://huggingface.co/blog/feed.xml
https://elevenlabs.io/blog/rss
https://runwayml.com/blog/rss
```

**6. Merge All** → single array of raw discoveries

---

## Workflow 2: `enrich-and-queue.json`

**Trigger:** Called by Workflow 1 after merge

### Nodes:

**1. Deduplicate Check (Supabase)**
For each item in the array:
```sql
SELECT id, slug FROM tools 
WHERE slug = {{ $item.slug }} OR title ILIKE {{ $item.title }}
UNION
SELECT id, slug FROM models 
WHERE slug = {{ $item.slug }} OR title ILIKE {{ $item.title }}
```
If match found → skip (or flag as "update candidate").

**2. Classify with Claude**
For each new (non-duplicate) item, call Claude API:

```
System: You are an AI tool classification specialist for Avelix.
        Respond ONLY in valid JSON. No markdown. No explanation.

User: Classify this AI tool/model discovery:
Title: {title}
Description: {description}
URL: {url}
Source: {source}

Return JSON with:
{
  "content_type": "tool" | "model" | "skill",
  "category": "string from approved category list",
  "tags": ["array", "of", "relevant", "tags"],
  "use_cases": ["array of use cases"],
  "user_types": ["creator", "developer", "business", "beginner"],
  "best_for": ["specific tasks this excels at"],
  "not_ideal_for": ["tasks where it falls short"],
  "difficulty": "beginner" | "intermediate" | "advanced",
  "pricing_model": "free" | "freemium" | "paid" | "open-source",
  "has_free_plan": true | false,
  "has_api": true | false,
  "short_description": "one clear sentence, max 150 chars",
  "confidence_score": 0.0-1.0,
  "is_genuine_ai_tool": true | false,
  "classification_notes": "brief reason for classification"
}
```

**3. Confidence Gate**
```
IF confidence_score < 0.5 → route to "Low Confidence" branch → log and skip
IF confidence_score >= 0.5 → continue to draft creation
```

**4. Generate Full Description (Claude)**
For items with confidence >= 0.5:
```
System: You are writing for Avelix, a practical AI discovery platform.
        Write clear, accurate, jargon-free content for non-technical users.
        Base ALL content strictly on the source URL provided.
        Do NOT invent features, pricing, or capabilities not mentioned in the source.
        
User: Write a full description for this AI tool:
Source URL: {url}
Title: {title}
Classification data: {json}

Provide:
- long_description (3-4 paragraphs, practical focus)
- main_features (array of 5-8 bullet points)
- pros (array of 3-5)
- cons (array of 2-4, be honest)
- example_prompts (array of 3 prompts showing how to use it)

Return as JSON only.
```

**5. Create Supabase Draft Record**
Insert into `tools`, `models`, or `skills` with `status = 'draft'`:
```javascript
{
  title: item.title,
  slug: slugify(item.title),
  short_description: enriched.short_description,
  long_description: enriched.long_description,
  category_id: categoryIdFromName(enriched.category),
  tags: enriched.tags,
  status: 'draft',
  source_urls: [item.url],
  confidence_score: enriched.confidence_score,
  ai_generated: true,
  last_synced_at: new Date().toISOString()
}
```

**6. Add to Approval Queue**
```javascript
INSERT INTO approval_queue (
  content_type, content_id, content_slug, content_title,
  action, source_url, ai_confidence, summary_of_changes,
  status, submitted_at
) VALUES (...)
```

**7. Send Admin Notification (Resend)**
```
Subject: "Avelix Sync: {N} new items ready for review"
Body: List of items with confidence scores and source links
Link: https://avelix.ai/admin/queue
```

---

## Workflow 3: `update-monitor.json`

**Schedule:** Every day at 14:00 UTC (second daily run)

**Purpose:** Detect updates to EXISTING tools (pricing changes, new features, deprecations).

### Nodes:

**1. Get All Published Tools with Source URLs**
```sql
SELECT id, title, slug, source_urls, last_synced_at 
FROM tools WHERE status = 'published'
```

**2. For each tool — fetch source URL**
HTTP Request node, GET the source URL.
Store: page content hash.

**3. Compare to stored hash**
If hash changed since last check → flag for update review.

**4. Claude: Summarize Change**
```
Given this new content from {url} compared to what we knew before,
what changed? Respond in JSON:
{
  "change_type": "pricing" | "feature" | "deprecation" | "launch" | "other",
  "description": "One sentence summary of what changed",
  "confidence": 0.0-1.0,
  "fields_to_update": ["pricing_summary", "main_features", etc.]
}
```

**5. Add to Approval Queue as "update" action**

---

## Workflow 4: `stale-page-detector.json`

**Schedule:** Every Sunday at 08:00 UTC

**Purpose:** Flag tools/models not reviewed in 30+ days.

```sql
UPDATE tools 
SET status = 'review'  -- flags for human to re-check
WHERE status = 'published' 
  AND (last_reviewed_at < NOW() - INTERVAL '30 days' 
       OR last_reviewed_at IS NULL)
RETURNING id, title, slug;
```

Add flagged items to approval queue with `action = 'review'`.

---

## Trusted Sources Registry

Seed these into the `sources` table:

| Source | URL | Type | Trust Score | Check Frequency |
|---|---|---|---|---|
| OpenAI Blog | openai.com/blog | official_blog | 1.0 | daily |
| Anthropic Blog | anthropic.com/blog | official_blog | 1.0 | daily |
| Google AI Blog | blog.google/technology/ai | official_blog | 1.0 | daily |
| Meta AI Blog | ai.meta.com/blog | official_blog | 1.0 | daily |
| Mistral Blog | mistral.ai/news | official_blog | 1.0 | daily |
| Hugging Face Blog | huggingface.co/blog | official_blog | 0.95 | daily |
| ElevenLabs Blog | elevenlabs.io/blog | official_blog | 0.95 | daily |
| Runway Blog | runwayml.com/blog | official_blog | 0.95 | daily |
| Product Hunt | producthunt.com | community | 0.7 | daily |
| GitHub Trending | github.com/trending | community | 0.6 | daily |
| Hugging Face Models | huggingface.co/models | community | 0.8 | daily |
| Ben's Bites Newsletter | bensbites.beehiiv.com | newsletter | 0.85 | daily |
| The Rundown AI | therundown.ai | newsletter | 0.8 | daily |

---

## Deduplication Logic

Before any insert, run this check:
1. Normalize title: lowercase, remove punctuation, trim
2. Normalize slug: `slugify(title)`
3. Check `tools` table: `WHERE slug = ? OR similarity(title, ?) > 0.8`
4. Check `approval_queue`: `WHERE content_slug = ? AND status = 'pending'`
5. If match found with confidence > 0.85 → mark as duplicate, skip
6. If match found with confidence 0.6–0.85 → flag as "possible duplicate", add to queue with warning

---

## Anti-Hallucination Controls

The Claude enrichment prompt must enforce these rules:
1. Only describe features explicitly mentioned in the source URL
2. Only state pricing confirmed on the official pricing page
3. Add `"confidence_score": 0.3` if source URL is not official
4. Never use phrases like "probably", "likely", "may have" — state facts or omit
5. Any field without source evidence → set to `null`, do not guess

The webhook endpoint validates:
- `source_urls` array is non-empty
- At least one source has trust_score >= 0.6
- `confidence_score` >= 0.5 before creating draft

---

## Done Criteria
- [ ] `daily-discovery.json` workflow imports into n8n and runs
- [ ] Product Hunt, Hugging Face, and RSS feeds all return data
- [ ] Deduplicate check correctly skips existing items
- [ ] Claude enrichment returns valid JSON (no markdown fences)
- [ ] Draft records created in Supabase with `status = 'draft'`
- [ ] Approval queue populated after each run
- [ ] Admin notification email sent via Resend
- [ ] `update-monitor.json` detects changed source content
- [ ] `stale-page-detector.json` flags items not reviewed in 30 days
- [ ] Low confidence items (< 0.5) are never drafted
- [ ] Source URLs validated before draft creation
