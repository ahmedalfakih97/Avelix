import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ModelsLibraryClient from '@/components/pages/ModelsLibraryClient'
import { getModels, getProviders, getCategories } from '@/lib/queries/models'
import type { ModelFilters, SortOption, ContextWindowBucket, ModalityGroup, RagGroup, SizeGroup, SourceFilter } from '@/types/model'

export const metadata: Metadata = {
  title: 'AI Model Index — Every Major AI Model Reviewed',
  description: 'Browse every major AI model: LLMs, image generators, audio models, and more. Filter by provider, type, pricing, and capabilities.',
  alternates: { canonical: '/models' },
  openGraph: {
    title: 'AI Model Index | Avelix',
    description: 'Find the right AI model for your task. LLMs, image generators, audio models — filtered and compared.',
    type: 'website',
  },
}

type SP = Record<string, string | string[] | undefined>

function getString(sp: SP, key: string): string | undefined {
  const v = sp[key]
  return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
}

function getArray(sp: SP, key: string): string[] {
  const v = getString(sp, key)
  return v ? v.split(',').map(s => s.trim()).filter(Boolean) : []
}

function parseFilters(sp: SP): ModelFilters {
  const g = (k: string) => getString(sp, k)
  const arr = (k: string) => getArray(sp, k)

  const categories = arr('category')
  const statuses = arr('status')
  const pricing_tiers = arr('pricing')
  const providers = arr('provider')
  const countries = arr('country')
  const popularity_tiers = arr('popularity')
  const modality_groups = arr('modality') as ModalityGroup[]

  return {
    search:    g('q'),
    sort:      (g('sort') ?? 'trending') as SortOption,
    page:      g('page') ? parseInt(g('page')!) : 1,

    categories:      categories.length      ? categories      : undefined,
    statuses:        statuses.length        ? statuses        : undefined,
    pricing_tiers:   pricing_tiers.length   ? pricing_tiers   : undefined,
    providers:       providers.length       ? providers       : undefined,
    countries:       countries.length       ? countries       : undefined,
    popularity_tiers: popularity_tiers.length ? popularity_tiers : undefined,
    modality_groups: modality_groups.length ? modality_groups : undefined,

    context_window_bucket: g('ctx') as ContextWindowBucket | undefined,
    avg_response_latency:  g('speed'),
    release_year:          g('year') ? parseInt(g('year')!) : undefined,
    rag:                   g('rag')  as RagGroup | undefined,
    size:                  g('size') as SizeGroup | undefined,
    source:                g('source') as SourceFilter | undefined,

    vision_support:            g('vision')     === '1' ? true : undefined,
    audio_support:             g('audio')      === '1' ? true : undefined,
    fine_tuning_support:       g('finetune')   === '1' ? true : undefined,
    tool_use_support:          g('tooluse')    === '1' ? true : undefined,
    has_free_tier:             g('freetier')   === '1' ? true : undefined,
    has_api:                   g('api')        === '1' ? true : undefined,
    embedding_support:         g('embedding')  === '1' ? true : undefined,
    json_mode_support:         g('jsonmode')   === '1' ? true : undefined,
    structured_output_support: g('structured') === '1' ? true : undefined,
    enterprise_ready:          g('enterprise') === '1' ? true : undefined,
  }
}

export default async function ModelsPage({ searchParams }: { searchParams: SP }) {
  const filters = parseFilters(searchParams)
  const [{ models, total }, providers, categories] = await Promise.all([
    getModels(filters),
    getProviders(),
    getCategories(),
  ])

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ModelsLibraryClient
          models={models}
          total={total}
          filters={filters}
          providers={providers}
          categories={categories}
        />
      </Suspense>
      <Footer />
    </>
  )
}
