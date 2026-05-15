import { createClient } from '@supabase/supabase-js'

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

async function seed() {
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, slug, name')
  if (catErr) { console.error('Failed to fetch categories:', catErr.message); process.exit(1) }
  const catMap = Object.fromEntries(cats.map(c => [c.slug, { id: c.id, name: c.name }]))

  const now = '2026-05-15T00:00:00Z'

  const models = [
    // ── 1. GPT-4o ────────────────────────────────────────────────────────────
    {
      title: 'GPT-4o',
      slug: 'gpt-4o',
      short_description: "Generate text, analyze images, and process audio with OpenAI's fastest flagship multimodal model.",
      long_description: `GPT-4o ("o" for omni) is OpenAI's flagship multimodal model, accepting any combination of text, image, and audio inputs and producing text or audio outputs. It matches GPT-4 Turbo on intelligence while running significantly faster and at lower cost, making it the default choice for most production applications.

Native multimodality is the key differentiator: GPT-4o processes vision, text, and audio in the same model without separate pipelines, enabling real-time voice conversations with emotional range, simultaneous image analysis with text response, and consistent cross-modal reasoning.

Context window of 128K tokens handles long documents, full codebases, and extended conversations without truncation. Structured output ensures reliable JSON generation for API integrations.

Function calling lets GPT-4o interact with external tools — it can call APIs, query databases, and take actions based on reasoning, enabling agent workflows.

Performance: leads on most general benchmarks (MMLU, HumanEval, GPQA), with particularly strong instruction following and structured output quality.

API pricing: $2.50 per million input tokens, $10 per million output tokens. Batch API offers 50% discount. Available free via ChatGPT.`,
      provider: 'OpenAI',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id ?? catMap['multimodal-models']?.id,
      tags: ['llm', 'multimodal', 'openai', 'flagship'],
      use_cases: ['writing', 'coding', 'research', 'automation'],
      context_window: 128000,
      input_types: ['text', 'image', 'audio'],
      output_types: ['text', 'audio'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['General text generation and writing', 'Image and vision analysis', 'Real-time voice conversations', 'API integrations requiring structured output', 'Coding assistance'],
      not_ideal_for: ['Complex multi-step math and science reasoning (use o1)', 'Privacy-sensitive local inference', 'High-volume low-cost tasks (use GPT-4o mini)'],
      strengths: ['Best multimodal capabilities across text, vision, and audio', 'Fast inference speed', 'Best price-performance ratio in its class', 'Massive third-party ecosystem', 'Excellent function calling and structured output'],
      weaknesses: ['Knowledge cutoff limits real-time information', 'Can hallucinate on obscure topics', 'Closed source', 'API costs at high volume'],
      speed_notes: 'Very fast — typically under 1s first token on standard requests.',
      quality_notes: 'Best-in-class for most tasks. Leads on MMLU, HumanEval, and general benchmarks.',
      safety_notes: 'Strong RLHF alignment. Reliably refuses harmful content across categories.',
      pricing_model: 'paid',
      pricing_summary: 'Free via ChatGPT. API: $2.50/M input tokens, $10/M output. Batch API: 50% off.',
      pricing_last_verified: now,
      release_date: '2024-05-13',
      current_status: 'active',
      official_source_url: 'https://platform.openai.com/docs/models/gpt-4o',
      related_tool_slugs: ['chatgpt', 'cursor'],
      related_model_slugs: ['gpt-4o-mini', 'o1', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics', 'write-system-prompts'],
      example_prompts: ['Analyze this image and describe the composition and mood', 'Write a Python function that implements binary search with full type hints', 'Summarize this 50-page report into a 1-page executive briefing'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/models/gpt-4o', 'https://openai.com/index/hello-gpt-4o'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 2. GPT-4o mini ───────────────────────────────────────────────────────
    {
      title: 'GPT-4o mini',
      slug: 'gpt-4o-mini',
      short_description: "Run high-volume AI tasks cheaply with OpenAI's fastest, most cost-efficient small model.",
      long_description: `GPT-4o mini is OpenAI's small, fast, cost-efficient model designed for high-volume production workloads. At $0.15 per million input tokens, it's significantly cheaper than GPT-4o while still outperforming GPT-3.5 Turbo on most benchmarks.

The model scores 82% on MMLU (general knowledge) and 87.0% on MGSM (math reasoning) — strong performance for a small model. It handles classification, extraction, simple Q&A, and summarization reliably, which covers the majority of production AI use cases.

128K context window is identical to GPT-4o, making it suitable for long-document processing at low cost. Vision support allows image analysis tasks — product image classification, document OCR, chart interpretation — at high volume without the GPT-4o price.

Speed is the other advantage: sub-500ms first token in most cases. For real-time chatbots, streaming assistants, and customer-facing applications where latency matters, GPT-4o mini is the right choice over heavier models.

The sweet spot: any task where GPT-3.5 was previously used. GPT-4o mini supersedes it on both quality and price.

API pricing: $0.15 per million input tokens, $0.60 per million output tokens. Batch API offers additional 50% discount, making it viable for large-scale batch processing.`,
      provider: 'OpenAI',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'small', 'fast', 'cheap', 'openai'],
      use_cases: ['automation', 'writing', 'coding'],
      context_window: 128000,
      input_types: ['text', 'image'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'very_fast',
      best_for: ['High-volume classification and extraction', 'Real-time chatbots requiring low latency', 'Cost-sensitive applications at scale', 'Simple summarization and Q&A', 'Replacing GPT-3.5 Turbo workloads'],
      not_ideal_for: ['Complex reasoning tasks', 'Long-form creative writing', 'Expert-level code generation'],
      strengths: ['Very cheap — $0.15/M input tokens', 'Very fast inference', '128K context window', 'Good instruction following', 'Vision support included'],
      weaknesses: ['Less capable than GPT-4o on complex tasks', 'Not ideal for nuanced creative work', 'Hallucination rate higher on edge cases'],
      speed_notes: 'Extremely fast — sub-500ms first token typical. Best for latency-critical applications.',
      quality_notes: 'Best small model for price/performance. Supersedes GPT-3.5 Turbo entirely.',
      safety_notes: 'Same alignment training as GPT-4o. Reliable content safety.',
      pricing_model: 'paid',
      pricing_summary: 'API: $0.15/M input tokens, $0.60/M output. Batch API: additional 50% off.',
      pricing_last_verified: now,
      release_date: '2024-07-18',
      current_status: 'active',
      official_source_url: 'https://platform.openai.com/docs/models/gpt-4o-mini',
      related_tool_slugs: ['chatgpt'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-haiku', 'gemini-1-5-flash'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-first-ai-agent'],
      example_prompts: ['Classify this support ticket: billing, technical, feature-request, or other. Respond with one word.', 'Extract the invoice number, date, and total amount from this text as JSON.'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/models/gpt-4o-mini'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 3. o1 ────────────────────────────────────────────────────────────────
    {
      title: 'o1',
      slug: 'o1',
      short_description: "Solve hard math, science, and coding problems with OpenAI's reasoning model that thinks first.",
      long_description: `o1 is OpenAI's first reasoning model, designed for problems where careful step-by-step thinking produces better results than fast generation. Before answering, o1 generates an internal chain of thought — an extended reasoning trace where it works through the problem systematically before producing the final output.

This "think before responding" approach dramatically improves performance on hard problems: o1 scores in the 89th percentile on competitive programming (Codeforces), achieves PhD-level accuracy on physics, chemistry, and biology questions (GPQA), and outperforms GPT-4o on mathematics benchmarks by a significant margin.

200K token context window — larger than GPT-4o — allows o1 to reason over very long inputs, making it suitable for complex codebases, research papers, and multi-document analysis tasks.

The trade-off is speed and cost: o1 typically takes 10–30 seconds per response as it works through reasoning. At $15 per million input tokens and $60 per million output tokens, it's 6× more expensive than GPT-4o. This makes it suitable for high-value tasks where correctness matters more than speed or cost.

Practical guidance: use GPT-4o for 90% of tasks. Switch to o1 when GPT-4o fails on a hard problem — particularly multi-step reasoning, formal proofs, complex debugging, or any task requiring extended logical chains.

Available via ChatGPT Plus and Pro, and through the OpenAI API with tier-based rate limits.`,
      provider: 'OpenAI',
      model_type: 'reasoning',
      category_id: catMap['reasoning-models']?.id,
      tags: ['reasoning', 'math', 'science', 'openai'],
      use_cases: ['research', 'coding'],
      context_window: 200000,
      input_types: ['text', 'image'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'slow',
      best_for: ['Complex mathematical proofs and derivations', 'Hard coding problems and algorithm design', 'Multi-step logical reasoning chains', 'Scientific research analysis'],
      not_ideal_for: ['Simple or routine tasks (wasteful)', 'Real-time applications (too slow)', 'Creative writing', 'High-volume processing (too expensive)'],
      strengths: ['PhD-level reasoning on science benchmarks', 'Best competitive programming performance', '200K context', 'Self-correcting reasoning chains', 'Reliable structured output'],
      weaknesses: ['10–30s latency per response', 'Very expensive ($15/M input)', 'Overkill for most tasks', 'No real-time streaming of reasoning'],
      speed_notes: 'Slow by design — reasoning takes time. 10–30s typical. Not for real-time use.',
      quality_notes: 'Best model for hard reasoning. Use when GPT-4o gives wrong or incomplete answers.',
      safety_notes: 'Strong safety training. Internal reasoning chain is not exposed in the API.',
      pricing_model: 'paid',
      pricing_summary: 'API: $15/M input tokens, $60/M output tokens. Available on ChatGPT Plus and Pro.',
      pricing_last_verified: now,
      release_date: '2024-12-05',
      current_status: 'active',
      official_source_url: 'https://platform.openai.com/docs/models/o1',
      related_tool_slugs: ['cursor', 'chatgpt'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-rag-system'],
      example_prompts: ['Prove that the sum of the first n odd numbers equals n² using mathematical induction.', 'Debug this complex recursive tree traversal algorithm and identify why it fails on balanced trees.'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/models/o1', 'https://openai.com/o1'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 4. Claude 3.5 Sonnet ─────────────────────────────────────────────────
    {
      title: 'Claude 3.5 Sonnet',
      slug: 'claude-3-5-sonnet',
      short_description: "Write code, analyze documents, and reason through complex tasks with Anthropic's best model.",
      long_description: `Claude 3.5 Sonnet is Anthropic's flagship model, consistently leading coding benchmarks and excelling at nuanced, long-context tasks. It's the model behind Cursor AI, GitHub Copilot's Claude integration, and many enterprise writing and coding workflows.

On SWE-bench Verified (a real-world software engineering benchmark), Claude 3.5 Sonnet leads all available models — it understands codebases, writes working code, and fixes bugs with higher accuracy than GPT-4o or Gemini 1.5 Pro. This makes it the preferred model for serious coding tasks.

The 200K token context window is genuinely usable: Claude actually retrieves information from throughout the full context accurately, unlike some models that nominally support long contexts but forget early content. This makes it ideal for large codebase review, long-document analysis, and multi-document synthesis.

Nuanced writing is another strength: Claude produces output with less "AI voice" — more natural, less generic, with better tone control. It handles ambiguity in instructions well and asks clarifying questions when needed rather than assuming.

Tool use (function calling) allows Claude to interact with external systems — search the web, call APIs, run code — enabling agent workflows. The MCP (Model Context Protocol) from Anthropic enables standardized tool integration across applications.

API pricing: $3 per million input tokens, $15 per million output tokens. Prompt caching reduces costs by up to 90% for repeated context. Available free via Claude.ai.`,
      provider: 'Anthropic',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'coding', 'anthropic', 'flagship'],
      use_cases: ['coding', 'writing', 'research', 'automation'],
      context_window: 200000,
      input_types: ['text', 'image'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['Coding, code review, and software engineering', 'Long-document analysis and synthesis', 'Nuanced writing and editing', 'AI agent workflows with tool use', 'Complex instruction following'],
      not_ideal_for: ['Image generation', 'Real-time audio processing', 'Simple quick tasks (use Haiku)'],
      strengths: ['#1 on SWE-bench software engineering benchmark', '200K context that works throughout', 'Best for nuanced writing quality', 'Strong tool use and MCP support', 'Prompt caching for cost efficiency'],
      weaknesses: ['No image generation capability', 'Knowledge cutoff', 'Slightly slower than GPT-4o on short requests', 'More cautious than GPT-4o on edge cases'],
      speed_notes: 'Fast. Comparable to GPT-4o. Latency increases proportionally with context length.',
      quality_notes: 'Best model for coding and long-document work. Strong competitor to GPT-4o on most tasks.',
      safety_notes: 'Constitutional AI training. More cautious on borderline requests than GPT-4o.',
      pricing_model: 'paid',
      pricing_summary: 'API: $3/M input, $15/M output. Prompt caching available. Free via Claude.ai.',
      pricing_last_verified: now,
      release_date: '2024-10-22',
      current_status: 'active',
      official_source_url: 'https://docs.anthropic.com/claude/docs/models-overview',
      related_tool_slugs: ['claude', 'cursor'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-haiku', 'gemini-1-5-pro'],
      related_skill_slugs: ['prompt-engineering-basics', 'mcp-with-claude', 'claude-business-automation'],
      example_prompts: ['Review this 500-line Python file for bugs, security issues, and code style violations.', 'Analyze the key arguments in this 80-page academic paper and identify any logical gaps.'],
      status: 'published',
      source_urls: ['https://docs.anthropic.com/claude/docs/models-overview', 'https://anthropic.com/claude'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 5. Claude 3.5 Haiku ──────────────────────────────────────────────────
    {
      title: 'Claude 3.5 Haiku',
      slug: 'claude-3-5-haiku',
      short_description: "Run fast, intelligent AI workflows at low cost with Anthropic's most efficient model.",
      long_description: `Claude 3.5 Haiku is Anthropic's fastest and most cost-efficient model in the Claude 3.5 family. It represents a significant improvement over Claude 3 Haiku — matching the intelligence of the older Claude 3 Sonnet while running faster and at a fraction of the cost.

The intelligence-to-cost ratio is the key selling point: Claude 3.5 Haiku handles classification, extraction, summarization, customer support routing, and simple Q&A with strong accuracy. On MMLU it scores above 80%, placing it solidly in the capable small-model category alongside GPT-4o mini.

200K token context window, identical to Claude 3.5 Sonnet, makes Haiku suitable for processing long documents at scale — a workload that would be expensive with heavier models.

The primary use case is production pipelines where you need many AI calls per day. A customer support system routing 10,000 tickets per day, a content moderation pipeline, or an email classification system — these benefit from Haiku's speed and cost at scale while still needing reliable AI judgment.

Vision support allows image-based classification and extraction tasks: reading receipts, categorizing product images, or extracting text from scanned documents.

API pricing: $0.80 per million input tokens, $4 per million output tokens. Significantly cheaper than Claude 3.5 Sonnet ($3/$15) for tasks that don't require full Sonnet capability.

Free tier: accessible via Claude.ai with usage limits. API requires Anthropic API access.`,
      provider: 'Anthropic',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'small', 'fast', 'cheap', 'anthropic'],
      use_cases: ['automation', 'writing', 'coding'],
      context_window: 200000,
      input_types: ['text', 'image'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'very_fast',
      best_for: ['High-volume classification and routing', 'Real-time customer support automation', 'Content moderation at scale', 'Cost-sensitive production pipelines', 'Simple summarization with long context'],
      not_ideal_for: ['Complex reasoning tasks', 'Expert-level code generation', 'Nuanced creative writing'],
      strengths: ['Fastest Anthropic model', 'Cheaper than Sonnet for cost-sensitive work', '200K context', 'Strong accuracy for a small model', 'Vision support'],
      weaknesses: ['Less capable than Sonnet on complex tasks', 'Not for hard coding or reasoning problems'],
      speed_notes: 'Fastest Claude model. Sub-500ms first token typical on standard requests.',
      quality_notes: 'Best Anthropic model for cost/performance on production workloads.',
      safety_notes: 'Same Constitutional AI training as Claude 3.5 Sonnet. Reliable content policy.',
      pricing_model: 'paid',
      pricing_summary: 'API: $0.80/M input, $4/M output. Free via Claude.ai with limits.',
      pricing_last_verified: now,
      release_date: '2024-11-05',
      current_status: 'active',
      official_source_url: 'https://docs.anthropic.com/claude/docs/models-overview',
      related_tool_slugs: ['claude'],
      related_model_slugs: ['claude-3-5-sonnet', 'gpt-4o-mini', 'gemini-1-5-flash'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-first-ai-agent'],
      example_prompts: ['Is this review positive, negative, or neutral? Respond with one word.', 'Extract the product name, price, and availability from this page text as JSON.'],
      status: 'published',
      source_urls: ['https://docs.anthropic.com/claude/docs/models-overview'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 6. Gemini 1.5 Pro ────────────────────────────────────────────────────
    {
      title: 'Gemini 1.5 Pro',
      slug: 'gemini-1-5-pro',
      short_description: "Analyze million-token documents, video, and audio with Google's most capable frontier model.",
      long_description: `Gemini 1.5 Pro is Google's frontier model, featuring the largest publicly available context window: 1 million tokens. This is large enough to process an entire codebase, a full book, or hours of video in a single API call — enabling analysis workflows that are simply impossible with other models.

The multimodal input capability covers text, images, audio, and video natively. You can upload a 1-hour meeting recording and ask for a summary, action items, and key decisions — without transcription as a separate step. This integrated approach makes it valuable for multimedia analysis pipelines.

Deep Google integration means Gemini 1.5 Pro is the underlying model in Google Workspace AI (Docs, Gmail, Sheets), Google Search Generative Experience, and NotebookLM. For teams in the Google ecosystem, it enables AI-native workflows within familiar tools.

On standard benchmarks (MMLU, MATH, HumanEval), Gemini 1.5 Pro is competitive with GPT-4o and Claude 3.5 Sonnet, making it a viable alternative rather than a secondary choice.

The free tier via Google AI Studio is generous: 50 requests per day at 1M context, which is sufficient for development and testing.

API pricing: $3.50 per million tokens (under 128K context), $7.00 (over 128K). The 2M token extended context version is available at higher pricing for research use cases.

Best for: teams building on Google infrastructure, video/audio analysis pipelines, and any workload requiring genuinely long context.`,
      provider: 'Google',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id ?? catMap['multimodal-models']?.id,
      tags: ['llm', 'google', 'long-context', 'multimodal'],
      use_cases: ['research', 'writing', 'automation'],
      context_window: 1000000,
      input_types: ['text', 'image', 'audio', 'video'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'medium',
      best_for: ['Processing very long documents (up to 1M tokens)', 'Video and audio analysis without transcription', 'Google Workspace AI tasks', 'Large codebase analysis in a single call'],
      not_ideal_for: ['Simple quick tasks (use Flash)', 'Real-time low-latency applications', 'Privacy-sensitive data outside Google'],
      strengths: ['1M token context — largest available', 'Native video and audio input', 'Deep Google Workspace integration', 'Competitive on standard benchmarks', 'Generous free tier via AI Studio'],
      weaknesses: ['Slower than GPT-4o and Claude 3.5 Sonnet', 'Google data processing concerns', 'Less third-party integrations', 'Higher cost on long contexts'],
      speed_notes: 'Medium speed. 1M token inputs incur noticeable latency.',
      quality_notes: 'Excellent for its unique capabilities. Competitive on standard tasks.',
      safety_notes: 'Google safety training and content policy. Comparable to OpenAI and Anthropic.',
      pricing_model: 'freemium',
      pricing_summary: 'Free: 50 req/day via AI Studio. API: $3.50/M (under 128K), $7/M (over 128K tokens).',
      pricing_last_verified: now,
      release_date: '2024-05-14',
      current_status: 'active',
      official_source_url: 'https://ai.google.dev/gemini-api/docs/models/gemini',
      related_tool_slugs: ['gemini', 'notebooklm'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-flash'],
      related_skill_slugs: ['prompt-engineering-basics', 'perplexity-deep-research'],
      example_prompts: ['Here is a 500-page regulatory document. List every compliance requirement that applies to financial services companies.', 'Watch this 1-hour product demo video and extract all feature announcements.'],
      status: 'published',
      source_urls: ['https://ai.google.dev/gemini-api/docs/models/gemini', 'https://deepmind.google/technologies/gemini'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 7. Gemini 1.5 Flash ──────────────────────────────────────────────────
    {
      title: 'Gemini 1.5 Flash',
      slug: 'gemini-1-5-flash',
      short_description: "Process long documents and multimodal inputs at scale with Google's fast, affordable model.",
      long_description: `Gemini 1.5 Flash is Google's speed-optimized model that retains the breakthrough 1M token context window of Gemini 1.5 Pro while running significantly faster and at far lower cost. It's designed for production workloads where long context or multimodal input matters, but speed and cost efficiency are also critical.

The price-performance ratio is exceptional: at $0.075 per million tokens for inputs under 128K, it's one of the cheapest capable models available. For long-context tasks (over 128K), pricing is $0.15 per million tokens — still very competitive for the capability.

The 1M token context makes it valuable for tasks that require reading many documents at once: processing an entire product catalog, analyzing all customer reviews across a product line, or reading a complete year of email threads for a user.

Multimodal support includes text, images, audio, and video — the same as Gemini 1.5 Pro — making Flash suitable for building multimedia processing pipelines where Pro would be too slow or expensive.

Use cases where Flash excels over Pro: high-volume summarization, real-time chat applications, bulk data extraction, and any workflow running 100+ requests per day where the extra capability of Pro isn't needed.

Free tier via Google AI Studio: 15 requests per minute and 1,500 per day — the most generous free tier of any capable model.

API pricing: $0.075/M tokens (under 128K), $0.15/M (over 128K). Images: $0.02 per 1,000 images.`,
      provider: 'Google',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'google', 'fast', 'long-context', 'efficient'],
      use_cases: ['automation', 'writing', 'research'],
      context_window: 1000000,
      input_types: ['text', 'image', 'audio', 'video'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['High-volume summarization with long context', 'Cost-sensitive production pipelines', 'Image captioning and classification at scale', 'Chat applications needing 1M context'],
      not_ideal_for: ['Complex expert-level reasoning', 'Creative nuanced writing', 'Highest-quality outputs where cost is secondary'],
      strengths: ['1M context at very low cost', 'Fast inference for a long-context model', 'Multimodal (text, image, audio, video)', 'Most generous free tier available', 'Good accuracy for its price point'],
      weaknesses: ['Less capable than Pro on hard tasks', 'Less accurate than GPT-4o and Claude 3.5 on complex reasoning', 'Google ecosystem dependency'],
      speed_notes: 'Fast. Much faster than 1.5 Pro for equivalent context lengths.',
      quality_notes: 'Good trade-off. Use when 1.5 Pro is overkill for your task.',
      safety_notes: 'Same Google safety training as 1.5 Pro.',
      pricing_model: 'freemium',
      pricing_summary: 'Free: 1,500 req/day via AI Studio. API: $0.075/M (under 128K), $0.15/M (over 128K).',
      pricing_last_verified: now,
      release_date: '2024-05-24',
      current_status: 'active',
      official_source_url: 'https://ai.google.dev/gemini-api/docs/models/gemini',
      related_tool_slugs: ['gemini'],
      related_model_slugs: ['gemini-1-5-pro', 'gpt-4o-mini', 'claude-3-5-haiku'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-first-ai-agent'],
      example_prompts: ['Summarize this 100-page product manual into a quick-start guide for non-technical users.', 'Describe the contents and layout of each image in this batch of product photos.'],
      status: 'published',
      source_urls: ['https://ai.google.dev/gemini-api/docs/models/gemini'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 8. Grok 2 ────────────────────────────────────────────────────────────
    {
      title: 'Grok 2',
      slug: 'grok-2',
      short_description: "Access real-time X/Twitter data and uncensored responses with xAI's frontier model.",
      long_description: `Grok 2 is xAI's flagship model, built with a distinctive philosophy: it has access to real-time data from X (formerly Twitter), responds with less restrictive content filtering than competitors, and takes a more direct approach to answering controversial or sensitive questions.

The real-time X data integration is the key unique capability: Grok can access current trending topics, breaking news, public posts, and live conversations on X. This makes it more current than models with knowledge cutoffs, especially for topics that are actively discussed on social media.

On standard benchmarks, Grok 2 is competitive with top-tier models: strong performance on MMLU, HumanEval, and reasoning tasks. It's not a niche model — it genuinely competes with GPT-4o and Claude 3.5 Sonnet on most standard tasks.

Image generation is integrated: Grok includes Aurora image generation, accessible directly in the chat without switching to a separate tool. Quality is comparable to DALL-E 3.

Availability: Grok is free for X Premium subscribers (X Premium+). API access is available through xAI's API for developers.

The more permissive content policy attracts users who find other AI assistants too restrictive — particularly for political commentary, speculative fiction, or dark humor. This is both a feature for some users and a reason others prefer Claude or ChatGPT.

Best for: X/Twitter users who want AI integrated into their social media workflow, journalists covering real-time events, and users who prefer less restricted AI responses.`,
      provider: 'xAI',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'real-time', 'xai'],
      use_cases: ['research', 'writing', 'coding'],
      context_window: 131072,
      input_types: ['text', 'image'],
      output_types: ['text', 'image'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['Real-time X/Twitter data and trending topics', 'Current events research with social media context', 'Users who prefer less restrictive content filters', 'Image generation integrated with chat'],
      not_ideal_for: ['Strict enterprise compliance requirements', 'Long-document analysis (shorter context than competitors)', 'Users without X Premium subscription'],
      strengths: ['Real-time X data access', 'Competitive benchmark performance', 'Integrated image generation (Aurora)', 'Less restrictive content policy', 'Free for X Premium subscribers'],
      weaknesses: ['Requires X Premium for full access', 'Smaller ecosystem than OpenAI/Anthropic', 'Shorter context window than competitors', 'Less enterprise trust due to permissive policy'],
      speed_notes: 'Fast. Comparable to GPT-4o for standard requests.',
      quality_notes: 'Competitive on benchmarks. Unique value in real-time X data.',
      safety_notes: 'More permissive than Claude and GPT-4o. xAI safety team working on alignment.',
      pricing_model: 'freemium',
      pricing_summary: 'Free for X Premium subscribers. xAI API: $5/M input, $15/M output tokens.',
      pricing_last_verified: now,
      release_date: '2024-08-14',
      current_status: 'active',
      official_source_url: 'https://x.ai/grok',
      related_tool_slugs: ['chatgpt', 'perplexity'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics'],
      example_prompts: ['What is trending on X about AI today and what are people saying?', 'Write a thread about the pros and cons of this controversial tech policy decision.'],
      status: 'published',
      source_urls: ['https://x.ai/grok', 'https://x.ai/api'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 9. Llama 3.1 405B ────────────────────────────────────────────────────
    {
      title: 'Llama 3.1 405B',
      slug: 'llama-3-1-405b',
      short_description: "Run Meta's most capable open-source model on your own infrastructure — no API fees ever.",
      long_description: `Llama 3.1 405B is Meta's most powerful open-source language model, released with fully open weights that can be downloaded, run locally, fine-tuned on custom data, and deployed without per-token fees. At 405 billion parameters, it rivals frontier closed-source models on most benchmarks.

The open weights release is the defining characteristic: you own the model. Download it, run it on your GPU cluster, modify it, fine-tune it on proprietary data, and serve it internally — with no ongoing API fees, no data sent to third parties, and no rate limits other than your own hardware.

Benchmark performance: Llama 3.1 405B scores competitively with GPT-4o and Claude 3.5 Sonnet on MMLU (88.6%), HumanEval coding (89.0%), and reasoning tasks. For the first time, an open-source model genuinely competes with frontier closed models at scale.

The 128K context window handles long documents and extended conversations. Multilingual support covers 8 languages: English, German, French, Italian, Portuguese, Hindi, Spanish, and Thai.

Hardware requirements are significant: running 405B requires substantial GPU infrastructure (at least 8× H100 80GB or equivalent). Most teams use hosted providers like Together AI, Groq, Fireworks AI, or Replicate — which offer Llama 3.1 405B via API, often cheaper than OpenAI at scale.

Use cases: privacy-sensitive enterprise deployments, custom fine-tuned models for specific domains, research requiring model modification, and high-volume production where self-hosting economics beat API fees.`,
      provider: 'Meta',
      model_type: 'llm',
      category_id: catMap['open-source-models']?.id ?? catMap['large-language-models']?.id,
      tags: ['llm', 'open-source', 'meta', 'self-host'],
      use_cases: ['coding', 'research', 'automation'],
      context_window: 128000,
      input_types: ['text'],
      output_types: ['text'],
      is_open_source: true,
      has_api: true,
      speed: 'medium',
      best_for: ['Privacy-sensitive enterprise deployments', 'Custom fine-tuning on proprietary data', 'High-volume production where self-hosting saves money', 'Research requiring model weights access'],
      not_ideal_for: ['Teams without GPU infrastructure', 'Simple quick setups', 'Multimodal tasks (text only)'],
      strengths: ['Fully open weights — own the model completely', 'Competitive with GPT-4o on benchmarks', 'No per-token fees when self-hosted', 'Fine-tunable on custom datasets', 'Data stays on your infrastructure'],
      weaknesses: ['Requires significant GPU infrastructure', 'Setup complexity vs cloud APIs', 'No multimodal (text only)', 'Slower than hosted competitors on typical hardware'],
      speed_notes: 'Speed entirely depends on hardware. H100 clusters give competitive performance.',
      quality_notes: 'Best open-source model. Genuinely competes with frontier closed models.',
      safety_notes: 'Meta safety training applied. Users are responsible for deployment safety in their context.',
      pricing_model: 'open-source',
      pricing_summary: 'Free weights. Pay only for compute: self-host on GPUs or use Together AI/Groq/Fireworks APIs.',
      pricing_last_verified: now,
      release_date: '2024-07-23',
      current_status: 'active',
      official_source_url: 'https://llama.meta.com/',
      related_tool_slugs: ['n8n'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'mistral-large', 'deepseek-v3'],
      related_skill_slugs: ['build-rag-system', 'build-first-ai-agent'],
      example_prompts: ['Generate a dataset of 200 customer support conversations for fine-tuning a specialized support model.', 'Write a detailed API specification for a REST endpoint following OpenAPI 3.0 standards.'],
      status: 'published',
      source_urls: ['https://llama.meta.com/', 'https://ai.meta.com/blog/meta-llama-3-1/', 'https://github.com/meta-llama/llama3'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 10. Mistral Large ────────────────────────────────────────────────────
    {
      title: 'Mistral Large',
      slug: 'mistral-large',
      short_description: "Process multilingual tasks with GDPR-compliant EU infrastructure and strong coding support.",
      long_description: `Mistral Large is the flagship model from Mistral AI, the French AI company building a European alternative to US frontier models. It's designed for enterprises requiring GDPR-compliant data processing, multilingual capabilities, and competitive performance across standard tasks.

EU data processing compliance is the primary differentiator: Mistral processes data on EU infrastructure with full GDPR guarantees, making it the go-to choice for European businesses, healthcare organizations, and any use case where data sovereignty matters.

Multilingual excellence covers English, French, Spanish, German, Italian, and Portuguese natively — not just translation but genuine reasoning and generation in these languages. This makes it valuable for international companies building products for European markets.

Benchmark performance is competitive: Mistral Large scores above 80% on MMLU and performs well on coding benchmarks (HumanEval), making it a credible choice even when GDPR isn't the primary concern.

Function calling supports agent workflows, and the model handles structured output reliably — useful for enterprise applications requiring consistent JSON responses.

The Mistral API (La Plateforme) provides access at competitive pricing. Enterprise options include Microsoft Azure and Google Cloud deployments, or self-hosted via Mistral's commercial license for maximum control.

API pricing: approximately $4 per million input tokens, $12 per million output tokens via La Plateforme. Azure/GCP pricing varies.`,
      provider: 'Mistral',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id,
      tags: ['llm', 'eu', 'gdpr', 'multilingual', 'mistral'],
      use_cases: ['writing', 'coding', 'automation', 'business'],
      context_window: 128000,
      input_types: ['text'],
      output_types: ['text'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['GDPR-compliant EU data processing', 'Multilingual content in European languages', 'Enterprise applications requiring EU infrastructure', 'Function calling and structured output'],
      not_ideal_for: ['Vision and image tasks', 'Very long contexts beyond 128K', 'Users outside the EU without compliance requirements'],
      strengths: ['EU-based GDPR compliant infrastructure', 'Excellent multilingual (6 European languages)', 'Competitive benchmarks', 'Strong function calling', 'Available on Azure and GCP'],
      weaknesses: ['No vision support', 'Smaller community than OpenAI/Anthropic', 'Less familiar brand outside Europe', 'Shorter context than Gemini or Claude'],
      speed_notes: 'Fast. Competitive with GPT-4o for standard requests.',
      quality_notes: 'Strong model. Best choice when EU compliance is required.',
      safety_notes: 'Mistral safety training. Somewhat more permissive than Claude but reasonable defaults.',
      pricing_model: 'paid',
      pricing_summary: 'La Plateforme: ~$4/M input, $12/M output. Azure/GCP pricing varies.',
      pricing_last_verified: now,
      release_date: '2024-02-26',
      current_status: 'active',
      official_source_url: 'https://docs.mistral.ai/getting-started/models/',
      related_tool_slugs: [],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'llama-3-1-405b'],
      related_skill_slugs: ['prompt-engineering-basics'],
      example_prompts: ['Translate this legal contract from English to formal French while preserving all legal terms accurately.', 'Write a Python function with proper error handling that calls this REST API endpoint.'],
      status: 'published',
      source_urls: ['https://docs.mistral.ai/getting-started/models/', 'https://mistral.ai'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 11. DeepSeek V3 ──────────────────────────────────────────────────────
    {
      title: 'DeepSeek V3',
      slug: 'deepseek-v3',
      short_description: "Access GPT-4-level coding and reasoning performance at a fraction of the cost.",
      long_description: `DeepSeek V3 is a Mixture-of-Experts (MoE) model from DeepSeek, a Chinese AI lab, that benchmarks competitively with GPT-4o and Claude 3.5 Sonnet while being significantly cheaper to run. Its release in December 2024 attracted global attention for demonstrating that frontier performance could be achieved at dramatically lower training and inference cost.

The MoE architecture activates only 37 billion parameters per forward pass (out of 671 billion total), making inference computationally efficient and cheap. This enables pricing significantly below comparable closed-source models.

Benchmark performance: DeepSeek V3 scores at or above GPT-4o on multiple benchmarks including HumanEval (coding: 90.2%), MATH (mathematical reasoning: 90.2%), and competitive programming (Codeforces: 1,096 Elo). On code generation, it matches or exceeds Claude 3.5 Sonnet for many tasks.

The model is open-weight: the weights are publicly available for download and self-hosting, giving full control similar to Llama 3.1. However, most users access it via DeepSeek's API or third-party providers (Together AI, Fireworks AI).

Context window: 128K tokens. Input types: text only (no vision in V3). Output: text.

API pricing via DeepSeek: $0.14 per million input tokens, $0.28 per million output tokens — approximately 20× cheaper than GPT-4o for the same task quality on coding and reasoning workloads.

Limitations: Chinese lab provenance raises data privacy concerns for some enterprises. No vision capability. Knowledge cutoff applies like all models.`,
      provider: 'DeepSeek',
      model_type: 'llm',
      category_id: catMap['large-language-models']?.id ?? catMap['open-source-models']?.id,
      tags: ['llm', 'open-source', 'coding', 'cheap'],
      use_cases: ['coding', 'research', 'automation'],
      context_window: 128000,
      input_types: ['text'],
      output_types: ['text'],
      is_open_source: true,
      has_api: true,
      speed: 'fast',
      best_for: ['Coding tasks at very low API cost', 'Mathematical reasoning and problem solving', 'Cost-sensitive production pipelines requiring GPT-4 level quality', 'Self-hosted deployment with frontier capability'],
      not_ideal_for: ['Vision and image analysis tasks', 'Data-sensitive enterprise workloads (Chinese lab)', 'Creative writing (stronger on technical tasks)'],
      strengths: ['20× cheaper than GPT-4o on API', 'Frontier-level coding and math performance', 'Open weights for self-hosting', 'Efficient MoE architecture', 'Strong on competitive programming benchmarks'],
      weaknesses: ['No vision capability', 'Chinese lab — data privacy concerns for some enterprises', 'Less ecosystem than OpenAI/Anthropic', 'Knowledge cutoff'],
      speed_notes: 'Fast. MoE architecture enables efficient inference at scale.',
      quality_notes: 'Frontier-level on coding and math. Exceptional price-to-performance ratio.',
      safety_notes: 'DeepSeek safety training. Less established safety track record than Anthropic or OpenAI.',
      pricing_model: 'open-source',
      pricing_summary: 'Open weights (free to self-host). API: $0.14/M input, $0.28/M output via DeepSeek.',
      pricing_last_verified: now,
      release_date: '2024-12-26',
      current_status: 'active',
      official_source_url: 'https://api-docs.deepseek.com',
      related_tool_slugs: ['cursor'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'llama-3-1-405b'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-rag-system'],
      example_prompts: ['Implement a red-black tree with insertion, deletion, and search in TypeScript with full type safety.', 'Solve this competitive programming problem and explain the algorithm step by step.'],
      status: 'published',
      source_urls: ['https://api-docs.deepseek.com', 'https://github.com/deepseek-ai/DeepSeek-V3'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 12. FLUX.1 ───────────────────────────────────────────────────────────
    {
      title: 'FLUX.1',
      slug: 'flux-1',
      short_description: "Generate photorealistic and artistic images with Black Forest Labs' open-weight image model.",
      long_description: `FLUX.1 is a family of text-to-image models from Black Forest Labs, founded by the original researchers behind Stable Diffusion. Released in August 2024, FLUX.1 quickly became the highest-quality open-weight image generation model available, matching and in some evaluations exceeding Midjourney v6 and DALL-E 3.

The FLUX.1 family has three tiers: FLUX.1 [schnell] (fast, open Apache 2.0 license, 4 steps), FLUX.1 [dev] (quality-focused, open weights, non-commercial), and FLUX.1 [pro] (highest quality, API only, commercial). Most discussions of "FLUX" refer to [dev] or [pro].

Image quality is exceptional: FLUX.1 produces detailed, photorealistic images with accurate anatomy (hands, faces), correct text rendering within images, and precise prompt adherence. The model follows detailed compositional instructions better than most competitors.

Open weights for [schnell] and [dev] enable self-hosting on consumer hardware. A modern gaming GPU (RTX 4090) can run FLUX.1 [schnell] at 4 steps for fast generation. This makes it accessible for developers and researchers who want to avoid API costs.

Integration: FLUX.1 is available on Replicate, Together AI, fal.ai, and Comfy UI. It has also been integrated into many AI image platforms as an underlying model option.

Use cases: product photography, artistic image generation, character design, marketing visuals, and any task requiring high-quality image output with open-weight flexibility.

FLUX.1 [pro] pricing via API: approximately $0.055 per image. Self-hosted [schnell] is free.`,
      provider: 'Black Forest Labs',
      model_type: 'image',
      category_id: catMap['image-generation-models']?.id ?? catMap['image-models']?.id,
      tags: ['image-gen', 'open-source'],
      use_cases: ['design', 'marketing', 'writing'],
      context_window: null,
      input_types: ['text', 'image'],
      output_types: ['image'],
      is_open_source: true,
      has_api: true,
      speed: 'medium',
      best_for: ['Photorealistic image generation', 'Accurate anatomy and hand rendering', 'Text within images', 'Self-hosted image generation without API fees', 'Artistic and product photography'],
      not_ideal_for: ['Real-time generation requiring extreme speed', 'Video generation'],
      strengths: ['Open weights (schnell and dev variants)', 'Best anatomy accuracy in class', 'Superior text rendering', 'Excellent prompt adherence', 'Runs on consumer GPUs (schnell)'],
      weaknesses: ['[dev] variant non-commercial license', '[pro] requires paid API', 'Slower than SDXL Turbo for real-time use', 'Larger model size than SD3.5'],
      speed_notes: 'Medium for [dev] (20+ steps). Fast for [schnell] (4 steps). [Pro] via API varies.',
      quality_notes: 'Best open-weight image model. Competes with Midjourney and DALL-E 3.',
      safety_notes: 'No built-in safety filters in open weights — users responsible. API versions have content filtering.',
      pricing_model: 'open-source',
      pricing_summary: '[schnell] free self-hosted (Apache 2.0). [dev] free non-commercial. [pro] API ~$0.055/image.',
      pricing_last_verified: now,
      release_date: '2024-08-01',
      current_status: 'active',
      official_source_url: 'https://blackforestlabs.ai',
      related_tool_slugs: ['midjourney', 'canva-ai'],
      related_model_slugs: ['stable-diffusion-3-5', 'dall-e-3'],
      related_skill_slugs: ['ai-image-midjourney'],
      example_prompts: ['A photorealistic portrait of a woman in her 30s with freckles, natural lighting, shallow depth of field, 85mm lens', 'Product shot of glass perfume bottle on marble surface, luxury photography, white background'],
      status: 'published',
      source_urls: ['https://blackforestlabs.ai', 'https://github.com/black-forest-labs/flux'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 13. Stable Diffusion 3.5 ─────────────────────────────────────────────
    {
      title: 'Stable Diffusion 3.5',
      slug: 'stable-diffusion-3-5',
      short_description: "Self-host Stability AI's open image model with commercial rights on your own hardware.",
      long_description: `Stable Diffusion 3.5 is Stability AI's open-weight image generation model, released in October 2024 with commercial use rights — meaning you can use it in products you sell, on client projects, and in commercial applications without paying per-image API fees.

The model family includes Large (8B parameters, highest quality), Large Turbo (fast, 4-step distillation), and Medium (2B parameters, runs on consumer GPUs). This range makes it accessible across different hardware configurations and use cases.

Commercial license with open weights is the key differentiator versus FLUX.1 [dev]: SD3.5 Medium and Large are both released under a Stability AI Community License that permits commercial use for companies under $1M annual revenue, making it genuinely usable for small businesses and indie developers building products.

The architecture uses Multimodal Diffusion Transformer (MMDiT), which improves instruction following and quality vs previous SD models. Text rendering in images has improved significantly over SD2.x.

Self-hosting requirements: SD3.5 Medium runs on a single RTX 3080 (10GB VRAM). SD3.5 Large requires 16GB+ VRAM. The community provides ComfyUI and Automatic1111 integrations for both models.

Use cases: building custom image generation products, workflow integration without API costs, fine-tuning on custom styles or characters, and local image generation for privacy-sensitive applications.

Compared to FLUX.1: SD3.5 Large quality is slightly below FLUX.1 [dev] on most comparisons, but the commercial license and smaller model size make it practical for different situations.`,
      provider: 'Stability AI',
      model_type: 'image',
      category_id: catMap['image-generation-models']?.id ?? catMap['image-models']?.id,
      tags: ['image-gen', 'open-source', 'self-host'],
      use_cases: ['design', 'marketing'],
      context_window: null,
      input_types: ['text', 'image'],
      output_types: ['image'],
      is_open_source: true,
      has_api: true,
      speed: 'fast',
      best_for: ['Commercial products needing open-weight image generation', 'Self-hosted image generation with commercial rights', 'Fine-tuning on custom styles or brand visuals', 'Privacy-sensitive local image generation'],
      not_ideal_for: ['Highest-quality artistic generation (FLUX.1 wins)', 'Users without GPU access', 'Real-time low-latency generation at scale'],
      strengths: ['Commercial license for companies under $1M revenue', 'Runs on consumer GPUs (Medium: RTX 3080)', 'Multiple model sizes', 'ComfyUI and A1111 integration', 'Active community and fine-tune ecosystem'],
      weaknesses: ['Quality below FLUX.1 on most comparisons', 'Commercial license has revenue limit', 'Smaller company stability concerns vs Meta/Google'],
      speed_notes: 'Large Turbo (4-step) is fast. Large standard is medium speed.',
      quality_notes: 'Good quality. Behind FLUX.1 on most evaluations but practical advantages in licensing.',
      safety_notes: 'No built-in safety filters in open weights. Users responsible for appropriate use.',
      pricing_model: 'open-source',
      pricing_summary: 'Free self-hosted (commercial license for <$1M revenue). Stability AI API also available.',
      pricing_last_verified: now,
      release_date: '2024-10-22',
      current_status: 'active',
      official_source_url: 'https://stability.ai/stable-image',
      related_tool_slugs: ['midjourney', 'canva-ai'],
      related_model_slugs: ['flux-1', 'dall-e-3'],
      related_skill_slugs: ['ai-image-midjourney'],
      example_prompts: ['A fantasy dragon perched on a mountain peak at sunset, detailed scales, epic landscape, fantasy art style', 'Corporate headshot of a man in a blue suit, neutral background, professional lighting'],
      status: 'published',
      source_urls: ['https://stability.ai/stable-image', 'https://huggingface.co/stabilityai/stable-diffusion-3.5-large'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 14. ElevenLabs Turbo v2.5 ────────────────────────────────────────────
    {
      title: 'ElevenLabs Turbo v2.5',
      slug: 'elevenlabs-turbo-v2-5',
      short_description: "Generate natural, low-latency speech in 32 languages for real-time voice applications.",
      long_description: `ElevenLabs Turbo v2.5 is ElevenLabs' optimized text-to-speech model, designed for real-time and latency-sensitive applications. While the standard Multilingual v2 model prioritizes maximum quality, Turbo v2.5 balances quality with speed — making it the right choice for interactive applications.

The model supports 32 languages with natural pronunciation, emotional expression, and voice consistency across long generations. Languages include English, Spanish, French, German, Arabic, Chinese, Japanese, Korean, and more — covering most global use cases.

Latency characteristics: Turbo v2.5 achieves approximately 300-400ms time-to-first-audio, enabling real-time conversational applications. This makes it suitable for building voice agents, customer service bots, interactive educational apps, and real-time voice assistants.

Voice quality is high — indistinguishable from human speech for most users in natural listening conditions. The model handles complex sentence structures, technical terminology, and natural pacing without robotic artifacts.

Voice cloning compatibility: custom voices created with ElevenLabs' Voice Cloning can be used with Turbo v2.5. This enables real-time speech in a specific person's voice — useful for personalized customer service or maintaining voice consistency in interactive content.

API integration is straightforward: send text, specify voice ID and model, receive audio in PCM or MP3 format. Streaming audio output enables progressive playback — the audio starts playing before the full generation is complete.

Pricing: charged per character, same as other ElevenLabs models. Included in all ElevenLabs plans. The Starter plan ($5/month, 30,000 characters) is enough for most small applications.`,
      provider: 'ElevenLabs',
      model_type: 'audio',
      category_id: catMap['audio-models']?.id,
      tags: ['audio', 'voice', 'tts', 'real-time'],
      use_cases: ['audio', 'automation', 'business'],
      context_window: null,
      input_types: ['text'],
      output_types: ['audio'],
      is_open_source: false,
      has_api: true,
      speed: 'fast',
      best_for: ['Real-time voice agents with low latency', 'Conversational AI with voice output', 'Interactive e-learning with spoken content', 'Customer service voice bots', 'Multilingual voice applications in 32 languages'],
      not_ideal_for: ['Maximum quality audiobook production (use Multilingual v2)', 'Offline/local audio generation'],
      strengths: ['~300-400ms time-to-first-audio', '32 language support', 'Works with custom cloned voices', 'Streaming audio output', 'Excellent naturalness for real-time use'],
      weaknesses: ['Slightly lower quality than Multilingual v2 at slow settings', 'API-only (no self-hosting)', 'Requires ElevenLabs subscription for commercial use'],
      speed_notes: 'Fast. 300-400ms time-to-first-audio. Suitable for real-time applications.',
      quality_notes: 'High quality for real-time use. Slightly below Multilingual v2 at max quality.',
      safety_notes: 'ElevenLabs voice consent policy. Voice cloning requires consent verification.',
      pricing_model: 'freemium',
      pricing_summary: 'Included in ElevenLabs plans. Free: 10K chars/mo. Starter $5/mo (30K chars).',
      pricing_last_verified: now,
      release_date: '2024-09-01',
      current_status: 'active',
      official_source_url: 'https://elevenlabs.io/docs/speech-synthesis/models',
      related_tool_slugs: ['elevenlabs', 'heygen'],
      related_model_slugs: ['whisper'],
      related_skill_slugs: ['ai-voice-elevenlabs'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://elevenlabs.io/docs/speech-synthesis/models', 'https://elevenlabs.io'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 15. Whisper ──────────────────────────────────────────────────────────
    {
      title: 'Whisper',
      slug: 'whisper',
      short_description: "Transcribe audio to text in 99 languages with OpenAI's free, open-source speech model.",
      long_description: `Whisper is OpenAI's open-source automatic speech recognition (ASR) model, trained on 680,000 hours of multilingual audio data. It transcribes spoken audio to text with high accuracy across 99 languages, handling accents, background noise, technical jargon, and overlapping speech better than most commercial alternatives.

The open-source release under MIT license means you can download the model weights and run Whisper entirely locally — no API calls, no per-minute fees, no audio data sent to external servers. This makes it the preferred choice for privacy-sensitive transcription use cases.

Five model sizes are available: tiny (39M params), base (74M), small (244M), medium (769M), and large (1550M). Larger models are more accurate but require more compute. Whisper large achieves near-human accuracy on many languages and near-perfect accuracy on clear English speech.

Common use cases: meeting transcription (Otter.ai, Fireflies, and Descript all use Whisper or derivatives), podcast transcription for show notes and SEO, generating subtitles for video content, voice command recognition in applications, and building multilingual customer support tools.

Limitations: Whisper is batch-only, not a streaming model — it processes complete audio files and returns transcripts, with typical latency of 1-5 seconds per minute of audio for the large model on a modern GPU. It does not identify speakers (no diarization), and punctuation can be inconsistent on complex speech.

OpenAI API pricing: $0.006 per minute of audio — cheaper than Google Cloud Speech and Amazon Transcribe for most workloads. Self-hosting is free (compute only).`,
      provider: 'OpenAI',
      model_type: 'audio',
      category_id: catMap['audio-models']?.id,
      tags: ['audio', 'speech-to-text', 'open-source', 'transcription'],
      use_cases: ['audio', 'automation', 'business'],
      context_window: null,
      input_types: ['audio'],
      output_types: ['text'],
      is_open_source: true,
      has_api: true,
      speed: 'fast',
      best_for: ['Accurate transcription of meetings and audio files', 'Multilingual transcription in 99 languages', 'Privacy-sensitive transcription (self-hosted)', 'Generating subtitles for video content', 'Podcast transcription for notes and SEO'],
      not_ideal_for: ['Real-time streaming transcription (batch only)', 'Speaker identification (who said what)', 'Phone call monitoring with diarization'],
      strengths: ['Open source under MIT (free to self-host)', '99 language support', 'Handles noise and accents well', 'Very cheap API ($0.006/min)', 'Active community and many integrations'],
      weaknesses: ['Batch only — no real-time streaming', 'No speaker diarization', 'Inconsistent punctuation on complex speech', 'Large model needs GPU for fast inference'],
      speed_notes: 'Fast for batch transcription. 1-5s per minute of audio (large model on GPU).',
      quality_notes: 'Best open-source ASR. Near-human accuracy on English. Competitive on 99 languages.',
      safety_notes: 'MIT licensed open weights. No content restrictions. Users responsible for appropriate use.',
      pricing_model: 'open-source',
      pricing_summary: 'Free self-hosted (open source). OpenAI API: $0.006/minute of audio.',
      pricing_last_verified: now,
      release_date: '2022-09-21',
      current_status: 'active',
      official_source_url: 'https://platform.openai.com/docs/models/whisper',
      related_tool_slugs: ['elevenlabs'],
      related_model_slugs: ['elevenlabs-turbo-v2-5'],
      related_skill_slugs: ['ai-voice-elevenlabs', 'automate-content-n8n'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/models/whisper', 'https://github.com/openai/whisper'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },
  ]

  console.log('Seeding models...')
  const { error } = await supabase.from('models').upsert(models, { onConflict: 'slug' })
  if (error) { console.error('models error:', error.message, error.details); process.exit(1) }
  console.log(`  ✓ ${models.length} models seeded`)
  console.log('\nDone.')
}

seed()
