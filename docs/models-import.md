# Models Import — AI Models Library 2026-05-16

## Source

**File:** `ai_models_library_2026_05_16.xlsx`
**Processed:** 2026-05-16
**Output:** `avelix_models_import.csv` (371 rows × 77 columns)

## Run the Import

```bash
# 1. Run the schema migration (once) in Supabase SQL Editor:
#    supabase/migrations/20260516000000_add_model_columns.sql

# 2. Import all 371 models:
node scripts/import-models-csv.mjs

# 3. Sync to Algolia:
node scripts/sync-algolia.mjs
```

## Column Mapping (CSV → Supabase)

| CSV Column              | Supabase Column            | Notes                                      |
|------------------------|----------------------------|--------------------------------------------|
| avelix_slug            | slug                       | Unique. Format: `{provider}-{model-name}`  |
| avelix_display_name    | title                      |                                            |
| avelix_overview        | long_description           | AI-generated, category-specific            |
| avelix_overview        | short_description          | First sentence, truncated to 220 chars     |
| avelix_category        | avelix_category            | New column. Also mapped to model_type      |
| avelix_category        | model_type                 | Mapped: Language→llm, Coding→coding, etc.  |
| avelix_featured        | avelix_featured            | Boolean                                    |
| avelix_tags            | avelix_tags                | Pipe-separated → TEXT[]                    |
| avelix_tags            | tags                       | Same source                                |
| confidence_score       | confidence_score           | 0.0–1.0                                    |
| avelix_data_flags      | avelix_data_flags          | Includes `ai_generated:true` always        |
| popularity_tier        | popularity_tier            | Trending / Popular / Niche                 |
| Provider name          | provider                   |                                            |
| provider_country_norm  | provider_country           |                                            |
| Model family           | model_family               |                                            |
| Model version          | model_version              |                                            |
| release_year           | release_year               | INTEGER                                    |
| Release date           | release_date               | DATE                                       |
| status_norm            | current_status             | Active→active, Legacy→deprecated, etc.     |
| model_type_norm        | model_type_detail          | Granular type, e.g. "Cost-Efficient Llm"   |
| modality_norm          | modality                   | Text, Multimodal, Audio+text, etc.         |
| Context window         | context_window             | Parsed from "1,000,000 tokens" → INTEGER   |
| max_output_tokens      | max_output_tokens          |                                            |
| parameter_count        | parameter_count            | TEXT (e.g. "70B", "Unknown")               |
| Input types            | input_types                | Comma-split → TEXT[]                       |
| Output types           | output_types               | Comma-split → TEXT[]                       |
| open_source_norm       | is_open_source             | Open Source → true                         |
| API availability       | has_api                    | "Available" → true                         |
| has_free_tier          | has_free_tier              | Yes → true                                 |
| Deployment options     | deployment_options         | Comma-split → TEXT[]                       |
| Official model URL     | official_source_url        |                                            |
| Documentation URL      | documentation_url          |                                            |
| Pricing URL            | pricing_url                |                                            |
| Model card URL         | model_card_url             |                                            |
| GitHub or HF URL       | github_hf_url              |                                            |
| consumer_url           | consumer_url               |                                            |
| Source links           | source_urls                | Pipe-separated → TEXT[]                    |
| price_summary          | pricing_summary            |                                            |
| api_input_price_usd_per_1m  | api_input_price_usd_per_1m  | NUMERIC                              |
| api_output_price_usd_per_1m | api_output_price_usd_per_1m | NUMERIC                              |
| pricing_tier_label     | pricing_tier_label         | Free / Budget / Mid-Range / Premium        |
| pricing_tier_label     | pricing_model              | Mapped to PricingModel enum                |
| Last verified date     | pricing_last_verified      |                                            |
| Key capabilities       | strengths                  | Comma-split → TEXT[]                       |
| Limitations            | weaknesses                 | Comma-split → TEXT[]                       |
| Best use cases         | best_for, use_cases        | Comma-split → TEXT[]                       |
| Not recommended...     | not_ideal_for              | Comma-split → TEXT[]                       |
| similar_cheaper_model  | similar_cheaper_model      |                                            |
| Tool use support       | tool_use_support           | Yes → true                                 |
| Structured output...   | structured_output_support  | Yes → true                                 |
| JSON mode support      | json_mode_support          | Yes → true                                 |
| Vision support         | vision_support             | Yes → true                                 |
| Audio support          | audio_support              | Yes → true                                 |
| Video support          | video_support              | Yes → true                                 |
| Image generation...    | image_generation_support   | Yes → true                                 |
| Fine-tuning support    | fine_tuning_support        | Yes / Yes (API) → true                     |
| RAG suitability        | rag_suitability            | TEXT (not boolean — varies too much)       |
| Embedding support      | embedding_support          | Yes → true                                 |
| avg_response_latency   | avg_response_latency       | Fast (<500ms) / Medium / Slow              |
| avg_response_latency   | speed                      | Mapped to ModelSpeed enum                  |
| Latency profile        | speed_notes                |                                            |
| Benchmark results      | benchmark_results, quality_notes | Pipe-separated key:value pairs       |
| Enterprise readiness   | enterprise_ready           | Contains "enterprise" → true              |
| Safety features        | safety_features, safety_notes |                                         |
| Known integrations     | known_integrations         | Comma-separated string                     |
| Primary competitors    | primary_competitors        |                                            |
| example_prompt_1/2/3   | example_prompts            | TEXT[]                                     |

## Status Assignment

| Condition                    | Status      |
|-----------------------------|-------------|
| confidence_score >= 0.7     | published   |
| confidence_score < 0.7      | draft       |

- 333 rows → `published`
- 38 rows → `draft` (low-confidence; see `avelix_flags.md` §6)

## AI-Generated Fields

All rows have `ai_generated: true`. Fields generated by the processing script:

- `short_description` — derived from `avelix_overview`
- `avelix_overview` / `long_description` — category-specific template per model type
- `example_prompt_1/2/3` — type-specific prompts (8 branches)
- `avelix_slug` — normalized from provider + model name
- `confidence_score` — formula: source_url (+0.30) + last_verified (+0.20) + description (+0.20) + key_capabilities (+0.15) + pricing_known (+0.15)
- `avelix_tags` — derived from category + modality + capabilities
- `avelix_data_flags` — quality flags, low-confidence marker

## Re-running the Import

To re-process the source xlsx and reimport:

```bash
# Step 1: Reprocess xlsx (regenerates CSV)
python3 scripts/process_models_xlsx.py

# Step 2: Reimport (upsert on slug — safe to re-run)
node scripts/import-models-csv.mjs

# Step 3: Re-sync Algolia
node scripts/sync-algolia.mjs
```

## Data Quality Notes

- See `avelix_flags.md` for the full 359-line data quality report
- 38 models blocked to draft due to confidence < 0.7
- 59 unique providers across 371 models
- Category distribution: Language 146, Multimodal 47, Reasoning 45, Audio 34, Image Generation 30, Video 29, Embeddings 17, Coding 13, Safety 6, Agents 2, On-Device 2
