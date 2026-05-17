import type { Model, ModelFilters, ModalityGroup, RagGroup, SizeGroup, SortOption } from '@/types/model'
import { MOCK_MODELS } from '@/lib/mock-models'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

// ── Context window token ranges ────────────────────────────────────────────────
const CTX_BUCKETS: Record<string, [number, number | null]> = {
  '8k':   [0,        8_192],
  '32k':  [8_193,    32_768],
  '128k': [32_769,   131_072],
  '1m':   [131_073,  1_048_576],
  'max':  [1_048_577, null],
}

// ── Modality group → actual DB values ─────────────────────────────────────────
const MODALITY_VALUES: Record<ModalityGroup, string[]> = {
  Text:       ['Text', 'Text, code'],
  Multimodal: ['Multimodal', 'Text and multimodal inputs', 'Text or multimodal',
               'Text, image, audio, video', 'Text, image, video',
               'Text, tools, browser or app state', 'Text (+ vision in VL line)',
               'Sequence-to-structure'],
  Image:      ['Text to Image', 'Text+image-to-image', 'Text-to-image/video'],
  Audio:      ['Audio', 'Audio + text', 'Audio-to-text', 'Text + Audio',
               'Text to Audio', 'Text-to-audio (music)', 'Text-to-audio (music+vocals)',
               'Text-to-audio / image-to-video'],
  Video:      ['Text to Video', 'Text/image-to-video'],
  Code:       [],  // handled via avelix_category=Coding
}

// ── RAG group → actual DB values ──────────────────────────────────────────────
const RAG_VALUES: Record<RagGroup, string[]> = {
  High:   ['High', 'High (grounding)', 'Very high', 'Very high (native web RAG)'],
  Medium: ['Medium'],
  Low:    ['Not primary use case', 'Not publicly disclosed'],
}

// ── Model size → parameter_count values ───────────────────────────────────────
const SIZE_VALUES: Record<SizeGroup, string[]> = {
  '<7B':     ['0.3B','0.5B','0.6B','1B','1.5B','2B','3B','3.8B','4B','5B','6B'],
  '7B–70B':  ['7B','8B','9B','11B','12B','13B','14B','20B','24B','26B','27B','32B','34B','35B','47B','49B','70B'],
  '70B–200B':['90B','104B','120B','123B','141B','176B'],
  '200B+':   ['236B','253B','405B','424B','671B','685B'],
  'Unknown': ['Unknown'],
}

// ── Sort config ────────────────────────────────────────────────────────────────
const SORT_MAP: Record<SortOption, { column: string; ascending: boolean; nullsLast?: boolean }> = {
  trending:   { column: 'confidence_score', ascending: false },
  newest:     { column: 'release_year',     ascending: false, nullsLast: true },
  alpha:      { column: 'title',            ascending: true },
  price_asc:  { column: 'api_input_price_usd_per_1m', ascending: true,  nullsLast: true },
  price_desc: { column: 'api_input_price_usd_per_1m', ascending: false, nullsLast: true },
}

export async function getModels(filters: ModelFilters = {}): Promise<{ models: Model[]; total: number }> {
  if (USE_MOCK) return getMockModels(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('models')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  // ── Multi-select filters (.in()) ───────────────────────────────────────────
  if (filters.categories?.length)       query = query.in('avelix_category',    filters.categories)
  if (filters.statuses?.length)         query = query.in('current_status',     filters.statuses)
  if (filters.pricing_tiers?.length)    query = query.in('pricing_tier_label', filters.pricing_tiers)
  if (filters.providers?.length)        query = query.in('provider',           filters.providers)
  if (filters.countries?.length)        query = query.in('provider_country',   filters.countries)
  if (filters.popularity_tiers?.length) query = query.in('popularity_tier',    filters.popularity_tiers)

  // ── Modality group ─────────────────────────────────────────────────────────
  if (filters.modality_groups?.length) {
    const vals: string[] = []
    for (const g of filters.modality_groups) {
      if (g === 'Code') {
        // Code models are identified via avelix_category=Coding
        query = query.in('avelix_category', ['Coding'])
      } else {
        vals.push(...(MODALITY_VALUES[g] ?? []))
      }
    }
    if (vals.length) query = query.in('modality', vals)
  }

  // ── Source (open/closed) ───────────────────────────────────────────────────
  if (filters.source === 'Open Source')  query = query.eq('is_open_source', true)
  if (filters.source === 'Closed Source') query = query.eq('is_open_source', false)

  // ── Single-select exact matches ────────────────────────────────────────────
  if (filters.avg_response_latency) query = query.eq('avg_response_latency', filters.avg_response_latency)
  if (filters.release_year)         query = query.eq('release_year',         filters.release_year)

  // ── RAG group ──────────────────────────────────────────────────────────────
  if (filters.rag) {
    const ragVals = RAG_VALUES[filters.rag] ?? []
    if (ragVals.length) query = query.in('rag_suitability', ragVals)
  }

  // ── Size (parameter_count) ─────────────────────────────────────────────────
  if (filters.size) {
    const sizeVals = SIZE_VALUES[filters.size] ?? []
    if (sizeVals.length) query = query.in('parameter_count', sizeVals)
  }

  // ── Context window bucket ──────────────────────────────────────────────────
  if (filters.context_window_bucket) {
    const [min, max] = CTX_BUCKETS[filters.context_window_bucket] ?? [0, null]
    query = query.gte('context_window', min)
    if (max !== null) query = query.lte('context_window', max)
  }

  // ── Boolean toggles ────────────────────────────────────────────────────────
  if (filters.vision_support)            query = query.eq('vision_support',            true)
  if (filters.audio_support)             query = query.eq('audio_support',             true)
  if (filters.fine_tuning_support)       query = query.eq('fine_tuning_support',       true)
  if (filters.tool_use_support)          query = query.eq('tool_use_support',          true)
  if (filters.has_free_tier)             query = query.eq('has_free_tier',             true)
  if (filters.has_api)                   query = query.eq('has_api',                   true)
  if (filters.embedding_support)         query = query.eq('embedding_support',         true)
  if (filters.json_mode_support)         query = query.eq('json_mode_support',         true)
  if (filters.structured_output_support) query = query.eq('structured_output_support', true)
  if (filters.enterprise_ready)          query = query.eq('enterprise_ready',          true)

  // ── Search — ilike across title, provider, description ────────────────────
  if (filters.search) {
    const t = filters.search.replace(/'/g, "''")
    query = query.or(`title.ilike.%${t}%,provider.ilike.%${t}%,short_description.ilike.%${t}%`)
  }

  // ── Sort ───────────────────────────────────────────────────────────────────
  const sortCfg = SORT_MAP[filters.sort ?? 'trending']
  query = query.order(sortCfg.column, {
    ascending: sortCfg.ascending,
    nullsFirst: false,
  })
  // Secondary sort by title for stable ordering
  if (sortCfg.column !== 'title') {
    query = query.order('title', { ascending: true })
  }

  // ── Pagination ─────────────────────────────────────────────────────────────
  const page  = filters.page ?? 1
  const limit = 24
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { models: (data ?? []) as Model[], total: count ?? 0 }
}

export async function getModelBySlug(slug: string): Promise<Model | null> {
  if (USE_MOCK) return MOCK_MODELS.find((m) => m.slug === slug) ?? null

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as Model
}

export async function getPublishedModelSlugs(): Promise<{ slug: string }[]> {
  if (USE_MOCK) return MOCK_MODELS.map((m) => ({ slug: m.slug }))

  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase.from('models').select('slug').eq('status', 'published')
  return data ?? []
}

export async function getRelatedModels(slugs: string[]): Promise<Model[]> {
  if (!slugs.length) return []
  if (USE_MOCK) return MOCK_MODELS.filter((m) => slugs.includes(m.slug))

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('models').select('*').in('slug', slugs).eq('status', 'published')
  return (data ?? []) as Model[]
}

export async function getRecentModels(limit = 3): Promise<Model[]> {
  if (USE_MOCK) return MOCK_MODELS.slice(0, limit)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as Model[]
}

export async function getFeaturedModels(limit = 8): Promise<Model[]> {
  if (USE_MOCK) return MOCK_MODELS.filter((m) => m.avelix_featured).slice(0, limit)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'published')
    .eq('avelix_featured', true)
    .order('confidence_score', { ascending: false })
    .limit(limit)
  return (data ?? []) as Model[]
}

export async function getModelsByCategory(category: string, limit = 24): Promise<Model[]> {
  if (USE_MOCK) return MOCK_MODELS.filter((m) => m.avelix_category === category).slice(0, limit)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'published')
    .eq('avelix_category', category)
    .order('confidence_score', { ascending: false })
    .limit(limit)
  return (data ?? []) as Model[]
}

export async function getProviders(): Promise<{ provider: string; provider_country: string | null }[]> {
  if (USE_MOCK) {
    const seen = new Set<string>()
    return MOCK_MODELS
      .filter((m) => { if (seen.has(m.provider)) return false; seen.add(m.provider); return true })
      .map((m) => ({ provider: m.provider, provider_country: m.provider_country ?? null }))
  }

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'published')
    .order('provider', { ascending: true })
  if (!data) return []
  const seen = new Set<string>()
  return (data as Model[])
    .filter((row) => { if (seen.has(row.provider)) return false; seen.add(row.provider); return true })
    .map((row) => ({ provider: row.provider, provider_country: row.provider_country ?? null }))
}

export async function getCategories(): Promise<{ category: string; count: number }[]> {
  if (USE_MOCK) {
    const counts: Record<string, number> = {}
    for (const m of MOCK_MODELS) {
      if (m.avelix_category) counts[m.avelix_category] = (counts[m.avelix_category] ?? 0) + 1
    }
    return Object.entries(counts).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)
  }

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('*')
    .eq('status', 'published')
    .not('avelix_category', 'is', null)
  if (!data) return []
  const counts: Record<string, number> = {}
  for (const row of (data as Model[])) {
    if (row.avelix_category) counts[row.avelix_category] = (counts[row.avelix_category] ?? 0) + 1
  }
  return Object.entries(counts).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)
}

// ── Mock filter implementation (for local dev without Supabase) ────────────────

function getMockModels(filters: ModelFilters): { models: Model[]; total: number } {
  let models = [...MOCK_MODELS]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    models = models.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      m.short_description.toLowerCase().includes(q)
    )
  }
  if (filters.categories?.length)       models = models.filter((m) => m.avelix_category && filters.categories!.includes(m.avelix_category))
  if (filters.statuses?.length)         models = models.filter((m) => m.current_status && filters.statuses!.includes(m.current_status))
  if (filters.pricing_tiers?.length)    models = models.filter((m) => m.pricing_tier_label && filters.pricing_tiers!.includes(m.pricing_tier_label))
  if (filters.providers?.length)        models = models.filter((m) => filters.providers!.includes(m.provider))
  if (filters.popularity_tiers?.length) models = models.filter((m) => m.popularity_tier && filters.popularity_tiers!.includes(m.popularity_tier))
  if (filters.source === 'Open Source')  models = models.filter((m) => m.is_open_source)
  if (filters.source === 'Closed Source') models = models.filter((m) => !m.is_open_source)
  if (filters.vision_support)           models = models.filter((m) => m.vision_support)
  if (filters.audio_support)            models = models.filter((m) => m.audio_support)
  if (filters.fine_tuning_support)      models = models.filter((m) => m.fine_tuning_support)
  if (filters.tool_use_support)         models = models.filter((m) => m.tool_use_support)
  if (filters.has_free_tier)            models = models.filter((m) => m.has_free_tier)
  if (filters.has_api)                  models = models.filter((m) => m.has_api)
  if (filters.release_year)             models = models.filter((m) => m.release_year === filters.release_year)

  if (filters.context_window_bucket) {
    const [min, max] = CTX_BUCKETS[filters.context_window_bucket] ?? [0, null]
    models = models.filter((m) => {
      if (!m.context_window) return false
      return m.context_window >= min && (max === null || m.context_window <= max)
    })
  }

  const sortFns: Record<string, (a: Model, b: Model) => number> = {
    trending:   (a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0),
    newest:     (a, b) => (b.release_year ?? 0) - (a.release_year ?? 0),
    alpha:      (a, b) => a.title.localeCompare(b.title),
    price_asc:  (a, b) => (a.api_input_price_usd_per_1m ?? Infinity) - (b.api_input_price_usd_per_1m ?? Infinity),
    price_desc: (a, b) => (b.api_input_price_usd_per_1m ?? -1) - (a.api_input_price_usd_per_1m ?? -1),
  }
  models.sort(sortFns[filters.sort ?? 'trending'] ?? sortFns.trending)

  const page = filters.page ?? 1
  const limit = 24
  const total = models.length
  return { models: models.slice((page - 1) * limit, page * limit), total }
}
