# Agent 12 — Initial Data Seeding

## Overview

Seeded the live Supabase database with all MVP launch content. All records are published, confidence_score=1.0, ai_generated=false, and synced to Algolia.

---

## What Was Seeded

| Content Type | Count | Script |
|---|---|---|
| Categories (extra) | 28 | `scripts/seed-categories-extra.mjs` |
| Tools | 20 | `scripts/seed-tools.mjs` |
| Models | 15 | `scripts/seed-models.mjs` |
| Skills | 15 | `scripts/seed-skills.mjs` |
| Glossary Terms | 33 | `scripts/seed-glossary.mjs` |
| Learning Paths | 5 | `scripts/seed-learning-paths.mjs` |

---

## Seeded Tools (20)

| Title | Slug | Category |
|---|---|---|
| ChatGPT | chatgpt | ai-chatbots |
| Claude | claude | ai-chatbots |
| Gemini | gemini | ai-chatbots |
| Perplexity | perplexity | ai-research-tools |
| ElevenLabs | elevenlabs | ai-voice-tools |
| Runway | runway | ai-video-tools |
| Kling | kling | ai-video-tools |
| HeyGen | heygen | ai-avatar-tools |
| Midjourney | midjourney | ai-image-tools |
| DALL-E 3 | dall-e-3 | ai-image-tools |
| n8n | n8n | ai-automation-tools |
| Make | make | ai-automation-tools |
| Zapier | zapier | ai-automation-tools |
| Cursor | cursor | ai-coding-tools |
| Replit | replit | ai-coding-tools |
| Gamma | gamma | ai-presentation-tools |
| NotebookLM | notebooklm | ai-research-tools |
| Canva AI | canva-ai | ai-design-tools |
| Lovable | lovable | ai-agent-builders |
| Bolt | bolt | ai-coding-tools |

---

## Seeded Models (15)

| Title | Slug | Provider | Type |
|---|---|---|---|
| GPT-4o | gpt-4o | OpenAI | multimodal |
| GPT-4o mini | gpt-4o-mini | OpenAI | llm |
| o1 | o1 | OpenAI | reasoning |
| Claude 3.5 Sonnet | claude-3-5-sonnet | Anthropic | llm |
| Claude 3.5 Haiku | claude-3-5-haiku | Anthropic | llm |
| Gemini 1.5 Pro | gemini-1-5-pro | Google | multimodal |
| Gemini 1.5 Flash | gemini-1-5-flash | Google | multimodal |
| Grok 2 | grok-2 | xAI | llm |
| Llama 3.1 405B | llama-3-1-405b | Meta | llm |
| Mistral Large | mistral-large | Mistral AI | llm |
| DeepSeek V3 | deepseek-v3 | DeepSeek | llm |
| FLUX.1 | flux-1 | Black Forest Labs | image |
| Stable Diffusion 3.5 | stable-diffusion-3-5 | Stability AI | image |
| ElevenLabs Turbo v2.5 | elevenlabs-turbo-v2-5 | ElevenLabs | audio |
| Whisper | whisper | OpenAI | audio |

---

## Seeded Skills (15)

| Title | Slug | Difficulty |
|---|---|---|
| Prompt Engineering Basics | prompt-engineering-basics | beginner |
| Build an AI Chatbot (no-code) | build-ai-chatbot-no-code | beginner |
| Automate Content Creation with n8n | automate-content-n8n | intermediate |
| AI Image Generation with Midjourney | ai-image-midjourney | beginner |
| AI Voice Generation with ElevenLabs | ai-voice-elevenlabs | beginner |
| Build Your First AI Agent | build-first-ai-agent | intermediate |
| Use Perplexity for Deep Research | perplexity-deep-research | beginner |
| Build a RAG System | build-rag-system | advanced |
| Write Better System Prompts | write-system-prompts | intermediate |
| Use Claude for Business Automation | claude-business-automation | intermediate |
| AI Video Creation with Runway | ai-video-runway | beginner |
| Build UGC Automation Pipeline | ugc-automation-pipeline | intermediate |
| Use MCP with Claude | mcp-with-claude | intermediate |
| AI Tool Selection Framework | ai-tool-selection | beginner |
| Automate Customer Support with AI | automate-customer-support | intermediate |

---

## Seeded Learning Paths (5)

| Title | Slug | Level | Hours |
|---|---|---|---|
| Start Learning AI from Zero | start-learning-ai-from-zero | beginner | 8 |
| AI for Business Owners | ai-for-business | beginner | 12 |
| AI for Content Creators | ai-for-creators | beginner | 15 |
| AI Automation with n8n | ai-automation-n8n | intermediate | 20 |
| Build Your First AI Agent | build-first-ai-agent | intermediate | 18 |

---

## Glossary Terms (33)

LLM, AI Agent, RAG, MCP, Token, Context Window, Prompt Engineering, System Prompt, Hallucination, Embeddings, Vector Database, Function Calling, Fine-tuning, Temperature, Chain of Thought, Reasoning Model, API, Multimodal AI, Zero-shot, Few-shot, Inference, Grounding, Transformer, RLHF, Quantization, LoRA, Voice Cloning, Text-to-Speech, Diffusion Model, Workflow, Automation, Top-P, Sampling

---

## Algolia Sync

Script: `scripts/sync-algolia.mjs`

Indexes populated:
- `tools` — 20 records, searchable by title, description, category, tags, use_cases
- `models` — 15 records, searchable by title, description, provider, model_type, tags
- `skills` — 15 records, searchable by title, description, tags

Index settings configured: searchableAttributes, attributesForFaceting, customRanking (tools by avelix_rating).

---

## Re-running Seeds

All scripts are idempotent — safe to re-run. They use `upsert` with `onConflict: 'slug'`.

```bash
node scripts/seed-categories-extra.mjs
node scripts/seed-tools.mjs
node scripts/seed-models.mjs
node scripts/seed-skills.mjs
node scripts/seed-glossary.mjs
node scripts/seed-learning-paths.mjs
node scripts/sync-algolia.mjs
```

---

## Data Quality

All seed records meet the Agent 12 quality requirements:
- `status = 'published'`
- `confidence_score = 1.0`
- `ai_generated = false`
- `short_description` max 150 chars, starts with a verb
- `long_description` 200–400 words, practical focus
- `source_urls` includes at least one official source
- `pricing_last_verified = '2026-05-15'`
