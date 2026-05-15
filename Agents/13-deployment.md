# Agent 13 — Deployment & Launch Checklist

## Goal
Deploy Avelix to production on Vercel, configure all environment variables, run final checks, and confirm the MVP is live and fully functional.

## Prerequisites
- Agents 01–12 complete
- Domain purchased (avelix.ai or equivalent)
- Vercel account
- All third-party accounts created

---

## Pre-Deployment Checklist

### Code Quality
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] TypeScript strict mode: zero `any` types
- [ ] All `console.log` removed from production code
- [ ] No hardcoded secrets or API keys in codebase
- [ ] `.env.local` in `.gitignore`

### Supabase
- [ ] All migrations run on production project
- [ ] RLS policies tested (anon cannot access draft/admin data)
- [ ] Service role key stored in Vercel env, NOT in client-side code
- [ ] Seed data fully loaded
- [ ] Database backup enabled
- [ ] Connection pooling enabled (PgBouncer)

### Algolia
- [ ] All indexes populated
- [ ] Search API key is read-only (safe for client-side)
- [ ] Admin API key is server-side only
- [ ] Test search returns correct results

### n8n
- [ ] Workflows imported and tested in n8n
- [ ] All credentials configured in n8n
- [ ] Test run completed for `daily-discovery.json`
- [ ] Webhook endpoint tested: `POST /api/webhooks/sync`
- [ ] Admin notification email tested

---

## Vercel Deployment

### 1. Connect repository
```bash
vercel login
vercel link
```

### 2. Configure environment variables in Vercel dashboard
All variables from `.env.local` must be set in Vercel:
- Settings → Environment Variables
- Set for: Production, Preview, Development

### 3. Deploy
```bash
vercel --prod
```

### 4. Configure custom domain
- Vercel → Domains → Add `avelix.ai`
- Update DNS at domain registrar:
  ```
  A     @     76.76.21.21
  CNAME www   cname.vercel-dns.com
  ```

---

## Post-Deployment Verification

### Pages that must load correctly:
```
https://avelix.ai                          ← Homepage
https://avelix.ai/tools                   ← Tools index
https://avelix.ai/tools/chatgpt           ← Tool page
https://avelix.ai/models                  ← Models index
https://avelix.ai/models/gpt-4o           ← Model page
https://avelix.ai/skills                  ← Skills index
https://avelix.ai/glossary                ← Glossary
https://avelix.ai/glossary/llm            ← Glossary term
https://avelix.ai/guides                  ← Learning paths
https://avelix.ai/services                ← Services
https://avelix.ai/sitemap.xml            ← Sitemap
https://avelix.ai/robots.txt             ← Robots
https://avelix.ai/admin                   ← Redirects to /login
```

### Functional checks:
- [ ] Search `Cmd+K` returns results
- [ ] Tool filters work (test 3 filter combinations)
- [ ] Contact form submits successfully
- [ ] Admin login works
- [ ] Approval queue shows items
- [ ] Approve action publishes a test item
- [ ] OG image generates: `https://avelix.ai/api/og/tool?slug=chatgpt`
- [ ] Sitemap contains published items

### Performance checks:
```bash
# Lighthouse CLI
npx lighthouse https://avelix.ai --output json

# Targets:
Performance: > 90
Accessibility: > 95
Best Practices: > 95
SEO: 100
```

---

## Analytics Setup

### Vercel Analytics (free)
Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';
// Add <Analytics /> to layout
```

### Google Search Console
1. Add property: `https://avelix.ai`
2. Verify via DNS TXT record
3. Submit sitemap: `https://avelix.ai/sitemap.xml`

### Google Analytics 4 (optional for MVP)
Add GA4 measurement ID if needed.

---

## Monitoring & Alerts

### Vercel
- Enable deployment notifications
- Enable function timeout alerts (set max 10s for API routes)

### Supabase
- Enable email alerts for:
  - Database storage > 80%
  - Failed auth attempts
  - API rate limit hits

### n8n
- Enable workflow execution notifications
- Alert on: failed sync runs, zero items discovered (possible source down)

### Uptime monitoring (free tier)
Use UptimeRobot or Better Stack:
- Monitor: `https://avelix.ai` every 5 minutes
- Alert: email if down > 2 minutes

---

## Monthly Cost Estimate (MVP)

| Service | Plan | Monthly Cost |
|---|---|---|
| Vercel | Hobby (free) | $0 |
| Supabase | Free tier | $0 |
| Algolia | Free tier (10k searches) | $0 |
| n8n | Self-hosted on Railway | ~$5 |
| Resend | Free tier (3k emails) | $0 |
| Domain | Annual / 12 | ~$1 |
| **Total MVP** | | **~$6/month** |

**When scaling:**
| Service | When to upgrade | Cost |
|---|---|---|
| Vercel | > 100GB bandwidth | $20/month |
| Supabase | > 500MB database | $25/month |
| Algolia | > 10k searches/month | $30/month |
| n8n | More workflows | $20/month |

---

## Launch Day Sequence

```
Day 0 (prep):
  □ All agents 01-12 complete
  □ Seed data live
  □ Admin panel tested
  □ n8n first sync run complete
  □ 5+ items reviewed and approved via queue

Day 1 (launch):
  □ Deploy to production
  □ Domain DNS propagated
  □ Run post-deployment checks
  □ Submit sitemap to Google Search Console
  □ Test all CTAs and forms
  □ Social post: "Avelix is live"
  □ Link social posts to website pages

Week 1 (post-launch):
  □ Monitor search console for indexing
  □ Review daily sync queue each morning
  □ Add more tools (target: 50 published tools)
  □ Add more skills (target: 30 published skills)
  □ First blog article published
```

---

## Done Criteria
- [ ] Production deployment live at custom domain
- [ ] All 13 verification URLs return 200
- [ ] Lighthouse scores meet targets
- [ ] Google Search Console property verified
- [ ] Sitemap submitted
- [ ] Analytics tracking confirmed
- [ ] n8n daily sync running on schedule
- [ ] Admin approval workflow end-to-end tested in production
- [ ] Uptime monitoring active
