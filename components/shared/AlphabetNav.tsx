'use client'

import { cn } from '@/lib/utils'

interface AlphabetNavProps {
  availableLetters: string[]
  activeLetter?: string
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function AlphabetNav({ availableLetters, activeLetter }: AlphabetNavProps) {
  const available = new Set(availableLetters)

  const scrollTo = (letter: string) => {
    const el = document.getElementById(`letter-${letter}`)
    if (el) {
      const offset = 112 // header (64px) + alphabet nav (~48px)
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-wrap gap-px bg-terminal-border border border-terminal-border">
      {ALPHABET.map((letter) => {
        const active = available.has(letter)
        const current = activeLetter === letter
        return (
          <button
            key={letter}
            disabled={!active}
            onClick={() => active && scrollTo(letter)}
            className={cn(
              'w-8 h-8 font-mono text-[10px] uppercase flex items-center justify-center transition-all',
              current
                ? 'bg-primary text-electromagnetic-ink'
                : active
                ? 'bg-electromagnetic-ink text-on-surface hover:bg-surface-container hover:text-primary cursor-pointer'
                : 'bg-electromagnetic-ink text-data-dim/30 cursor-default'
            )}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
