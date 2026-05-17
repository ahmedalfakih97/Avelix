import { MOCK_TOOLS } from '@/lib/mock-tools'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export interface SitemapEntry {
  slug: string
  updated_at: string
}

const FALLBACK_DATE = new Date().toISOString()

export async function getSitemapTools(): Promise<SitemapEntry[]> {
  if (USE_MOCK) {
    return MOCK_TOOLS.map((t) => ({ slug: t.slug, updated_at: FALLBACK_DATE }))
  }
  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase
    .from('tools')
    .select('slug, updated_at')
    .eq('status', 'published')
  return (data ?? []) as SitemapEntry[]
}

export async function getSitemapModels(): Promise<SitemapEntry[]> {
  if (USE_MOCK) return []
  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase
    .from('models')
    .select('slug, updated_at')
    .eq('status', 'published')
  return (data ?? []) as SitemapEntry[]
}

export async function getSitemapSkills(): Promise<SitemapEntry[]> {
  if (USE_MOCK) return []
  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase
    .from('skills')
    .select('slug, updated_at')
    .eq('status', 'published')
  return (data ?? []) as SitemapEntry[]
}

export async function getSitemapGlossaryTerms(): Promise<SitemapEntry[]> {
  if (USE_MOCK) return []
  const { createStaticSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createStaticSupabaseClient()
  const { data } = await supabase
    .from('glossary_terms')
    .select('slug, updated_at')
    .eq('status', 'published')
  return (data ?? []) as SitemapEntry[]
}
