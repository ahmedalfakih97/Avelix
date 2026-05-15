import type { Comparison } from '@/types/comparison'
import { MOCK_COMPARISONS } from '@/lib/mock-comparisons'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function getComparisons(): Promise<Comparison[]> {
  if (USE_MOCK) return MOCK_COMPARISONS
  return MOCK_COMPARISONS
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  if (USE_MOCK) return MOCK_COMPARISONS.find((c) => c.slug === slug) ?? null
  return MOCK_COMPARISONS.find((c) => c.slug === slug) ?? null
}

export async function getPublishedComparisonSlugs(): Promise<{ slug: string }[]> {
  return MOCK_COMPARISONS.map((c) => ({ slug: c.slug }))
}
