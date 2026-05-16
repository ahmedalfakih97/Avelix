'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Tool, ToolFilters } from '@/types/tool'
import ToolCard from '@/components/library/ToolCard'
import FilterBar from '@/components/library/FilterBar'
import SearchBox from '@/components/library/SearchBox'
import ActiveFilterTags, { type ActiveTag } from '@/components/library/ActiveFilterTags'
import { CATEGORIES } from '@/lib/mock-tools'

interface ToolsLibraryClientProps {
  initialTools: Tool[]
  initialTotal: number
  initialFilters: ToolFilters
}

function filtersToParams(filters: ToolFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search)         params.set('search',   filters.search)
  if (filters.category)       params.set('category', filters.category)
  if (filters.pricing)        params.set('pricing',  filters.pricing)
  if (filters.user_type)      params.set('user_type', filters.user_type)
  if (filters.sort && filters.sort !== 'relevant') params.set('sort', filters.sort)
  if (filters.has_free_plan)  params.set('has_free_plan', '1')
  if (filters.has_api)        params.set('has_api',  '1')
  if (filters.no_code)        params.set('no_code',  '1')
  if (filters.arabic_support) params.set('arabic_support', '1')
  if (filters.platform)       params.set('platform', filters.platform)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  return params
}

export default function ToolsLibraryClient({
  initialTools,
  initialTotal,
  initialFilters,
}: ToolsLibraryClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [filters, setFilters] = useState<ToolFilters>(initialFilters)
  const [tools] = useState<Tool[]>(initialTools)
  const [total] = useState(initialTotal)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const activeTags: ActiveTag[] = [
    filters.category && {
      key: 'category',
      label: `Category: ${CATEGORIES.find((c) => c.id === filters.category)?.name ?? filters.category}`,
      onRemove: () => handleFiltersChange({ ...filters, category: undefined, page: 1 }),
    },
    filters.pricing && {
      key: 'pricing',
      label: `Plan: ${filters.pricing}`,
      onRemove: () => handleFiltersChange({ ...filters, pricing: undefined, page: 1 }),
    },
    filters.user_type && {
      key: 'user_type',
      label: `User: ${filters.user_type}`,
      onRemove: () => handleFiltersChange({ ...filters, user_type: undefined, page: 1 }),
    },
    filters.has_free_plan && {
      key: 'has_free_plan',
      label: 'Free plan',
      onRemove: () => handleFiltersChange({ ...filters, has_free_plan: false, page: 1 }),
    },
    filters.has_api && {
      key: 'has_api',
      label: 'Has API',
      onRemove: () => handleFiltersChange({ ...filters, has_api: false, page: 1 }),
    },
    filters.no_code && {
      key: 'no_code',
      label: 'No-Code',
      onRemove: () => handleFiltersChange({ ...filters, no_code: false, page: 1 }),
    },
  ].filter(Boolean) as ActiveTag[]

  const handleFiltersChange = useCallback(
    (next: ToolFilters) => {
      setFilters(next)
      const params = filtersToParams(next)
      startTransition(() => {
        router.push(`/tools?${params.toString()}`, { scroll: false })
      })
    },
    [router]
  )

  const handleSearch = useCallback(
    (search: string) => handleFiltersChange({ ...filters, search: search || undefined, page: 1 }),
    [filters, handleFiltersChange]
  )

  return (
    <div className="min-h-screen bg-electromagnetic-ink pt-16">
      {/* Page header */}
      <div className="border-b border-terminal-border bg-surface-container-lowest px-4 py-8">
        <span className="font-mono text-label-caps text-primary uppercase block mb-2">
          [TOOL_DIRECTORY]
        </span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
          AI Tool Index
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant max-w-lg">
          Every AI tool reviewed, categorized, and rated. Filter by use case, pricing, and features to find exactly what you need.
        </p>
        <div className="mt-6 max-w-xl">
          <SearchBox
            value={filters.search ?? ''}
            onChange={handleSearch}
            placeholder="SEARCH_TOOLS..."
          />
        </div>
      </div>

      <ActiveFilterTags
        tags={activeTags}
        onClearAll={() => handleFiltersChange({ sort: filters.sort })}
      />

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 border-r border-terminal-border p-6 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <FilterBar
            filters={filters}
            onChange={handleFiltersChange}
            totalCount={total}
          />
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden w-full border-b border-terminal-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 font-mono text-[10px] text-on-surface uppercase border border-terminal-border px-3 py-2 hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Filters {Object.keys(filters).filter((k) => k !== 'sort' && k !== 'page' && filters[k as keyof ToolFilters]).length > 0 && `(${Object.keys(filters).filter((k) => k !== 'sort' && k !== 'page' && filters[k as keyof ToolFilters]).length})`}
          </button>
          <span className="font-mono text-[10px] text-data-dim uppercase">{total} tools</span>
        </div>

        {/* Mobile filter panel */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-electromagnetic-ink pt-16 overflow-y-auto">
            <div className="p-4 border-b border-terminal-border flex justify-between items-center">
              <span className="font-mono text-[10px] text-primary uppercase">[FILTERS]</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="font-mono text-[10px] text-data-dim hover:text-primary uppercase transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-4">
              <FilterBar
                filters={filters}
                onChange={(f) => { handleFiltersChange(f); setMobileFiltersOpen(false) }}
                totalCount={total}
              />
            </div>
          </div>
        )}

        {/* Tool grid */}
        <main className="flex-1 p-4 lg:p-6">
          {tools.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-data-dim text-4xl mb-4 block">search_off</span>
              <p className="font-mono text-[11px] text-data-dim uppercase">No tools match your filters.</p>
              <button
                onClick={() => handleFiltersChange({})}
                className="mt-4 font-mono text-[10px] text-primary uppercase hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-data-dim uppercase">
                  {total} tools
                  {filters.search && ` matching "${filters.search}"`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} variant="default" />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
