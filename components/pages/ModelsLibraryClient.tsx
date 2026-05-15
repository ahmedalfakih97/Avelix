'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Model, ModelFilters } from '@/types/model'
import ModelCard from '@/components/library/ModelCard'
import SearchBox from '@/components/library/SearchBox'
import { MODEL_PROVIDERS, MODEL_TYPES } from '@/lib/mock-models'

interface ModelsLibraryClientProps {
  initialModels: Model[]
  initialTotal: number
  initialFilters: ModelFilters
}

const SORT_OPTIONS = [
  { value: 'popular',        label: 'Most Used' },
  { value: 'newest',         label: 'Newest Release' },
  { value: 'context_window', label: 'Best Context' },
  { value: 'beginner',       label: 'Best for Beginners' },
]

const INPUT_OUTPUT_TYPES = ['text', 'image', 'audio', 'video', 'code']
const PRICING_OPTIONS = [
  { value: 'free',        label: 'Free' },
  { value: 'paid',        label: 'Paid' },
  { value: 'open-source', label: 'Open Source' },
]

function filtersToParams(f: ModelFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.search)        p.set('search',      f.search)
  if (f.provider)      p.set('provider',    f.provider)
  if (f.model_type)    p.set('model_type',  f.model_type)
  if (f.pricing)       p.set('pricing',     f.pricing)
  if (f.input_type)    p.set('input_type',  f.input_type)
  if (f.output_type)   p.set('output_type', f.output_type)
  if (f.is_open_source) p.set('is_open_source', '1')
  if (f.has_api)        p.set('has_api', '1')
  if (f.sort && f.sort !== 'popular') p.set('sort', f.sort)
  if (f.page && f.page > 1) p.set('page', String(f.page))
  return p
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] uppercase border px-2 py-1 transition-all ${
        active
          ? 'border-primary text-primary bg-primary/5'
          : 'border-terminal-border text-data-dim hover:border-primary hover:text-primary'
      }`}
    >
      {label}
    </button>
  )
}

export default function ModelsLibraryClient({
  initialModels,
  initialTotal,
  initialFilters,
}: ModelsLibraryClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [filters, setFilters] = useState<ModelFilters>(initialFilters)
  const [models] = useState<Model[]>(initialModels)
  const [total] = useState(initialTotal)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const handleFiltersChange = useCallback(
    (next: ModelFilters) => {
      setFilters(next)
      const params = filtersToParams(next)
      startTransition(() => {
        router.push(`/models?${params.toString()}`, { scroll: false })
      })
    },
    [router]
  )

  const handleSearch = useCallback(
    (search: string) => handleFiltersChange({ ...filters, search: search || undefined, page: 1 }),
    [filters, handleFiltersChange]
  )

  const activeFilterCount = [
    filters.provider, filters.model_type, filters.pricing,
    filters.input_type, filters.output_type,
    filters.is_open_source, filters.has_api,
  ].filter(Boolean).length

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">SORT_BY</p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={(filters.sort ?? 'popular') === opt.value}
              onClick={() => handleFiltersChange({ ...filters, sort: opt.value as ModelFilters['sort'], page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">PROVIDER</p>
        <div className="flex flex-col gap-1">
          {MODEL_PROVIDERS.map((p) => (
            <FilterPill
              key={p}
              label={p}
              active={filters.provider === p}
              onClick={() => handleFiltersChange({ ...filters, provider: filters.provider === p ? undefined : p, page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">MODEL_TYPE</p>
        <div className="flex flex-col gap-1">
          {MODEL_TYPES.map((t) => (
            <FilterPill
              key={t.value}
              label={t.label}
              active={filters.model_type === t.value}
              onClick={() => handleFiltersChange({ ...filters, model_type: filters.model_type === t.value ? undefined : t.value as ModelFilters['model_type'], page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">INPUT_TYPE</p>
        <div className="flex flex-col gap-1">
          {INPUT_OUTPUT_TYPES.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={filters.input_type === t}
              onClick={() => handleFiltersChange({ ...filters, input_type: filters.input_type === t ? undefined : t, page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">OUTPUT_TYPE</p>
        <div className="flex flex-col gap-1">
          {INPUT_OUTPUT_TYPES.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={filters.output_type === t}
              onClick={() => handleFiltersChange({ ...filters, output_type: filters.output_type === t ? undefined : t, page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">PRICING</p>
        <div className="flex flex-col gap-1">
          {PRICING_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={filters.pricing === opt.value}
              onClick={() => handleFiltersChange({ ...filters, pricing: filters.pricing === opt.value ? undefined : opt.value as ModelFilters['pricing'], page: 1 })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] text-data-dim uppercase mb-3">FEATURES</p>
        <div className="flex flex-col gap-1">
          <FilterPill
            label="Open Source"
            active={!!filters.is_open_source}
            onClick={() => handleFiltersChange({ ...filters, is_open_source: filters.is_open_source ? undefined : true, page: 1 })}
          />
          <FilterPill
            label="Has API"
            active={!!filters.has_api}
            onClick={() => handleFiltersChange({ ...filters, has_api: filters.has_api ? undefined : true, page: 1 })}
          />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={() => handleFiltersChange({})}
          className="font-mono text-[9px] text-signal-orange uppercase hover:underline text-left"
        >
          CLEAR_ALL ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-electromagnetic-ink pt-16">
      {/* Page header */}
      <div className="border-b border-terminal-border bg-surface-container-lowest px-4 py-8">
        <span className="font-mono text-label-caps text-primary uppercase block mb-2">
          [MODEL_INDEX]
        </span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
          AI Model Index
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant max-w-lg">
          Every major AI model documented, compared, and rated. Find the right model for your use case — LLMs, image generators, audio models, and more.
        </p>
        <div className="mt-6 max-w-xl">
          <SearchBox
            value={filters.search ?? ''}
            onChange={handleSearch}
            placeholder="SEARCH_MODELS..."
          />
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block w-64 xl:w-72 border-r border-terminal-border p-6 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <FilterPanel />
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden w-full border-b border-terminal-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 font-mono text-[10px] text-on-surface uppercase border border-terminal-border px-3 py-2 hover:border-primary transition-all"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <span className="font-mono text-[10px] text-data-dim uppercase">{total} models</span>
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
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Model grid */}
        <main className="flex-1 p-4 lg:p-6">
          {models.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-data-dim text-4xl mb-4 block">search_off</span>
              <p className="font-mono text-[11px] text-data-dim uppercase">No models match your filters.</p>
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
                  {total} models
                  {filters.search && ` matching "${filters.search}"`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {models.map((model) => (
                  <ModelCard key={model.slug} model={model} variant="default" />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
