import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToolsLibraryClient from '@/components/pages/ToolsLibraryClient'
import { getTools } from '@/lib/queries/tools'
import type { ToolFilters } from '@/types/tool'

export const metadata: Metadata = {
  title: 'AI Tools Directory — Find the Right AI Tool',
  description: 'Browse 200+ AI tools reviewed, categorized, and rated. Filter by use case, pricing, and features. Find the best AI tool for your specific goal.',
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'AI Tools Directory | Avelix',
    description: 'Browse 200+ AI tools reviewed, categorized, and rated. Filter by use case, pricing, and features.',
    type: 'website',
  },
}

interface SearchParams {
  search?: string
  category?: string
  pricing?: string
  user_type?: string
  sort?: string
  has_free_plan?: string
  has_api?: string
  no_code?: string
  arabic_support?: string
  platform?: string
  page?: string
}

function parseFilters(params: SearchParams): ToolFilters {
  return {
    search:         params.search || undefined,
    category:       params.category || undefined,
    pricing:        (params.pricing as ToolFilters['pricing']) || undefined,
    user_type:      params.user_type || undefined,
    sort:           (params.sort as ToolFilters['sort']) || 'relevant',
    has_free_plan:  params.has_free_plan === '1',
    has_api:        params.has_api === '1',
    no_code:        params.no_code === '1',
    arabic_support: params.arabic_support === '1',
    platform:       params.platform || undefined,
    page:           params.page ? Number(params.page) : 1,
  }
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const filters = parseFilters(searchParams)
  const { tools, total } = await getTools(filters)

  return (
    <>
      <Header />
      <Suspense>
        <ToolsLibraryClient
          initialTools={tools}
          initialTotal={total}
          initialFilters={filters}
        />
      </Suspense>
      <Footer />
    </>
  )
}
