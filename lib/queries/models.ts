import type { Model, ModelFilters } from '@/types/model'
import { MOCK_MODELS } from '@/lib/mock-models'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getModels(filters: ModelFilters = {}): Promise<{ models: Model[]; total: number }> {
  if (USE_MOCK) return getMockModels(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('models')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (filters.provider)       query = query.eq('provider', filters.provider)
  if (filters.model_type)     query = query.eq('model_type', filters.model_type)
  if (filters.is_open_source) query = query.eq('is_open_source', true)
  if (filters.has_api)        query = query.eq('has_api', true)
  if (filters.pricing)        query = query.eq('pricing_model', filters.pricing)
  if (filters.input_type)     query = query.contains('input_types', [filters.input_type])
  if (filters.output_type)    query = query.contains('output_types', [filters.output_type])
  if (filters.search)         query = query.textSearch('title', filters.search, { type: 'websearch' })

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    newest:         { column: 'release_date',    ascending: false },
    context_window: { column: 'context_window',  ascending: false },
    popular:        { column: 'confidence_score', ascending: false },
    beginner:       { column: 'confidence_score', ascending: false },
  }
  const sort = sortMap[filters.sort ?? 'popular']
  query = query.order(sort.column, { ascending: sort.ascending })

  const page = filters.page ?? 1
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

function getMockModels(filters: ModelFilters): { models: Model[]; total: number } {
  let models = [...MOCK_MODELS]

  if (filters.provider)       models = models.filter((m) => m.provider === filters.provider)
  if (filters.model_type)     models = models.filter((m) => m.model_type === filters.model_type)
  if (filters.is_open_source) models = models.filter((m) => m.is_open_source)
  if (filters.has_api)        models = models.filter((m) => m.has_api)
  if (filters.pricing)        models = models.filter((m) => m.pricing_model === filters.pricing)
  if (filters.input_type)     models = models.filter((m) => m.input_types.includes(filters.input_type!))
  if (filters.output_type)    models = models.filter((m) => m.output_types.includes(filters.output_type!))
  if (filters.search) {
    const q = filters.search.toLowerCase()
    models = models.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.short_description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  const sortFns: Record<string, (a: Model, b: Model) => number> = {
    popular:        (a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0),
    newest:         (a, b) => new Date(b.release_date ?? 0).getTime() - new Date(a.release_date ?? 0).getTime(),
    context_window: (a, b) => (b.context_window ?? 0) - (a.context_window ?? 0),
    beginner:       (a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0),
  }
  models.sort(sortFns[filters.sort ?? 'popular'])

  return { models, total: models.length }
}
