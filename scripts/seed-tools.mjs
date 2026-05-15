import { createClient } from '@supabase/supabase-js'

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

async function seed() {
  // Fetch categories to build slug→id map
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, slug, name')
  if (catErr) { console.error('Failed to fetch categories:', catErr.message); process.exit(1) }
  const catMap = Object.fromEntries(cats.map(c => [c.slug, { id: c.id, name: c.name }]))

  const now = '2026-05-15T00:00:00Z'

  const tools = [
    // ── 1. ChatGPT ──────────────────────────────────────────────────────────────
    {
      title: 'ChatGPT',
      slug: 'chatgpt',
      short_description: 'Generate text, code, images, and browse the web with OpenAI\'s flagship AI assistant.',
      long_description: `ChatGPT is OpenAI's flagship AI assistant, built on the GPT-4o model family. It can write emails, essays, and marketing copy; generate and debug code in any language; analyze uploaded documents and images; perform web search; and run Python code in a sandboxed interpreter.

The free tier uses GPT-4o mini with limited daily GPT-4o access. ChatGPT Plus ($20/month) unlocks full GPT-4o, image generation via DALL-E 3, advanced data analysis, and the ability to create and share custom GPTs. Teams and Enterprise plans add workspace management, SSO, and extended context.

Custom GPTs let you build specialized assistants pre-loaded with instructions, knowledge files, and tool integrations — without writing code. The GPT Store hosts thousands of community-built GPTs for specific use cases.

ChatGPT's biggest strength is its breadth. It handles more task types than any other AI assistant: voice conversations on mobile, multi-image analysis, real-time web browsing, data visualization, document summarization, and multi-turn agentic workflows. Its free tier is generous enough for casual daily use.

The main limitation is accuracy on niche or recent topics — the model can hallucinate confidently. For research requiring citations, Perplexity AI is better. For coding, Cursor is faster. For long-document analysis, Claude handles more context reliably.

Best for: teams wanting one AI tool that does everything without switching apps.`,
      website_url: 'https://chat.openai.com',
      category_id: catMap['ai-chatbots']?.id,
      category_name: catMap['ai-chatbots']?.name ?? 'AI Chatbots',
      tags: ['llm', 'writing', 'coding', 'multimodal', 'openai'],
      use_cases: ['writing', 'coding', 'research', 'automation'],
      best_for: ['Writing emails and content', 'Debugging code', 'Analyzing uploaded documents', 'Building custom GPT assistants'],
      not_ideal_for: ['Research requiring citations', 'Photorealistic image generation', 'Long documents over 200K tokens'],
      user_types: ['creator', 'developer', 'business', 'beginner'],
      avelix_rating: 4.8,
      avelix_recommendation: 'Best all-around AI assistant — start here if you\'re new to AI.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with GPT-4o mini. Plus $20/mo for full GPT-4o, DALL-E 3, and advanced tools.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web', 'ios', 'android', 'macos'],
      integrations: ['Zapier', 'Make', 'Slack', 'API'],
      has_arabic_support: true,
      related_tool_slugs: ['claude', 'gemini', 'perplexity'],
      related_model_slugs: ['gpt-4o', 'gpt-4o-mini', 'o1'],
      related_skill_slugs: ['prompt-engineering-basics', 'write-system-prompts'],
      pros: ['Most versatile AI assistant', 'Excellent free tier', 'DALL-E 3 image generation built-in', 'Custom GPT Store', 'Web browsing and code interpreter'],
      cons: ['Can hallucinate on niche topics', 'Knowledge cutoff for non-browsing queries', 'Plus required for best models'],
      main_features: ['GPT-4o chat', 'DALL-E 3 image generation', 'Code interpreter', 'Web browsing', 'File uploads', 'Custom GPTs', 'Voice mode'],
      example_prompts: ['Write a product description for [product] targeting [audience]', 'Debug this code and explain what was wrong: [code]', 'Summarize this PDF into 5 key takeaways'],
      status: 'published',
      source_urls: ['https://openai.com/chatgpt', 'https://platform.openai.com/docs'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 2. Claude ──────────────────────────────────────────────────────────────
    {
      title: 'Claude',
      slug: 'claude',
      short_description: 'Write, analyze, and code with Anthropic\'s safety-focused AI built for nuanced, long-context tasks.',
      long_description: `Claude is Anthropic's flagship AI assistant, built with a strong emphasis on safety, honesty, and nuanced reasoning. Powered by the Claude 3.5 Sonnet model, it excels at tasks where depth and accuracy matter more than speed.

Claude's standout feature is its 200K token context window — large enough to process an entire book, a full codebase, or extensive legal documents in a single session. It genuinely uses this context: you can ask it about details from page 150 of a document and it will answer accurately.

The Projects feature lets you maintain persistent memory and uploaded documents across conversations, making Claude ideal for ongoing work like writing campaigns, codebase review, or research synthesis. Each project preserves your files, preferences, and conversation history.

Claude is used by Cursor AI, GitHub Copilot, and many enterprise coding tools because it leads on SWE-bench coding benchmarks. It handles code review, multi-file refactoring, and complex architecture discussions better than most competitors.

On writing, Claude produces more nuanced, less generic output than ChatGPT — it avoids the "AI voice" that plagues many assistants. It is more careful about making up facts and will tell you when it's uncertain.

Free tier includes Claude 3.5 Haiku (fast, capable). Claude Pro at $20/month gives access to Claude 3.5 Sonnet with 5× more usage. The API is available for developers.

Main limitations: no image generation, no real-time web search on the free tier, and it can be overly cautious on borderline creative requests.`,
      website_url: 'https://claude.ai',
      category_id: catMap['ai-chatbots']?.id,
      category_name: catMap['ai-chatbots']?.name ?? 'AI Chatbots',
      tags: ['llm', 'writing', 'analysis', 'coding', 'anthropic'],
      use_cases: ['writing', 'coding', 'research', 'automation'],
      best_for: ['Long-document analysis and summarization', 'Code review and refactoring', 'Nuanced writing and editing', 'Ongoing projects with persistent context'],
      not_ideal_for: ['Image generation', 'Real-time web search', 'Simple one-off tasks'],
      user_types: ['developer', 'business', 'creator'],
      avelix_rating: 4.8,
      avelix_recommendation: 'Best for serious writing, coding, and long-document work.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free tier with Claude 3.5 Haiku. Pro at $20/mo for Claude 3.5 Sonnet with higher limits.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web', 'ios', 'android'],
      integrations: ['API', 'Slack', 'Cursor', 'GitHub Copilot'],
      has_arabic_support: true,
      related_tool_slugs: ['chatgpt', 'gemini', 'cursor'],
      related_model_slugs: ['claude-3-5-sonnet', 'claude-3-5-haiku'],
      related_skill_slugs: ['prompt-engineering-basics', 'claude-business-automation', 'mcp-with-claude'],
      pros: ['200K context window that actually works', 'Best coding assistant for review/refactoring', 'Nuanced, non-generic writing', 'Projects feature for persistent work', 'Honest about uncertainty'],
      cons: ['No image generation', 'No real-time web browsing (free)', 'Can be cautious on creative edge cases'],
      main_features: ['200K context window', 'Projects with persistent memory', 'Document and file upload', 'Code generation and review', 'Artifacts viewer', 'MCP integration'],
      example_prompts: ['Analyze this 80-page contract and highlight any unusual clauses', 'Review this codebase and suggest architectural improvements', 'Rewrite this blog post to sound less like AI'],
      status: 'published',
      source_urls: ['https://anthropic.com/claude', 'https://docs.anthropic.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 3. Gemini ──────────────────────────────────────────────────────────────
    {
      title: 'Gemini',
      slug: 'gemini',
      short_description: 'Access Google\'s multimodal AI with native Workspace, Search, and Android integration.',
      long_description: `Gemini is Google's AI assistant, powered by the Gemini 1.5 Pro and Flash model family. Its defining advantage is deep integration with the Google ecosystem — it works natively inside Gmail, Docs, Sheets, Slides, Drive, and Google Search, making it uniquely powerful for users already in Google Workspace.

The free tier gives access to Gemini 1.5 Flash with a 1-million-token context window — the largest of any free-tier assistant. Google One AI Premium ($19.99/month) unlocks Gemini 1.5 Pro with access inside all Workspace apps. Gemini Advanced includes Deep Research, which synthesizes multiple web sources into a structured report.

Gemini natively processes text, images, audio, and video — you can upload a 1-hour video and ask questions about it. This multimodal capability is more deeply integrated than competitors: it can analyze your Google Photos, read your Gmail for context, and reference your Drive files in a conversation.

Gemini for Workspace lets it draft emails, summarize meeting notes, create presentations from documents, and analyze spreadsheet data using natural language — all without leaving the app you're in.

For coding, Gemini powers Google AI Studio and Vertex AI, giving developers API access with very generous free-tier quotas. It also integrates with Android natively, enabling on-device AI features.

The main limitations are that it trails Claude and GPT-4o on complex multi-step reasoning and creative writing, and some users have privacy concerns about data processing through Google's infrastructure.`,
      website_url: 'https://gemini.google.com',
      category_id: catMap['ai-chatbots']?.id,
      category_name: catMap['ai-chatbots']?.name ?? 'AI Chatbots',
      tags: ['llm', 'multimodal', 'google', 'workspace'],
      use_cases: ['writing', 'research', 'automation', 'coding'],
      best_for: ['Google Workspace users needing AI in Docs/Gmail/Sheets', 'Multimodal tasks with video and audio', 'Long-context research with 1M token window', 'Android users wanting on-device AI'],
      not_ideal_for: ['Complex reasoning problems', 'Privacy-sensitive tasks outside Google', 'Nuanced creative writing'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.4,
      avelix_recommendation: 'Best AI for teams already in Google Workspace.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with Gemini 1.5 Flash. Advanced (Gemini 1.5 Pro) at $19.99/mo via Google One.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web', 'ios', 'android'],
      integrations: ['Google Docs', 'Gmail', 'Google Sheets', 'Google Drive', 'Google Search', 'YouTube'],
      has_arabic_support: true,
      related_tool_slugs: ['chatgpt', 'claude', 'notebooklm'],
      related_model_slugs: ['gemini-1-5-pro', 'gemini-1-5-flash'],
      related_skill_slugs: ['prompt-engineering-basics'],
      pros: ['Google Workspace integration is unmatched', '1M token context on free tier', 'Native video and audio input', 'Deep Research for synthesis tasks', 'Strong API with generous free quota'],
      cons: ['Behind GPT-4o and Claude on complex reasoning', 'Google data privacy concerns', 'Less consistent than Claude on nuanced tasks'],
      main_features: ['Gemini 1.5 Pro/Flash chat', 'Google Workspace integration', 'Deep Research', '1M token context', 'Video and audio input', 'Google AI Studio API'],
      example_prompts: ['Summarize all emails from last week and list action items', 'Create a presentation from this Google Doc', 'Watch this YouTube video and extract the key points'],
      status: 'published',
      source_urls: ['https://gemini.google.com', 'https://ai.google.dev'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 4. Perplexity ──────────────────────────────────────────────────────────
    {
      title: 'Perplexity',
      slug: 'perplexity',
      short_description: 'Research any topic with real-time, cited answers powered by AI search.',
      long_description: `Perplexity AI is a conversational search engine that combines large language models with live web search. Every answer includes numbered citations linking to the original sources — so you can verify every claim and go deeper instantly.

Unlike ChatGPT or Claude (which have knowledge cutoffs), Perplexity searches the web in real time before answering. This makes it ideal for current events, recent product launches, market research, and any topic where fresh data matters.

The free tier includes unlimited searches using its Perplexity model (powered by various LLMs), with limited Pro Searches per day. Pro Searches use more powerful models (GPT-4o, Claude 3.5 Sonnet, or Gemini) and perform deeper, multi-step searches. Perplexity Pro at $20/month removes limits and adds file upload, image generation, and higher usage caps.

Spaces let you create dedicated research environments with uploaded documents and custom instructions — like a private research assistant pre-loaded with context about your project.

Perplexity's Deep Research feature (Pro) does extended multi-source research, synthesizing 20-30+ web sources into a structured report. It's the closest thing to having a research assistant who reads the whole internet and writes you a briefing.

The main limitation is that it's not built for creative tasks, code generation, or complex analysis — it's a research and information tool. For writing and coding, ChatGPT or Claude is better. For research, Perplexity is best.`,
      website_url: 'https://perplexity.ai',
      category_id: catMap['ai-research']?.id,
      category_name: catMap['ai-research']?.name ?? 'AI Research',
      tags: ['research', 'search', 'citations', 'real-time'],
      use_cases: ['research', 'writing', 'business'],
      best_for: ['Researching any topic with cited sources', 'Tracking recent news and product launches', 'Deep research reports with multi-source synthesis', 'Fact-checking with verifiable references'],
      not_ideal_for: ['Creative writing', 'Code generation', 'Document editing'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.6,
      avelix_recommendation: 'Best AI search tool — replaces Google for serious research.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with daily Pro Search limits. Pro at $20/mo for unlimited access and Deep Research.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web', 'ios', 'android'],
      integrations: ['API', 'Zapier'],
      has_arabic_support: false,
      related_tool_slugs: ['chatgpt', 'claude', 'notebooklm'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['perplexity-deep-research', 'prompt-engineering-basics'],
      pros: ['Real-time web search', 'Every answer is cited', 'Free tier is generous', 'Deep Research for synthesis', 'Multiple AI models available'],
      cons: ['Not for creative writing or coding', 'Can over-rely on lower-quality sources', 'Mobile app less polished'],
      main_features: ['Real-time cited search', 'Pro Search with advanced models', 'Deep Research', 'Spaces (document collections)', 'Image generation', 'API access'],
      example_prompts: ['What are the top AI video tools launched in 2025?', 'Compare the pricing of Claude, ChatGPT, and Gemini APIs', 'Research the current state of autonomous AI agents'],
      status: 'published',
      source_urls: ['https://perplexity.ai', 'https://docs.perplexity.ai'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 5. ElevenLabs ──────────────────────────────────────────────────────────
    {
      title: 'ElevenLabs',
      slug: 'elevenlabs',
      short_description: 'Clone voices and generate realistic AI speech in 29 languages for any content.',
      long_description: `ElevenLabs is the leading AI voice synthesis platform, offering text-to-speech, voice cloning, and real-time voice conversion with human-like quality. It's used by podcasters, YouTubers, audiobook publishers, e-learning creators, and enterprises for scalable audio production.

The core text-to-speech product lets you type any text and generate audio in one of hundreds of voices — including community voices and your own cloned voice. The quality is the most realistic of any TTS platform: natural pacing, emotional range, and language-specific pronunciation.

Voice cloning requires a short audio sample (as little as 60 seconds). Instant Voice Cloning creates a voice from a clip immediately. Professional Voice Cloning (Pro tier) uses a full 30-minute training session for studio-quality output with full emotional control.

ElevenLabs supports 29 languages, making it valuable for global content: dubbing videos, creating multilingual e-learning courses, or reaching Arabic/Spanish/French audiences with natural-sounding audio.

The Dubbing Studio automatically translates and re-voices video in any language while preserving the speaker's voice characteristics — a task that previously required expensive human voice actors.

The free tier provides 10,000 characters per month (~10 minutes of audio). Starter ($5/month) gives 30,000 characters. Creator ($22/month) adds professional voice cloning and commercial usage rights.

API integration is well-documented, making it straightforward to embed TTS in applications. It integrates with n8n, Make, and Zapier for automation workflows.`,
      website_url: 'https://elevenlabs.io',
      category_id: catMap['ai-audio-voice']?.id ?? catMap['ai-voice-tools']?.id,
      category_name: 'AI Voice Tools',
      tags: ['voice', 'audio', 'tts', 'voice-cloning'],
      use_cases: ['audio', 'writing', 'business'],
      best_for: ['Podcast and audiobook production', 'Dubbing video into other languages', 'Voiceover for YouTube and marketing videos', 'Adding voice to e-learning courses'],
      not_ideal_for: ['Real-time phone call voice conversion', 'Speaker diarization'],
      user_types: ['creator', 'business'],
      avelix_rating: 4.8,
      avelix_recommendation: 'Best AI voice tool — nothing else comes close for realism.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 10K chars/mo. Starter $5/mo. Creator $22/mo. API available on all plans.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['API', 'Zapier', 'Make', 'n8n'],
      has_arabic_support: true,
      related_tool_slugs: ['heygen', 'runway'],
      related_model_slugs: ['elevenlabs-turbo-v2-5', 'whisper'],
      related_skill_slugs: ['ai-voice-elevenlabs', 'ugc-automation-pipeline'],
      pros: ['Most realistic TTS quality available', 'Voice cloning from short samples', '29 languages with natural pronunciation', 'Strong API for developers', 'Dubbing Studio for video translation'],
      cons: ['Free tier limited to 10K chars/month', 'Voice cloning requires consent verification', 'Professional cloning requires Pro tier'],
      main_features: ['Text-to-speech in 29 languages', 'Instant and professional voice cloning', 'Dubbing Studio', 'Voice design', 'Projects for long-form audio', 'API and webhooks'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://elevenlabs.io', 'https://elevenlabs.io/docs'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 6. Runway ──────────────────────────────────────────────────────────────
    {
      title: 'Runway',
      slug: 'runway',
      short_description: 'Generate and edit AI video from text, images, or footage with professional-quality results.',
      long_description: `Runway is the leading AI video generation and editing platform, used by filmmakers, marketers, and content creators. Its Gen-3 Alpha model produces high-quality, coherent video from text prompts, images, or existing video clips.

Text-to-video lets you describe a scene and receive a 5 or 10-second video clip with consistent motion. Image-to-video takes a still image and animates it realistically. Video-to-video applies style transformations or motion effects to existing footage.

Runway's professional editing suite includes AI-powered tools: background removal without a green screen, motion brush for selective animation, camera controls for simulated camera movement, and Inpainting to remove or replace objects in video.

Act-One lets you record yourself and transfer your facial expressions and body movement onto an AI character — enabling digital avatar creation without expensive motion capture equipment.

The platform is designed for creative professionals: the interface is clean, the export quality is high (up to 4K), and it integrates into professional workflows via direct export to Premiere and Final Cut. It's not a quick-and-dirty AI toy; it's a production tool.

The free tier offers 125 one-time credits. Standard ($12/month) includes 625 credits/month. Pro ($28/month) gives 2,250 credits and 4K export. Credits are consumed per second of generated video.

Best for teams and individuals working on commercial video production who want to speed up parts of the workflow with AI rather than replace the entire process.`,
      website_url: 'https://runwayml.com',
      category_id: catMap['ai-video']?.id ?? catMap['ai-video-tools']?.id,
      category_name: 'AI Video',
      tags: ['video', 'image-gen', 'creative', 'generation'],
      use_cases: ['video', 'design', 'marketing'],
      best_for: ['Generating b-roll and scene clips from text', 'Animating still images', 'Removing video backgrounds', 'AI-assisted video editing for professionals'],
      not_ideal_for: ['Long-form video generation (over 10 seconds per clip)', 'Realistic human talking heads (use HeyGen)', 'Budget-conscious creators (credits add up)'],
      user_types: ['creator', 'business'],
      avelix_rating: 4.5,
      avelix_recommendation: 'Best AI video tool for professional creative production.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 125 credits (one-time). Standard $12/mo, Pro $28/mo. Credits consumed per video second.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['API', 'Adobe Premiere', 'Final Cut Pro'],
      has_arabic_support: false,
      related_tool_slugs: ['heygen', 'kling', 'elevenlabs'],
      related_model_slugs: [],
      related_skill_slugs: ['ai-video-runway', 'ugc-automation-pipeline'],
      pros: ['Industry-leading Gen-3 video model', 'Professional editing suite', '4K export on Pro', 'Act-One for avatar creation', 'Strong API for integration'],
      cons: ['Credit model gets expensive for heavy use', 'Clips limited to 10 seconds', 'Realistic human generation still imperfect'],
      main_features: ['Gen-3 Alpha text-to-video', 'Image-to-video animation', 'Video-to-video transformation', 'Background removal', 'Motion brush', 'Act-One facial transfer', 'Camera controls'],
      example_prompts: ['A drone flying over a futuristic city at sunset, cinematic lighting', 'A woman walking through a rain-soaked street in Tokyo at night'],
      status: 'published',
      source_urls: ['https://runwayml.com', 'https://docs.runwayml.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 7. Kling ──────────────────────────────────────────────────────────────
    {
      title: 'Kling',
      slug: 'kling',
      short_description: 'Generate high-quality AI video up to 2 minutes with realistic motion and physics.',
      long_description: `Kling is an AI video generation tool developed by Kuaishou (China's second-largest short video platform). It produces one of the highest-quality AI videos available, with support for clips up to 2 minutes long — significantly longer than most competitors like Runway or Sora.

Kling 1.6 (the current model) generates video with realistic motion, accurate physics, and consistent characters across frames. It handles fluid simulation, character movement, and scene transitions better than earlier models. Text-to-video takes a written description and generates the clip. Image-to-video takes a still photo and animates it in a specified direction.

The camera controls feature lets you specify camera movement: pan, zoom, orbit, dolly — giving cinematic control over AI-generated scenes. This makes it useful for creating professional-looking footage for marketing videos, film previs, or social content.

Character persistence is a notable strength: Kling maintains consistent character appearance across multiple clips from the same prompt, making it possible to create multi-shot scenes with the same character.

Motion brush lets you select parts of an image and specify how they should move — animating specific elements while keeping others static, like making flowing water move or hair blow in the wind.

Pricing is credit-based: free credits are provided, and additional packs start at around $8 for 66 credits. Professional plans offer better credit rates and higher quality generations. The platform is accessible globally at klingai.com.`,
      website_url: 'https://klingai.com',
      category_id: catMap['ai-video']?.id ?? catMap['ai-video-tools']?.id,
      category_name: 'AI Video',
      tags: ['video', 'generation', 'ai-video'],
      use_cases: ['video', 'marketing', 'design'],
      best_for: ['Long-form AI video up to 2 minutes', 'Realistic human and object motion', 'Multi-shot scenes with consistent characters', 'Animating product images for marketing'],
      not_ideal_for: ['Professional-grade 4K export', 'Text overlay in video', 'Talking head videos (use HeyGen)'],
      user_types: ['creator', 'business'],
      avelix_rating: 4.3,
      avelix_recommendation: 'Best for AI video generation — especially longer clips.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free daily credits. Pro from ~$8 for 66 credits. Professional plans available.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: [],
      has_arabic_support: false,
      related_tool_slugs: ['runway', 'heygen'],
      related_model_slugs: [],
      related_skill_slugs: ['ai-video-runway'],
      pros: ['Up to 2-minute video clips', 'Realistic physics and motion', 'Camera control options', 'Character persistence across clips', 'Competitive quality vs Runway Gen-3'],
      cons: ['No API (web only)', 'Chinese platform — data policies differ', 'Credit model for heavy use', 'Not ideal for talking heads'],
      main_features: ['Text-to-video up to 2 min', 'Image-to-video animation', 'Camera controls (pan/zoom/orbit)', 'Motion brush', 'Character consistency', 'Lip sync (beta)'],
      example_prompts: ['A golden retriever running through a field of sunflowers, slow motion, cinematic', 'A cup of coffee being poured in extreme close-up, steam rising, warm lighting'],
      status: 'published',
      source_urls: ['https://klingai.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 8. HeyGen ──────────────────────────────────────────────────────────────
    {
      title: 'HeyGen',
      slug: 'heygen',
      short_description: 'Create AI avatar videos with realistic talking heads for training, marketing, and content.',
      long_description: `HeyGen is the leading AI avatar video platform, enabling anyone to create professional-looking talking head videos without a camera, studio, or video editing skills. You type a script, select an avatar, and receive a polished video in minutes.

The platform offers 300+ pre-built avatars in diverse languages, styles, and demographics. You can also create a custom avatar of yourself by recording a short video — your digital twin can then deliver any script with your face and voice, even after you've stopped recording.

Video translation is one of HeyGen's most powerful features. Upload any video and translate it into 40+ languages while maintaining the speaker's original face movements and voice characteristics. The lip sync adjusts to match the new language naturally — useful for global content distribution without expensive dubbing.

For business use cases: upload your product, type a script, and generate a spokesperson video. Change the script tomorrow and get a new video in 10 minutes. No studio. No scheduling. No re-recording.

The Interactive Avatar feature (enterprise) enables real-time AI avatars for customer service — an avatar that responds live to user questions, useful for kiosks, websites, or virtual agents.

Pricing: Free tier gives 1 credit/month (about 1 minute of video). Creator ($29/month) gives 15 credits. Team ($89/month) adds collaboration and custom avatars. Enterprise starts at $499/month.

Best for: HR and L&D teams, marketing departments creating localized content, and content creators who want talking-head videos without being on camera.`,
      website_url: 'https://heygen.com',
      category_id: catMap['ai-avatar-tools']?.id,
      category_name: catMap['ai-avatar-tools']?.name ?? 'AI Avatar Tools',
      tags: ['avatar', 'video', 'voice', 'marketing'],
      use_cases: ['video', 'marketing', 'business'],
      best_for: ['Talking head videos without a camera', 'Translating videos into 40+ languages', 'Employee training and onboarding content', 'Marketing spokesperson videos at scale'],
      not_ideal_for: ['Artistic or cinematic video generation', 'Creative non-talking-head video', 'Budget-conscious creators (expensive)'],
      user_types: ['creator', 'business'],
      avelix_rating: 4.5,
      avelix_recommendation: 'Best AI avatar video tool for business content creation.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 1 credit/mo. Creator $29/mo. Team $89/mo. Enterprise from $499/mo.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['API', 'Zapier'],
      has_arabic_support: true,
      related_tool_slugs: ['elevenlabs', 'runway', 'kling'],
      related_model_slugs: [],
      related_skill_slugs: ['ai-voice-elevenlabs', 'ugc-automation-pipeline'],
      pros: ['Realistic talking head avatars', '40+ language translation with lip sync', 'Custom avatar from short video', 'Fast production — script to video in minutes', 'Interactive Avatar for live use'],
      cons: ['Expensive for high volume', 'Free tier very limited', 'Not for cinematic/artistic video', 'Uncanny valley on some avatar movements'],
      main_features: ['300+ AI avatars', 'Custom avatar creation', 'Video translation into 40+ languages', 'Lip sync', 'Interactive Avatar (live)', 'API access'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://heygen.com', 'https://docs.heygen.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 9. Midjourney ──────────────────────────────────────────────────────────
    {
      title: 'Midjourney',
      slug: 'midjourney',
      short_description: 'Generate stunning, artistic AI images from text prompts using the industry-leading image model.',
      long_description: `Midjourney is the most artistically capable AI image generator available. Its distinctive aesthetic quality — rich detail, painterly texture, and coherent composition — has made it the tool of choice for designers, marketers, concept artists, and anyone who needs beautiful visuals.

Version 6 (the current default) significantly improved prompt adherence, meaning you get closer to what you ask for. It also improved text rendering in images, which had previously been a weak point for all AI image generators.

Images are generated via text prompts with optional parameters: aspect ratio (--ar), style intensity (--stylize), and negative prompts (--no). The web editor (midjourney.com) allows inpainting, outpainting, and variation generation without needing Discord.

Style references let you upload an existing image and tell Midjourney to match its aesthetic — useful for maintaining visual consistency across a project or brand.

Character references maintain a consistent person across multiple images, solving the notorious AI face-consistency problem. This makes it possible to create image sequences with the same character in different scenes.

The biggest limitation: Midjourney has no free tier. Basic starts at $10/month (200 images/month). Standard ($30/month) gives 900 images. Relax mode on Standard allows unlimited low-priority generations.

For photorealistic product photography, DALL-E 3 is more controllable. For open-source self-hosted use, FLUX.1 is better. For pure artistic quality, Midjourney remains the leader.`,
      website_url: 'https://midjourney.com',
      category_id: catMap['ai-image-generation']?.id ?? catMap['ai-image-tools']?.id,
      category_name: 'AI Image Generation',
      tags: ['image-gen', 'design', 'creative', 'art'],
      use_cases: ['design', 'marketing', 'writing'],
      best_for: ['High-quality artistic image generation', 'Marketing visuals and social media content', 'Concept art and design exploration', 'Consistent character creation across scenes'],
      not_ideal_for: ['Exact text rendering in images', 'Photorealistic product photography', 'Free image generation'],
      user_types: ['creator', 'business'],
      avelix_rating: 4.7,
      avelix_recommendation: 'Best AI image generator — unmatched artistic quality.',
      pricing_model: 'paid',
      has_free_plan: false,
      pricing_summary: 'Basic $10/mo (200 images). Standard $30/mo (900 images + unlimited Relax). Pro $60/mo.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Discord'],
      has_arabic_support: false,
      related_tool_slugs: ['dall-e-3', 'canva-ai'],
      related_model_slugs: ['flux-1', 'stable-diffusion-3-5'],
      related_skill_slugs: ['ai-image-midjourney', 'prompt-engineering-basics'],
      pros: ['Highest artistic image quality', 'Character and style references', 'Active community for learning', 'Regular model updates', 'Web editor with inpainting/outpainting'],
      cons: ['No free tier', 'Less precise than DALL-E on exact prompts', 'No API (web and Discord only)', 'Pricing based on credits/images'],
      main_features: ['Text-to-image with v6 model', 'Style references', 'Character references', 'Inpainting and outpainting', 'Image variations', 'Aspect ratio control', 'Web editor'],
      example_prompts: ['A futuristic Tokyo street at night, neon signs, rain reflections, cinematic --ar 16:9 --v 6', 'Product poster for a luxury watch, minimalist, white background, studio lighting --ar 1:1'],
      status: 'published',
      source_urls: ['https://midjourney.com', 'https://docs.midjourney.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 10. DALL-E 3 ──────────────────────────────────────────────────────────
    {
      title: 'DALL-E 3',
      slug: 'dall-e-3',
      short_description: 'Generate detailed, prompt-accurate images via ChatGPT or OpenAI API without artistic experience.',
      long_description: `DALL-E 3 is OpenAI's text-to-image model, integrated directly into ChatGPT and available via the OpenAI API. Its defining strength is prompt adherence — it generates images that closely match detailed textual descriptions, outperforming Midjourney when you need precise control over composition and content.

Unlike Midjourney (which develops its own interpretation of your prompt), DALL-E 3 follows your description closely. This makes it ideal for non-designers who need specific visuals: "a blue coffee mug on a wooden desk with morning light coming from the left window" will render those exact elements.

Text rendering inside images is a particular strength: DALL-E 3 can generate readable signs, labels, and short text within the image — something Midjourney and Stable Diffusion still struggle with.

Access is straightforward: ChatGPT Plus users get DALL-E 3 built into the chat interface. You can describe what you want conversationally and refine through dialogue. The API provides programmatic access at $0.04–$0.08 per image.

OpenAI's content policy applies: it refuses explicit content, realistic depictions of real named people, and copyright-infringing styles. This makes it safer for business use but limits artistic freedom.

Quality comparison: Midjourney produces more artistically beautiful images with better texture and atmosphere. DALL-E 3 produces more accurate images that match what you described. Choose based on whether you need beauty or precision.

DALL-E 3 is included in ChatGPT Plus ($20/month). API pricing is per image. No standalone subscription is needed if you already use ChatGPT.`,
      website_url: 'https://openai.com/dall-e-3',
      category_id: catMap['ai-image-generation']?.id ?? catMap['ai-image-tools']?.id,
      category_name: 'AI Image Generation',
      tags: ['image-gen', 'openai', 'dall-e'],
      use_cases: ['design', 'marketing', 'writing'],
      best_for: ['Generating images that match precise descriptions', 'Text rendering inside images', 'Product mockups and marketing visuals', 'Non-designers needing specific visuals'],
      not_ideal_for: ['Artistic and aesthetic-driven projects', 'Photorealistic human photography', 'Open-source self-hosted use'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.3,
      avelix_recommendation: 'Best for precise image generation when you need exactly what you described.',
      pricing_model: 'freemium',
      has_free_plan: false,
      pricing_summary: 'Included in ChatGPT Plus ($20/mo). API: $0.04–$0.08 per 1024×1024 image.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['ChatGPT', 'API', 'Zapier'],
      has_arabic_support: false,
      related_tool_slugs: ['chatgpt', 'midjourney', 'canva-ai'],
      related_model_slugs: ['gpt-4o'],
      related_skill_slugs: ['ai-image-midjourney'],
      pros: ['Best prompt adherence of any image model', 'Text in images works reliably', 'Built into ChatGPT (no separate tool)', 'API for developers', 'Safe for business use'],
      cons: ['Less artistic than Midjourney', 'No style references', 'Strict content policy limits creative freedom', 'API costs add up at volume'],
      main_features: ['Text-to-image with DALL-E 3', 'Natural language image refinement in ChatGPT', 'Text rendering in images', 'Inpainting via API', 'Multiple aspect ratios'],
      example_prompts: ['A product photo of red running shoes on a white background, studio lighting, no shadows', 'A birthday card illustration with balloons that say "Happy 30th", watercolor style'],
      status: 'published',
      source_urls: ['https://openai.com/dall-e-3', 'https://platform.openai.com/docs/guides/images'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 11. n8n ──────────────────────────────────────────────────────────────
    {
      title: 'n8n',
      slug: 'n8n',
      short_description: 'Build AI-powered automations and workflows connecting 400+ apps with a visual editor.',
      long_description: `n8n is an open-source workflow automation platform that gives developers and technical teams full control over their automation infrastructure. It connects 400+ apps through a visual node-based editor, with the ability to write custom JavaScript or Python when needed.

Unlike Zapier (simple, cloud-only, expensive at scale) or Make (visual but limited code), n8n is designed for developers who want automation power without per-task pricing. Self-hosting is free forever — you pay only for the server, not per workflow execution.

AI workflows are a first-class feature in n8n. Built-in AI nodes connect directly to OpenAI, Anthropic, Gemini, and other LLM providers. You can build multi-agent workflows where different AI models handle different tasks, pass data between them, and route based on model output.

The n8n AI Agent node implements ReAct (Reasoning + Acting) natively: connect it to tools (HTTP requests, databases, APIs), give it a goal, and it autonomously figures out how to complete the task using those tools.

Webhook triggers allow external systems to fire workflows. You can build a system where a new Supabase database row triggers an AI enrichment workflow that sends a Slack notification, updates a Google Sheet, and drafts an email — all automatically.

The self-hosted version is completely free and runs on a VPS or Docker container. n8n Cloud starts at $20/month for 2,500 workflow executions. The key advantage over Zapier: at 10,000+ tasks per month, n8n self-hosted is dramatically cheaper.

Best for teams with technical resources who need scalable, customizable automation with AI integration.`,
      website_url: 'https://n8n.io',
      category_id: catMap['ai-automation']?.id ?? catMap['ai-automation-tools']?.id,
      category_name: 'AI Automation',
      tags: ['automation', 'no-code', 'open-source', 'api'],
      use_cases: ['automation', 'ai-agents', 'business', 'coding'],
      best_for: ['Complex multi-step AI workflows', 'Self-hosted automation at scale', 'Multi-agent AI pipelines', 'Connecting 400+ apps with code-optional flexibility'],
      not_ideal_for: ['Non-technical teams who want plug-and-play simplicity', 'Simple one-step automations'],
      user_types: ['developer', 'business'],
      avelix_rating: 4.7,
      avelix_recommendation: 'Best automation platform for technical teams building AI workflows.',
      pricing_model: 'open-source',
      has_free_plan: true,
      pricing_summary: 'Self-hosted: free forever. n8n Cloud from $20/mo for 2,500 executions.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web', 'desktop'],
      integrations: ['OpenAI', 'Anthropic', 'Supabase', 'Slack', 'Gmail', 'Google Sheets', '400+ more'],
      has_arabic_support: false,
      related_tool_slugs: ['make', 'zapier'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['automate-content-n8n', 'build-first-ai-agent', 'automate-customer-support'],
      pros: ['Open source and self-hostable', '400+ integrations', 'AI Agent node with ReAct', 'Code nodes (JavaScript/Python)', 'Free at scale when self-hosted'],
      cons: ['Steeper learning curve than Zapier', 'Self-hosting requires infrastructure knowledge', 'Less polished UI than Make'],
      main_features: ['Visual workflow builder', '400+ native integrations', 'AI Agent node (ReAct)', 'Code nodes (JS/Python)', 'Webhook triggers', 'Self-hosting support', 'n8n Cloud'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://n8n.io', 'https://docs.n8n.io'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 12. Make ──────────────────────────────────────────────────────────────
    {
      title: 'Make',
      slug: 'make',
      short_description: 'Automate any business workflow visually with 1,500+ app integrations and no-code tools.',
      long_description: `Make (formerly Integromat) is a visual automation platform known for its intuitive flowchart interface and powerful data transformation capabilities. It bridges the gap between Zapier's simplicity and n8n's technical depth, making it popular with non-technical business teams and marketing operations.

The scenario builder shows your automation as a visual flow: data enters from a trigger, passes through routers, filters, and transformers, and exits to one or more actions. The visual representation makes complex multi-step automations easy to understand and debug.

Data transformation is a strength: Make includes built-in functions for text manipulation, number formatting, date calculations, JSON parsing, and array operations — without requiring code. The UI for mapping data between apps is more intuitive than Zapier's.

Make's 1,500+ integrations cover all major business apps: Gmail, Slack, Google Sheets, Airtable, HubSpot, Shopify, Webflow, and more. The HTTP module lets you connect to any API not natively supported.

AI integrations include OpenAI (GPT-4o for text, DALL-E for images), Anthropic (Claude), and custom HTTP calls to any AI API. A common pattern: Make routes incoming support emails through an AI classification step, then auto-responds or assigns to the right team.

Free tier: 1,000 operations/month. Core plan: $9/month for 10,000 operations. Pro: $16/month for 10,000 with advanced features. Make is more affordable than Zapier for similar operation volumes.

Best for: marketing, sales, and operations teams who want powerful automation without hiring developers.`,
      website_url: 'https://make.com',
      category_id: catMap['ai-automation']?.id ?? catMap['ai-automation-tools']?.id,
      category_name: 'AI Automation',
      tags: ['automation', 'no-code', 'integration'],
      use_cases: ['automation', 'business', 'marketing'],
      best_for: ['Visual business workflow automation', 'Data transformation between apps', 'AI-powered email and lead routing', 'Marketing operations and CRM automation'],
      not_ideal_for: ['Complex developer workflows (use n8n)', 'Very simple one-step automations (Zapier easier)'],
      user_types: ['business', 'creator'],
      avelix_rating: 4.4,
      avelix_recommendation: 'Best visual automation for non-technical business teams.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 1,000 ops/mo. Core $9/mo (10K ops). Pro $16/mo. Teams $29/mo.',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Google Workspace', 'Slack', 'HubSpot', 'Shopify', 'Airtable', 'OpenAI', '1,500+ more'],
      has_arabic_support: false,
      related_tool_slugs: ['zapier', 'n8n'],
      related_model_slugs: [],
      related_skill_slugs: ['automate-content-n8n', 'automate-customer-support'],
      pros: ['Beautiful visual flowchart interface', 'Powerful data transformation', '1,500+ integrations', 'More affordable than Zapier', 'Good error handling and retry logic'],
      cons: ['Less powerful than n8n for developers', 'Operations pricing model can limit heavy users', 'Slower execution than Zapier for simple flows'],
      main_features: ['Visual scenario builder', '1,500+ app integrations', 'Data transformation functions', 'Router and filter modules', 'HTTP module for any API', 'AI modules (OpenAI, Anthropic)', 'Scheduling and webhooks'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://make.com', 'https://www.make.com/en/help'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 13. Zapier ──────────────────────────────────────────────────────────────
    {
      title: 'Zapier',
      slug: 'zapier',
      short_description: 'Automate tasks between 7,000+ apps with AI-powered Zaps that require no coding.',
      long_description: `Zapier is the most popular automation platform for non-technical users, known for its simplicity and the largest integration catalog available — over 7,000 apps. If you want to connect two tools and have something happen automatically, Zapier is often the fastest path to a working automation.

A Zap consists of a trigger (something that happens in one app) and one or more actions (things that happen as a result in other apps). Setup is guided and straightforward: choose your trigger app, select the event, map data, choose action app, test. Most simple Zaps are live in under 10 minutes.

Zapier AI adds intelligence to automations: use ChatGPT or other AI models to process data within a Zap — classify emails, generate summaries, draft responses, translate text, or extract structured data from unstructured input. These AI Steps integrate directly into the workflow without API setup.

Tables (Zapier's built-in database) and Interfaces (web forms and portals) extend Zapier into a lightweight no-code app builder. You can build intake forms, customer portals, and internal tools without writing code.

The Zaps directory contains thousands of pre-built Zap templates for common workflows, making it easy to find starting points for your use case.

Free tier: 5 Zaps, 100 tasks/month. Starter: $19.99/month (750 tasks). Professional: $49/month (2,000 tasks). For high-volume use, Make or n8n offer better pricing. For ease of use and quick setup, Zapier is unbeaten.

Best for: individuals and small businesses who want automation quickly without technical complexity.`,
      website_url: 'https://zapier.com',
      category_id: catMap['ai-automation']?.id ?? catMap['ai-automation-tools']?.id,
      category_name: 'AI Automation',
      tags: ['automation', 'no-code', 'integration'],
      use_cases: ['automation', 'business', 'marketing'],
      best_for: ['Simple app-to-app automations in minutes', 'AI-powered data processing in workflows', 'Teams needing 7,000+ app support', 'Quick prototypes without technical setup'],
      not_ideal_for: ['Complex multi-branch workflows', 'High-volume operations (costly)', 'Developer-grade customization'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.3,
      avelix_recommendation: 'Easiest automation tool — best for getting started quickly.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 5 Zaps, 100 tasks/mo. Starter $19.99/mo (750 tasks). Pro $49/mo (2,000 tasks).',
      pricing_last_verified: now,
      has_api: true,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Gmail', 'Slack', 'Salesforce', 'HubSpot', 'Google Sheets', 'OpenAI', '7,000+ apps'],
      has_arabic_support: false,
      related_tool_slugs: ['make', 'n8n'],
      related_model_slugs: [],
      related_skill_slugs: ['automate-customer-support'],
      pros: ['7,000+ app integrations (largest library)', 'Simplest setup of any automation tool', 'AI Steps built in', 'Pre-built Zap templates', 'Tables and Interfaces for basic app building'],
      cons: ['Expensive at high operation volumes', 'Less flexibility than Make or n8n', 'Complex workflows can be awkward to build'],
      main_features: ['7,000+ app connectors', 'AI Steps (ChatGPT integration)', 'Multi-step Zaps', 'Zapier Tables (database)', 'Zapier Interfaces (forms/portals)', 'Zap templates', 'Filters and conditions'],
      example_prompts: [],
      status: 'published',
      source_urls: ['https://zapier.com', 'https://help.zapier.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 14. Cursor ──────────────────────────────────────────────────────────────
    {
      title: 'Cursor',
      slug: 'cursor',
      short_description: 'Write, edit, and debug code faster with AI inline in a VS Code-compatible editor.',
      long_description: `Cursor is an AI-first code editor built as a fork of VS Code, adding deep AI integration at every level of the coding workflow. It's designed for professional developers who want AI assistance without switching out of a familiar environment.

The Tab completion feature predicts not just the next line but multi-line edits — it understands what you're doing and suggests the entire continuation. It learns from your codebase's patterns and gets more accurate over time within a project.

Cmd+K (or Ctrl+K) opens inline code generation: select code, describe what you want to change in plain English, and Cursor generates and previews the edit before applying. This works for adding functions, refactoring, fixing bugs, or adding tests.

The Chat panel (Cmd+L) lets you ask questions about your entire codebase. Unlike GitHub Copilot, which has limited codebase awareness, Cursor indexes your full project and answers accurately: "Where is the authentication logic?" "Which files reference this function?" "What would break if I changed this interface?"

Agent mode is Cursor's most powerful feature: give it a multi-step task and it autonomously writes code, runs terminal commands, reads file output, and iterates until the task is complete. It works like a pair programmer who can operate independently.

Cursor supports multiple AI models: Claude 3.5 Sonnet (default, best for coding), GPT-4o, and o1 for complex reasoning tasks.

Free tier: 2,000 completions + 50 slow premium requests. Pro ($20/month): 500 premium requests. Business ($40/user/month) adds team management.

Best for professional developers building real products, especially those working across large codebases.`,
      website_url: 'https://cursor.com',
      category_id: catMap['ai-coding']?.id ?? catMap['ai-coding-tools']?.id,
      category_name: 'AI Coding',
      tags: ['coding', 'developer-tools', 'ide'],
      use_cases: ['coding', 'automation', 'business'],
      best_for: ['Full-stack development with AI assistance', 'Codebase-aware Q&A and refactoring', 'Autonomous multi-step coding tasks', 'Code review and bug fixing at speed'],
      not_ideal_for: ['Non-developers or beginners', 'Simple scripting (overkill)', 'Web-based development (use Replit)'],
      user_types: ['developer'],
      avelix_rating: 4.8,
      avelix_recommendation: 'Best AI coding editor for professional developers.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 2,000 completions. Pro $20/mo (500 premium). Business $40/user/mo.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: false,
      platforms: ['macos', 'windows', 'linux'],
      integrations: ['GitHub', 'GitLab', 'VS Code extensions', 'Claude API', 'OpenAI API'],
      has_arabic_support: false,
      related_tool_slugs: ['replit', 'chatgpt'],
      related_model_slugs: ['claude-3-5-sonnet', 'gpt-4o'],
      related_skill_slugs: ['prompt-engineering-basics'],
      pros: ['Full codebase context and awareness', 'Multi-model support (Claude, GPT-4o, o1)', 'VS Code extensions compatible', 'Agent mode for autonomous tasks', 'Fast multi-line tab completion'],
      cons: ['Requires technical setup and Git knowledge', 'Premium model usage on credit system', 'Not for no-code users'],
      main_features: ['AI tab completion', 'Inline edit (Cmd+K)', 'Codebase chat (Cmd+L)', 'Agent mode', 'Multi-model support', 'VS Code extension compatibility', 'Terminal integration'],
      example_prompts: ['Refactor this API route to use the repository pattern', 'Add comprehensive error handling and TypeScript types to this file', 'Write unit tests for all functions in this module'],
      status: 'published',
      source_urls: ['https://cursor.com', 'https://docs.cursor.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 15. Replit ──────────────────────────────────────────────────────────────
    {
      title: 'Replit',
      slug: 'replit',
      short_description: 'Build, run, and deploy apps in the browser with AI that writes code from descriptions.',
      long_description: `Replit is a browser-based development environment that lets you write, run, and deploy code entirely in the cloud — no local setup required. It's the go-to platform for learners, rapid prototypers, and developers who want to build and ship quickly without infrastructure management.

Replit AI (powered by its custom model and integrations) can generate entire apps from a text description. Describe what you want — "a React todo app with local storage" or "a Python script that scrapes product prices" — and Replit generates the code, installs dependencies, and gets it running in the browser.

The Always On feature keeps apps running 24/7 without a dedicated server. Deploy a web app, API, or bot directly from Replit to a public URL in one click. This makes it ideal for building side projects, demos, and internal tools without DevOps knowledge.

Multiplayer (real-time collaboration) lets multiple people code in the same environment simultaneously — like Google Docs for code. This makes it valuable for coding education, pair programming, and collaborative hackathons.

The Bounties marketplace connects developers with small paid tasks: post a programming task, pay in dollars or Cycles (Replit's virtual currency), and a developer delivers the code. This creates an ecosystem of quick, cheap development work.

Language support is broad: Python, JavaScript, TypeScript, React, Next.js, Ruby, Go, Rust, and 50+ others — all runnable without installing anything.

Free tier includes basic compute and public Repls. Core plan ($25/month) adds more compute, private Repls, and always-on. Teams plan ($20/user/month) adds collaboration management.

Best for students, learners, and developers who want to build and deploy quickly without local environment setup.`,
      website_url: 'https://replit.com',
      category_id: catMap['ai-coding']?.id ?? catMap['ai-coding-tools']?.id,
      category_name: 'AI Coding',
      tags: ['coding', 'developer-tools', 'no-code'],
      use_cases: ['coding', 'education', 'automation'],
      best_for: ['Building and deploying apps from scratch quickly', 'Learning to code with AI assistance', 'Collaborative coding and hackathons', 'Running code without local setup'],
      not_ideal_for: ['Large production codebases', 'Performance-critical applications', 'Developers with complex local tool setups'],
      user_types: ['developer', 'beginner', 'creator'],
      avelix_rating: 4.3,
      avelix_recommendation: 'Best for beginners and rapid prototyping without any local setup.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free basic plan. Core $25/mo. Teams $20/user/mo. Compute billed separately.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: false,
      platforms: ['web'],
      integrations: ['GitHub', 'Google Auth', 'Nix packages'],
      has_arabic_support: false,
      related_tool_slugs: ['cursor', 'bolt', 'lovable'],
      related_model_slugs: ['gpt-4o'],
      related_skill_slugs: ['prompt-engineering-basics'],
      pros: ['Zero setup — code in browser instantly', 'AI code generation from descriptions', 'Deploy with one click to public URL', 'Real-time collaboration', '50+ languages supported'],
      cons: ['Performance limited vs local development', 'Free tier compute is slow', 'Not for large production systems'],
      main_features: ['Browser-based IDE', 'AI code generation (Ghostwriter)', 'One-click deployment', 'Always On hosting', 'Multiplayer collaboration', 'Bounties marketplace', '50+ language support'],
      example_prompts: ['Build a REST API with Express that manages a todo list', 'Create a Python web scraper that extracts product data from a given URL'],
      status: 'published',
      source_urls: ['https://replit.com', 'https://docs.replit.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 16. Gamma ──────────────────────────────────────────────────────────────
    {
      title: 'Gamma',
      slug: 'gamma',
      short_description: 'Create polished presentations, documents, and websites from a text prompt in seconds.',
      long_description: `Gamma is an AI-powered creation tool that generates beautiful presentations, documents, and web pages from a text prompt or existing content. It eliminates the blank-slide problem: describe your topic, choose a style, and Gamma drafts a complete, visually designed presentation in under a minute.

The generation process is prompt-driven: enter a title or outline, pick from template styles, and Gamma creates the full deck with layout, images, charts, and text. You can then edit any element — swap images, adjust text, change themes — in a WYSIWYG editor.

Gamma works with text, images, videos, and embeds. Cards (slides) can contain multiple content types, and the responsive layout means presentations look good on desktop, mobile, and as web pages — all from the same file.

The AI edit features let you improve existing content: select any card and ask Gamma to rewrite the text, change the tone, add a visual, or expand a section. This makes it useful for quickly updating older presentations rather than starting from scratch.

Import from Google Docs or paste text and Gamma restructures it into slides automatically. This is useful for converting written reports into presentations without manual reformatting.

Analytics (on paid plans) show how many people viewed your presentation and for how long — useful for sales decks and investor materials where engagement matters.

Free tier: unlimited creation with Gamma branding. Plus ($10/month): removes branding, adds more AI credits. Pro ($20/month): custom domains, advanced analytics, and export to PowerPoint/PDF.

Best for: business professionals, marketers, and consultants who need polished presentations quickly without design skills.`,
      website_url: 'https://gamma.app',
      category_id: catMap['ai-presentation-tools']?.id,
      category_name: catMap['ai-presentation-tools']?.name ?? 'AI Presentation Tools',
      tags: ['writing', 'design', 'no-code'],
      use_cases: ['writing', 'business', 'marketing'],
      best_for: ['Creating presentations from a text description', 'Converting documents into slides', 'Web-based presentations that work on all devices', 'Sales decks and pitch materials'],
      not_ideal_for: ['Complex PowerPoint animations', 'Highly custom-designed branded materials', 'Technical diagrams and flowcharts'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.4,
      avelix_recommendation: 'Best AI presentation tool — from prompt to polished deck in seconds.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with Gamma branding. Plus $10/mo. Pro $20/mo (exports, analytics, custom domains).',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Google Docs', 'Figma', 'YouTube', 'Loom'],
      has_arabic_support: false,
      related_tool_slugs: ['chatgpt', 'canva-ai'],
      related_model_slugs: [],
      related_skill_slugs: ['prompt-engineering-basics'],
      pros: ['Fastest way to create polished presentations', 'Beautiful templates out of the box', 'Web, document, and presentation in one', 'AI editing and content suggestions', 'Analytics on paid plans'],
      cons: ['Less control than PowerPoint/Keynote', 'Free tier includes Gamma branding', 'Not for highly custom visual designs'],
      main_features: ['AI presentation generation from prompts', 'Cards (slides) with rich media', 'Import from Google Docs', 'AI edit (rewrite, expand, style)', 'Web page mode', 'Export to PDF/PPTX (Pro)', 'Presentation analytics'],
      example_prompts: ['Create a 10-slide pitch deck for an AI productivity startup targeting SMBs', 'Generate a presentation on the future of remote work for a team meeting'],
      status: 'published',
      source_urls: ['https://gamma.app', 'https://help.gamma.app'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 17. NotebookLM ──────────────────────────────────────────────────────────
    {
      title: 'NotebookLM',
      slug: 'notebooklm',
      short_description: 'Upload documents and research with Google\'s AI that cites every answer from your sources.',
      long_description: `NotebookLM is Google's AI research assistant that works exclusively from documents you provide. Upload PDFs, Google Docs, web pages, YouTube transcripts, or audio files, and ask questions — every answer cites exactly which source and which passage supports it.

This citation-first approach is the key differentiator: you never have to wonder if the AI is making something up. Every claim links back to a specific page and paragraph in your uploaded materials. This makes it ideal for research, legal analysis, academic work, and any task where source accuracy matters.

The Notebook Guide automatically generates a briefing document, FAQ, timeline, study guide, or table of contents from your uploaded sources — useful for quickly getting up to speed on a new topic.

Audio Overviews transform your documents into a podcast-style conversation between two AI hosts who discuss and explain the content. This "AI podcast" feature makes complex material more accessible for auditory learners or commute listening.

The Source Q&A mode answers questions with direct quotes from your sources, while Chat mode allows more free-form conversation about the content. You can switch between modes depending on whether you need precise citation or broader synthesis.

NotebookLM supports up to 50 sources per notebook, with each source up to 500,000 words. This is enough to process an entire book, a regulatory document set, or a large research corpus in one notebook.

NotebookLM is currently free from Google with a Google account. There are usage limits on queries and audio generation, but no subscription is required. This makes it the most accessible AI research tool available.`,
      website_url: 'https://notebooklm.google.com',
      category_id: catMap['ai-research']?.id ?? catMap['ai-research-tools']?.id,
      category_name: 'AI Research',
      tags: ['research', 'analysis', 'google'],
      use_cases: ['research', 'education', 'writing'],
      best_for: ['Researching from uploaded documents with citations', 'Summarizing books and long reports', 'Academic research and paper analysis', 'Learning from documents via AI podcast mode'],
      not_ideal_for: ['Real-time web research', 'Writing new content from scratch', 'Data analysis and visualization'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.6,
      avelix_recommendation: 'Best free AI for source-grounded document research.',
      pricing_model: 'free',
      has_free_plan: true,
      pricing_summary: 'Completely free with a Google account. Usage limits apply.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Google Docs', 'Google Drive', 'YouTube'],
      has_arabic_support: false,
      related_tool_slugs: ['perplexity', 'chatgpt', 'claude'],
      related_model_slugs: ['gemini-1-5-pro'],
      related_skill_slugs: ['perplexity-deep-research'],
      pros: ['Every answer cites the exact source', 'Free with Google account', 'Audio Overview podcast generation', 'Handles 50 sources per notebook', 'Great for document-heavy research'],
      cons: ['Cannot search the web (sources only)', 'No real-time information', 'Usage limits on free tier', 'Not for creative writing'],
      main_features: ['Source-cited Q&A', 'Audio Overview (AI podcast)', 'Notebook Guide (auto summaries)', 'Support for PDF, Docs, web, YouTube, audio', '50 sources per notebook', 'Study guide generation'],
      example_prompts: ['What are the main arguments in these papers?', 'Create a study guide from all uploaded chapters', 'What does the contract say about termination clauses?'],
      status: 'published',
      source_urls: ['https://notebooklm.google.com', 'https://blog.google/technology/ai/notebooklm-new-features'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 18. Canva AI ──────────────────────────────────────────────────────────
    {
      title: 'Canva AI',
      slug: 'canva-ai',
      short_description: 'Design images, videos, and presentations with AI-powered tools inside Canva\'s editor.',
      long_description: `Canva AI is a suite of AI-powered design features built into Canva, the world's most popular visual design platform. It adds AI generation, editing, and automation capabilities to Canva's existing drag-and-drop design tools — making it the most accessible path to AI-assisted design for non-designers.

Magic Media generates images and videos from text prompts directly within a Canva design. You can type a description, generate an image, and place it into your design without leaving Canva. This eliminates the workflow of generating elsewhere and importing.

Magic Write generates text for any design element: social captions, presentation copy, ad copy, product descriptions, or email subjects. It drafts content based on context from your design, making it useful for marketers creating multi-format content.

Background Remover automatically removes image backgrounds in one click — a task that previously required Photoshop skills. This is one of Canva's most-used AI features for product photography, profile photos, and marketing visuals.

Magic Design generates entire presentation templates or social media designs from a prompt or uploaded image, giving you a starting point to customize rather than a blank canvas.

AI video generation (Magic Media for video) creates short clips from text prompts, integrated into Canva's video editor. This is more limited than Runway or Kling but useful for quick social media content.

Canva's free tier includes many AI features with usage limits. Pro ($14.99/month) removes limits, adds premium templates, and includes Brand Kit for consistent brand assets.

Best for: non-designers, marketing teams, and content creators who already use Canva and want AI features without switching platforms.`,
      website_url: 'https://canva.com',
      category_id: catMap['ai-design']?.id ?? catMap['ai-design-tools']?.id,
      category_name: 'AI Design',
      tags: ['design', 'image-gen', 'writing', 'no-code'],
      use_cases: ['design', 'marketing', 'writing'],
      best_for: ['Non-designers creating marketing visuals', 'Quick social media graphics with AI text and images', 'Presentation design with AI content', 'Product images with background removal'],
      not_ideal_for: ['Professional graphic design requiring Photoshop-level control', 'High-quality AI image generation (use Midjourney)'],
      user_types: ['creator', 'business', 'beginner'],
      avelix_rating: 4.5,
      avelix_recommendation: 'Best AI design tool for non-designers who already use Canva.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with limited AI credits. Pro $14.99/mo. Teams $29.99/mo (first 5 users).',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web', 'ios', 'android', 'desktop'],
      integrations: ['Google Drive', 'Dropbox', 'Mailchimp', 'HubSpot', 'Slack'],
      has_arabic_support: true,
      related_tool_slugs: ['midjourney', 'dall-e-3', 'gamma'],
      related_model_slugs: [],
      related_skill_slugs: ['ai-image-midjourney'],
      pros: ['All-in-one design + AI in one platform', 'Background Remover is instant and accurate', 'No design skills required', 'Pro templates for every format', 'Arabic support'],
      cons: ['AI image quality below Midjourney/DALL-E', 'AI credits limited on free tier', 'Less control than professional tools'],
      main_features: ['Magic Media (image + video generation)', 'Magic Write (text generation)', 'Background Remover', 'Magic Design (template generation)', 'Magic Resize', 'Brand Kit', 'Presentation and video editor'],
      example_prompts: ['Generate a social media post image for a product launch', 'Write 5 captions for this Instagram post about our new collection'],
      status: 'published',
      source_urls: ['https://canva.com', 'https://www.canva.com/ai-image-generator'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 19. Lovable ──────────────────────────────────────────────────────────
    {
      title: 'Lovable',
      slug: 'lovable',
      short_description: 'Build full-stack web apps from a text description with AI — no coding experience required.',
      long_description: `Lovable (formerly GPT Engineer) is an AI-powered full-stack app builder that turns natural language descriptions into working web applications. It builds React frontends with Tailwind CSS, connects Supabase databases, and handles authentication — all from a conversational interface without requiring programming knowledge.

The workflow is intuitive: describe the app you want ("a CRM with contacts, deals pipeline, and email notes"), and Lovable generates a complete working application with a database schema, UI components, and navigation. You iterate by describing what to change in plain English.

Lovable's integration with Supabase is deep — it automatically creates database tables, sets up row-level security, and wires the frontend to the backend. This eliminates the most complex part of building web apps: database setup and backend logic.

Authentication, user accounts, and role-based access are supported out of the box. Building a multi-tenant SaaS product that was previously a weeks-long development task can be prototyped in hours.

The visual editor complements the chat interface: click on any element in the preview, describe what to change, and the AI updates the code. The editor shows the generated code (React/TypeScript) so developers can take it further.

GitHub sync exports the full codebase to your repository, making it possible to start in Lovable and hand off to developers for production refinement.

Pricing: Free tier includes 5 messages/day. Starter ($20/month) gives 100 monthly messages. Pro ($50/month) removes limits. Messages are consumed per AI-generated change.

Best for: non-developers building internal tools and MVPs, and developers who want to bootstrap a project's UI and database layer quickly.`,
      website_url: 'https://lovable.dev',
      category_id: catMap['ai-agent-builders']?.id ?? catMap['ai-coding-tools']?.id,
      category_name: 'AI Agent Builders',
      tags: ['no-code', 'coding', 'automation'],
      use_cases: ['coding', 'business', 'automation'],
      best_for: ['Building full-stack web apps without coding', 'Rapid MVP prototyping for startups', 'Internal tools for operations teams', 'Non-developers who need a working app quickly'],
      not_ideal_for: ['Complex production apps with custom performance needs', 'Mobile app development', 'Teams that need full control over every line of code'],
      user_types: ['developer', 'business', 'creator'],
      avelix_rating: 4.4,
      avelix_recommendation: 'Best no-code AI app builder — builds real full-stack apps, not just prototypes.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free: 5 messages/day. Starter $20/mo (100 messages). Pro $50/mo (unlimited).',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Supabase', 'GitHub', 'Stripe', 'OpenAI'],
      has_arabic_support: false,
      related_tool_slugs: ['bolt', 'replit', 'cursor'],
      related_model_slugs: ['claude-3-5-sonnet'],
      related_skill_slugs: ['build-first-ai-agent'],
      pros: ['True full-stack apps with database and auth', 'Deep Supabase integration', 'No coding required', 'GitHub export for developer handoff', 'Visual editor alongside chat'],
      cons: ['Message-based pricing limits iteration speed', 'Complex custom logic may need developer help', 'App quality depends heavily on prompt quality'],
      main_features: ['Natural language app generation', 'Supabase database integration', 'Authentication and user management', 'Visual editor', 'GitHub export', 'Stripe payment integration', 'Real-time preview'],
      example_prompts: ['Build a project management tool with tasks, team members, and a Kanban board', 'Create an AI customer support tool that stores tickets in a database'],
      status: 'published',
      source_urls: ['https://lovable.dev', 'https://docs.lovable.dev'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 20. Bolt ──────────────────────────────────────────────────────────────
    {
      title: 'Bolt',
      slug: 'bolt',
      short_description: 'Generate, run, and deploy full-stack apps in the browser from a single text prompt.',
      long_description: `Bolt (bolt.new) is an AI-powered in-browser development environment from StackBlitz that generates complete full-stack applications from text prompts and lets you run, edit, and deploy them without any local setup.

Unlike code generators that produce static code, Bolt provides a full Node.js runtime in the browser. When it generates an app, you can immediately run it, see it working, install npm packages, and make edits — all within the browser tab. There's no download, no terminal setup, no environment configuration.

The generation quality is strong: Bolt understands common tech stacks (React, Next.js, Vue, SvelteKit, Express, Astro) and generates working apps with routing, state management, and UI components. Describe "a Next.js app with a blog, markdown support, and dark mode" and you get a fully functional codebase.

Iterative editing via chat: after generation, describe what to change and Bolt modifies the code. "Add a search bar to the blog index" or "Add Supabase authentication" — Bolt understands the existing codebase context and makes targeted changes.

Deploy to Netlify is built in: click Deploy and your app is live on a public URL in under a minute, with no account setup needed for basic deploys.

The WebContainer technology means you're running a real Node.js environment in the browser — npm install works, build tools run, environment variables work. This is more capable than simple code playgrounds like CodeSandbox.

Pricing: Free tier includes limited AI tokens. Pro ($20/month) gives more tokens and private projects. The free tier is generous enough for exploring and small projects.

Best for: rapid prototyping, learning modern web development, and shipping quick demos without any local environment setup.`,
      website_url: 'https://bolt.new',
      category_id: catMap['ai-coding-tools']?.id ?? catMap['ai-agent-builders']?.id,
      category_name: 'AI Coding Tools',
      tags: ['coding', 'no-code', 'developer-tools'],
      use_cases: ['coding', 'business', 'education'],
      best_for: ['Generating and running full-stack apps in the browser', 'Rapid prototyping without local setup', 'Learning modern web frameworks with AI assistance', 'Shipping demos and landing pages quickly'],
      not_ideal_for: ['Large production codebases', 'Complex backend systems', 'Teams with established local development workflows'],
      user_types: ['developer', 'beginner', 'creator'],
      avelix_rating: 4.3,
      avelix_recommendation: 'Best for instant app generation with real runtime — no setup required.',
      pricing_model: 'freemium',
      has_free_plan: true,
      pricing_summary: 'Free with limited AI tokens. Pro $20/mo for more tokens and private projects.',
      pricing_last_verified: now,
      has_api: false,
      is_no_code: true,
      platforms: ['web'],
      integrations: ['Netlify', 'GitHub', 'npm'],
      has_arabic_support: false,
      related_tool_slugs: ['lovable', 'replit', 'cursor'],
      related_model_slugs: ['claude-3-5-sonnet', 'gpt-4o'],
      related_skill_slugs: ['prompt-engineering-basics'],
      pros: ['Full Node.js runtime in the browser', 'Zero local setup needed', 'Strong modern framework support', 'One-click Netlify deploy', 'Genuine npm package support'],
      cons: ['Token-based pricing limits heavy use', 'Not for complex production systems', 'Browser-based limits performance for heavy builds'],
      main_features: ['AI full-stack code generation', 'In-browser Node.js runtime (WebContainer)', 'npm package installation', 'One-click Netlify deploy', 'Iterative chat editing', 'Multiple framework support', 'GitHub export'],
      example_prompts: ['Build a SvelteKit blog with markdown posts and dark mode', 'Create an Astro landing page for a SaaS product with pricing section'],
      status: 'published',
      source_urls: ['https://bolt.new', 'https://stackblitz.com/blog/introducing-bolt'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },
  ]

  console.log('Seeding tools...')
  const { error } = await supabase.from('tools').upsert(tools, { onConflict: 'slug' })
  if (error) { console.error('tools error:', error.message, error.details); process.exit(1) }
  console.log(`  ✓ ${tools.length} tools seeded`)
  console.log('\nDone.')
}

seed()
