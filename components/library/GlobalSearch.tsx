'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SearchResultItem, SearchResults } from '@/app/api/search/route'

const TYPE_ICON: Record<string, string> = {
  tool:  'dataset',
  model: 'psychology',
  skill: 'school',
  term:  'menu_book',
}

const TYPE_LABEL: Record<string, string> = {
  tool:  '// TOOLS',
  model: '// MODELS',
  skill: '// SKILLS',
  term:  '// GLOSSARY',
}

const EMPTY: SearchResults = { tools: [], models: [], skills: [], terms: [], query: '' }

export default function GlobalSearch() {
  const [open, setOpen]             = useState(false)
  const [query, setQuery]           = useState('')
  const [results, setResults]       = useState<SearchResults>(EMPTY)
  const [loading, setLoading]       = useState(false)
  const [activeIdx, setActiveIdx]   = useState(-1)
  const inputRef                    = useRef<HTMLInputElement>(null)
  const debounceRef                 = useRef<ReturnType<typeof setTimeout>>()
  const router                      = useRouter()

  // ── Open / close ──────────────────────────────────────────────
  const openSearch = useCallback(() => {
    setOpen(true)
    setQuery('')
    setResults(EMPTY)
    setActiveIdx(-1)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const closeSearch = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults(EMPTY)
  }, [])

  // Listen for custom event from header button
  useEffect(() => {
    const handle = () => openSearch()
    window.addEventListener('avelix:search-open', handle)
    return () => window.removeEventListener('avelix:search-open', handle)
  }, [openSearch])

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? closeSearch() : openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, openSearch, closeSearch])

  // ── Flat result list for keyboard nav ─────────────────────────
  const allResults: SearchResultItem[] = [
    ...results.tools,
    ...results.models,
    ...results.skills,
    ...results.terms,
  ]

  // ── Keyboard navigation inside modal ──────────────────────────
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { closeSearch(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, allResults.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
      if (activeIdx <= 0) inputRef.current?.focus()
    }
    if (e.key === 'Enter' && activeIdx >= 0 && allResults[activeIdx]) {
      router.push(allResults[activeIdx].href)
      closeSearch()
    }
  }

  // ── Debounced search fetch ─────────────────────────────────────
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    setActiveIdx(-1)
    clearTimeout(debounceRef.current)

    if (!q.trim()) { setResults(EMPTY); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data: SearchResults = await res.json()
        setResults(data)
      } catch {
        setResults(EMPTY)
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  // ── Flat index within a typed group ───────────────────────────
  const flatIdx = (type: SearchResultItem['type'], localIdx: number) => {
    const offsets = {
      tool:  0,
      model: results.tools.length,
      skill: results.tools.length + results.models.length,
      term:  results.tools.length + results.models.length + results.skills.length,
    }
    return offsets[type] + localIdx
  }

  if (!open) return null

  const hasResults = allResults.length > 0
  const groups: [SearchResultItem['type'], SearchResultItem[]][] = [
    ['tool',  results.tools],
    ['model', results.models],
    ['skill', results.skills],
    ['term',  results.terms],
  ]

  return (
    <div
      className="fixed inset-0 z-50 bg-electromagnetic-ink/80 backdrop-blur-sm flex items-start justify-center px-4 pt-20"
      onClick={(e) => { if (e.target === e.currentTarget) closeSearch() }}
      onKeyDown={onKeyDown}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-terminal-border flex flex-col overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 10rem)' }}
      >
        {/* ── Header bar ── */}
        <div className="flex items-center border-b border-terminal-border px-4 py-3 gap-3">
          <span className="font-mono text-[9px] text-primary uppercase flex-shrink-0">[GLOBAL_SEARCH]</span>
          <div className="flex-1 flex items-center gap-2">
            {loading
              ? <span className="material-symbols-outlined text-primary text-base animate-spin">refresh</span>
              : <span className="material-symbols-outlined text-data-dim text-base">search</span>
            }
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInput}
              placeholder="SEARCH_ALL..."
              className="flex-1 bg-transparent font-mono text-[12px] text-on-surface placeholder:text-data-dim uppercase tracking-wider outline-none"
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden sm:block font-mono text-[8px] text-data-dim border border-terminal-border px-1.5 py-0.5 uppercase">ESC</span>
            <button onClick={closeSearch} className="text-data-dim hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {!query.trim() && (
            <div className="px-4 py-8 text-center">
              <span className="material-symbols-outlined text-data-dim text-3xl block mb-3">manage_search</span>
              <p className="font-mono text-[10px] text-data-dim uppercase">Type to search tools, models, skills &amp; terms</p>
              <p className="font-mono text-[9px] text-data-dim/50 mt-2 uppercase">Use ↑ ↓ to navigate · Enter to open · Esc to close</p>
            </div>
          )}

          {query.trim() && !loading && !hasResults && (
            <div className="px-4 py-8 text-center">
              <span className="material-symbols-outlined text-data-dim text-3xl block mb-3">search_off</span>
              <p className="font-mono text-[10px] text-data-dim uppercase">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          {hasResults && (
            <div className="pb-2">
              {groups.map(([type, items]) => {
                if (!items.length) return null
                return (
                  <div key={type}>
                    {/* Group label */}
                    <div className="px-4 py-2 border-b border-terminal-border/50">
                      <span className="font-mono text-[9px] text-data-dim uppercase">{TYPE_LABEL[type]}</span>
                    </div>
                    {/* Items */}
                    {items.map((item, localI) => {
                      const globalI = flatIdx(type, localI)
                      const isActive = activeIdx === globalI
                      return (
                        <Link
                          key={item.objectID || item.slug}
                          href={item.href}
                          onClick={closeSearch}
                          onMouseEnter={() => setActiveIdx(globalI)}
                          className={`flex items-center gap-3 px-4 py-3 border-b border-terminal-border/30 transition-colors group ${
                            isActive ? 'bg-surface-container' : 'hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="w-7 h-7 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-sm transition-colors">
                              {TYPE_ICON[type]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-[11px] text-on-surface uppercase truncate group-hover:text-primary transition-colors">
                              {item.title}
                            </p>
                            <p className="font-body text-[12px] text-on-surface-variant truncate">{item.description}</p>
                          </div>
                          {item.badge && (
                            <span className="font-mono text-[8px] text-data-dim border border-terminal-border px-1.5 py-0.5 uppercase flex-shrink-0 hidden sm:block">
                              {item.badge}
                            </span>
                          )}
                          <span className={`material-symbols-outlined text-sm flex-shrink-0 transition-colors ${
                            isActive ? 'text-primary' : 'text-data-dim group-hover:text-primary'
                          }`}>
                            north_east
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer: see all ── */}
        {query.trim() && (
          <div className="border-t border-terminal-border px-4 py-3 flex items-center justify-between">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={closeSearch}
              className="font-mono text-[10px] text-primary uppercase hover:text-electric-teal transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
              See all results for &ldquo;{query}&rdquo;
            </Link>
            <span className="font-mono text-[9px] text-data-dim uppercase hidden sm:block">
              {allResults.length} result{allResults.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
