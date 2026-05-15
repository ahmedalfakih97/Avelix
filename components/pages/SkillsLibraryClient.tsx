'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Skill, SkillFilters } from '@/types/skill'
import SkillCard from '@/components/library/SkillCard'
import SearchBox from '@/components/library/SearchBox'
import { cn } from '@/lib/utils'

interface SkillsLibraryClientProps {
  initialSkills: Skill[]
  initialTotal: number
  initialFilters: SkillFilters
}

const DIFFICULTY_OPTIONS = [
  { value: undefined,       label: 'ALL_LEVELS' },
  { value: 'beginner',      label: 'BEGINNER' },
  { value: 'intermediate',  label: 'INTERMEDIATE' },
  { value: 'advanced',      label: 'ADVANCED' },
] as const

const TIME_OPTIONS = [
  { value: undefined, label: 'ANY_TIME' },
  { value: 1,         label: '<1H' },
  { value: 3,         label: '≤3H' },
  { value: 8,         label: '≤8H' },
] as const

const SORT_OPTIONS = [
  { value: 'popular',  label: 'POPULAR' },
  { value: 'newest',   label: 'NEWEST' },
  { value: 'easiest',  label: 'EASIEST_FIRST' },
  { value: 'quickest', label: 'QUICKEST_FIRST' },
] as const

function filtersToParams(f: SkillFilters): URLSearchParams {
  const p = new URLSearchParams()
  if (f.search)     p.set('search', f.search)
  if (f.difficulty) p.set('difficulty', f.difficulty)
  if (f.time_max)   p.set('time_max', String(f.time_max))
  if (f.sort && f.sort !== 'popular') p.set('sort', f.sort)
  if (f.page && f.page > 1) p.set('page', String(f.page))
  return p
}

export default function SkillsLibraryClient({
  initialSkills,
  initialTotal,
  initialFilters,
}: SkillsLibraryClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [filters, setFilters] = useState<SkillFilters>(initialFilters)
  const [skills] = useState<Skill[]>(initialSkills)
  const [total] = useState(initialTotal)

  const handleChange = useCallback(
    (next: SkillFilters) => {
      setFilters(next)
      const params = filtersToParams(next)
      startTransition(() => {
        router.push(`/skills?${params.toString()}`, { scroll: false })
      })
    },
    [router]
  )

  return (
    <div className="min-h-screen bg-electromagnetic-ink pt-16">
      {/* Page header */}
      <div className="border-b border-terminal-border bg-surface-container-lowest px-4 py-8">
        <span className="font-mono text-label-caps text-primary uppercase block mb-2">[SKILL_MATRIX]</span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
          AI Skills
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant max-w-lg">
          Learn to use AI effectively. Structured, practical skills from beginner to advanced — with step-by-step guides and real examples.
        </p>
        <div className="mt-6 max-w-xl">
          <SearchBox
            value={filters.search ?? ''}
            onChange={(s) => handleChange({ ...filters, search: s || undefined, page: 1 })}
            placeholder="SEARCH_SKILLS..."
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b border-terminal-border px-4 py-3 bg-surface-container-lowest overflow-x-auto">
        <div className="flex items-center gap-6 min-w-max">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-data-dim uppercase">LEVEL:</span>
            <div className="flex gap-1">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleChange({ ...filters, difficulty: opt.value as SkillFilters['difficulty'], page: 1 })}
                  className={cn(
                    'font-mono text-[9px] px-2.5 py-1 uppercase border transition-all',
                    filters.difficulty === opt.value
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-terminal-border text-on-surface-variant hover:border-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-data-dim uppercase">TIME:</span>
            <div className="flex gap-1">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleChange({ ...filters, time_max: opt.value, page: 1 })}
                  className={cn(
                    'font-mono text-[9px] px-2.5 py-1 uppercase border transition-all',
                    filters.time_max === opt.value
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-terminal-border text-on-surface-variant hover:border-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-mono text-[9px] text-data-dim uppercase">SORT:</span>
            <div className="flex gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleChange({ ...filters, sort: opt.value, page: 1 })}
                  className={cn(
                    'font-mono text-[9px] px-2.5 py-1 uppercase border transition-all',
                    (filters.sort ?? 'popular') === opt.value
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-terminal-border text-on-surface-variant hover:border-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="p-4 lg:p-6">
        {skills.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-data-dim text-4xl mb-4 block">search_off</span>
            <p className="font-mono text-[11px] text-data-dim uppercase">No skills match your filters.</p>
            <button
              onClick={() => handleChange({})}
              className="mt-4 font-mono text-[10px] text-primary uppercase hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-data-dim uppercase">
                {total} skills
                {filters.search && ` matching "${filters.search}"`}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
              {skills.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} variant="default" />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
