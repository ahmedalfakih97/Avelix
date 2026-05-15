'use client'

import { cn } from '@/lib/utils'
import type { ToolFilters } from '@/types/tool'
import { CATEGORIES } from '@/lib/mock-tools'

interface FilterBarProps {
  filters: ToolFilters
  onChange: (filters: ToolFilters) => void
  totalCount: number
}

const PRICING_OPTIONS = [
  { value: 'free',         label: 'FREE' },
  { value: 'freemium',     label: 'FREEMIUM' },
  { value: 'paid',         label: 'PAID' },
  { value: 'open-source',  label: 'OPEN SOURCE' },
]

const USER_TYPE_OPTIONS = [
  { value: 'beginner',   label: 'BEGINNER' },
  { value: 'creator',    label: 'CREATOR' },
  { value: 'developer',  label: 'DEVELOPER' },
  { value: 'business',   label: 'BUSINESS' },
]

const SORT_OPTIONS = [
  { value: 'relevant',   label: 'MOST RELEVANT' },
  { value: 'top_rated',  label: 'TOP RATED' },
  { value: 'newest',     label: 'NEWEST' },
  { value: 'free_first', label: 'FREE FIRST' },
]

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
      className={cn(
        'whitespace-nowrap border px-3 py-1.5 font-mono text-[10px] uppercase transition-all',
        active
          ? 'border-primary text-primary bg-primary/5'
          : 'border-terminal-border text-on-surface hover:border-primary'
      )}
    >
      {label}
    </button>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-terminal-border pb-5 mb-5">
      <p className="font-mono text-[9px] text-data-dim uppercase tracking-widest mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default function FilterBar({ filters, onChange, totalCount }: FilterBarProps) {
  const set = (key: keyof ToolFilters, value: unknown) =>
    onChange({ ...filters, [key]: value, page: 1 })

  const toggle = (key: keyof ToolFilters) =>
    onChange({ ...filters, [key]: !filters[key as keyof ToolFilters], page: 1 })

  const activeCount = [
    filters.category, filters.pricing, filters.user_type,
    filters.has_free_plan, filters.has_api, filters.no_code, filters.arabic_support,
  ].filter(Boolean).length

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] text-primary uppercase">[TOOL_DIRECTORY]</span>
        <span className="font-mono text-[10px] text-data-dim uppercase">{totalCount} tools</span>
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => onChange({ sort: filters.sort })}
          className="w-full mb-5 border border-terminal-border py-2 font-mono text-[10px] text-data-dim hover:border-primary hover:text-primary uppercase transition-all"
        >
          Clear Filters ({activeCount})
        </button>
      )}

      <FilterSection label="Sort">
        {SORT_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={(filters.sort ?? 'relevant') === opt.value}
            onClick={() => set('sort', opt.value)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Category">
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.id}
            label={cat.name.toUpperCase()}
            active={filters.category === cat.id}
            onClick={() => set('category', filters.category === cat.id ? undefined : cat.id)}
          />
        ))}
      </FilterSection>

      <FilterSection label="Pricing">
        {PRICING_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={filters.pricing === opt.value}
            onClick={() => set('pricing', filters.pricing === opt.value ? undefined : opt.value)}
          />
        ))}
      </FilterSection>

      <FilterSection label="User Type">
        {USER_TYPE_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            label={opt.label}
            active={filters.user_type === opt.value}
            onClick={() => set('user_type', filters.user_type === opt.value ? undefined : opt.value)}
          />
        ))}
      </FilterSection>

      <div className="border-b border-terminal-border pb-5 mb-5">
        <p className="font-mono text-[9px] text-data-dim uppercase tracking-widest mb-3">Features</p>
        <div className="flex flex-col gap-2">
          {[
            { key: 'has_free_plan' as const, label: 'FREE PLAN AVAILABLE' },
            { key: 'has_api'       as const, label: 'HAS API' },
            { key: 'no_code'       as const, label: 'NO-CODE' },
            { key: 'arabic_support' as const, label: 'ARABIC SUPPORT' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={cn(
                'flex items-center gap-2 font-mono text-[10px] uppercase transition-colors text-left',
                filters[key] ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <span className="material-symbols-outlined text-sm">
                {filters[key] ? 'check_box' : 'check_box_outline_blank'}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
