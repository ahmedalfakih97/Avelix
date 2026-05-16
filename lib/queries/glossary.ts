import type { GlossaryTerm, GlossaryFilters } from '@/types/glossary'
import { MOCK_GLOSSARY } from '@/lib/mock-glossary'
export { groupTermsByLetter } from '@/lib/glossary-utils'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getAllGlossaryTerms(
  filters: GlossaryFilters = {}
): Promise<GlossaryTerm[]> {
  if (USE_MOCK) return getMockTerms(filters)

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('glossary_terms')
    .select('*')
    .eq('status', 'published')
    .order('title', { ascending: true })

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,simple_definition.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as GlossaryTerm[]
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  if (USE_MOCK) return MOCK_GLOSSARY.find((t) => t.slug === slug) ?? null

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data as GlossaryTerm
}

export async function getPublishedTermSlugs(): Promise<{ slug: string }[]> {
  if (USE_MOCK) return MOCK_GLOSSARY.map((t) => ({ slug: t.slug }))

  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase
    .from('glossary_terms')
    .select('slug')
    .eq('status', 'published')
  return data ?? []
}

export async function getRelatedGlossaryTerms(slugs: string[]): Promise<GlossaryTerm[]> {
  if (!slugs.length) return []
  if (USE_MOCK) return MOCK_GLOSSARY.filter((t) => slugs.includes(t.slug))

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('glossary_terms')
    .select('id, title, slug, simple_definition, related_term_slugs')
    .in('slug', slugs)
    .eq('status', 'published')
  return (data ?? []) as GlossaryTerm[]
}

function getMockTerms(filters: GlossaryFilters): GlossaryTerm[] {
  let terms = [...MOCK_GLOSSARY]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    terms = terms.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.simple_definition.toLowerCase().includes(q)
    )
  }
  return terms.sort((a, b) => a.title.localeCompare(b.title))
}
