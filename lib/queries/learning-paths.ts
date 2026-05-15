import type { LearningPath, LearningPathFilters } from '@/types/skill'
import { MOCK_LEARNING_PATHS } from '@/lib/mock-learning-paths'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getLearningPaths(
  filters: LearningPathFilters = {}
): Promise<{ paths: LearningPath[]; total: number }> {
  if (USE_MOCK) return getMockPaths(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('learning_paths')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (filters.level)  query = query.eq('required_skill_level', filters.level)
  if (filters.search) query = query.textSearch('title', filters.search, { type: 'websearch' })

  query = query.order('published_at', { ascending: false })

  const { data, error, count } = await query
  if (error) throw error
  return { paths: (data ?? []) as LearningPath[], total: count ?? 0 }
}

export async function getLearningPathBySlug(slug: string): Promise<LearningPath | null> {
  if (USE_MOCK) return MOCK_LEARNING_PATHS.find((p) => p.slug === slug) ?? null

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as LearningPath
}

export async function getPublishedPathSlugs(): Promise<{ slug: string }[]> {
  if (USE_MOCK) return MOCK_LEARNING_PATHS.map((p) => ({ slug: p.slug }))

  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase.from('learning_paths').select('slug').eq('status', 'published')
  return data ?? []
}

function getMockPaths(filters: LearningPathFilters): { paths: LearningPath[]; total: number } {
  let paths = [...MOCK_LEARNING_PATHS]
  if (filters.level) paths = paths.filter((p) => p.required_skill_level === filters.level)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    paths = paths.filter(
      (p) => p.title.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q)
    )
  }
  return { paths, total: paths.length }
}
