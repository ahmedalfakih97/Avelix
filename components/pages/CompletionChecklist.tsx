'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CompletionChecklistProps {
  items: string[]
  pathSlug: string
}

export default function CompletionChecklist({ items, pathSlug }: CompletionChecklistProps) {
  const storageKey = `avelix-checklist-${pathSlug}`
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [storageKey])

  const toggle = (i: number) => {
    const next = checked.map((v, idx) => (idx === i ? !v : v))
    setChecked(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }

  const completedCount = checked.filter(Boolean).length
  const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] text-data-dim uppercase">
          PROGRESS: {completedCount}/{items.length}
        </span>
        <span className="font-mono text-[9px] text-primary uppercase">{progress}%</span>
      </div>
      <div className="h-1 w-full bg-surface-container mb-6">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={cn(
              'flex items-start gap-3 p-4 border text-left transition-all',
              checked[i]
                ? 'border-primary/40 bg-primary/5'
                : 'border-terminal-border bg-electromagnetic-ink hover:border-primary/30'
            )}
          >
            <div className={cn(
              'w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
              checked[i] ? 'border-primary bg-primary' : 'border-data-dim'
            )}>
              {checked[i] && (
                <span className="material-symbols-outlined text-electromagnetic-ink text-[12px]">check</span>
              )}
            </div>
            <span className={cn(
              'font-body text-body-sm transition-colors',
              checked[i] ? 'text-on-surface-variant line-through' : 'text-on-surface'
            )}>
              {item}
            </span>
          </button>
        ))}
      </div>

      {completedCount === items.length && items.length > 0 && (
        <div className="mt-6 border border-primary/40 bg-primary/5 p-4 text-center">
          <span className="material-symbols-outlined text-primary text-2xl block mb-2">verified</span>
          <p className="font-mono text-[10px] text-primary uppercase">PATH_COMPLETE — Congratulations!</p>
        </div>
      )}
    </div>
  )
}
