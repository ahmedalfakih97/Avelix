'use client'

import { useCallback, useRef } from 'react'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBox({ value, onChange, placeholder = 'SEARCH_TOOLS...' }: SearchBoxProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      clearTimeout(timer.current)
      timer.current = setTimeout(() => onChange(val), 300)
    },
    [onChange]
  )

  return (
    <div className="relative flex items-center border border-terminal-border focus-within:border-primary transition-colors bg-electromagnetic-ink">
      <span className="material-symbols-outlined text-data-dim text-base px-3">search</span>
      <input
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-3 pr-3 font-mono text-[11px] text-on-surface placeholder:text-data-dim uppercase tracking-wider outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="px-3 text-data-dim hover:text-primary transition-colors"
          aria-label="Clear search"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  )
}
