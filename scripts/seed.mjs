import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── Categories ──────────────────────────────────────────────
const categories = [
  // Tool categories
  { name: 'AI Writing',          slug: 'ai-writing',          description: 'Tools for writing, editing, and content generation',    content_type: 'tool', icon: 'edit_note',       sort_order: 1 },
  { name: 'AI Coding',           slug: 'ai-coding',           description: 'Code assistants, debuggers, and dev tools',             content_type: 'tool', icon: 'code',            sort_order: 2 },
  { name: 'AI Image Generation', slug: 'ai-image-generation', description: 'Generate images from text prompts',                     content_type: 'tool', icon: 'image',           sort_order: 3 },
  { name: 'AI Video',            slug: 'ai-video',            description: 'Generate or edit video with AI',                        content_type: 'tool', icon: 'movie',           sort_order: 4 },
  { name: 'AI Audio & Voice',    slug: 'ai-audio-voice',      description: 'Text-to-speech, voice cloning, music generation',       content_type: 'tool', icon: 'mic',             sort_order: 5 },
  { name: 'AI Automation',       slug: 'ai-automation',       description: 'Workflow automation and AI agents',                     content_type: 'tool', icon: 'auto_mode',       sort_order: 6 },
  { name: 'AI Research',         slug: 'ai-research',         description: 'AI-powered research and knowledge tools',               content_type: 'tool', icon: 'search',          sort_order: 7 },
  { name: 'AI Productivity',     slug: 'ai-productivity',     description: 'Productivity, summarization, and meeting tools',        content_type: 'tool', icon: 'productivity',    sort_order: 8 },
  { name: 'AI Design',           slug: 'ai-design',           description: 'UI, graphic design, and creative tools',               content_type: 'tool', icon: 'brush',           sort_order: 9 },
  { name: 'AI Business',         slug: 'ai-business',         description: 'CRM, sales, marketing, and business automation',       content_type: 'tool', icon: 'business_center', sort_order: 10 },
  // Model categories
  { name: 'Large Language Models', slug: 'large-language-models', description: 'General-purpose text generation models',           content_type: 'model', icon: 'psychology',  sort_order: 1 },
  { name: 'Reasoning Models',      slug: 'reasoning-models',      description: 'Models optimized for step-by-step reasoning',      content_type: 'model', icon: 'calculate',   sort_order: 2 },
  { name: 'Image Generation',      slug: 'image-generation-models',description: 'Text-to-image models',                            content_type: 'model', icon: 'image',       sort_order: 3 },
  { name: 'Audio Models',          slug: 'audio-models',          description: 'Speech recognition and generation models',         content_type: 'model', icon: 'mic',         sort_order: 4 },
  { name: 'Embedding Models',      slug: 'embedding-models',      description: 'Vector embedding models for search and retrieval', content_type: 'model', icon: 'hub',         sort_order: 5 },
  { name: 'Coding Models',         slug: 'coding-models',         description: 'Models specialized for code generation',           content_type: 'model', icon: 'code',        sort_order: 6 },
  // Skill categories
  { name: 'Prompt Engineering', slug: 'prompt-engineering',  description: 'Writing effective prompts for AI models',              content_type: 'skill', icon: 'tune',         sort_order: 1 },
  { name: 'AI Workflows',       slug: 'ai-workflows',        description: 'Building automated workflows with AI',                 content_type: 'skill', icon: 'account_tree', sort_order: 2 },
  { name: 'AI for Business',    slug: 'ai-for-business',     description: 'Using AI in professional and business contexts',       content_type: 'skill', icon: 'business',     sort_order: 3 },
  { name: 'AI for Creators',    slug: 'ai-for-creators',     description: 'Using AI for content creation and design',            content_type: 'skill', icon: 'palette',      sort_order: 4 },
  { name: 'AI Development',     slug: 'ai-development',      description: 'Building apps and integrations with AI APIs',         content_type: 'skill', icon: 'terminal',     sort_order: 5 },
  { name: 'AI Research Skills', slug: 'ai-research-skills',  description: 'Using AI effectively for research and analysis',      content_type: 'skill', icon: 'lab_research', sort_order: 6 },
]

// ── Use Cases ────────────────────────────────────────────────
const use_cases = [
  { name: 'Writing',             slug: 'writing',          description: 'Creating written content of any kind' },
  { name: 'Coding',              slug: 'coding',           description: 'Writing, debugging, and reviewing code' },
  { name: 'Research',            slug: 'research',         description: 'Finding and synthesizing information' },
  { name: 'Automation',          slug: 'automation',       description: 'Automating repetitive tasks and workflows' },
  { name: 'Design',              slug: 'design',           description: 'Creating visual assets and UI' },
  { name: 'Video Production',    slug: 'video',            description: 'Creating or editing video content' },
  { name: 'Audio Production',    slug: 'audio',            description: 'Creating or editing audio content' },
  { name: 'Business Operations', slug: 'business',         description: 'Running and optimizing business processes' },
  { name: 'Customer Support',    slug: 'customer-support', description: 'Handling customer queries and support' },
  { name: 'Data Analysis',       slug: 'data-analysis',    description: 'Analyzing and visualizing data' },
  { name: 'Marketing',           slug: 'marketing',        description: 'Marketing content and campaigns' },
  { name: 'Education',           slug: 'education',        description: 'Learning and teaching with AI' },
  { name: 'AI Agents',           slug: 'ai-agents',        description: 'Building autonomous AI agents' },
]

// ── Tags ─────────────────────────────────────────────────────
const tags = [
  { name: 'llm',         slug: 'llm' },
  { name: 'multimodal',  slug: 'multimodal' },
  { name: 'open-source', slug: 'open-source' },
  { name: 'api',         slug: 'api' },
  { name: 'no-code',     slug: 'no-code' },
  { name: 'free',        slug: 'free' },
  { name: 'openai',      slug: 'openai' },
  { name: 'anthropic',   slug: 'anthropic' },
  { name: 'google',      slug: 'google' },
  { name: 'meta',        slug: 'meta' },
  { name: 'automation',  slug: 'automation' },
  { name: 'image-gen',   slug: 'image-gen' },
  { name: 'voice',       slug: 'voice' },
  { name: 'coding',      slug: 'coding' },
  { name: 'writing',     slug: 'writing' },
]

async function seed() {
  console.log('Seeding categories...')
  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' })
  if (catErr) { console.error('categories:', catErr.message); process.exit(1) }
  console.log(`  ✓ ${categories.length} categories`)

  console.log('Seeding use_cases...')
  const { error: ucErr } = await supabase.from('use_cases').upsert(use_cases, { onConflict: 'slug' })
  if (ucErr) { console.error('use_cases:', ucErr.message); process.exit(1) }
  console.log(`  ✓ ${use_cases.length} use cases`)

  console.log('Seeding tags...')
  const { error: tagErr } = await supabase.from('tags').upsert(tags, { onConflict: 'slug' })
  if (tagErr) { console.error('tags:', tagErr.message); process.exit(1) }
  console.log(`  ✓ ${tags.length} tags`)

  console.log('\nSeed complete.')
}

seed()
