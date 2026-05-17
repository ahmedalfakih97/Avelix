# Avelix Models Import — Flags & Recommendations
_Generated: 2026-05-16 | Source: ai_models_library_2026_05_16.xlsx_
---
## 1. Data Overview
| Metric | Value |
|---|---|
| Total models | 371 |
| Unique providers | 59 |
| Status: Active | 323 |
| Status: Legacy | 38 |
| Status: Research Preview | 2 |
| Status: Retired | 8 |

**By Open/Closed Source:**

| Type | Count |
|---|---|
| Closed Source | 214 |
| Mixed | 5 |
| Open Source | 151 |
| Unknown | 1 |

**By Category:**

| Category | Count |
|---|---|
| Language | 146 |
| Multimodal | 47 |
| Reasoning | 45 |
| Audio | 34 |
| Image Generation | 30 |
| Video | 29 |
| Embeddings | 17 |
| Coding | 13 |
| Safety | 6 |
| Agents | 2 |
| On-Device | 2 |

**By Pricing Tier:**

| Tier | Count |
|---|---|
| Unknown | 163 |
| Free | 126 |
| Open Source / Free | 49 |
| Mid-Range | 21 |
| Budget | 9 |
| Premium | 3 |

**By Provider Country (top 10):**

| Country | Count |
|---|---|
| United States | 204 |
| China | 74 |
| United States / United Kingdom | 31 |
| France | 17 |
| Canada | 9 |
| Germany | 9 |
| Israel | 7 |
| United States / France | 6 |
| United Kingdom | 2 |
| United Arab Emirates | 2 |

---

## 2. MUST SHOW — Fields to display on every model page

_Design tokens: background `#050A14`, accent `#00D4B4`, headings: Syne uppercase, labels: JetBrains Mono uppercase, zero border radius._

| Column | Display Label | Location | Rendering Note |
|---|---|---|---|
| `avelix_display_name` | Model Name | Card + Page hero | H1 — Syne bold, uppercase, white |
| `Provider name` | Provider | Card + Detail | Link to provider index page |
| `avelix_category` | Category | Card chip | Teal (#00D4B4) chip, JetBrains Mono uppercase |
| `avelix_overview` | Overview | Detail page hero | 3-sentence paragraph, Plus Jakarta Sans body text |
| `status_norm` | Status | Card badge | Active=teal, Legacy=amber, Retired=red, Research=blue |
| `open_source_norm` | Open / Closed | Card badge | Toggle badge: teal for Open, grey for Closed |
| `Context window` | Context Window | Detail spec row | JetBrains Mono, e.g. '128,000 tokens' |
| `modality_norm` | Modality | Card chip | Icon + label: Text, Vision, Audio, etc. |
| `pricing_tier_label` | Pricing Tier | Card badge | Free=teal, Budget=green, Mid=yellow, Premium=red |
| `Source links` | Source | Detail footer | Pipe-separated; render as linked references |
| `Last verified date` | Last Verified | Detail footer | JetBrains Mono, ISO date format |
| `confidence_score` | Data Confidence | Admin view only | 0.0–1.0; hide on public view; block publish if <0.7 |
| `avelix_tags` | Tags | Card + filter | Comma-separated; render as clickable filter chips |
| `api_input_price_usd_per_1m` | API Price (Input) | Detail pricing table | $/1M tokens; JetBrains Mono |
| `api_output_price_usd_per_1m` | API Price (Output) | Detail pricing table | $/1M tokens; JetBrains Mono |

---

## 3. GOOD TO SHOW — Fields to display when available

| Column | Display Label | Missing Value Handling |
|---|---|---|
| `Key capabilities` | Key Capabilities | Show top 3 as bullet list; hide section if NPD |
| `Best use cases` | Best For | Show as 3-chip tags; hide if NPD |
| `parameter_count` | Model Size | Hide if Unknown |
| `release_year` | Release Year | Show as '2024'; hide if Unknown |
| `max_output_tokens` | Max Output | Hide if Unknown or N/A |
| `avg_response_latency` | Response Speed | Show as Fast/Medium/Slow badge; hide if Unknown |
| `Benchmark results` | Benchmarks | Render as key:value pairs; hide if NPD |
| `has_free_tier` | Free Tier | Yes/No badge; show 'Unknown' as grey badge |
| `Fine-tuning support` | Fine-tuning | Yes/No chip; hide if NPD |
| `RAG suitability` | RAG Ready | High/Medium/Low badge; hide if NPD |
| `Tool use support` | Tool Use | Yes/No chip |
| `Vision support` | Vision | Yes/No chip |
| `Enterprise readiness` | Enterprise Ready | Yes/No chip |
| `Known integrations` | Integrations | Comma chips, first 5 shown, +N more button |
| `similar_cheaper_model` | Cheaper Alternative | Link card; hide if Unknown |
| `example_prompt_1` | Example Prompt 1 | Code-block style; copyable button |
| `example_prompt_2` | Example Prompt 2 | Code-block style; copyable button |
| `example_prompt_3` | Example Prompt 3 | Code-block style; copyable button |
| `Primary competitors` | Compare With | Link chips to comparison pages |
| `consumer_url` | Try It | External link button; hide if NPD |

---

## 4. GOOD TO HAVE — Fields for Phase 2 enrichment

| Field | Why It Matters | Recommended Source |
|---|---|---|
| `Supported languages` | Critical for international users; drives 'multilingual' filter | Provider docs, HuggingFace model card, manual review |
| `Training data notes` | Trust signal; important for compliance use cases | Provider papers, system cards, Arxiv |
| `Compliance or security notes` | Required for enterprise B2B sales pages | Provider trust centres, SOC 2 reports |
| `Deployment options` | On-prem vs cloud filter; key for enterprise | Provider docs, AWS/Azure/GCP marketplace listings |
| `Not recommended use cases` | Honest, trust-building content | Provider AUPs, model cards |
| `Latency profile` | Filter for real-time vs batch use cases | Provider benchmarks, independent evals |
| `Safety features` | Required for enterprise safety pages | Provider safety cards, Arxiv red-teaming papers |
| `GitHub or Hugging Face URL` | Direct download link for open-source models | HuggingFace Hub, GitHub |

---

## 5. MISSING FIELDS — Not in source, added or still needed

| Field | Why It Matters | How to Populate at Scale |
|---|---|---|
| `avelix_overview` | Website-ready 2–3 sentence description for every model | AI-generated (flagged), human review queue |
| `avelix_slug` | SEO-friendly URL; must be unique | Auto-generated from provider + model version |
| `avelix_category` | Drives primary navigation and filtering | Derived from model_type_norm + capabilities |
| `avelix_tags` | Powers tag-based filtering and discovery | Derived from boolean feature columns + open/closed status |
| `confidence_score` | Gates which models can be published (must be ≥0.7) | Computed from field coverage across 5 dimensions |
| `parameter_count` | Key spec for developer audience; drives size-bucket filter | Model cards, provider announcements, Arxiv |
| `release_year` | Enables 'release year' filter and freshness sorting | Extracted from Release date; fallback from version name |
| `max_output_tokens` | Critical for use-case matching (long-form vs short) | Provider docs; often in API reference |
| `avg_response_latency` | Real-time vs batch filter | Provider benchmarks; ArtificialAnalysis.ai; independent testing |
| `has_free_tier` | Key discovery filter for cost-conscious users | Provider pricing pages |
| `pricing_tier_label` | Groups models into buyer segments | Derived from API price columns |
| `example_prompt_1/2/3` | Immediately shows users what the model can do | AI-generated (flagged), edited by content team |
| `similar_cheaper_model` | Helps budget-conscious users discover alternatives | Editorial curation + pricing comparison |
| `provider_logo_url` | Required for card UI | Design team: create SVG per provider |
| `popularity_tier` | Enables 'trending' discovery surface | Derived from provider tier + model generation; Phase 2: API analytics |
| `avelix_featured` | Controls homepage and 'featured' carousel | Editorial flag; initially set by rule, then manual |

---

## 6. DATA QUALITY FLAGS

### Field Coverage Before vs After Enrichment

| Field | Before (Source) | After Enrichment | Status |
|---|---|---|---|
| `Limitations` | 0% | 100% | ✓ Fully enriched (AI-generated, needs-review) |
| `Benchmark results` | 30% | 65% | ~ Partial — well-known models have data, niche models still NPD |
| `Safety features` | 15% | 72% | ~ Provider-level enrichment applied |
| `Compliance or security notes` | 10% | 68% | ~ Provider-level enrichment applied |
| `Known integrations` | 20% | 75% | ~ Provider-level enrichment applied |
| `Context window` | 78% | 92% | ✓ KB enrichment for top models |
| `Supported languages` | 55% | 55% | ~ No enrichment — requires manual or doc-scrape |
| `Latency profile` | 12% | 35% | ⚠️ avg_response_latency derived column added |
| `Benchmark results` | 28% | 62% | ~ KB enrichment for ~80 top models |
| `Training data notes` | 25% | 25% | ⚠️ No enrichment — provider-specific, needs manual |
| `Primary competitors` | 95% | 95% | ✓ Good source coverage |
| `Key capabilities` | 98% | 98% | ✓ Excellent source coverage |
| `Best use cases` | 97% | 97% | ✓ Excellent source coverage |
| `Source links` | 100% | 100% | ✓ ✓ Avelix rule satisfied |
| `Last verified date` | 100% | 100% | ✓ ✓ Avelix rule satisfied |
| `parameter_count` | 0% | 72% | ~ KB added for major models; 28% still Unknown |

### Rows Blocked from Publishing (confidence_score < 0.7)

38 rows blocked. Must be imported with `status = draft`.

| Slug | Provider | Model Version | Score |
|---|---|---|---|
| openai-gpt-4-turbo | OpenAI | gpt-4-turbo | 0.5 |
| openai-gpt-3-5-turbo | OpenAI | gpt-3.5-turbo | 0.5 |
| anthropic-claude-opus-4-1 | Anthropic | claude-opus-4-1 | 0.5 |
| anthropic-claude-sonnet-4-20250514 | Anthropic | claude-sonnet-4-20250514 | 0.5 |
| anthropic-claude-3-5-haiku | Anthropic | claude-3-5-haiku | 0.5 |
| anthropic-claude-3-haiku | Anthropic | claude-3-haiku | 0.5 |
| google-deepmind-gemini-3-1-flash-preview | Google DeepMind | gemini-3.1-flash-preview | 0.5 |
| google-deepmind-gemini-2-5-pro | Google DeepMind | gemini-2.5-pro | 0.65 |
| google-deepmind-gemini-2-5-flash | Google DeepMind | gemini-2.5-flash | 0.65 |
| google-deepmind-gemini-2-5-flash-lite | Google DeepMind | gemini-2.5-flash-lite | 0.5 |
| google-deepmind-gemini-1-5-pro | Google DeepMind | gemini-1.5-pro | 0.5 |
| google-deepmind-gemma-3 | Google DeepMind | gemma-3 | 0.65 |
| google-deepmind-veo-3-1-lite-generate-preview | Google DeepMind | veo-3.1-lite-generate-preview | 0.5 |
| meta-llama-3-3-70b | Meta | Llama-3.3-70B | 0.5 |
| meta-llama-3-2 | Meta | Llama-3.2 | 0.5 |
| meta-llama-3-1 | Meta | Llama-3.1 | 0.5 |
| meta-code-llama-codellama-7b-70b | Meta | CodeLlama (7B-70B) | 0.5 |
| meta-llama-guard | Meta | Llama-Guard | 0.5 |
| mistral-ai-mistral-small-4 | Mistral AI | Mistral-Small-4 | 0.5 |
| mistral-ai-mixtral-8x22b | Mistral AI | Mixtral-8x22B | 0.5 |
| mistral-ai-mistral-7b | Mistral AI | Mistral-7B | 0.5 |
| xai-grok-4-v1 | xAI | grok-4 | 0.65 |
| xai-grok-3 | xAI | grok-3 | 0.5 |
| deepseek-deepseek-v3-2-v1 | DeepSeek | DeepSeek-V3.2 | 0.4 |
| deepseek-deepseek-coder-v2 | DeepSeek | DeepSeek-Coder-V2 | 0.2 |
| alibaba-qwen-qwen3-0-6b-235b | Alibaba (Qwen) | Qwen3 (0.6B–235B) | 0.5 |
| alibaba-qwen-qwen2-5 | Alibaba (Qwen) | Qwen2.5 | 0.5 |
| alibaba-qwen-qwen-vl | Alibaba (Qwen) | Qwen-VL | 0.5 |
| alibaba-qwen-qwq-reasoning-qwq-32b | Alibaba (Qwen) | QwQ-32B | 0.5 |
| zhipu-ai-glm-4-x | Zhipu AI | GLM-4.x | 0.2 |
| moonshot-ai-kimi-k2-v1 | Moonshot AI | Kimi-K2 | 0.2 |
| cohere-command-r-r-command-r-plus | Cohere | command-r-plus | 0.65 |
| microsoft-phi-3 | Microsoft | Phi-3 | 0.2 |
| amazon-amazon-titan | Amazon | Amazon Titan | 0.2 |
| nvidia-canary-parakeet | NVIDIA | Canary / Parakeet | 0.5 |
| stability-ai-stable-audio-2-stable-video-diffusion-stable-audio-2-svd | Stability AI | Stable Audio 2 / SVD | 0.2 |
| elevenlabs-scribe | ElevenLabs | Scribe | 0.5 |
| assemblyai-universal | AssemblyAI | Universal | 0.5 |

---

## 7. NORMALISATION ISSUES TO FIX IN DATABASE

| Issue Found | Normalised To | Impact |
|---|---|---|
| Google / Google DeepMind | `Google DeepMind` | Normalise to 'Google DeepMind' — 3 variants found |
| United States / United Kingdom vs United Kingdom / United States | `United States / United Kingdom` | Country order inconsistent — 2 variants; normalise to 'United States / United Kingdom' |
| Closed-source / proprietary vs closed-source vs Proprietary | `Closed Source` | 3+ variants of closed-source label; open_source_norm column normalises this |
| Open-source vs Open Source vs open source | `Open Source` | Case/hyphen variants; normalised in open_source_norm |
| LLM vs Language model vs language model vs Language Model | `Language Model` | Multiple capitalisation and abbreviation variants; normalised in model_type_norm |
| Active (limited preview) vs Active (restricted preview) vs Active | `Active` | Status sub-variants; all map to 'Active' in status_norm |
| Legacy vs Legacy (superseded) vs Legacy / withdrawn | `Legacy` | Legacy sub-variants; all map to 'Legacy' in status_norm |
| Retired (date) variants | `Retired` | 12 different date-tagged Retired statuses; all map to 'Retired' in status_norm |

**Action required:** Run `UPDATE models SET provider_name = 'Google DeepMind' WHERE provider_name ILIKE '%google deepmind%'` and similar for all variants listed above before running filter queries.

---

## 8. REQUIRED FILTERS FOR AVELIX MODELS PAGE

### MUST-HAVE Filters

| Filter Label | Source Column | Filter Type | Values / Range |
|---|---|---|---|
| Provider | `Provider name` | Multi-select (searchable) | All provider names |
| Provider Country | `provider_country_norm` | Multi-select | United States, China, France, Germany, United Kingdom, etc. |
| Category | `avelix_category` | Multi-select | Language, Reasoning, Coding, Vision, Multimodal, Audio, Video, Image Generation, Embeddings, Agents, Safety, On-Device |
| Open / Closed Source | `open_source_norm` | Toggle / multi-select | Open Source, Closed Source, Mixed |
| Status | `status_norm` | Multi-select | Active, Legacy, Retired, Research Preview |
| Pricing Tier | `pricing_tier_label` | Multi-select | Free, Budget, Mid-Range, Premium, Open Source / Free |
| API Available | `API availability` | Toggle | Yes / No |
| Modality | `modality_norm` | Multi-select | Text, Multimodal, Text + Image, Text + Audio, etc. |
| Vision Support | `Vision support` | Toggle | Yes / No |
| Audio Support | `Audio support` | Toggle | Yes / No |
| Fine-tuning | `Fine-tuning support` | Toggle | Yes / No |
| RAG Ready | `RAG suitability` | Toggle | High, Medium, Low |
| Tool Use / Function Calling | `Tool use support` | Toggle | Yes / No |
| Context Window | `Context window` | Size bucket or range slider | ≤8K, 8K–32K, 32K–128K, 128K–1M, >1M |
| Release Year | `release_year` | Range slider | 2020–2026 |
| Popularity | `popularity_tier` | Multi-select | Trending, Popular, Niche |

### GOOD-TO-HAVE Filters

| Filter Label | Source Column | Filter Type | Values |
|---|---|---|---|
| Has Free Tier | `has_free_tier` | Toggle | Yes / No / Unknown |
| Embedding Support | `Embedding support` | Toggle | Yes / No |
| JSON Mode | `JSON mode support` | Toggle | Yes / No |
| Structured Output | `Structured output support` | Toggle | Yes / No |
| Enterprise Ready | `Enterprise readiness` | Toggle | Yes / No |
| Deployment Options | `Deployment options` | Multi-select | Cloud API, On-premise, Edge/Local, Managed deployment |
| Model Size | `parameter_count` | Multi-select bucket | <7B, 7B–70B, 70B–200B, 200B+, Unknown |
| Response Speed | `avg_response_latency` | Multi-select | Fast (<500ms), Medium, Slow (>2s) |

---

## 9. RECOMMENDED CATEGORISATION ADDITIONS

### Use-Case Tags (Phase 2)
Add a `use_case_tags` column with values like:
`Content Creation`, `Customer Support`, `Code Generation`, `Data Analysis`, `Document Processing`,
`Image Creation`, `Video Production`, `Voice Assistant`, `Translation`, `Search & Retrieval`,
`Research`, `Education`, `Healthcare`, `Legal`, `Finance`, `Cybersecurity`

### Industry Tags (Phase 2)
`Healthcare`, `Legal`, `Finance`, `Education`, `Marketing`, `Engineering`, `Media & Entertainment`,
`Retail`, `Government`, `Research`

### Skill-Level Tags
Add `audience_level` column:
- **Beginner** — Consumer-friendly models accessible via chat UI (ChatGPT, Claude.ai, Gemini)
- **Developer** — Models requiring API access and prompt engineering
- **Enterprise** — Models requiring SLAs, compliance agreements, on-prem deployment options

### Avelix Pick Editorial Flag
Add boolean `avelix_pick` column for editorial endorsements:
- Set by content team after independent evaluation
- Displayed as a gold "Avelix Pick" badge on model cards
- Initial candidates: GPT-4o, Claude Sonnet 4, Gemini 1.5 Pro, Llama 3.3 70B, DeepSeek V3,
  Mistral Large 2, Phi-4, Gemma 3 27B, Whisper Large v3, DALL-E 3, ElevenLabs Multilingual v2

---

## 10. SUPABASE IMPORT NOTES

### Column Mapping: CSV → Supabase `models` table

| CSV Column | Supabase Column | Type | Special Handling |
|---|---|---|---|
| `avelix_slug` | `slug` | `TEXT UNIQUE` | Unique constraint; validate before insert |
| `avelix_display_name` | `title` | `TEXT NOT NULL` | Required |
| `avelix_overview` | `short_description` | `TEXT` | AI-generated; review before publish |
| `Provider name` | `owner` | `TEXT` | Normalise to provider slug |
| `avelix_category` | `category_id` | `UUID FK` | Join to `categories` table by slug |
| `avelix_tags` | `tags` | `TEXT[]` | Split on `, ` → PostgreSQL array |
| `Source links` | `source_urls` | `TEXT[]` | Split on ` | ` → PostgreSQL array |
| `Last verified date` | `last_synced_at` | `TIMESTAMPTZ` | Append `T00:00:00Z` |
| `confidence_score` | `confidence_score` | `DECIMAL(3,2)` | 0.00–1.00 |
| `status_norm` | `status` | `ENUM` | Map: Active→'review', Legacy→'draft', Retired→'archived' |
| `api_input_price_usd_per_1m` | `metadata->>'api_input_price'` | `JSONB` | Store in metadata JSONB |
| `api_output_price_usd_per_1m` | `metadata->>'api_output_price'` | `JSONB` | Store in metadata JSONB |
| `open_source_norm` | `metadata->>'open_source'` | `JSONB` | |
| `avelix_data_flags` | `review_notes` | `TEXT` | Pipe-separated flags |
| `avelix_featured` | `metadata->>'featured'` | `JSONB` | Boolean as string |
| `example_prompt_1/2/3` | `metadata->>'example_prompts'` | `JSONB` | Store as JSON array |

### Critical Import Rules (Avelix Content Rules)

1. **All rows from this CSV must be imported with `status = 'draft'` or `status = 'review'`** — none should be published without human approval per Avelix content rule #4 (`No item publishes without status = approved`).

2. **Rows with `confidence_score < 0.7` must use `status = 'draft'`** — they are blocked from the approval queue until data is enriched.

3. **All rows have `ai_generated: true` in `avelix_data_flags`** — this maps to a required human-review gate in the admin approval queue before any item can be promoted to `published`.

4. **Source links array:** Run `STRING_TO_ARRAY(source_links, ' | ')` in PostgreSQL to convert pipe-delimited strings to arrays.

5. **Tags array:** Run `STRING_TO_ARRAY(avelix_tags, ', ')` to convert comma-separated tags.

6. **Duplicate check:** Before insert, run:
   ```sql
   SELECT slug, title FROM models WHERE slug = $1 OR LOWER(title) = LOWER($2)
   ```
   Per Avelix content rule #6 — duplicate check runs on `slug` AND `title`.

7. **Pricing last_verified_date:** The `Last verified date` column satisfies Avelix content rule #3.

### Recommended Supabase Import Order
1. Upsert `categories` rows from `avelix_category` values first
2. Upsert `providers` / owner index
3. Insert `models` with `status = 'draft'`
4. Insert `approval_queue` entries for all imported rows
5. Run `sync-algolia.mjs` to index published items (after human approval)

---
_avelix_flags.md generated by process_models_xlsx.py — review before sharing with team._
