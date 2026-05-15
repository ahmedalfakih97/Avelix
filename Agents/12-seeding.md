# Agent 12 — Initial Data Seeding

## Goal
Populate the Avelix database with enough initial content to make the MVP launch-ready. This agent creates seed SQL files and seed scripts for all core content types.

## Prerequisites
- Agent 02 complete (database schema live)
- Supabase project accessible

---

## What to Seed

### Categories (`supabase/seeds/categories.sql`)

**Tool Categories:**
```sql
INSERT INTO categories (name, slug, content_type, icon) VALUES
('AI Writing Tools', 'ai-writing-tools', 'tool', 'pen'),
('AI Chatbots', 'ai-chatbots', 'tool', 'message-circle'),
('AI Research Tools', 'ai-research-tools', 'tool', 'search'),
('AI Image Tools', 'ai-image-tools', 'tool', 'image'),
('AI Video Tools', 'ai-video-tools', 'tool', 'video'),
('AI Voice Tools', 'ai-voice-tools', 'tool', 'mic'),
('AI Avatar Tools', 'ai-avatar-tools', 'tool', 'user'),
('AI Automation Tools', 'ai-automation-tools', 'tool', 'zap'),
('AI Agent Builders', 'ai-agent-builders', 'tool', 'bot'),
('AI Coding Tools', 'ai-coding-tools', 'tool', 'code'),
('AI Design Tools', 'ai-design-tools', 'tool', 'palette'),
('AI Presentation Tools', 'ai-presentation-tools', 'tool', 'layout'),
('AI Meeting Tools', 'ai-meeting-tools', 'tool', 'calendar'),
('AI Marketing Tools', 'ai-marketing-tools', 'tool', 'trending-up'),
('AI Data Analysis Tools', 'ai-data-analysis-tools', 'tool', 'bar-chart'),
('AI UGC Tools', 'ai-ugc-tools', 'tool', 'film');
```

**Model Categories:**
```sql
INSERT INTO categories (name, slug, content_type) VALUES
('Large Language Models', 'llm', 'model'),
('Reasoning Models', 'reasoning-models', 'model'),
('Multimodal Models', 'multimodal-models', 'model'),
('Image Generation Models', 'image-models', 'model'),
('Video Generation Models', 'video-models', 'model'),
('Audio & Speech Models', 'audio-models', 'model'),
('Embedding Models', 'embedding-models', 'model'),
('Open-Source Models', 'open-source-models', 'model'),
('Coding Models', 'coding-models', 'model'),
('Local Models', 'local-models', 'model');
```

**Skill Categories:**
```sql
INSERT INTO categories (name, slug, content_type) VALUES
('Prompt Engineering', 'prompt-engineering', 'skill'),
('AI Content Creation', 'ai-content-creation', 'skill'),
('AI Automation', 'ai-automation', 'skill'),
('AI for Business', 'ai-for-business', 'skill'),
('AI Agents & MCP', 'ai-agents-mcp', 'skill'),
('AI for Creators', 'ai-for-creators', 'skill'),
('AI for Developers', 'ai-for-developers', 'skill'),
('AI Research', 'ai-research', 'skill'),
('AI Image Generation', 'ai-image-generation', 'skill'),
('AI Video Generation', 'ai-video-generation', 'skill'),
('AI Voice & Avatars', 'ai-voice-avatars', 'skill'),
('n8n Workflows', 'n8n-workflows', 'skill'),
('RAG & Embeddings', 'rag-embeddings', 'skill');
```

---

### Initial Tools (20 launch tools)

Create `supabase/seeds/tools.sql` with full records for:

```
1. ChatGPT (OpenAI)
2. Claude (Anthropic)
3. Gemini (Google)
4. Perplexity
5. ElevenLabs
6. Runway
7. Kling
8. HeyGen
9. Midjourney
10. DALL-E 3
11. n8n
12. Make (formerly Integromat)
13. Zapier
14. Cursor
15. Replit
16. Gamma
17. NotebookLM
18. Canva AI
19. Lovable
20. Bolt
```

For each tool, populate ALL fields defined in the schema. Mark `ai_generated = false` for seed data (manually verified).

---

### Initial Models (15 launch models)

Create `supabase/seeds/models.sql` with full records for:

```
1. GPT-4o (OpenAI)
2. GPT-4o mini (OpenAI)
3. o1 (OpenAI)
4. Claude 3.5 Sonnet (Anthropic)
5. Claude 3.5 Haiku (Anthropic)
6. Gemini 1.5 Pro (Google)
7. Gemini 1.5 Flash (Google)
8. Grok 2 (xAI)
9. Llama 3.1 405B (Meta)
10. Mistral Large (Mistral AI)
11. DeepSeek V3 (DeepSeek)
12. FLUX.1 (Black Forest Labs)
13. Stable Diffusion 3.5 (Stability AI)
14. ElevenLabs Turbo v2.5 (ElevenLabs)
15. Whisper (OpenAI)
```

---

### Initial Skills (15 launch skills)

Create `supabase/seeds/skills.sql` with records for:

```
1. Prompt Engineering Basics
2. Build an AI Chatbot (no-code)
3. Automate Content Creation with n8n
4. AI Image Generation with Midjourney
5. AI Voice Generation with ElevenLabs
6. Build Your First AI Agent
7. Use Perplexity for Deep Research
8. Build a RAG System
9. Write Better System Prompts
10. Use Claude for Business Automation
11. AI Video Creation with Runway
12. Build UGC Automation Pipeline
13. Use MCP with Claude
14. AI Tool Selection Framework
15. Automate Customer Support with AI
```

---

### Glossary Seed (30 terms)

Create `supabase/seeds/glossary.sql` with fully populated records for all 30 terms listed in Agent 06.

---

### Learning Paths (5 launch paths)

Create `supabase/seeds/learning_paths.sql`:

```
1. Start Learning AI from Zero
2. AI for Business Owners
3. AI for Content Creators
4. AI Automation with n8n
5. Build Your First AI Agent
```

---

### Seed Script

Create `scripts/seed.ts`:
```typescript
import { execSync } from 'child_process';
import * as fs from 'fs';

const seedFiles = [
  'supabase/seeds/categories.sql',
  'supabase/seeds/tools.sql',
  'supabase/seeds/models.sql',
  'supabase/seeds/skills.sql',
  'supabase/seeds/glossary.sql',
  'supabase/seeds/learning_paths.sql',
];

for (const file of seedFiles) {
  console.log(`Seeding: ${file}`);
  execSync(`supabase db execute --file ${file}`);
}

console.log('✅ All seeds complete');
```

Run with: `npx ts-node scripts/seed.ts`

---

### Algolia Initial Index

After seeding Supabase, run the sync script from Agent 08:
```bash
npx ts-node scripts/sync-algolia.ts
```

This pushes all published seed items to Algolia indexes.

---

## Content Quality Requirements for Seed Data

All seed data must meet these quality bars:
- `short_description`: max 150 characters, starts with verb ("Generate...", "Build...", "Analyze...")
- `long_description`: 200–400 words, no marketing fluff, practical focus
- `best_for`: 3–5 specific tasks (not vague like "productivity")
- `source_urls`: at least 1 official source (company website or docs)
- `pricing_last_verified`: set to seed date
- `status`: `'published'` for all seed data (pre-approved)
- `confidence_score`: 1.0 for manually verified seed data
- `ai_generated`: `false` for all seed data

---

## Done Criteria
- [ ] All category seed records inserted
- [ ] 20 tools seeded with full data
- [ ] 15 models seeded with full data
- [ ] 15 skills seeded with full data
- [ ] 30 glossary terms seeded
- [ ] 5 learning paths seeded
- [ ] All items have `status = 'published'`
- [ ] Algolia indexes populated (verify in Algolia dashboard)
- [ ] Homepage "Featured Tools" renders real data
- [ ] `/tools` page shows 20 tools
- [ ] `/models` page shows 15 models
- [ ] `/skills` page shows 15 skills
- [ ] `/glossary` shows 30 terms with alphabet navigation
