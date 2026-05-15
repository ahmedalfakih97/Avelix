import { createClient } from '@supabase/supabase-js'

const url = 'https://hgloedsnmpntnohvxhie.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const categories = [
  // Tool categories (new ones not in Agent 02 seed)
  { name: 'AI Chatbots',           slug: 'ai-chatbots',           content_type: 'tool', icon: 'chat',           sort_order: 1 },
  { name: 'AI Research Tools',     slug: 'ai-research-tools',     content_type: 'tool', icon: 'travel_explore',  sort_order: 2 },
  { name: 'AI Image Tools',        slug: 'ai-image-tools',        content_type: 'tool', icon: 'image',           sort_order: 3 },
  { name: 'AI Video Tools',        slug: 'ai-video-tools',        content_type: 'tool', icon: 'movie',           sort_order: 4 },
  { name: 'AI Voice Tools',        slug: 'ai-voice-tools',        content_type: 'tool', icon: 'mic',             sort_order: 5 },
  { name: 'AI Avatar Tools',       slug: 'ai-avatar-tools',       content_type: 'tool', icon: 'face',            sort_order: 6 },
  { name: 'AI Automation Tools',   slug: 'ai-automation-tools',   content_type: 'tool', icon: 'settings_suggest', sort_order: 7 },
  { name: 'AI Agent Builders',     slug: 'ai-agent-builders',     content_type: 'tool', icon: 'smart_toy',       sort_order: 8 },
  { name: 'AI Coding Tools',       slug: 'ai-coding-tools',       content_type: 'tool', icon: 'code',            sort_order: 9 },
  { name: 'AI Design Tools',       slug: 'ai-design-tools',       content_type: 'tool', icon: 'brush',           sort_order: 10 },
  { name: 'AI Presentation Tools', slug: 'ai-presentation-tools', content_type: 'tool', icon: 'present_to_all',  sort_order: 11 },
  { name: 'AI Meeting Tools',      slug: 'ai-meeting-tools',      content_type: 'tool', icon: 'groups',          sort_order: 12 },
  { name: 'AI Marketing Tools',    slug: 'ai-marketing-tools',    content_type: 'tool', icon: 'campaign',        sort_order: 13 },
  { name: 'AI Data Analysis Tools',slug: 'ai-data-analysis-tools',content_type: 'tool', icon: 'bar_chart',       sort_order: 14 },
  { name: 'AI UGC Tools',          slug: 'ai-ugc-tools',          content_type: 'tool', icon: 'videocam',        sort_order: 15 },
  { name: 'AI Writing Tools',      slug: 'ai-writing-tools',      content_type: 'tool', icon: 'edit_note',       sort_order: 16 },

  // Model categories (new)
  { name: 'Multimodal Models',        slug: 'multimodal-models',     content_type: 'model', icon: 'auto_awesome', sort_order: 3 },
  { name: 'Video Generation Models',  slug: 'video-models',          content_type: 'model', icon: 'movie',        sort_order: 5 },
  { name: 'Open-Source Models',       slug: 'open-source-models',    content_type: 'model', icon: 'open_in_new',  sort_order: 7 },
  { name: 'Local Models',             slug: 'local-models',          content_type: 'model', icon: 'computer',     sort_order: 10 },

  // Skill categories (new)
  { name: 'AI Content Creation', slug: 'ai-content-creation', content_type: 'skill', icon: 'edit',          sort_order: 2 },
  { name: 'AI Agents & MCP',     slug: 'ai-agents-mcp',       content_type: 'skill', icon: 'hub',           sort_order: 5 },
  { name: 'AI for Developers',   slug: 'ai-for-developers',   content_type: 'skill', icon: 'terminal',      sort_order: 7 },
  { name: 'AI Image Generation', slug: 'ai-image-generation', content_type: 'skill', icon: 'image',         sort_order: 9 },
  { name: 'AI Video Generation', slug: 'ai-video-generation', content_type: 'skill', icon: 'movie',         sort_order: 10 },
  { name: 'AI Voice & Avatars',  slug: 'ai-voice-avatars',    content_type: 'skill', icon: 'mic',           sort_order: 11 },
  { name: 'n8n Workflows',       slug: 'n8n-workflows',       content_type: 'skill', icon: 'account_tree',  sort_order: 12 },
  { name: 'RAG & Embeddings',    slug: 'rag-embeddings',      content_type: 'skill', icon: 'database',      sort_order: 13 },
]

async function seed() {
  console.log('Seeding extra categories...')
  const { error } = await supabase.from('categories').upsert(categories, { onConflict: 'slug', ignoreDuplicates: true })
  if (error) { console.error('categories error:', error.message); process.exit(1) }
  console.log(`  ✓ ${categories.length} categories upserted`)
  console.log('\nDone.')
}

seed()
