import type { Skill, SkillFilters } from '@/types/skill'
import { MOCK_SKILLS } from '@/lib/mock-skills'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getSkills(filters: SkillFilters = {}): Promise<{ skills: Skill[]; total: number }> {
  if (USE_MOCK) return getMockSkills(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('skills')
    .select('*', { count: 'exact' })
    .eq('status', 'published')

  if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
  if (filters.category)   query = query.eq('category_id', filters.category)
  if (filters.time_max)   query = query.lte('estimated_hours', filters.time_max)
  if (filters.search)     query = query.textSearch('title', filters.search, { type: 'websearch' })

  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    popular:   { column: 'confidence_score', ascending: false },
    newest:    { column: 'published_at',     ascending: false },
    easiest:   { column: 'difficulty',       ascending: true },
    quickest:  { column: 'estimated_hours',  ascending: true },
  }
  const sort = sortMap[filters.sort ?? 'popular']
  query = query.order(sort.column, { ascending: sort.ascending })

  const page = filters.page ?? 1
  const limit = 24
  query = query.range((page - 1) * limit, page * limit - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { skills: (data ?? []) as Skill[], total: count ?? 0 }
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  if (USE_MOCK) return MOCK_SKILLS.find((s) => s.slug === slug) ?? null

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as Skill
}

export async function getPublishedSkillSlugs(): Promise<{ slug: string }[]> {
  if (USE_MOCK) return MOCK_SKILLS.map((s) => ({ slug: s.slug }))

  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase.from('skills').select('slug').eq('status', 'published')
  return data ?? []
}

export async function getRelatedSkills(slugs: string[]): Promise<Skill[]> {
  if (!slugs.length) return []
  if (USE_MOCK) return MOCK_SKILLS.filter((s) => slugs.includes(s.slug))

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('skills')
    .select('*')
    .in('slug', slugs)
    .eq('status', 'published')
  return (data ?? []) as Skill[]
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const { skills } = await getSkills({ sort: 'popular' })
  const map: Record<string, Skill[]> = {}

  for (const skill of skills) {
    const key = skill.category_id ?? 'uncategorized'
    if (!map[key]) map[key] = []
    map[key].push(skill)
  }
  return map
}

function getMockSkills(filters: SkillFilters): { skills: Skill[]; total: number } {
  let skills = [...MOCK_SKILLS]

  if (filters.difficulty) skills = skills.filter((s) => s.difficulty === filters.difficulty)
  if (filters.time_max)   skills = skills.filter((s) => (s.estimated_hours ?? 0) <= filters.time_max!)
  if (filters.search) {
    const q = filters.search.toLowerCase()
    skills = skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.short_description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  const diffOrder: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 }
  const sortFns: Record<string, (a: Skill, b: Skill) => number> = {
    popular:  (a, b) => (b.confidence_score ?? 0) - (a.confidence_score ?? 0),
    newest:   (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
    easiest:  (a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty],
    quickest: (a, b) => (a.estimated_hours ?? 0) - (b.estimated_hours ?? 0),
  }
  skills.sort(sortFns[filters.sort ?? 'popular'])

  return { skills, total: skills.length }
}
