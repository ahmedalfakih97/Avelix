'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { GlossaryTerm } from '@/types/glossary'
import GlossaryTermCard from '@/components/library/GlossaryTermCard'
import AlphabetNav from '@/components/shared/AlphabetNav'
import { groupTermsByLetter } from '@/lib/glossary-utils'

interface GlossaryIndexClientProps {
  terms: GlossaryTerm[]
}

export default function GlossaryIndexClient({ terms }: GlossaryIndexClientProps) {
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | undefined>()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return terms
    const q = search.toLowerCase()
    return terms.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.simple_definition.toLowerCase().includes(q)
    )
  }, [search, terms])

  const grouped = useMemo(() => groupTermsByLetter(filtered), [filtered])
  const letters = Object.keys(grouped).sort()

  // Intersection Observer to update active letter as user scrolls
  useEffect(() => {
    if (search) return // no active tracking while searching
    observerRef.current?.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveLetter(entry.target.id.replace('letter-', ''))
            break
          }
        }
      },
      { rootMargin: '-112px 0px -70% 0px', threshold: 0 }
    )

    letters.forEach((l) => {
      const el = document.getElementById(`letter-${l}`)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [letters, search])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setActiveLetter(undefined)
  }, [])

  return (
    <div>
      {/* Search */}
      <div className="border-b border-terminal-border px-4 py-4 bg-surface-container-lowest">
        <div className="relative max-w-xl">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-data-dim text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="SEARCH_TERMS..."
            className="w-full bg-electromagnetic-ink border border-terminal-border pl-9 pr-4 py-2.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim uppercase focus:border-primary focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-data-dim hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-[9px] text-data-dim uppercase">
            {filtered.length} {filtered.length === 1 ? 'term' : 'terms'}
            {search && ` matching "${search}"`}
          </span>
        </div>
      </div>

      {/* Alphabet nav — sticky below header */}
      {!search && (
        <div className="sticky top-16 z-40 border-b border-terminal-border bg-surface-container-lowest px-4 py-2 overflow-x-auto custom-scrollbar">
          <AlphabetNav availableLetters={letters} activeLetter={activeLetter} />
        </div>
      )}

      {/* Term groups */}
      <div className="px-4 py-8">
        {letters.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-data-dim text-4xl mb-4 block">search_off</span>
            <p className="font-mono text-[11px] text-data-dim uppercase">{`No terms match "${search}"`}</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 font-mono text-[10px] text-primary uppercase hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {letters.map((letter) => (
              <div key={letter} id={`letter-${letter}`}>
                {/* Letter heading */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono text-[28px] text-primary font-bold leading-none">{letter}</span>
                  <div className="h-px flex-1 bg-terminal-border" />
                  <span className="font-mono text-[9px] text-data-dim uppercase">
                    {grouped[letter].length} {grouped[letter].length === 1 ? 'term' : 'terms'}
                  </span>
                </div>

                {/* Terms */}
                <div className="grid grid-cols-1 gap-px bg-terminal-border border border-terminal-border">
                  {grouped[letter].map((term) => (
                    <GlossaryTermCard key={term.slug} term={term} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
