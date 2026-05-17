import type { Tables } from '@/types/database'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApprovalQueueItem = Tables<'approval_queue'>
export type ChangelogEntry   = Tables<'changelogs'>

export interface AdminStats {
  tools:  { published: number; pending: number; draft: number; total: number }
  models: { published: number; pending: number; draft: number; total: number }
  skills: { published: number; pending: number; draft: number; total: number }
  queue:  { pending: number; total: number }
  lastSync: string | null
}

export interface Source {
  id: string
  name: string
  url: string
  type: string
  trust_score: number
  last_checked: string | null
  active: boolean
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATS: AdminStats = {
  tools:  { published: 8, pending: 3, draft: 2, total: 13 },
  models: { published: 6, pending: 1, draft: 0, total: 7  },
  skills: { published: 5, pending: 2, draft: 1, total: 8  },
  queue:  { pending: 4, total: 12 },
  lastSync: new Date(Date.now() - 3600_000 * 6).toISOString(),
}

const MOCK_QUEUE: ApprovalQueueItem[] = [
  {
    id: 'q1',
    content_type: 'tool',
    content_id: 'tool-elevenlabs',
    content_slug: 'elevenlabs',
    content_title: 'ElevenLabs',
    action: 'update',
    source_url: 'https://blog.elevenlabs.io/creator-plan',
    ai_confidence: 89,
    summary_of_changes: 'New pricing tier: Creator Plan at $22/month. API rate limits increased to 10,000 chars/request.',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600_000 * 2).toISOString(),
    reviewed_by: null,
    reviewed_at: null,
    decision: null,
    review_notes: null,
  },
  {
    id: 'q2',
    content_type: 'model',
    content_id: 'model-gemini-15-pro',
    content_slug: 'gemini-1-5-pro',
    content_title: 'Gemini 1.5 Pro',
    action: 'create',
    source_url: 'https://blog.google/technology/ai/gemini-1-5-pro',
    ai_confidence: 94,
    summary_of_changes: 'New model launched: Gemini 1.5 Pro with 1M token context window. Multimodal capabilities including video understanding.',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600_000 * 5).toISOString(),
    reviewed_by: null,
    reviewed_at: null,
    decision: null,
    review_notes: null,
  },
  {
    id: 'q3',
    content_type: 'tool',
    content_id: 'tool-cursor',
    content_slug: 'cursor',
    content_title: 'Cursor',
    action: 'update',
    source_url: 'https://cursor.sh/changelog',
    ai_confidence: 76,
    summary_of_changes: 'Added Claude-3.5-Sonnet as default model. Background agents feature now in beta.',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600_000 * 8).toISOString(),
    reviewed_by: null,
    reviewed_at: null,
    decision: null,
    review_notes: null,
  },
  {
    id: 'q4',
    content_type: 'skill',
    content_id: 'skill-prompt-eng',
    content_slug: 'prompt-engineering',
    content_title: 'Prompt Engineering',
    action: 'update',
    source_url: 'https://anthropic.com/research/prompt-engineering',
    ai_confidence: 91,
    summary_of_changes: 'Added chain-of-thought prompting section and updated examples for Claude 3 models.',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600_000 * 12).toISOString(),
    reviewed_by: null,
    reviewed_at: null,
    decision: null,
    review_notes: null,
  },
  {
    id: 'q5',
    content_type: 'tool',
    content_id: 'tool-midjourney',
    content_slug: 'midjourney',
    content_title: 'Midjourney',
    action: 'update',
    source_url: 'https://docs.midjourney.com/v7',
    ai_confidence: 85,
    summary_of_changes: 'Version 7 released with improved realism and new style reference parameter.',
    status: 'approved',
    submitted_at: new Date(Date.now() - 3600_000 * 24).toISOString(),
    reviewed_by: 'admin',
    reviewed_at: new Date(Date.now() - 3600_000 * 20).toISOString(),
    decision: 'approved',
    review_notes: null,
  },
  {
    id: 'q6',
    content_type: 'tool',
    content_id: 'tool-xxx',
    content_slug: 'some-random-tool',
    content_title: 'SomeRandomTool',
    action: 'create',
    source_url: null,
    ai_confidence: 45,
    summary_of_changes: 'Unknown tool detected from newsletter mention. Low confidence — no official source found.',
    status: 'rejected',
    submitted_at: new Date(Date.now() - 3600_000 * 30).toISOString(),
    reviewed_by: 'admin',
    reviewed_at: new Date(Date.now() - 3600_000 * 28).toISOString(),
    decision: 'rejected',
    review_notes: 'Cannot verify — no official source or product page found.',
  },
]

const MOCK_CHANGELOGS: ChangelogEntry[] = [
  { id: 'ch1', content_type: 'tool',  content_id: 'tool-runway',    content_slug: 'runway',           change_type: 'pricing',  description: 'New pricing tier added — Gen-3 Alpha at $35/month',              source_url: null, changed_at: new Date(Date.now() - 3600_000 * 2).toISOString() },
  { id: 'ch2', content_type: 'model', content_id: 'model-claude',   content_slug: 'claude',           change_type: 'new_model',description: 'Claude 3.5 Haiku detected from Anthropic release notes',         source_url: null, changed_at: new Date(Date.now() - 3600_000 * 5).toISOString() },
  { id: 'ch3', content_type: 'tool',  content_id: 'tool-n8n',       content_slug: 'n8n',              change_type: 'feature',  description: 'AI Agent node added to n8n workflow builder',                    source_url: null, changed_at: new Date(Date.now() - 3600_000 * 9).toISOString() },
  { id: 'ch4', content_type: 'tool',  content_id: 'tool-perplexity',content_slug: 'perplexity-ai',   change_type: 'feature',  description: 'Perplexity Pro now includes Deep Research mode',                 source_url: null, changed_at: new Date(Date.now() - 3600_000 * 14).toISOString() },
  { id: 'ch5', content_type: 'skill', content_id: 'skill-rag',      content_slug: 'rag-pipelines',   change_type: 'content',  description: 'RAG Pipelines skill updated with LangGraph examples',            source_url: null, changed_at: new Date(Date.now() - 3600_000 * 20).toISOString() },
  { id: 'ch6', content_type: 'model', content_id: 'model-gpt4o',    content_slug: 'gpt-4o',          change_type: 'pricing',  description: 'GPT-4o pricing reduced by 50% — now $5/1M input tokens',        source_url: null, changed_at: new Date(Date.now() - 3600_000 * 26).toISOString() },
  { id: 'ch7', content_type: 'tool',  content_id: 'tool-chatgpt',   content_slug: 'chatgpt',         change_type: 'feature',  description: 'ChatGPT Canvas mode now available to all Plus users',           source_url: null, changed_at: new Date(Date.now() - 3600_000 * 32).toISOString() },
  { id: 'ch8', content_type: 'tool',  content_id: 'tool-cursor',    content_slug: 'cursor',           change_type: 'feature',  description: 'Cursor background agents now in private beta',                  source_url: null, changed_at: new Date(Date.now() - 3600_000 * 38).toISOString() },
]

export const MOCK_SOURCES: Source[] = [
  { id: 's1', name: 'OpenAI Blog',        url: 'https://openai.com/blog',           type: 'official_blog',      trust_score: 1.0,  last_checked: new Date(Date.now() - 3600_000 * 6).toISOString(),   active: true  },
  { id: 's2', name: 'Anthropic Research', url: 'https://anthropic.com/research',    type: 'official_blog',      trust_score: 1.0,  last_checked: new Date(Date.now() - 3600_000 * 6).toISOString(),   active: true  },
  { id: 's3', name: 'Google AI Blog',     url: 'https://ai.googleblog.com',         type: 'official_blog',      trust_score: 0.95, last_checked: new Date(Date.now() - 3600_000 * 6).toISOString(),   active: true  },
  { id: 's4', name: 'HuggingFace Hub',    url: 'https://huggingface.co',            type: 'huggingface',        trust_score: 0.90, last_checked: new Date(Date.now() - 3600_000 * 12).toISOString(),  active: true  },
  { id: 's5', name: 'Product Hunt',       url: 'https://producthunt.com',           type: 'product_hunt',       trust_score: 0.65, last_checked: new Date(Date.now() - 3600_000 * 12).toISOString(),  active: true  },
  { id: 's6', name: 'The Rundown AI',     url: 'https://therundown.ai',             type: 'newsletter',         trust_score: 0.75, last_checked: new Date(Date.now() - 3600_000 * 24).toISOString(),  active: true  },
  { id: 's7', name: 'Ben\'s Bites',       url: 'https://bensbites.com',             type: 'newsletter',         trust_score: 0.80, last_checked: new Date(Date.now() - 3600_000 * 24).toISOString(),  active: true  },
  { id: 's8', name: 'AI Twitter/X',       url: 'https://twitter.com',               type: 'x_account',          trust_score: 0.50, last_checked: null,                                                  active: false },
]

// ─── Query Functions ──────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  if (USE_MOCK) return MOCK_STATS

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()

  const [toolsRes, modelsRes, skillsRes, queueRes] = await Promise.all([
    supabase.from('tools').select('status'),
    supabase.from('models').select('status'),
    supabase.from('skills').select('status'),
    supabase.from('approval_queue').select('status'),
  ])

  const countByStatus = (rows: Array<{ status: string }> | null) => {
    const all = rows ?? []
    return {
      published: all.filter((r) => r.status === 'published').length,
      pending:   all.filter((r) => r.status === 'review').length,
      draft:     all.filter((r) => r.status === 'draft').length,
      total:     all.length,
    }
  }

  const queue = (queueRes.data ?? []) as Array<{ status: string }>
  return {
    tools:  countByStatus(toolsRes.data as Array<{ status: string }> | null),
    models: countByStatus(modelsRes.data as Array<{ status: string }> | null),
    skills: countByStatus(skillsRes.data as Array<{ status: string }> | null),
    queue:  { pending: queue.filter((q) => q.status === 'pending').length, total: queue.length },
    lastSync: null,
  }
}

export async function getApprovalQueue(
  status?: string
): Promise<ApprovalQueueItem[]> {
  if (USE_MOCK) {
    if (!status || status === 'all') return MOCK_QUEUE
    return MOCK_QUEUE.filter((q) => q.status === status)
  }

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()

  let query = supabase
    .from('approval_queue')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ApprovalQueueItem[]
}

export async function getRecentChangelogs(limit = 20): Promise<ChangelogEntry[]> {
  if (USE_MOCK) return MOCK_CHANGELOGS.slice(0, limit)

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('changelogs')
    .select('*')
    .order('changed_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as ChangelogEntry[]
}

export async function getAllToolsAdmin() {
  if (USE_MOCK) {
    const { MOCK_TOOLS } = await import('@/lib/mock-tools')
    return MOCK_TOOLS
  }

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllModelsAdmin() {
  if (USE_MOCK) {
    const { MOCK_MODELS } = await import('@/lib/mock-models')
    return MOCK_MODELS
  }

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllSkillsAdmin() {
  if (USE_MOCK) {
    const { MOCK_SKILLS } = await import('@/lib/mock-skills')
    return MOCK_SKILLS
  }

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function approveQueueItem(
  queueId: string,
  contentType: string,
  contentId: string,
  reviewedBy = 'admin'
): Promise<void> {
  if (USE_MOCK) return

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()

  const now = new Date().toISOString()

  // Update queue item — cast needed for Supabase strict TS v2
  // Supabase strict TS requires cast — update() infers never on chained queries
  await (supabase.from('approval_queue') as any)
    .update({ status: 'approved', reviewed_by: reviewedBy, reviewed_at: now, decision: 'approved' })
    .eq('id', queueId)

  // Publish the content item
  if (contentType === 'tool') {
    // Supabase strict TS requires cast — update() infers never on chained queries
    await (supabase.from('tools') as any).update({ status: 'published', published_at: now }).eq('id', contentId)
  } else if (contentType === 'model') {
    // Supabase strict TS requires cast — update() infers never on chained queries
    await (supabase.from('models') as any).update({ status: 'published', published_at: now }).eq('id', contentId)
  } else if (contentType === 'skill') {
    // Supabase strict TS requires cast — update() infers never on chained queries
    await (supabase.from('skills') as any).update({ status: 'published', published_at: now }).eq('id', contentId)
  }
}

export async function rejectQueueItem(
  queueId: string,
  reason: string,
  reviewedBy = 'admin'
): Promise<void> {
  if (USE_MOCK) return

  const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
  const supabase = createAdminSupabaseClient()

  // Supabase strict TS requires cast — update() infers never on chained queries
  await (supabase.from('approval_queue') as any)
    .update({
      status:       'rejected',
      reviewed_by:  reviewedBy,
      reviewed_at:  new Date().toISOString(),
      decision:     'rejected',
      review_notes: reason,
    })
    .eq('id', queueId)
}

export async function getSources(): Promise<Source[]> {
  return MOCK_SOURCES
}
