'use client'

import { useCallback, useState, useTransition, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Model, ModelFilters, ModalityGroup } from '@/types/model'
import ModelCard from '@/components/library/ModelCard'

// ── Prop types ─────────────────────────────────────────────────────────────────

interface ModelsLibraryClientProps {
  models: Model[]
  total: number
  filters: ModelFilters
  providers: { provider: string; provider_country: string | null }[]
  categories: { category: string; count: number }[]
}

// ── Static filter option data ──────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'trending',   label: 'Trending' },
  { value: 'newest',     label: 'Newest First' },
  { value: 'alpha',      label: 'A → Z' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

const STATUS_OPTIONS = ['Active', 'Legacy', 'Retired', 'Research Preview']

const PRICING_OPTIONS = ['Free', 'Open Source / Free', 'Budget', 'Mid-Range', 'Premium', 'Unknown']

const POPULARITY_OPTIONS = ['Trending', 'Popular', 'Niche']

const MODALITY_OPTIONS: { value: ModalityGroup; icon: string }[] = [
  { value: 'Text',       icon: 'text_fields' },
  { value: 'Multimodal', icon: 'all_inclusive' },
  { value: 'Image',      icon: 'image' },
  { value: 'Audio',      icon: 'mic' },
  { value: 'Video',      icon: 'movie' },
  { value: 'Code',       icon: 'code' },
]

const CTX_OPTIONS = [
  { value: '8k',   label: '≤ 8K' },
  { value: '32k',  label: '8K–32K' },
  { value: '128k', label: '32K–128K' },
  { value: '1m',   label: '128K–1M' },
  { value: 'max',  label: '> 1M' },
]

const LATENCY_OPTIONS = [
  { value: 'Fast (<500ms)',     label: 'Fast (<500ms)' },
  { value: 'Medium (500ms–2s)', label: 'Medium' },
  { value: 'Slow (>2s)',        label: 'Slow (>2s)' },
]

const YEAR_OPTIONS = [2022, 2023, 2024, 2025, 2026]

const RAG_OPTIONS: { value: string; label: string }[] = [
  { value: 'High',   label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low',    label: 'Low' },
]

const SIZE_OPTIONS = ['<7B', '7B–70B', '70B–200B', '200B+', 'Unknown']

const PROVIDER_COUNTRIES = [
  'United States', 'China', 'United States / United Kingdom', 'France',
  'Canada', 'Germany', 'Israel', 'United Kingdom', 'United Arab Emirates',
  'India', 'Singapore', 'South Korea', 'Russia', 'Saudi Arabia',
  'USA/France (community)', 'International (community)', 'United States / France',
]

// ── URL helpers ────────────────────────────────────────────────────────────────

function useFilterNav() {
  const router    = useRouter()
  const params    = useSearchParams()
  const pathname  = usePathname()
  const [isPending, startTransition] = useTransition()

  const set = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString())
    if (value !== null && value !== '') p.set(key, value)
    else p.delete(key)
    if (key !== 'page') p.delete('page')
    startTransition(() => router.push(`${pathname}?${p.toString()}`, { scroll: false }))
  }, [params, pathname, router])

  const toggleMulti = useCallback((key: string, value: string) => {
    const p      = new URLSearchParams(params.toString())
    const cur    = p.get(key)?.split(',').filter(Boolean) ?? []
    const next   = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    if (next.length) p.set(key, next.join(','))
    else p.delete(key)
    p.delete('page')
    startTransition(() => router.push(`${pathname}?${p.toString()}`, { scroll: false }))
  }, [params, pathname, router])

  const toggleBool = useCallback((key: string) => {
    const p = new URLSearchParams(params.toString())
    if (p.get(key) === '1') p.delete(key)
    else p.set(key, '1')
    p.delete('page')
    startTransition(() => router.push(`${pathname}?${p.toString()}`, { scroll: false }))
  }, [params, pathname, router])

  const clearAll = useCallback(() => {
    const p = new URLSearchParams()
    const sort = params.get('sort')
    if (sort) p.set('sort', sort)
    startTransition(() => router.push(`${pathname}?${p.toString()}`, { scroll: false }))
  }, [params, pathname, router])

  return { params, set, toggleMulti, toggleBool, clearAll, isPending }
}

// ── Read helpers ───────────────────────────────────────────────────────────────

function getArr(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(',').filter(Boolean) ?? []
}
function getBool(params: URLSearchParams, key: string): boolean {
  return params.get(key) === '1'
}
function getStr(params: URLSearchParams, key: string): string | null {
  return params.get(key)
}

// ── Count active filters ───────────────────────────────────────────────────────

function countActiveFilters(params: URLSearchParams): number {
  const filterKeys = [
    'category','status','pricing','provider','country','popularity','modality',
    'source','ctx','speed','year','rag','size',
    'vision','audio','finetune','tooluse','freetier','api',
    'embedding','jsonmode','structured','enterprise',
    'q',
  ]
  return filterKeys.filter(k => {
    const v = params.get(k)
    return v !== null && v !== ''
  }).length
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] uppercase border px-2 py-1 transition-all text-left whitespace-nowrap ${
        active
          ? 'border-primary text-primary bg-primary/10'
          : 'border-terminal-border text-data-dim hover:border-primary/40 hover:text-on-surface-variant'
      }`}
    >
      {label}
    </button>
  )
}

function TogglePill({ label, icon, active, onClick }: { label: string; icon?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[9px] uppercase border px-2 py-1 transition-all flex items-center gap-1.5 ${
        active
          ? 'border-primary text-primary bg-primary/10'
          : 'border-terminal-border text-data-dim hover:border-primary/40 hover:text-on-surface-variant'
      }`}
    >
      {icon ? (
        <span className="material-symbols-outlined text-[12px]">{icon}</span>
      ) : (
        <span className={`w-2 h-2 border flex-shrink-0 ${active ? 'bg-primary border-primary' : 'border-data-dim'}`} />
      )}
      {label}
    </button>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="font-mono text-[8px] text-primary/70 uppercase tracking-wider mb-1.5 border-b border-terminal-border pb-1">
      {label}
    </p>
  )
}

function Accordion({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between font-mono text-[8px] text-primary/70 uppercase tracking-wider mb-1.5 border-b border-terminal-border pb-1 hover:text-primary transition-colors"
      >
        {label}
        <span className="material-symbols-outlined text-[12px]">{open ? 'expand_less' : 'expand_more'}</span>
      </button>
      {open && <div className="flex flex-col gap-1">{children}</div>}
    </div>
  )
}

// ── Search with debounce ───────────────────────────────────────────────────────

function SearchInput({ currentValue, onSearch }: { currentValue: string; onSearch: (v: string) => void }) {
  const [val, setVal] = useState(currentValue)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setVal(currentValue) }, [currentValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setVal(v)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => onSearch(v), 300)
  }

  return (
    <div className="relative flex items-center border border-terminal-border bg-surface-container-low hover:border-primary/40 transition-colors">
      <span className="material-symbols-outlined text-data-dim text-[16px] ml-3">search</span>
      <input
        type="text"
        value={val}
        onChange={handleChange}
        placeholder="SEARCH MODELS..."
        className="w-full bg-transparent font-mono text-[10px] text-on-surface uppercase placeholder:text-data-dim px-3 py-2.5 outline-none"
      />
      {val && (
        <button
          onClick={() => { setVal(''); onSearch('') }}
          className="mr-2 text-data-dim hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      )}
    </div>
  )
}

// ── Active filter chips ────────────────────────────────────────────────────────

const PARAM_LABELS: Record<string, string> = {
  category: 'Category', status: 'Status', pricing: 'Price', provider: 'Provider',
  country: 'Country', popularity: 'Popularity', modality: 'Modality',
  source: 'Source', ctx: 'Context', speed: 'Speed', year: 'Year',
  rag: 'RAG', size: 'Size', q: 'Search',
  vision: 'Vision', audio: 'Audio', finetune: 'Fine-tune', tooluse: 'Tool Use',
  freetier: 'Free Tier', api: 'Has API', embedding: 'Embeddings',
  jsonmode: 'JSON Mode', structured: 'Structured', enterprise: 'Enterprise',
}

const BOOL_KEYS = ['vision','audio','finetune','tooluse','freetier','api','embedding','jsonmode','structured','enterprise']

function ActiveFilterChips({ params, onRemove, onClearAll }: {
  params: URLSearchParams
  onRemove: (key: string, value?: string) => void
  onClearAll: () => void
}) {
  const chips: { key: string; value: string; display: string }[] = []

  for (const [key, label] of Object.entries(PARAM_LABELS)) {
    const val = params.get(key)
    if (!val) continue

    if (BOOL_KEYS.includes(key)) {
      chips.push({ key, value: '1', display: label })
    } else if (key === 'q') {
      chips.push({ key, value: val, display: `"${val}"` })
    } else {
      // Multi-value: split by comma
      for (const v of val.split(',').filter(Boolean)) {
        chips.push({ key, value: v, display: `${label}: ${v}` })
      }
    }
  }

  if (!chips.length) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {chips.map(({ key, value, display }) => (
        <button
          key={`${key}-${value}`}
          onClick={() => {
            if (BOOL_KEYS.includes(key) || key === 'q') onRemove(key)
            else onRemove(key, value)
          }}
          className="inline-flex items-center gap-1 font-mono text-[8px] text-primary uppercase border border-primary/40 bg-primary/5 px-2 py-0.5 hover:bg-primary/10 transition-all"
        >
          {display}
          <span className="material-symbols-outlined text-[10px]">close</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 font-mono text-[8px] text-rose-400 uppercase border border-rose-400/30 px-2 py-0.5 hover:bg-rose-400/5 transition-all"
        >
          CLEAR ALL
        </button>
      )}
    </div>
  )
}

// ── FilterPanel (extracted — NOT inside main component) ────────────────────────

interface FilterPanelProps {
  params: URLSearchParams
  providers: { provider: string }[]
  categories: { category: string; count: number }[]
  nav: ReturnType<typeof useFilterNav>
}

function FilterPanel({ params, providers, categories, nav }: FilterPanelProps) {
  const { set, toggleMulti, toggleBool } = nav

  const activeCategories    = getArr(params, 'category')
  const activeStatuses      = getArr(params, 'status')
  const activePricing       = getArr(params, 'pricing')
  const activeProviders     = getArr(params, 'provider')
  const activeCountries     = getArr(params, 'country')
  const activePopularity    = getArr(params, 'popularity')
  const activeModalities    = getArr(params, 'modality')
  const activeCtx           = getStr(params, 'ctx')
  const activeSpeed         = getStr(params, 'speed')
  const activeYear          = getStr(params, 'year')
  const activeRag           = getStr(params, 'rag')
  const activeSize          = getStr(params, 'size')
  const activeSource        = getStr(params, 'source')

  // Provider search
  const [providerSearch, setProviderSearch] = useState('')
  const filteredProviders = providers.filter(p =>
    p.provider.toLowerCase().includes(providerSearch.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-5">

      {/* Sort */}
      <div>
        <SectionHeader label="SORT BY" />
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(opt => (
            <FilterPill
              key={opt.value}
              label={opt.label}
              active={(getStr(params, 'sort') ?? 'trending') === opt.value}
              onClick={() => set('sort', opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <SectionHeader label="CATEGORY" />
        <div className="flex flex-col gap-1">
          {categories.map(({ category, count }) => (
            <FilterPill
              key={category}
              label={`${category} (${count})`}
              active={activeCategories.includes(category)}
              onClick={() => toggleMulti('category', category)}
            />
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <SectionHeader label="STATUS" />
        <div className="flex flex-col gap-1">
          {STATUS_OPTIONS.map(s => (
            <FilterPill
              key={s}
              label={s}
              active={activeStatuses.includes(s)}
              onClick={() => toggleMulti('status', s)}
            />
          ))}
        </div>
      </div>

      {/* Source */}
      <div>
        <SectionHeader label="SOURCE" />
        <div className="flex flex-col gap-1">
          <FilterPill label="Open Source"  active={activeSource === 'Open Source'}  onClick={() => set('source', activeSource === 'Open Source'  ? null : 'Open Source')} />
          <FilterPill label="Closed Source" active={activeSource === 'Closed Source'} onClick={() => set('source', activeSource === 'Closed Source' ? null : 'Closed Source')} />
        </div>
      </div>

      {/* Popularity */}
      <div>
        <SectionHeader label="POPULARITY" />
        <div className="flex flex-col gap-1">
          {POPULARITY_OPTIONS.map(p => (
            <FilterPill
              key={p}
              label={p}
              active={activePopularity.includes(p)}
              onClick={() => toggleMulti('popularity', p)}
            />
          ))}
        </div>
      </div>

      {/* Pricing tier */}
      <div>
        <SectionHeader label="PRICING TIER" />
        <div className="flex flex-col gap-1">
          {PRICING_OPTIONS.map(t => (
            <FilterPill
              key={t}
              label={t}
              active={activePricing.includes(t)}
              onClick={() => toggleMulti('pricing', t)}
            />
          ))}
        </div>
      </div>

      {/* Modality */}
      <div>
        <SectionHeader label="MODALITY" />
        <div className="flex flex-col gap-1">
          {MODALITY_OPTIONS.map(({ value, icon }) => (
            <TogglePill
              key={value}
              label={value}
              icon={icon}
              active={activeModalities.includes(value)}
              onClick={() => toggleMulti('modality', value)}
            />
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <div>
        <SectionHeader label="CAPABILITIES" />
        <div className="flex flex-col gap-1">
          <TogglePill label="Vision"           active={getBool(params, 'vision')}     onClick={() => toggleBool('vision')} />
          <TogglePill label="Audio"            active={getBool(params, 'audio')}      onClick={() => toggleBool('audio')} />
          <TogglePill label="Tool Use"         active={getBool(params, 'tooluse')}    onClick={() => toggleBool('tooluse')} />
          <TogglePill label="Fine-Tuning"      active={getBool(params, 'finetune')}   onClick={() => toggleBool('finetune')} />
          <TogglePill label="Free Tier"        active={getBool(params, 'freetier')}   onClick={() => toggleBool('freetier')} />
          <TogglePill label="Has API"          active={getBool(params, 'api')}        onClick={() => toggleBool('api')} />
        </div>
      </div>

      {/* More Filters accordion */}
      <Accordion label="MORE FILTERS">
        <div className="flex flex-col gap-4 pt-1">

          {/* Context window */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">CONTEXT WINDOW</p>
            <div className="flex flex-col gap-1">
              {CTX_OPTIONS.map(b => (
                <FilterPill
                  key={b.value}
                  label={b.label}
                  active={activeCtx === b.value}
                  onClick={() => set('ctx', activeCtx === b.value ? null : b.value)}
                />
              ))}
            </div>
          </div>

          {/* Response speed */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">RESPONSE SPEED</p>
            <div className="flex flex-col gap-1">
              {LATENCY_OPTIONS.map(opt => (
                <FilterPill
                  key={opt.value}
                  label={opt.label}
                  active={activeSpeed === opt.value}
                  onClick={() => set('speed', activeSpeed === opt.value ? null : opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Release year */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">RELEASE YEAR</p>
            <div className="grid grid-cols-3 gap-1">
              {YEAR_OPTIONS.map(y => (
                <FilterPill
                  key={y}
                  label={String(y)}
                  active={activeYear === String(y)}
                  onClick={() => set('year', activeYear === String(y) ? null : String(y))}
                />
              ))}
            </div>
          </div>

          {/* Model size */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">MODEL SIZE</p>
            <div className="flex flex-col gap-1">
              {SIZE_OPTIONS.map(s => (
                <FilterPill
                  key={s}
                  label={s}
                  active={activeSize === s}
                  onClick={() => set('size', activeSize === s ? null : s)}
                />
              ))}
            </div>
          </div>

          {/* RAG suitability */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">RAG SUITABILITY</p>
            <div className="flex flex-col gap-1">
              {RAG_OPTIONS.map(opt => (
                <FilterPill
                  key={opt.value}
                  label={opt.label}
                  active={activeRag === opt.value}
                  onClick={() => set('rag', activeRag === opt.value ? null : opt.value)}
                />
              ))}
            </div>
          </div>

          {/* Advanced capabilities */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">ADVANCED CAPABILITIES</p>
            <div className="flex flex-col gap-1">
              <TogglePill label="Embeddings"        active={getBool(params, 'embedding')}  onClick={() => toggleBool('embedding')} />
              <TogglePill label="JSON Mode"         active={getBool(params, 'jsonmode')}   onClick={() => toggleBool('jsonmode')} />
              <TogglePill label="Structured Output" active={getBool(params, 'structured')} onClick={() => toggleBool('structured')} />
              <TogglePill label="Enterprise Ready"  active={getBool(params, 'enterprise')} onClick={() => toggleBool('enterprise')} />
            </div>
          </div>

          {/* Provider country */}
          <div>
            <p className="font-mono text-[8px] text-data-dim uppercase mb-1">PROVIDER COUNTRY</p>
            <div className="flex flex-col gap-1">
              {PROVIDER_COUNTRIES.map(c => (
                <FilterPill
                  key={c}
                  label={c}
                  active={activeCountries.includes(c)}
                  onClick={() => toggleMulti('country', c)}
                />
              ))}
            </div>
          </div>

        </div>
      </Accordion>

      {/* Provider search */}
      <div>
        <SectionHeader label="PROVIDER" />
        <input
          type="text"
          value={providerSearch}
          onChange={e => setProviderSearch(e.target.value)}
          placeholder="FILTER PROVIDERS..."
          className="w-full bg-surface-container-low border border-terminal-border font-mono text-[9px] text-on-surface uppercase placeholder:text-data-dim px-2 py-1.5 outline-none mb-1 hover:border-primary/40 transition-colors"
        />
        <div className="max-h-44 overflow-y-auto flex flex-col gap-1 custom-scrollbar pr-1">
          {filteredProviders.map(({ provider }) => (
            <FilterPill
              key={provider}
              label={provider}
              active={activeProviders.includes(provider)}
              onClick={() => toggleMulti('provider', provider)}
            />
          ))}
          {filteredProviders.length === 0 && (
            <p className="font-mono text-[8px] text-data-dim uppercase py-1">No providers found</p>
          )}
        </div>
      </div>

    </div>
  )
}

// ── Main client component ──────────────────────────────────────────────────────

export default function ModelsLibraryClient({
  models,
  total,
  providers,
  categories,
}: ModelsLibraryClientProps) {
  const nav = useFilterNav()
  const { params, set, clearAll, isPending } = nav
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = countActiveFilters(params)
  const totalPages  = Math.ceil(total / 24)
  const currentPage = parseInt(params.get('page') ?? '1')

  // Remove a single chip
  const removeChip = useCallback((key: string, value?: string) => {
    if (!value || BOOL_KEYS.includes(key) || key === 'q') {
      set(key, null)
    } else {
      nav.toggleMulti(key, value)
    }
  }, [set, nav])

  return (
    <div className={`min-h-screen bg-electromagnetic-ink pt-16 transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
      {/* Page hero */}
      <div className="border-b border-terminal-border bg-surface-container-lowest px-4 lg:px-8 py-8">
        <span className="font-mono text-[9px] text-primary uppercase block mb-2 tracking-widest">
          [MODEL_INDEX]
        </span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-3">
          AI Model Index
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant max-w-lg mb-5">
          {total} models documented, compared, and rated. Find the right model for your use case.
        </p>
        <div className="max-w-xl">
          <SearchInput
            currentValue={params.get('q') ?? ''}
            onSearch={v => set('q', v || null)}
          />
        </div>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 xl:w-64 border-r border-terminal-border p-5 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <FilterPanel params={params} providers={providers} categories={categories} nav={nav} />
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-4 w-full font-mono text-[9px] text-rose-400 uppercase border border-rose-400/30 py-1.5 hover:bg-rose-400/5 transition-all"
            >
              CLEAR ALL ({activeCount})
            </button>
          )}
        </aside>

        {/* Mobile filter bar */}
        <div className="lg:hidden w-full">
          <div className="border-b border-terminal-border px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 font-mono text-[10px] text-on-surface uppercase border border-terminal-border px-3 py-2 hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              FILTERS {activeCount > 0 && `(${activeCount})`}
            </button>
            <span className="font-mono text-[9px] text-data-dim uppercase">{total} models</span>
          </div>

          {mobileOpen && (
            <div className="fixed inset-0 z-50 bg-electromagnetic-ink pt-0 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-surface-container-lowest flex-shrink-0">
                <span className="font-mono text-[10px] text-primary uppercase">[FILTERS] ({activeCount})</span>
                <button onClick={() => setMobileOpen(false)} className="text-data-dim hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <FilterPanel params={params} providers={providers} categories={categories} nav={nav} />
                {activeCount > 0 && (
                  <button
                    onClick={() => { clearAll(); setMobileOpen(false) }}
                    className="mt-4 w-full font-mono text-[9px] text-rose-400 uppercase border border-rose-400/30 py-1.5 hover:bg-rose-400/5 transition-all"
                  >
                    CLEAR ALL ({activeCount})
                  </button>
                )}
              </div>
              <div className="border-t border-terminal-border p-4 flex-shrink-0">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full font-mono text-[10px] text-primary uppercase border border-primary py-2.5 hover:bg-primary/5 transition-all"
                >
                  SHOW {total} RESULTS
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 min-w-0">
          {models.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-data-dim text-5xl mb-4 block">search_off</span>
              <p className="font-mono text-[11px] text-data-dim uppercase mb-2">
                No models match your filters.
              </p>
              {activeCount > 0 && (
                <p className="font-mono text-[10px] text-data-dim uppercase mb-4">
                  {activeCount} filter{activeCount > 1 ? 's' : ''} active
                </p>
              )}
              <button
                onClick={clearAll}
                className="font-mono text-[10px] text-primary uppercase border border-primary/40 px-4 py-2 hover:bg-primary/5 transition-all"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <>
              {/* Results bar */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[9px] text-data-dim uppercase">
                  SHOWING {(currentPage - 1) * 24 + 1}–{Math.min(currentPage * 24, total)} OF {total} MODELS
                </span>
                {isPending && (
                  <span className="font-mono text-[8px] text-primary uppercase animate-pulse tracking-wider">
                    LOADING...
                  </span>
                )}
              </div>

              {/* Active filter chips */}
              <ActiveFilterChips
                params={params}
                onRemove={removeChip}
                onClearAll={clearAll}
              />

              {/* Model grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {models.map(model => (
                  <div key={model.slug} className="bg-electromagnetic-ink">
                    <ModelCard model={model} variant="default" />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-terminal-border">
                  <button
                    onClick={() => set('page', String(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="font-mono text-[9px] text-on-surface uppercase border border-terminal-border px-4 py-2 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← PREV
                  </button>
                  <span className="font-mono text-[9px] text-data-dim uppercase px-4">
                    PAGE {currentPage} OF {totalPages}
                  </span>
                  <button
                    onClick={() => set('page', String(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="font-mono text-[9px] text-on-surface uppercase border border-terminal-border px-4 py-2 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
