import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ModelsLibraryClient from '@/components/pages/ModelsLibraryClient'
import { getModels } from '@/lib/queries/models'
import type { ModelFilters } from '@/types/model'

export const metadata: Metadata = {
  title: 'AI Model Index — Every Major AI Model Reviewed | Avelix',
  description: 'Browse every major AI model: LLMs, image generators, audio models, and more. Filter by provider, type, pricing, and capabilities.',
  openGraph: {
    title: 'AI Model Index | Avelix',
    description: 'Find the right AI model for your task. LLMs, image generators, audio models — filtered and compared.',
    type: 'website',
  },
}

interface SearchParams {
  search?: string
  provider?: string
  model_type?: string
  pricing?: string
  input_type?: string
  output_type?: string
  is_open_source?: string
  has_api?: string
  sort?: string
  page?: string
}

function parseFilters(sp: SearchParams): ModelFilters {
  return {
    search:        sp.search,
    provider:      sp.provider,
    model_type:    sp.model_type as ModelFilters['model_type'],
    pricing:       sp.pricing as ModelFilters['pricing'],
    input_type:    sp.input_type,
    output_type:   sp.output_type,
    is_open_source: sp.is_open_source === '1' ? true : undefined,
    has_api:        sp.has_api === '1' ? true : undefined,
    sort:          sp.sort as ModelFilters['sort'],
    page:          sp.page ? parseInt(sp.page) : 1,
  }
}

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const filters = parseFilters(searchParams)
  const { models, total } = await getModels(filters)

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <ModelsLibraryClient
          initialModels={models}
          initialTotal={total}
          initialFilters={filters}
        />
      </Suspense>
      <Footer />
    </>
  )
}
