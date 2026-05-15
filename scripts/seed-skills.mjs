import { createClient } from '@supabase/supabase-js'

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

async function seed() {
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, slug, name')
  if (catErr) { console.error('Failed to fetch categories:', catErr.message); process.exit(1) }
  const catMap = Object.fromEntries(cats.map(c => [c.slug, { id: c.id, name: c.name }]))

  const now = '2026-05-15T00:00:00Z'

  const skills = [
    // ── 1. Prompt Engineering Basics ────────────────────────────────────────
    {
      title: 'Prompt Engineering Basics',
      slug: 'prompt-engineering-basics',
      short_description: 'Learn to write clear, effective prompts that get consistent, high-quality results from any AI model.',
      long_description: `Prompt engineering is the practice of designing inputs to AI language models in ways that reliably produce the outputs you want. It's the foundational skill for working with AI tools, and improving it dramatically increases your results across every AI tool you use.

This skill covers the core principles: how context shapes model output, the difference between instructional and conversational prompts, when to use examples (few-shot prompting), how to break complex tasks into steps, and how to write system prompts that consistently shape AI behavior.

You'll learn specific techniques with measurable impact: role assignment ("You are a senior copywriter"), output format specification ("Respond as a JSON object with keys: title, description, tags"), chain-of-thought prompting for complex reasoning, and persona prompts for consistent tone and voice.

The skill also covers common mistakes: vague instructions, missing context, assuming the model knows your preferences, and over-constraining vs. under-constraining. Understanding why a prompt fails is as important as knowing what good prompts look like.

Practical exercises apply these techniques to real tools — ChatGPT, Claude, and Gemini each respond differently to the same prompt, and you'll understand why and how to adjust.

By the end, you'll be able to write prompts that consistently produce what you want, debug prompts that aren't working, and build reusable prompt templates for your common tasks.`,
      category_id: catMap['prompt-engineering']?.id,
      tags: ['llm', 'writing', 'automation'],
      use_cases: ['writing', 'coding', 'automation'],
      difficulty: 'beginner',
      estimated_hours: 3,
      who_should_learn: 'Anyone who uses AI tools regularly and wants more consistent, useful results.',
      why_it_matters: 'Prompt quality is the single biggest variable in AI output quality. A well-engineered prompt can turn a mediocre AI response into an excellent one. This skill compounds — every AI tool you use improves.',
      learning_steps: [
        { step: 1, title: 'Understand how language models process prompts', description: 'Learn the basics: tokens, context window, and how the model predicts the next word.' },
        { step: 2, title: 'Learn the core prompt components', description: 'Role, context, task, format, constraints — the five building blocks of effective prompts.' },
        { step: 3, title: 'Practice few-shot prompting', description: 'Give examples in your prompt to teach the model what good output looks like.' },
        { step: 4, title: 'Write your first system prompts', description: 'Create reusable system prompts for your most common tasks.' },
        { step: 5, title: 'Debug and iterate', description: 'Learn a systematic process for identifying why a prompt fails and improving it.' },
      ],
      practical_examples: ['Write a system prompt for a customer support assistant', 'Convert a vague request into a structured prompt with role, context, and format', 'Use chain-of-thought prompting to solve a multi-step problem'],
      common_mistakes: ['Being too vague about the desired output', 'Forgetting to specify format and length', 'Giving conflicting instructions', 'Not testing prompts across different contexts'],
      required_tool_slugs: ['chatgpt'],
      related_tool_slugs: ['claude', 'gemini', 'perplexity'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['write-system-prompts', 'build-first-ai-agent'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/guides/prompt-engineering', 'https://docs.anthropic.com/claude/docs/prompt-engineering'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 2. Build an AI Chatbot (no-code) ─────────────────────────────────────
    {
      title: 'Build an AI Chatbot (No-Code)',
      slug: 'build-ai-chatbot-no-code',
      short_description: 'Create and deploy a working AI chatbot without writing code using Lovable, n8n, or a custom GPT.',
      long_description: `This skill teaches you to build a functional AI chatbot for a real use case — customer support, lead qualification, internal FAQ, or a personal assistant — without writing any code.

You'll explore three approaches depending on your needs and technical comfort: Custom GPTs (ChatGPT Plus feature), no-code builders like Voiceflow or Botpress, and n8n workflows with AI nodes. Each has different tradeoffs in flexibility, hosting, and capability.

The Custom GPT route is fastest: create a GPT with custom instructions, upload knowledge documents, and share it via a link. This works well for internal team assistants or simple customer-facing Q&A bots.

The n8n webhook route gives you more control: set up a webhook trigger, connect it to an AI model node (Claude or GPT-4o), add a memory node to track conversation history, and expose it via an embedded web widget. This handles customer support workflows where you need to log conversations or escalate to humans.

You'll learn how to give your chatbot a persona, feed it knowledge from documents and URLs, set boundaries on what it will and won't discuss, and connect it to external data (pricing pages, product catalog, support articles).

Testing and deployment: how to test edge cases, handle off-topic questions gracefully, and embed the chatbot on a website or connect it to Slack.

By the end, you'll have a working AI chatbot deployed and accessible to real users.`,
      category_id: catMap['ai-agents-mcp']?.id ?? catMap['ai-content-creation']?.id,
      tags: ['automation', 'no-code', 'llm'],
      use_cases: ['automation', 'business', 'customer-support'],
      difficulty: 'beginner',
      estimated_hours: 4,
      who_should_learn: 'Business owners, marketers, and operations teams who want an AI chatbot without a developer.',
      why_it_matters: 'A well-built chatbot handles routine customer queries 24/7, freeing your team for complex work. Building one no-code takes hours, not weeks.',
      learning_steps: [
        { step: 1, title: 'Choose your chatbot platform', description: 'Compare Custom GPT, n8n webhook bot, and no-code builders. Choose based on your needs.' },
        { step: 2, title: 'Define your chatbot persona and scope', description: 'Write a system prompt that defines what the bot does, its tone, and what it refuses.' },
        { step: 3, title: 'Add your knowledge base', description: 'Upload product docs, FAQs, and support articles as context for the bot.' },
        { step: 4, title: 'Build and test the conversation flow', description: 'Test with 20 realistic user questions. Identify and fix gaps.' },
        { step: 5, title: 'Deploy and embed', description: 'Publish the chatbot to a website widget, Slack workspace, or shareable link.' },
      ],
      practical_examples: ['Customer support bot that answers common questions', 'Internal HR FAQ bot for team policy questions', 'Lead qualification bot for a service business'],
      common_mistakes: ['Giving the chatbot too broad a scope', 'Not testing edge cases and off-topic questions', 'Forgetting to add a human escalation path', 'Under-investing in the knowledge base quality'],
      required_tool_slugs: ['chatgpt'],
      related_tool_slugs: ['n8n', 'claude', 'lovable'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-haiku'],
      related_skill_slugs: ['prompt-engineering-basics', 'automate-customer-support'],
      status: 'published',
      source_urls: ['https://openai.com/blog/introducing-gpts', 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.lmchatopenai'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 3. Automate Content Creation with n8n ────────────────────────────────
    {
      title: 'Automate Content Creation with n8n',
      slug: 'automate-content-n8n',
      short_description: 'Build automated pipelines that research, write, and publish content using n8n and AI models.',
      long_description: `This skill teaches you to build automated content creation workflows in n8n — pipelines that take a topic or trigger, research the web, generate written content with AI, format it, and publish or send it somewhere useful.

You'll build real workflows: a daily newsletter pipeline that scrapes industry news, summarizes it with Claude, and sends it to your email list; a blog post generator that takes a keyword, pulls research from Perplexity API, and drafts a full post with GPT-4o; and a social media scheduler that generates and queues platform-specific posts.

n8n's strength is in connecting things: you'll use the HTTP Request node to call AI APIs, the Code node to transform data, the Gmail node to send results, and webhook triggers to start workflows from external events.

The course covers AI-specific patterns in n8n: chaining multiple AI calls (research → outline → write → review), passing context between nodes, using different models for different steps (cheap model for research filtering, expensive model for final writing), and storing outputs in Airtable or Notion.

Error handling is covered in depth: what to do when an AI call fails, how to add retry logic, and how to monitor workflow runs to catch problems before they affect output.

By the end, you'll have 3 working content automation workflows running on your schedule, requiring zero manual intervention.`,
      category_id: catMap['n8n-workflows']?.id ?? catMap['ai-content-creation']?.id,
      tags: ['automation', 'no-code', 'writing'],
      use_cases: ['automation', 'writing', 'marketing'],
      difficulty: 'intermediate',
      estimated_hours: 6,
      who_should_learn: 'Marketers, content creators, and operators who publish regularly and want to automate the repetitive parts.',
      why_it_matters: 'Content creation at scale requires automation. This skill lets one person produce the content volume of a team, with consistent quality and zero burnout.',
      learning_steps: [
        { step: 1, title: 'Set up n8n and connect your first AI node', description: 'Install n8n or use Cloud, add your OpenAI/Anthropic key, build a simple text generation test.' },
        { step: 2, title: 'Build a content research pipeline', description: 'Use HTTP Request nodes to call Perplexity or SerpAPI for research, parse results.' },
        { step: 3, title: 'Chain AI writing steps', description: 'Outline → draft → review with different models. Learn when to use cheap vs expensive models.' },
        { step: 4, title: 'Connect to publishing destinations', description: 'Send to email (Resend/Gmail), publish to Webflow/WordPress, or post to social.' },
        { step: 5, title: 'Add scheduling and error handling', description: 'Run workflows on a cron schedule. Add error notifications so you know when something fails.' },
      ],
      practical_examples: ['Daily AI news digest sent to email list', 'Weekly blog post drafted from keyword list', 'LinkedIn and Twitter post variations from one topic'],
      common_mistakes: ['Not testing AI prompts before putting them in automation', 'Forgetting to handle AI API rate limits', 'Publishing without a human review step for important content'],
      required_tool_slugs: ['n8n'],
      related_tool_slugs: ['make', 'chatgpt', 'claude', 'perplexity'],
      related_model_slugs: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-first-ai-agent'],
      status: 'published',
      source_urls: ['https://docs.n8n.io', 'https://n8n.io/blog/automate-content-with-ai'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 4. AI Image Generation with Midjourney ───────────────────────────────
    {
      title: 'AI Image Generation with Midjourney',
      slug: 'ai-image-midjourney',
      short_description: 'Create professional-quality images for any project using Midjourney prompts, parameters, and techniques.',
      long_description: `This skill takes you from basic image generation to consistent, professional output using Midjourney — the tool that produces the most artistically impressive AI images available today.

You'll start with the fundamentals: how prompts are interpreted, the difference between descriptive and stylistic language, how to specify subjects, settings, lighting, and composition. You'll learn what makes Midjourney produce realistic vs. artistic results, and how to push it toward what you actually want.

Parameters are a core skill: --ar for aspect ratio, --v for model version, --stylize for artistic interpretation level, --quality for detail, and --no for negative prompts. Understanding these turns image generation from random to intentional.

Style references (--sref) and character references (--cref) unlock consistency across multiple images — critical for creating a character in multiple scenes, maintaining a visual brand, or producing a series of illustrations with the same aesthetic.

Advanced techniques include prompt weighting (making certain elements more or less prominent), using image prompts to blend styles, inpainting in the web editor to fix specific areas, and upscaling workflows for print-ready output.

Real-world projects: you'll complete a full product visual set (4 product angles + lifestyle shot), a set of social media illustrations with consistent style, and a concept art piece from reference to final output.

By the end, you'll be able to produce commercial-grade images for clients, generate consistent brand visuals, and use Midjourney as a production tool rather than an experiment.`,
      category_id: catMap['ai-image-generation']?.id,
      tags: ['image-gen', 'design', 'creative'],
      use_cases: ['design', 'marketing', 'writing'],
      difficulty: 'beginner',
      estimated_hours: 5,
      who_should_learn: 'Designers, marketers, content creators, and anyone who needs custom visuals regularly.',
      why_it_matters: 'AI image generation cuts visual production time from days to minutes. Mastering Midjourney means you can produce professional visuals for any project without a designer or stock photo subscription.',
      learning_steps: [
        { step: 1, title: 'Set up Midjourney and run your first prompt', description: 'Subscribe, access the web interface, and generate your first test images.' },
        { step: 2, title: 'Learn the prompt structure', description: 'Subject + style + medium + lighting + camera + mood — the anatomy of effective Midjourney prompts.' },
        { step: 3, title: 'Master the key parameters', description: 'Use --ar, --stylize, --v, and --no effectively. Understand when each matters.' },
        { step: 4, title: 'Use style and character references', description: 'Create consistent aesthetics across multiple images with --sref and --cref.' },
        { step: 5, title: 'Edit and refine in the web editor', description: 'Use inpainting, outpainting, and variations to get to the final image you want.' },
      ],
      practical_examples: ['Product lifestyle images for an e-commerce store', 'Social media graphics with consistent brand aesthetic', 'Concept art for a book or game project'],
      common_mistakes: ['Prompts that are too vague ("a nice landscape")', 'Not using aspect ratio parameters for platform-specific formats', 'Over-prompting with conflicting style instructions', 'Not using variations and refinement steps'],
      required_tool_slugs: ['midjourney'],
      related_tool_slugs: ['dall-e-3', 'canva-ai'],
      related_model_slugs: ['flux-1', 'stable-diffusion-3-5'],
      related_skill_slugs: ['prompt-engineering-basics'],
      status: 'published',
      source_urls: ['https://docs.midjourney.com', 'https://midjourney.com/showcase'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 5. AI Voice Generation with ElevenLabs ───────────────────────────────
    {
      title: 'AI Voice Generation with ElevenLabs',
      slug: 'ai-voice-elevenlabs',
      short_description: 'Produce professional voiceovers, clone voices, and build AI audio content with ElevenLabs.',
      long_description: `This skill teaches you to produce professional-quality audio content with ElevenLabs — from simple text-to-speech voiceovers to full voice cloning and multilingual dubbing workflows.

You'll start with the basics: selecting the right voice for your content type (authoritative for explainer videos, warm and conversational for podcasts, neutral for e-learning), adjusting speaking rate and emotion, and generating clean audio from scripts.

Voice cloning is the advanced capability that transforms the tool: using a 60-second audio sample, you'll clone a voice (your own, with permission) and use it to generate unlimited content in that voice. You'll learn what makes a good voice sample (clean audio, natural speech, varied sentences) and how to get the best quality from short samples.

The Dubbing Studio workflow lets you take any video, translate the script to a target language, and re-voice it in the speaker's original voice characteristics. You'll build a complete multilingual workflow: record once, distribute in any language.

Projects (ElevenLabs' long-form audio tool) handles audiobooks, multi-chapter content, and podcast episodes — tracking voice consistency across hours of content and allowing chapter-by-chapter revision.

API integration: you'll build a simple Node.js or Python script that takes a text input and produces audio output — the foundation for adding TTS to applications, chatbots, and automation workflows.

By the end, you'll have a complete audio production workflow, a cloned voice ready for use, and an API integration running in your automation pipeline.`,
      category_id: catMap['ai-voice-avatars']?.id,
      tags: ['voice', 'audio', 'content'],
      use_cases: ['audio', 'writing', 'automation'],
      difficulty: 'beginner',
      estimated_hours: 4,
      who_should_learn: 'Content creators, podcasters, e-learning producers, and businesses that need multilingual audio content.',
      why_it_matters: 'Professional voiceover production was expensive and slow. ElevenLabs makes it instant and affordable — one person can produce audio for every market.',
      learning_steps: [
        { step: 1, title: 'Generate your first voiceover', description: 'Write a 200-word script, select a voice, generate audio, and assess quality.' },
        { step: 2, title: 'Choose and configure voices', description: 'Browse the voice library. Understand stability, similarity boost, and style settings.' },
        { step: 3, title: 'Clone a voice from a sample', description: 'Record a clean 60-second sample and create an Instant Voice Clone. Test quality.' },
        { step: 4, title: 'Produce a full project (multi-chapter)', description: 'Use ElevenLabs Projects for a long-form piece with chapter navigation.' },
        { step: 5, title: 'Build the API integration', description: 'Connect ElevenLabs API to an automation: text in, audio file out, stored in a folder.' },
      ],
      practical_examples: ['Voiceover for a product explainer video', 'Podcast intro and outro generation', 'Multilingual e-learning narration from a single English script'],
      common_mistakes: ['Using noisy audio samples for voice cloning', 'Setting stability too high (sounds robotic)', 'Not adjusting speaking rate for the content type', 'Generating the full script without testing a paragraph first'],
      required_tool_slugs: ['elevenlabs'],
      related_tool_slugs: ['heygen', 'runway'],
      related_model_slugs: ['elevenlabs-turbo-v2-5', 'whisper'],
      related_skill_slugs: ['ugc-automation-pipeline'],
      status: 'published',
      source_urls: ['https://elevenlabs.io/docs', 'https://elevenlabs.io/blog/voice-cloning-guide'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 6. Build Your First AI Agent ─────────────────────────────────────────
    {
      title: 'Build Your First AI Agent',
      slug: 'build-first-ai-agent',
      short_description: 'Create an autonomous AI agent that researches, decides, and takes action on a real-world task.',
      long_description: `An AI agent is a system that can plan, reason, take actions with tools, observe results, and iterate until a task is complete — without requiring a human to guide each step. This skill teaches you to build one from scratch.

You'll start with the mental model: agents vs. chatbots vs. automation. An agent receives a goal, not a question. It uses tools (web search, code execution, API calls) to gather information, makes decisions based on what it finds, and produces a result or takes an action.

The practical implementation uses n8n's AI Agent node (ReAct architecture) or the OpenAI Assistants API, connecting it to real tools: a web search tool, a code execution tool, a file writing tool, and a database query tool.

You'll build three progressively complex agents: a research agent that searches the web and writes a structured report; a data agent that queries a database, calculates metrics, and sends a formatted Slack message; and a content agent that monitors a topic, identifies new developments, and drafts summaries for review.

Tool design is a core skill: well-designed tools make agents more reliable. You'll learn how to write tool descriptions that guide agent decision-making, handle tool errors gracefully, and set boundaries on what the agent can do autonomously.

Memory and context: agents that maintain memory across tasks are more useful. You'll implement short-term (within-session) and long-term (database-backed) memory patterns.

Safety and oversight: building in human approval checkpoints, setting action limits, and monitoring agent behavior — essential for any agent running in production.`,
      category_id: catMap['ai-agents-mcp']?.id,
      tags: ['automation', 'llm', 'coding'],
      use_cases: ['automation', 'coding', 'business'],
      difficulty: 'intermediate',
      estimated_hours: 8,
      who_should_learn: 'Developers and technical operators who want to automate complex, multi-step tasks that require AI judgment.',
      why_it_matters: 'Agents are the future of AI work automation. Building your first agent unlocks the ability to automate tasks that were previously too complex for simple workflows.',
      learning_steps: [
        { step: 1, title: 'Understand agent architecture', description: 'ReAct loop: Reason → Act → Observe → Repeat. Understand when to use agents vs simpler approaches.' },
        { step: 2, title: 'Set up your first agent in n8n', description: 'Configure the AI Agent node, connect OpenAI, and run a simple research task.' },
        { step: 3, title: 'Connect your first tools', description: 'Add web search (SerpAPI or Tavily), code execution, and a file write tool.' },
        { step: 4, title: 'Build a research agent end to end', description: 'Goal: "Research AI tools launched this week and write a summary." Fully autonomous.' },
        { step: 5, title: 'Add memory and safety controls', description: 'Implement conversation memory. Add a human-in-the-loop approval step for actions.' },
      ],
      practical_examples: ['Research agent that monitors a topic and summarizes weekly', 'Data analysis agent that queries your database and sends reports', 'Content agent that drafts social posts from trending topics'],
      common_mistakes: ['Giving agents too much autonomy without oversight', 'Writing vague tool descriptions that confuse the agent', 'Not handling tool errors — agents stop when tools fail silently', 'Building complex agents before mastering simple ones'],
      required_tool_slugs: ['n8n'],
      related_tool_slugs: ['chatgpt', 'claude', 'cursor'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics', 'automate-content-n8n', 'mcp-with-claude'],
      status: 'published',
      source_urls: ['https://docs.n8n.io/advanced-ai/examples/agent-workflow', 'https://platform.openai.com/docs/assistants/overview'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 7. Use Perplexity for Deep Research ──────────────────────────────────
    {
      title: 'Use Perplexity for Deep Research',
      slug: 'perplexity-deep-research',
      short_description: 'Research any topic thoroughly with citations using Perplexity AI\'s Pro Search and Deep Research.',
      long_description: `This skill teaches you to use Perplexity AI as your primary research tool — getting cited, accurate, real-time answers faster than traditional web research, and producing structured research reports with Deep Research.

You'll learn the difference between basic search (fast, conversational, single sources) and Pro Search (multi-step, synthesizes multiple sources, uses powerful models). For most research questions, Pro Search produces significantly better results.

Query formulation matters for research quality: you'll learn how to structure questions that give Perplexity enough context to search correctly. Too vague ("AI tools") produces generic results. Precise and contextual ("AI video generation tools for marketing teams with no-code interfaces and pricing under $50/month") produces actionable results.

Spaces are Perplexity's research environments: create one for a project, upload your own documents as context, and then ask questions that draw from both web search and your uploaded materials. This is useful for competitive analysis (upload competitor pricing + search for market comparisons) and research synthesis.

Deep Research (Pro feature) is the advanced capability: give it a complex research question, and it autonomously searches 20-30 sources, synthesizes findings, and produces a structured report. You'll build a workflow for using Deep Research outputs as inputs to Claude or ChatGPT for further analysis and writing.

Export and use: how to get Perplexity research into your workflow — exporting to Notion, turning citations into a bibliography, and using the output as source material for writing with other AI tools.

By the end, you'll have a complete research workflow that produces cited, accurate intelligence on any topic in 10-20 minutes instead of hours.`,
      category_id: catMap['ai-research']?.id ?? catMap['ai-research-skills']?.id,
      tags: ['research', 'search'],
      use_cases: ['research', 'writing', 'business'],
      difficulty: 'beginner',
      estimated_hours: 3,
      who_should_learn: 'Anyone who does regular research for work: analysts, writers, consultants, marketers, and students.',
      why_it_matters: 'Research quality bottlenecks most knowledge work. Perplexity compresses hours of web research into minutes while providing verification through citations.',
      learning_steps: [
        { step: 1, title: 'Set up Perplexity and run your first search', description: 'Create account, run a Pro Search, and understand the citation interface.' },
        { step: 2, title: 'Write effective research queries', description: 'Learn query patterns that produce better results: specificity, context, and comparison framing.' },
        { step: 3, title: 'Use Spaces for project research', description: 'Create a Space for a research project, upload documents, and ask questions across sources.' },
        { step: 4, title: 'Run a Deep Research report', description: 'Give Perplexity a complex research question and receive a structured multi-source synthesis.' },
        { step: 5, title: 'Integrate with your writing workflow', description: 'Use Perplexity output as source material for Claude or ChatGPT to write from.' },
      ],
      practical_examples: ['Market research report on AI tools in a specific category', 'Competitive analysis of 3-5 companies in a space', 'Deep research on a regulatory or compliance topic'],
      common_mistakes: ['Not verifying important facts from the original sources', 'Using Perplexity for creative writing (not its strength)', 'Ignoring the follow-up questions in the sidebar', 'Not using Pro Search for complex research questions'],
      required_tool_slugs: ['perplexity'],
      related_tool_slugs: ['notebooklm', 'chatgpt', 'claude'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics'],
      status: 'published',
      source_urls: ['https://perplexity.ai', 'https://blog.perplexity.ai'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 8. Build a RAG System ────────────────────────────────────────────────
    {
      title: 'Build a RAG System',
      slug: 'build-rag-system',
      short_description: 'Connect AI models to your own data using Retrieval-Augmented Generation for accurate, sourced answers.',
      long_description: `RAG (Retrieval-Augmented Generation) is the technique of connecting a language model to an external knowledge base so it answers questions using your data — not just what it was trained on. It's the foundation of most enterprise AI applications.

The core concept: when a user asks a question, the system converts it to a vector embedding, finds the most semantically similar chunks from your knowledge base, injects those chunks as context into the prompt, and lets the model answer using only that retrieved information. This produces accurate, sourced answers grounded in your actual documents.

You'll build a complete RAG system step by step: chunk and embed a document corpus (PDF reports, product docs, FAQ pages) using OpenAI's embedding model, store vectors in a vector database (Supabase's pgvector or Pinecone), write a query function that retrieves relevant chunks, and connect it to Claude or GPT-4o for answer generation.

The skill covers practical challenges: chunking strategy (how to split documents for best retrieval), embedding model selection (OpenAI text-embedding-3-large vs. alternatives), similarity thresholds (when to say "I don't know"), and hybrid search (combining vector similarity with keyword search).

No-code RAG options: you'll also implement a quick version using n8n's AI nodes and vector store integration — useful when you need RAG without writing custom code.

Evaluation: how to measure RAG quality — precision (are retrieved chunks relevant?) and faithfulness (does the answer match the retrieved context?).

By the end, you'll have a working RAG system over your own documents, and the knowledge to extend it into production.`,
      category_id: catMap['rag-embeddings']?.id,
      tags: ['api', 'coding', 'llm'],
      use_cases: ['coding', 'automation', 'business'],
      difficulty: 'advanced',
      estimated_hours: 10,
      who_should_learn: 'Developers and technical teams building AI applications that need to answer questions from proprietary data.',
      why_it_matters: 'RAG is the most common pattern in enterprise AI. Without it, AI models can only answer from training data. With it, they can answer from anything you give them.',
      learning_steps: [
        { step: 1, title: 'Understand embeddings and vector search', description: 'What are vectors? How does similarity search work? Build intuition with examples.' },
        { step: 2, title: 'Chunk and embed your documents', description: 'Chunk a PDF, embed with OpenAI text-embedding-3-small, store in Supabase pgvector.' },
        { step: 3, title: 'Build the retrieval function', description: 'Write a query function: embed the question, find top-k similar chunks, return them.' },
        { step: 4, title: 'Connect to an LLM for answer generation', description: 'Inject retrieved chunks into a prompt. Generate grounded answers with citations.' },
        { step: 5, title: 'Evaluate and improve', description: 'Test 20 questions. Measure accuracy. Tune chunking strategy and similarity threshold.' },
      ],
      practical_examples: ['Customer support bot grounded in your product documentation', 'Internal knowledge base Q&A for team policies and SOPs', 'Research assistant over a corpus of academic papers'],
      common_mistakes: ['Chunks too large (too much irrelevant context) or too small (loses meaning)', 'Not handling cases where no relevant chunks are found', 'Skipping evaluation — assuming accuracy without testing'],
      required_tool_slugs: ['n8n'],
      related_tool_slugs: ['chatgpt', 'claude'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'llama-3-1-405b'],
      related_skill_slugs: ['build-first-ai-agent', 'prompt-engineering-basics'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/guides/embeddings', 'https://supabase.com/docs/guides/ai/vector-columns'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 9. Write Better System Prompts ───────────────────────────────────────
    {
      title: 'Write Better System Prompts',
      slug: 'write-system-prompts',
      short_description: 'Design system prompts that reliably shape AI behavior for consistent, production-ready outputs.',
      long_description: `System prompts are the instructions you give to an AI model before the user interaction begins — they define the model's persona, capabilities, constraints, and output format. A well-designed system prompt is the difference between a generic AI response and a consistent, specialized assistant.

This skill focuses on system prompts for production use cases: customer support bots, writing assistants, coding tools, and data analysis workflows — where consistency and reliability matter more than impressive single responses.

You'll learn the core structure of effective system prompts: identity and role definition, behavioral guidelines, capability boundaries ("only answer questions about X"), output format specification, tone and style guidelines, and example outputs embedded directly in the prompt.

The most common failure modes: prompts that are too general (the model defaults to generic behavior), contradictory instructions (the model chooses arbitrarily), missing edge case handling (the model behaves unpredictably on unusual inputs), and prompts that try to do too much (one prompt, one job).

Testing methodology: you'll learn to systematically test system prompts with adversarial inputs, edge cases, and realistic user scenarios. A prompt that works for expected inputs but fails on unusual ones is not production-ready.

Prompt versioning and iteration: how to track prompt changes, measure their effect on output quality, and maintain a library of production prompts across your projects.

By the end, you'll have a tested, production-ready system prompt for a specific use case and a repeatable process for creating them.`,
      category_id: catMap['prompt-engineering']?.id,
      tags: ['llm', 'writing', 'automation'],
      use_cases: ['writing', 'coding', 'automation'],
      difficulty: 'intermediate',
      estimated_hours: 4,
      who_should_learn: 'Developers and operators building production AI systems that need consistent, controlled behavior.',
      why_it_matters: 'The system prompt determines 80% of an AI assistant\'s behavior. Mastering system prompt design is the highest-leverage prompt engineering skill.',
      learning_steps: [
        { step: 1, title: 'Learn the anatomy of a system prompt', description: 'Identity, capabilities, constraints, output format, examples. One job per prompt.' },
        { step: 2, title: 'Write your first production system prompt', description: 'Pick a use case. Write the prompt. Test with 10 realistic inputs and 5 adversarial ones.' },
        { step: 3, title: 'Handle edge cases and boundaries', description: 'Define what the assistant will and will not do. Test every boundary.' },
        { step: 4, title: 'Add few-shot examples', description: 'Embed input-output examples that demonstrate the desired behavior for ambiguous cases.' },
        { step: 5, title: 'Iterate based on failure analysis', description: 'Document every test failure. Fix the prompt. Re-test. Repeat until the failure rate is acceptable.' },
      ],
      practical_examples: ['Customer support agent prompt with product context and escalation rules', 'Writing assistant prompt with brand tone, forbidden phrases, and format requirements', 'Data extraction prompt that always returns structured JSON with a defined schema'],
      common_mistakes: ['Writing prompts that tell the model what not to do without saying what to do', 'Not testing with adversarial inputs', 'Changing multiple things between prompt versions (can\'t attribute improvements)', 'Too long — models may ignore later instructions in very long prompts'],
      required_tool_slugs: ['chatgpt'],
      related_tool_slugs: ['claude', 'gemini'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics', 'build-ai-chatbot-no-code'],
      status: 'published',
      source_urls: ['https://platform.openai.com/docs/guides/prompt-engineering', 'https://docs.anthropic.com/claude/docs/system-prompts'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 10. Use Claude for Business Automation ───────────────────────────────
    {
      title: 'Use Claude for Business Automation',
      slug: 'claude-business-automation',
      short_description: 'Automate document analysis, communication drafting, and decision support using Claude\'s API.',
      long_description: `This skill teaches you to use Claude as the AI backbone of real business automation workflows — connecting it to your documents, email, CRM, and internal tools to automate tasks that currently require human judgment.

Claude's strengths for business automation: long context (200K tokens means reading entire contracts, reports, or email threads), strong structured output (reliable JSON for downstream systems), and nuanced reasoning (classifying edge cases that rule-based systems can't handle).

You'll build three complete workflows: a contract review pipeline that reads legal documents and flags unusual clauses; an email triage system that reads incoming messages, classifies urgency and topic, and drafts responses; and a competitive intelligence pipeline that reads competitor content and produces structured analysis.

Prompt caching is a critical cost-optimization technique for business use: when the same document is analyzed repeatedly with different questions, caching the document reduces costs by up to 90%. You'll implement prompt caching in each workflow.

Error handling and graceful degradation: what happens when Claude refuses to answer, gives a low-confidence response, or times out. Business automation must handle failures gracefully, escalating to humans when AI output isn't reliable.

Integration patterns: connecting Claude to Make/n8n via HTTP Request nodes, building a simple API wrapper that adds authentication, rate limiting, and logging, and using Claude within Zapier for non-technical teams.

Cost management: estimating token usage for your workflows, choosing between Claude 3.5 Sonnet and Haiku based on task complexity, and monitoring API costs as usage scales.`,
      category_id: catMap['ai-for-business']?.id,
      tags: ['automation', 'llm', 'business'],
      use_cases: ['automation', 'business', 'writing'],
      difficulty: 'intermediate',
      estimated_hours: 6,
      who_should_learn: 'Business operators, consultants, and technical founders who want to automate complex document and communication workflows.',
      why_it_matters: 'Document-heavy business workflows are the highest-value AI automation target. Claude\'s long context and reasoning make it uniquely suited for automating tasks that require genuine understanding.',
      learning_steps: [
        { step: 1, title: 'Get Claude API access and understand pricing', description: 'Set up API key. Understand Sonnet vs Haiku pricing. Estimate costs for your use case.' },
        { step: 2, title: 'Build a contract review pipeline', description: 'Upload a PDF, extract text, send to Claude with review instructions, receive structured findings.' },
        { step: 3, title: 'Implement prompt caching', description: 'Cache the document as context. Run multiple analyses without re-sending the full document.' },
        { step: 4, title: 'Build the email triage workflow', description: 'Connect Gmail trigger → Claude classification → CRM update → draft response.' },
        { step: 5, title: 'Add error handling and monitoring', description: 'Handle API failures, log all Claude calls, set up alerts for unexpected outputs.' },
      ],
      practical_examples: ['Contract clause flagging for a legal or procurement team', 'Email classification and auto-draft for a customer support team', 'Weekly competitor content analysis and summary'],
      common_mistakes: ['Using Sonnet when Haiku would work (3× cost difference)', 'Not implementing prompt caching for repeated document analysis', 'Missing error handling — workflows that break silently'],
      required_tool_slugs: ['claude', 'n8n'],
      related_tool_slugs: ['make', 'zapier'],
      related_model_slugs: ['claude-3-5-sonnet', 'claude-3-5-haiku'],
      related_skill_slugs: ['prompt-engineering-basics', 'write-system-prompts', 'mcp-with-claude'],
      status: 'published',
      source_urls: ['https://docs.anthropic.com', 'https://anthropic.com/claude'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 11. AI Video Creation with Runway ────────────────────────────────────
    {
      title: 'AI Video Creation with Runway',
      slug: 'ai-video-runway',
      short_description: 'Generate, edit, and refine professional AI video content using Runway Gen-3 Alpha.',
      long_description: `This skill teaches you to use Runway as a professional video production tool — generating clips, transforming footage, removing backgrounds, and assembling polished video sequences for marketing, social media, and creative projects.

You'll start with Gen-3 Alpha text-to-video: understanding how prompt structure affects video quality, motion type, and scene coherence. Runway interprets prompts differently from image generators — motion descriptions, camera instructions, and subject behavior all shape the output in ways you'll learn to control.

Image-to-video is often more useful than text-to-video for commercial work: start with a product photo or illustration, animate it, and get video that is visually consistent with your brand assets. You'll build this workflow for product showcase videos.

Camera controls are Runway's professional differentiator: specifying camera movement (pan, zoom, orbit, push) gives cinematic control over generated scenes. You'll learn camera control language and how to combine it with scene descriptions.

Act-One (facial expression transfer) enables avatar-like videos: record yourself or an actor, and transfer the facial performance onto an AI-generated character. This creates talking-character videos without expensive production.

Practical projects: you'll produce a 30-second product showcase video, a social media content set (5 clips with consistent aesthetic), and a background video loop for presentation use.

The credit economy: understanding how credits are consumed, which settings burn more credits, and how to plan your generation workflow to stay within budget while maximizing quality.`,
      category_id: catMap['ai-video-generation']?.id,
      tags: ['video', 'creative', 'generation'],
      use_cases: ['video', 'marketing', 'design'],
      difficulty: 'intermediate',
      estimated_hours: 5,
      who_should_learn: 'Content creators, marketers, and video producers who want to add AI-generated footage to their production workflow.',
      why_it_matters: 'Stock footage is generic and licensing is expensive. AI video lets you generate exactly the footage you need — specific scene, specific mood, specific motion — in minutes.',
      learning_steps: [
        { step: 1, title: 'Run your first Gen-3 text-to-video generation', description: 'Write a descriptive prompt, generate a 5-second clip, evaluate the result.' },
        { step: 2, title: 'Master prompt structure for video', description: 'Subject + action + setting + camera + style. How motion description changes the output.' },
        { step: 3, title: 'Use image-to-video for consistent results', description: 'Start with a product photo, animate it, compare consistency vs text-to-video.' },
        { step: 4, title: 'Apply camera controls', description: 'Add pan, zoom, and orbit instructions. Generate the same scene with different camera movements.' },
        { step: 5, title: 'Assemble a complete video sequence', description: 'Combine 4-6 clips into a 30-second sequence using video editing tools.' },
      ],
      practical_examples: ['Product showcase video for e-commerce', 'B-roll footage for YouTube content', 'Background loops for presentations and events'],
      common_mistakes: ['Overloading the prompt with too many elements', 'Not specifying camera movement (static shots are less engaging)', 'Generating at low quality to save credits — then being unhappy with results', 'Not planning the full video sequence before generating individual clips'],
      required_tool_slugs: ['runway'],
      related_tool_slugs: ['kling', 'heygen', 'elevenlabs'],
      related_model_slugs: [],
      related_skill_slugs: ['ai-image-midjourney', 'ugc-automation-pipeline'],
      status: 'published',
      source_urls: ['https://runwayml.com', 'https://help.runwayml.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 12. Build a UGC Automation Pipeline ─────────────────────────────────
    {
      title: 'Build a UGC Automation Pipeline',
      slug: 'ugc-automation-pipeline',
      short_description: 'Create scalable user-generated content (UGC) videos automatically using AI voice, avatar, and automation tools.',
      long_description: `UGC (User-Generated Content) style videos — authentic-looking testimonials, product reviews, and talking-head content — are among the highest-converting content formats for paid social advertising. This skill teaches you to produce them at scale using AI tools.

The pipeline connects four tools: ElevenLabs for voice generation, HeyGen for avatar video, a script generation AI (Claude or ChatGPT), and n8n to orchestrate the full workflow. The output: a library of unique-looking UGC videos generated from product information, without actors, studios, or post-production.

Script generation is the starting point: given a product name, features, and target audience, Claude generates 5-10 unique UGC scripts in conversational styles. The scripts vary in tone, opening hook, and call-to-action — critical for testing different creative angles in ads.

Avatar selection and voice matching: HeyGen provides diverse avatar options that can be matched to target demographics. ElevenLabs provides the voice, either from HeyGen's built-in TTS or as a separate step for higher quality.

Batch production via n8n: the orchestration workflow takes a list of scripts, sends each to HeyGen's API, waits for generation, downloads the video files, and organizes them by variant. This produces 10 unique videos in the time it would take to produce one manually.

Quality control: reviewing generated videos, identifying and removing uncanny valley artifacts, and selecting the best variants for ad testing.

Scaling and variation: how to produce 50-100 variants per campaign, test hooks and calls-to-action systematically, and manage the creative library as it grows.`,
      category_id: catMap['ai-content-creation']?.id,
      tags: ['automation', 'video', 'content'],
      use_cases: ['marketing', 'video', 'automation'],
      difficulty: 'advanced',
      estimated_hours: 8,
      who_should_learn: 'Performance marketers, e-commerce brands, and agencies running paid social campaigns at scale.',
      why_it_matters: 'UGC ads outperform polished production ads by 2-4× in most categories. AI-generated UGC is indistinguishable from real UGC for digital ad delivery and converts at the same rate.',
      learning_steps: [
        { step: 1, title: 'Set up all tool accounts and APIs', description: 'ElevenLabs, HeyGen, n8n. Test each individually before connecting them.' },
        { step: 2, title: 'Write UGC script generation prompts', description: 'Create a prompt that generates diverse, conversational scripts for your product.' },
        { step: 3, title: 'Generate your first HeyGen avatar video', description: 'Create a video manually via HeyGen dashboard. Verify quality and avatar selection.' },
        { step: 4, title: 'Build the n8n orchestration workflow', description: 'Automate: script → HeyGen API call → wait for completion → download video.' },
        { step: 5, title: 'Produce and review a batch of 10 variants', description: 'Run the full pipeline. Review quality. Select best 3 for testing.' },
      ],
      practical_examples: ['Product testimonial video library for DTC e-commerce', 'SaaS feature demo videos for paid social', 'App review content for app install campaigns'],
      common_mistakes: ['Skipping the quality review step', 'Using the same avatar and voice for all variants (looks like the same person)', 'Not varying the script structure enough across variants', 'Generating in low quality to save credits on the first batch'],
      required_tool_slugs: ['heygen', 'elevenlabs', 'n8n'],
      related_tool_slugs: ['runway', 'chatgpt', 'claude'],
      related_model_slugs: ['gpt-4o', 'elevenlabs-turbo-v2-5'],
      related_skill_slugs: ['ai-voice-elevenlabs', 'ai-video-runway', 'automate-content-n8n'],
      status: 'published',
      source_urls: ['https://docs.heygen.com', 'https://elevenlabs.io/docs', 'https://docs.n8n.io'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 13. Use MCP with Claude ──────────────────────────────────────────────
    {
      title: 'Use MCP with Claude',
      slug: 'mcp-with-claude',
      short_description: 'Connect Claude to external tools and data sources using the Model Context Protocol for agentic workflows.',
      long_description: `MCP (Model Context Protocol) is an open standard from Anthropic that defines how AI models connect to external tools, data sources, and services in a standardized way. This skill teaches you to use MCP to extend Claude's capabilities — giving it access to your databases, APIs, file systems, and custom tools.

The core value: without MCP, connecting Claude to external tools requires custom code for every integration. MCP provides a standardized interface that makes Claude work with any MCP-compatible server the same way, dramatically reducing integration effort.

You'll set up Claude Desktop with MCP server integrations: the filesystem server (Claude reads and writes files on your computer), the database server (Claude queries your SQL database), the Brave Search server (Claude searches the web), and a custom MCP server you'll build for your specific use case.

Building an MCP server from scratch: you'll implement a simple MCP server in Node.js that exposes two tools — a "read document" tool and a "update record" tool. This gives you the pattern for any custom integration.

Practical use cases: Claude with filesystem access becomes a coding assistant that reads your actual project files; Claude with database access becomes an analytics assistant that queries your real data; Claude with a CRM MCP server becomes a sales assistant with live customer information.

The agentic workflow pattern: combining multiple MCP servers so Claude can research, retrieve data, write files, and take actions in a single conversation turn — all orchestrated by Claude without switching tools.

Security considerations: what MCP servers can and cannot do, how to restrict access, and the principle of least privilege when granting Claude tool access.`,
      category_id: catMap['ai-agents-mcp']?.id,
      tags: ['llm', 'api', 'coding', 'automation'],
      use_cases: ['coding', 'automation', 'business'],
      difficulty: 'advanced',
      estimated_hours: 6,
      who_should_learn: 'Developers building agentic AI applications who want standardized tool integration with Claude.',
      why_it_matters: 'MCP is the emerging standard for AI tool integration. Building on it now means your integrations will work with future models and tools, not just Claude today.',
      learning_steps: [
        { step: 1, title: 'Install Claude Desktop and enable MCP', description: 'Set up Claude Desktop. Enable MCP in settings. Connect the filesystem MCP server.' },
        { step: 2, title: 'Connect pre-built MCP servers', description: 'Add Brave Search, a Postgres MCP server, and the GitHub MCP server. Test each.' },
        { step: 3, title: 'Build a simple MCP server in Node.js', description: 'Implement an MCP server with two tools. Use the MCP SDK. Test with Claude Desktop.' },
        { step: 4, title: 'Build a multi-server agentic workflow', description: 'Give Claude access to filesystem + database + search. Build a research-and-write workflow.' },
        { step: 5, title: 'Apply security and permission controls', description: 'Review what each MCP server can access. Apply least-privilege restrictions.' },
      ],
      practical_examples: ['Claude reads your codebase and proposes specific code changes', 'Claude queries your database and produces a formatted report', 'Claude researches a topic, reads your existing docs, and writes a new article'],
      common_mistakes: ['Granting too broad filesystem access', 'Not testing MCP server tools individually before combining them', 'Building complex MCP servers before understanding the protocol', 'Forgetting that Claude still needs good prompts even with MCP access'],
      required_tool_slugs: ['claude'],
      related_tool_slugs: ['cursor', 'n8n'],
      related_model_slugs: ['claude-3-5-sonnet'],
      related_skill_slugs: ['build-first-ai-agent', 'prompt-engineering-basics'],
      status: 'published',
      source_urls: ['https://modelcontextprotocol.io', 'https://docs.anthropic.com/claude/docs/mcp'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 14. AI Tool Selection Framework ─────────────────────────────────────
    {
      title: 'AI Tool Selection Framework',
      slug: 'ai-tool-selection',
      short_description: 'Evaluate and choose the right AI tool for any task using a systematic framework.',
      long_description: `The AI tools landscape is overwhelming: hundreds of tools, overlapping capabilities, constant new releases, and wildly varying quality. This skill gives you a systematic framework for evaluating AI tools quickly and choosing the right one for each task — without wasting time on tools that don't fit.

The core framework has four dimensions: task fit (does the tool's capability actually solve your specific problem?), quality ceiling (what's the best output this tool can produce?), cost model (what does this cost at your usage volume?), and workflow integration (how easily does it fit into how you already work?).

Category heuristics: you'll learn the decision rules for each major AI category. For LLMs: when to use GPT-4o vs Claude 3.5 Sonnet vs Gemini 1.5 Pro, and when to downgrade to a cheaper model. For image generation: when Midjourney beats DALL-E and when to use FLUX.1. For automation: when n8n vs Make vs Zapier vs custom code.

Trial-and-error shortcut: instead of long evaluations, you'll learn to test a tool in 15 minutes with a representative sample of your actual use case. If it can't handle the sample well, it won't handle edge cases either.

Avoiding common traps: recency bias (new tool ≠ better tool), benchmark gaming (benchmarks don't predict your use case), and feature bloat (more features doesn't mean better for your task).

Building your personal AI stack: you'll map your recurring tasks, identify where you're spending AI-related time, and select the minimum set of tools that covers 90% of your needs without tool-switching overhead.

Decision documentation: keeping a lightweight record of tool decisions so your team doesn't repeat evaluations, and updating it as tools evolve.`,
      category_id: catMap['ai-for-business']?.id,
      tags: ['automation', 'no-code'],
      use_cases: ['business', 'research'],
      difficulty: 'beginner',
      estimated_hours: 2,
      who_should_learn: 'Anyone who uses AI tools regularly and wants a systematic way to decide which tool to use for each job.',
      why_it_matters: 'Using the wrong tool for a task is a consistent productivity tax. The right framework prevents tool switching fatigue and poor results from tool-task mismatch.',
      learning_steps: [
        { step: 1, title: 'Map your common AI tasks', description: 'List the 10 tasks you use AI for most frequently. Categorize by type.' },
        { step: 2, title: 'Apply the selection framework', description: 'For each category, use the four dimensions to shortlist tools.' },
        { step: 3, title: 'Run 15-minute tool trials', description: 'Test the top candidates with a real sample from your work.' },
        { step: 4, title: 'Build your personal AI stack', description: 'Select the minimum set of tools. Commit to them for 30 days.' },
        { step: 5, title: 'Document and share decisions', description: 'Record why you chose each tool so your team can skip re-evaluation.' },
      ],
      practical_examples: ['Choosing between ChatGPT and Claude for a content writing workflow', 'Evaluating n8n vs Make vs Zapier for a specific automation', 'Selecting an image generation tool for a marketing campaign'],
      common_mistakes: ['Choosing tools based on hype rather than task fit', 'Using too many tools (switching overhead)', 'Not re-evaluating when major new tools are released', 'Copying someone else\'s stack without considering your specific tasks'],
      required_tool_slugs: [],
      related_tool_slugs: ['chatgpt', 'claude', 'gemini', 'perplexity'],
      related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet'],
      related_skill_slugs: ['prompt-engineering-basics'],
      status: 'published',
      source_urls: [],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },

    // ── 15. Automate Customer Support with AI ────────────────────────────────
    {
      title: 'Automate Customer Support with AI',
      slug: 'automate-customer-support',
      short_description: 'Handle, triage, and respond to customer support tickets automatically using AI and automation tools.',
      long_description: `Customer support is one of the highest-ROI targets for AI automation: high volume, repetitive questions, clear success criteria, and immediate measurability. This skill teaches you to build a working AI customer support system that handles tier-1 tickets, escalates complex issues, and drafts responses for human review.

The architecture: incoming emails or tickets trigger an automation workflow (n8n or Make), which sends the message to Claude or GPT-4o for classification and response drafting, stores results in a database, and routes based on urgency and topic — all before a human sees the ticket.

Tier-1 automation: for simple, frequently asked questions (order status, return policy, basic product questions), the AI drafts responses that are automatically sent without human review. You'll learn how to identify which queries are safe to auto-respond to and how to implement confidence thresholds.

Tier-2 routing: for complex or sensitive issues, the AI classifies and routes to the right team with a drafted response for human review. This cuts first-response time dramatically while keeping humans in the loop for difficult cases.

Knowledge base integration: connecting your FAQ, documentation, and past resolved tickets as RAG context so the AI answers from your actual policies rather than general knowledge.

Quality control loop: how to review auto-responses, identify systematic errors, improve prompts, and update the knowledge base based on what the AI gets wrong.

Metrics and improvement: measuring AI support metrics (auto-resolution rate, response accuracy, escalation rate) and using them to continuously improve the system.`,
      category_id: catMap['ai-for-business']?.id ?? catMap['n8n-workflows']?.id,
      tags: ['automation', 'no-code', 'llm'],
      use_cases: ['automation', 'business', 'customer-support'],
      difficulty: 'intermediate',
      estimated_hours: 6,
      who_should_learn: 'Customer support managers, operations leads, and founders at companies receiving 50+ support tickets per week.',
      why_it_matters: 'AI support automation can handle 30-60% of tier-1 tickets automatically, reducing response time from hours to minutes and freeing agents for complex work.',
      learning_steps: [
        { step: 1, title: 'Audit your support ticket categories', description: 'Analyze 100 past tickets. Categorize by type and complexity. Identify automatable queries.' },
        { step: 2, title: 'Build the classification pipeline', description: 'Connect your support inbox to n8n. Use Claude to classify ticket type and urgency.' },
        { step: 3, title: 'Create the knowledge base', description: 'Build a RAG system from your FAQ, policies, and resolved ticket archive.' },
        { step: 4, title: 'Implement response drafting', description: 'For each category, build a prompt that generates accurate, brand-consistent responses.' },
        { step: 5, title: 'Set up review and quality control', description: 'Route auto-responses through human review initially. Measure accuracy. Automate gradually.' },
      ],
      practical_examples: ['E-commerce order status and returns automation', 'SaaS onboarding and technical support triage', 'Service business quote and scheduling inquiry handling'],
      common_mistakes: ['Automating too broadly too fast — start with simple, specific ticket types', 'Not maintaining the knowledge base (stale information causes wrong answers)', 'Missing the escalation path for urgent/angry customers', 'Not measuring quality — assuming it works without tracking accuracy'],
      required_tool_slugs: ['n8n', 'claude'],
      related_tool_slugs: ['make', 'zapier', 'chatgpt'],
      related_model_slugs: ['claude-3-5-haiku', 'gpt-4o-mini'],
      related_skill_slugs: ['build-rag-system', 'write-system-prompts', 'build-ai-chatbot-no-code'],
      status: 'published',
      source_urls: ['https://docs.n8n.io', 'https://docs.anthropic.com'],
      confidence_score: 1.0,
      ai_generated: false,
      published_at: now,
      last_reviewed_at: now,
    },
  ]

  console.log('Seeding skills...')
  const { error } = await supabase.from('skills').upsert(skills, { onConflict: 'slug' })
  if (error) { console.error('skills error:', error.message, error.details); process.exit(1) }
  console.log(`  ✓ ${skills.length} skills seeded`)
  console.log('\nDone.')
}

seed()
