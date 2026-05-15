import { createClient } from '@supabase/supabase-js'

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const learningPaths = [
  {
    title: 'Start Learning AI from Zero',
    slug: 'start-learning-ai-from-zero',
    short_description: 'Go from complete beginner to confident AI user in under 10 hours with hands-on practice.',
    long_description: `This learning path is designed for anyone who has heard about AI tools but doesn't know where to start. You don't need any technical background, coding skills, or prior experience with AI. By the end of this path, you'll be using AI tools confidently in your daily work and personal projects.

You'll start by understanding what AI actually is — stripping away the hype and focusing on what these tools can and cannot do. Then you'll get hands-on with the most important AI tool of today: ChatGPT. You'll learn how to write prompts that actually work, how to avoid the most common mistakes beginners make, and how to get consistent, high-quality results.

From there, you'll explore the broader AI landscape. You'll learn what makes Claude, Gemini, and Perplexity different from ChatGPT, and when to use each. You'll discover AI tools for images, voice, and automation, so you have a complete picture of what's available.

By the end, you'll be able to answer the question "What AI tool should I use for this?" on your own. You'll have a working vocabulary for AI concepts, a practical sense of what AI is good at and where it fails, and real confidence from having actually built things with these tools.

This path takes approximately 8 hours to complete and requires no paid subscriptions — everything can be done with free tiers.`,
    goal: 'Build foundational AI literacy and hands-on confidence across the core AI tools.',
    who_its_for: 'Complete beginners with no AI experience — students, professionals, or anyone curious about AI tools.',
    required_skill_level: 'beginner',
    estimated_hours: 8,
    modules: [
      {
        module: 1,
        title: 'What Is AI and How Does It Work?',
        description: 'Understand what large language models are, how they generate responses, and what their real limitations are. No jargon.',
        skills: ['prompt-engineering-basics'],
        tools: [],
        duration_hours: 1
      },
      {
        module: 2,
        title: 'Your First AI Tool: ChatGPT',
        description: 'Get hands-on with ChatGPT. Learn to write effective prompts, understand context windows, and avoid hallucinations.',
        skills: ['prompt-engineering-basics'],
        tools: ['chatgpt'],
        duration_hours: 2
      },
      {
        module: 3,
        title: 'The AI Tool Landscape',
        description: 'Explore Claude, Gemini, and Perplexity. Understand when each one outperforms the others.',
        skills: ['ai-tool-selection'],
        tools: ['claude', 'gemini', 'perplexity'],
        duration_hours: 2
      },
      {
        module: 4,
        title: 'AI Beyond Text: Images, Voice, and Video',
        description: 'Try AI image generation with DALL-E 3, voice with ElevenLabs, and discover what\'s possible across modalities.',
        skills: ['ai-image-midjourney'],
        tools: ['dall-e-3', 'elevenlabs'],
        duration_hours: 2
      },
      {
        module: 5,
        title: 'Build Your First Real AI Project',
        description: 'Apply what you\'ve learned by completing a small project: write, refine, and publish something with AI assistance.',
        skills: ['prompt-engineering-basics', 'write-system-prompts'],
        tools: ['chatgpt', 'claude'],
        duration_hours: 1
      }
    ],
    practice_tasks: [
      'Write 5 different prompts for the same task and compare results',
      'Ask ChatGPT to explain a concept you care about, then fact-check one claim',
      'Generate an image with DALL-E 3 using progressively more specific prompts',
      'Use Perplexity to research a topic and compare to a regular Google search',
      'Write a system prompt for a custom AI assistant for your job or hobby'
    ],
    mini_projects: [
      'Create a personal AI prompt library with 10 prompts you\'ll actually use',
      'Write a short blog post or email entirely with AI assistance and refine it to sound like you'
    ],
    completion_checklist: [
      'Understand what LLMs are and what they cannot do',
      'Written and tested at least 20 prompts across different tools',
      'Tried ChatGPT, Claude, Gemini, and Perplexity',
      'Generated an AI image',
      'Generated AI voice or explored a voice tool',
      'Completed one small project using AI'
    ],
    related_tool_slugs: ['chatgpt', 'claude', 'gemini', 'perplexity', 'dall-e-3', 'elevenlabs'],
    related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'gemini-1-5-pro'],
    related_skill_slugs: ['prompt-engineering-basics', 'write-system-prompts', 'ai-tool-selection'],
    status: 'published',
    published_at: '2026-05-15T00:00:00Z'
  },

  {
    title: 'AI for Business Owners',
    slug: 'ai-for-business',
    short_description: 'Apply AI to marketing, operations, customer support, and content to save hours every week.',
    long_description: `This learning path is built for business owners, founders, and managers who want to use AI to run their business more efficiently — not for learning AI theory, but for getting real results fast.

You'll start with the highest-ROI use case for most businesses: content and communication. You'll learn how to use Claude and ChatGPT to draft emails, proposals, social media posts, and marketing copy in a fraction of the time it used to take. You'll also learn how to train AI to sound like your brand — not like generic AI output.

Next, you'll tackle customer support automation. You'll build a simple AI-powered FAQ chatbot that can handle common questions without human intervention, using n8n or Make to connect it to your existing tools. You'll learn how to set escalation rules so the AI knows when to hand off to a human.

You'll then move into operational automation — using Zapier, Make, or n8n to connect your tools and eliminate manual data entry, status update messages, and repetitive admin tasks. By the end, you'll have at least two real automations running in your business.

Finally, you'll learn how to evaluate AI tools for business ROI: how to estimate time savings, avoid vendor lock-in, and build workflows that your whole team can use — not just technical staff.

This path requires no coding knowledge. All automations are built visually with no-code tools.`,
    goal: 'Save 5+ hours per week by applying AI to content, customer support, and business operations.',
    who_its_for: 'Business owners, founders, and managers who want to apply AI practically without a technical team.',
    required_skill_level: 'beginner',
    estimated_hours: 12,
    modules: [
      {
        module: 1,
        title: 'AI for Writing and Communication',
        description: 'Use Claude and ChatGPT to write emails, proposals, and marketing copy faster. Learn to make AI write in your voice.',
        skills: ['claude-business-automation', 'write-system-prompts'],
        tools: ['claude', 'chatgpt'],
        duration_hours: 2
      },
      {
        module: 2,
        title: 'AI for Customer Support',
        description: 'Build an AI assistant that handles common customer questions. Set escalation rules and connect to your helpdesk.',
        skills: ['automate-customer-support'],
        tools: ['chatgpt', 'n8n'],
        duration_hours: 3
      },
      {
        module: 3,
        title: 'Operational Automation with No-Code AI',
        description: 'Use n8n or Make to build automations that eliminate repetitive manual work across your business tools.',
        skills: ['automate-content-n8n'],
        tools: ['n8n', 'make', 'zapier'],
        duration_hours: 4
      },
      {
        module: 4,
        title: 'AI Tool Selection for Business',
        description: 'Evaluate AI tools by ROI. Avoid common mistakes. Build a team-ready AI policy for your business.',
        skills: ['ai-tool-selection'],
        tools: ['perplexity'],
        duration_hours: 2
      },
      {
        module: 5,
        title: 'Putting It All Together',
        description: 'Build a complete AI-powered workflow that saves your business at least 3 hours per week.',
        skills: ['claude-business-automation', 'automate-customer-support'],
        tools: ['claude', 'n8n'],
        duration_hours: 1
      }
    ],
    practice_tasks: [
      'Rewrite your most-sent email template using AI and test which version gets better responses',
      'List your top 10 most common customer questions and write AI responses for each',
      'Map one repetitive task in your business and design an automation for it',
      'Use Perplexity to research a competitor and generate a competitive analysis report',
      'Write a system prompt that makes Claude respond exactly like your brand voice'
    ],
    mini_projects: [
      'Build a customer FAQ chatbot connected to your website or email',
      'Create a weekly content calendar automation that generates social posts from a topic list'
    ],
    completion_checklist: [
      'Using AI daily for at least one business writing task',
      'Built and tested a customer support AI response system',
      'Have at least one live automation saving time each week',
      'Created a brand voice system prompt that teammates can use',
      'Estimated ROI of AI time savings for your business'
    ],
    related_tool_slugs: ['claude', 'chatgpt', 'n8n', 'make', 'zapier', 'perplexity'],
    related_model_slugs: ['claude-3-5-sonnet', 'gpt-4o', 'gpt-4o-mini'],
    related_skill_slugs: ['claude-business-automation', 'automate-customer-support', 'automate-content-n8n', 'ai-tool-selection', 'write-system-prompts'],
    status: 'published',
    published_at: '2026-05-15T00:00:00Z'
  },

  {
    title: 'AI for Content Creators',
    slug: 'ai-for-creators',
    short_description: 'Use AI to create videos, images, voiceovers, and written content faster without losing your creative voice.',
    long_description: `This learning path is for content creators — YouTubers, podcasters, social media creators, writers, and designers — who want to use AI to produce better content faster while staying authentic.

You'll begin by learning how to use AI as a creative thinking partner, not a replacement for your creativity. You'll use ChatGPT and Claude to generate ideas, develop concepts, and overcome creative blocks while keeping everything grounded in your unique voice and perspective.

Next, you'll dive into visual content creation. You'll learn how to use Midjourney for stunning images, how to write prompts that produce consistent styles, and how to use Canva AI to turn those images into polished social media content without a design team.

You'll then explore AI video and voice. You'll learn how to use Runway or Kling for AI video generation, how ElevenLabs can create consistent voiceovers for your content, and how HeyGen can turn a script into a video with an AI avatar — useful for faceless channels or multilingual content.

The final section covers content automation: building systems with n8n that take your core ideas and multiply them across platforms. You'll build a workflow that turns one YouTube video script into Instagram captions, tweets, a newsletter excerpt, and LinkedIn posts automatically.

By the end of this path, you'll have a personal AI content production system that handles the repetitive parts of content creation so you can focus on the creative parts only you can do.`,
    goal: 'Build a personal AI content production system that multiplies your output without sacrificing quality.',
    who_its_for: 'Content creators across YouTube, social media, podcasting, blogging, and design who want to scale their output.',
    required_skill_level: 'beginner',
    estimated_hours: 15,
    modules: [
      {
        module: 1,
        title: 'AI as Your Creative Partner',
        description: 'Use ChatGPT and Claude for ideation, scripting, and overcoming creative blocks. Keep your voice, amplify your output.',
        skills: ['prompt-engineering-basics', 'write-system-prompts'],
        tools: ['chatgpt', 'claude'],
        duration_hours: 2
      },
      {
        module: 2,
        title: 'AI Image Creation for Content',
        description: 'Generate consistent, high-quality images with Midjourney and Canva AI for thumbnails, social posts, and branding.',
        skills: ['ai-image-midjourney'],
        tools: ['midjourney', 'canva-ai', 'dall-e-3'],
        duration_hours: 3
      },
      {
        module: 3,
        title: 'AI Video and Voice Generation',
        description: 'Create AI voiceovers with ElevenLabs, AI videos with Runway or Kling, and AI avatars with HeyGen.',
        skills: ['ai-voice-elevenlabs', 'ai-video-runway'],
        tools: ['elevenlabs', 'runway', 'kling', 'heygen'],
        duration_hours: 4
      },
      {
        module: 4,
        title: 'Content Repurposing Automation',
        description: 'Build an n8n workflow that turns one piece of content into posts for multiple platforms automatically.',
        skills: ['automate-content-n8n'],
        tools: ['n8n', 'chatgpt'],
        duration_hours: 4
      },
      {
        module: 5,
        title: 'Your Personal Content Production System',
        description: 'Put it all together: a repeatable weekly content production system powered by AI from idea to published.',
        skills: ['automate-content-n8n', 'ugc-automation-pipeline'],
        tools: ['n8n', 'claude', 'elevenlabs'],
        duration_hours: 2
      }
    ],
    practice_tasks: [
      'Generate 20 video or post ideas in your niche using AI and refine the best 3',
      'Create a consistent image style with Midjourney using a style reference prompt',
      'Generate a 60-second voiceover with ElevenLabs using your own cloned voice',
      'Script, shoot (or generate), and publish one piece of AI-assisted content',
      'Build a simple content repurposing workflow in n8n'
    ],
    mini_projects: [
      'Create a complete YouTube video (or equivalent) using AI for scripting, thumbnail, and voiceover',
      'Build an automated content repurposing pipeline for your main platform'
    ],
    completion_checklist: [
      'Used AI for ideation and scripting on a real piece of content',
      'Created at least 5 high-quality images with Midjourney or DALL-E 3',
      'Generated an AI voiceover with ElevenLabs',
      'Created or experimented with AI video generation',
      'Built at least one automation for content repurposing',
      'Published content made with AI tools'
    ],
    related_tool_slugs: ['chatgpt', 'claude', 'midjourney', 'canva-ai', 'elevenlabs', 'runway', 'kling', 'heygen', 'n8n'],
    related_model_slugs: ['gpt-4o', 'claude-3-5-sonnet', 'flux-1', 'elevenlabs-turbo-v2-5'],
    related_skill_slugs: ['prompt-engineering-basics', 'ai-image-midjourney', 'ai-voice-elevenlabs', 'ai-video-runway', 'automate-content-n8n', 'ugc-automation-pipeline'],
    status: 'published',
    published_at: '2026-05-15T00:00:00Z'
  },

  {
    title: 'AI Automation with n8n',
    slug: 'ai-automation-n8n',
    short_description: 'Build powerful AI-powered workflows with n8n to automate repetitive tasks across all your business tools.',
    long_description: `This learning path teaches you how to build real, production-ready AI automations using n8n — the most powerful open-source workflow automation tool available today. You'll go from installing n8n to shipping automations that save hours of manual work every week.

n8n is different from simpler tools like Zapier or Make because it lets you embed AI at every step of your workflow — not just as a connector, but as a decision-maker, content generator, and data transformer. This path focuses on that AI-native approach to automation.

You'll start with n8n fundamentals: setting up your instance, understanding the node-based interface, and building your first simple workflow. Even if you've never used automation tools before, you'll be running workflows within the first hour.

Then you'll integrate AI models. You'll connect ChatGPT and Claude into your n8n workflows using their APIs, and learn how to use them for tasks like summarizing emails, classifying support tickets, generating social posts from RSS feeds, and extracting structured data from unstructured text.

The intermediate section covers building multi-step AI agents inside n8n — workflows that can make decisions, handle errors, and loop through large datasets. You'll build a complete content automation pipeline and a customer support triage system.

Advanced topics include using webhooks to trigger workflows from external apps, building scheduled AI agents that run autonomously, and setting up monitoring so you know when something breaks.

By the end, you'll have 3–5 production automations running and the skills to build any AI workflow you can imagine.`,
    goal: 'Ship 3+ production AI automations in n8n that run reliably and save real time each week.',
    who_its_for: 'Operators, marketers, developers, and founders who want to automate AI-powered workflows without complex infrastructure.',
    required_skill_level: 'intermediate',
    estimated_hours: 20,
    modules: [
      {
        module: 1,
        title: 'n8n Foundations',
        description: 'Install n8n (cloud or self-hosted), understand the interface, and build your first trigger-action workflow.',
        skills: ['automate-content-n8n'],
        tools: ['n8n'],
        duration_hours: 3
      },
      {
        module: 2,
        title: 'Connecting AI Models to n8n',
        description: 'Add ChatGPT and Claude API nodes. Build your first AI-powered workflow: email summarizer or social post generator.',
        skills: ['automate-content-n8n', 'prompt-engineering-basics'],
        tools: ['n8n', 'chatgpt', 'claude'],
        duration_hours: 4
      },
      {
        module: 3,
        title: 'Multi-Step AI Workflows',
        description: 'Build workflows with conditional logic, error handling, and loops. Create a content pipeline from RSS to social posts.',
        skills: ['automate-content-n8n'],
        tools: ['n8n'],
        duration_hours: 5
      },
      {
        module: 4,
        title: 'AI Agents in n8n',
        description: 'Build autonomous AI agents that can search the web, query databases, and make multi-step decisions using n8n\'s AI Agent node.',
        skills: ['build-first-ai-agent', 'automate-customer-support'],
        tools: ['n8n', 'claude'],
        duration_hours: 5
      },
      {
        module: 5,
        title: 'Production Automations',
        description: 'Set up webhooks, scheduled runs, error notifications, and monitoring. Deploy your automations to production.',
        skills: ['automate-content-n8n'],
        tools: ['n8n'],
        duration_hours: 3
      }
    ],
    practice_tasks: [
      'Build a workflow that monitors a Gmail inbox and uses AI to classify and summarize emails',
      'Create an automation that posts AI-generated social content from an RSS feed',
      'Build a Slack bot powered by Claude that answers questions from a knowledge base',
      'Set up error handling and Slack notifications for a critical workflow',
      'Build an AI agent that can perform web research and generate a report'
    ],
    mini_projects: [
      'Build a complete content repurposing pipeline: input a URL, get back Twitter/LinkedIn/newsletter versions',
      'Create a customer support triage system that classifies tickets and generates draft replies'
    ],
    completion_checklist: [
      'n8n instance running (cloud or self-hosted)',
      'Connected ChatGPT and Claude APIs to n8n',
      'Built and tested at least 3 complete workflows',
      'Have at least one scheduled workflow running automatically',
      'Set up error notifications for at least one critical workflow',
      'Shipped a production automation used in real work'
    ],
    related_tool_slugs: ['n8n', 'chatgpt', 'claude', 'make', 'zapier'],
    related_model_slugs: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-haiku'],
    related_skill_slugs: ['automate-content-n8n', 'build-first-ai-agent', 'automate-customer-support', 'prompt-engineering-basics'],
    status: 'published',
    published_at: '2026-05-15T00:00:00Z'
  },

  {
    title: 'Build Your First AI Agent',
    slug: 'build-first-ai-agent',
    short_description: 'Design, build, and deploy an autonomous AI agent that can take actions and complete multi-step tasks on its own.',
    long_description: `This learning path teaches you how to build real AI agents — not chatbots, but autonomous systems that can plan, take actions, use tools, and complete multi-step tasks with minimal human intervention. This is the frontier of practical AI development in 2025 and 2026.

You'll start by understanding what makes an AI agent different from a standard chatbot. Agents have goals, can use tools (web search, code execution, database queries, API calls), maintain memory across steps, and can recover from errors. Understanding this architecture is the foundation for everything else.

You'll then build your first agent using the simplest possible approach: a Claude agent with tool use via the Anthropic API. You'll give it web search, a calculator, and file-writing capabilities and watch it reason through multi-step problems on its own.

Next, you'll explore MCP (Model Context Protocol) — Anthropic's open standard for connecting AI models to external data sources and tools. You'll configure Claude Desktop to use MCP servers, giving it access to your filesystem, databases, and web tools. This is the new standard for AI agent tooling.

You'll then move to n8n's AI Agent node for no-code/low-code agent building — building agents that can query APIs, send emails, update spreadsheets, and execute conditional logic based on AI decisions.

The advanced section covers multi-agent systems: orchestrating multiple specialized agents that work together on complex tasks. You'll build a research-and-writing pipeline where one agent searches and collects, another synthesizes, and a third formats and publishes.

By the end, you'll understand the full agent stack and have built at least one production agent of your own.`,
    goal: 'Build, deploy, and iterate on a real AI agent that completes multi-step tasks autonomously.',
    who_its_for: 'Developers, technical founders, and power users who want to go beyond chat and build agents that actually do things.',
    required_skill_level: 'intermediate',
    estimated_hours: 18,
    modules: [
      {
        module: 1,
        title: 'What Is an AI Agent?',
        description: 'Understand the agent architecture: goals, tools, memory, and action loops. See what separates agents from chatbots.',
        skills: ['build-first-ai-agent'],
        tools: ['claude', 'chatgpt'],
        duration_hours: 2
      },
      {
        module: 2,
        title: 'Build an Agent with Claude API',
        description: 'Use the Anthropic API with tool use to build an agent that can search the web, run code, and write files.',
        skills: ['build-first-ai-agent', 'prompt-engineering-basics'],
        tools: ['claude', 'replit'],
        duration_hours: 4
      },
      {
        module: 3,
        title: 'MCP: Model Context Protocol',
        description: 'Configure MCP servers for Claude Desktop. Connect your AI to filesystem, databases, GitHub, and web tools.',
        skills: ['mcp-with-claude'],
        tools: ['claude'],
        duration_hours: 4
      },
      {
        module: 4,
        title: 'No-Code Agents with n8n',
        description: 'Build powerful agents using n8n\'s AI Agent node — no API coding required. Connect to real business tools.',
        skills: ['build-first-ai-agent', 'automate-content-n8n'],
        tools: ['n8n', 'claude'],
        duration_hours: 4
      },
      {
        module: 5,
        title: 'Multi-Agent Systems',
        description: 'Orchestrate multiple specialized agents working together on complex tasks. Build a research-to-publication pipeline.',
        skills: ['build-first-ai-agent', 'build-rag-system'],
        tools: ['claude', 'n8n', 'perplexity'],
        duration_hours: 4
      }
    ],
    practice_tasks: [
      'Build an agent that can answer questions about a PDF document by reading and reasoning over it',
      'Create an agent that monitors a website for changes and summarizes what changed',
      'Configure at least 3 MCP servers in Claude Desktop and test each one',
      'Build an n8n agent that can book meetings by reading your calendar and emails',
      'Design and build a two-agent pipeline where agents hand off work between each other'
    ],
    mini_projects: [
      'Build a personal research agent that finds, reads, and summarizes relevant articles on any topic you give it',
      'Create a business agent that monitors your inbox, classifies inquiries, and drafts reply templates automatically'
    ],
    completion_checklist: [
      'Understand the difference between a chatbot and an AI agent architecturally',
      'Built an agent using Claude API with at least 2 tools (web search + one other)',
      'Configured and used at least 2 MCP servers in Claude Desktop',
      'Built a working agent in n8n without coding',
      'Designed a multi-agent workflow (even if simple)',
      'Shipped an agent that runs on a real task you care about'
    ],
    related_tool_slugs: ['claude', 'chatgpt', 'n8n', 'replit', 'cursor', 'perplexity'],
    related_model_slugs: ['claude-3-5-sonnet', 'gpt-4o', 'claude-3-5-haiku'],
    related_skill_slugs: ['build-first-ai-agent', 'mcp-with-claude', 'build-rag-system', 'automate-content-n8n', 'prompt-engineering-basics'],
    status: 'published',
    published_at: '2026-05-15T00:00:00Z'
  }
]

async function seed() {
  console.log('Seeding learning paths...')
  const { error } = await supabase
    .from('learning_paths')
    .upsert(learningPaths, { onConflict: 'slug' })
  if (error) { console.error('learning_paths error:', error.message); process.exit(1) }
  console.log(`  ✓ ${learningPaths.length} learning paths upserted`)
  console.log('\nDone.')
}

seed()
