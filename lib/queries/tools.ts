import type { Tool, ToolFilters } from '@/types/tool'
import { MOCK_TOOLS } from '@/lib/mock-tools'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getTools(filters: ToolFilters = {}): Promise<{ tools: Tool[]; total: number }> {
  if (USE_MOCK) return getMockTools(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('tools')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (filters.category) query = query.eq('category_id', filters.category)
  if (filters.pricing)  query = query.eq('pricing_model', filters.pricing)
  if (filters.has_free_plan) query = query.eq('has_free_plan', true)
  if (filters.has_api)       query = query.eq('has_api', true)
  if (filters.no_code)       query = query.eq('is_no_code', true)
  if (filters.arabic_support) query = query.eq('has_arabic_support', true)
  if (filters.search)   query = query.textSearch('title', filters.search, { type: 'websearch' })
  if (filters.platform) query = query.contains('platforms', [filters.platform])

  const sortMap = {
    newest:     { column: 'published_at', ascending: false },
    top_rated:  { column: 'avelix_rating', ascending: false },
    free_first: { column: 'has_free_plan', ascending: false },
    relevant:   { column: 'confidence_score', ascending: false },
  }
  const sort = sortMap[filters.sort ?? 'relevant']
  query = query.order(sort.column, { ascending: sort.ascending })

  const page = filters.page ?? 1
  const limit = 24
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { tools: (data ?? []) as Tool[], total: count ?? 0 }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  if (USE_MOCK) {
    return MOCK_TOOLS.find((t) => t.slug === slug) ?? null
  }

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as Tool
}

export async function getPublishedToolSlugs(): Promise<{ slug: string }[]> {
  if (USE_MOCK) return MOCK_TOOLS.map((t) => ({ slug: t.slug }))

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('tools').select('slug').eq('status', 'published')
  return data ?? []
}

export async function getRelatedTools(slugs: string[]): Promise<Tool[]> {
  if (!slugs.length) return []
  if (USE_MOCK) return MOCK_TOOLS.filter((t) => slugs.includes(t.slug))

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('tools').select('*').in('slug', slugs).eq('status', 'published')
  return (data ?? []) as Tool[]
}

function getMockTools(filters: ToolFilters): { tools: Tool[]; total: number } {
  let tools = [...MOCK_TOOLS]

  if (filters.category)   tools = tools.filter((t) => t.category_id === filters.category)
  if (filters.pricing)    tools = tools.filter((t) => t.pricing_model === filters.pricing)
  if (filters.has_free_plan) tools = tools.filter((t) => t.has_free_plan)
  if (filters.has_api)    tools = tools.filter((t) => t.has_api)
  if (filters.no_code)    tools = tools.filter((t) => t.is_no_code)
  if (filters.arabic_support) tools = tools.filter((t) => t.has_arabic_support)
  if (filters.platform)   tools = tools.filter((t) => t.platforms.includes(filters.platform!))
  if (filters.search) {
    const q = filters.search.toLowerCase()
    tools = tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.short_description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  }

  const sortFns: Record<string, (a: Tool, b: Tool) => number> = {
    top_rated:  (a, b) => (b.avelix_rating ?? 0) - (a.avelix_rating ?? 0),
    newest:     (a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime(),
    free_first: (a, b) => Number(b.has_free_plan) - Number(a.has_free_plan),
    relevant:   (a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0),
  }
  tools.sort(sortFns[filters.sort ?? 'relevant'])

  return { tools, total: tools.length }
}
