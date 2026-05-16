'use client'

export default function SearchButton() {
  const openSearch = () => {
    window.dispatchEvent(new Event('avelix:search-open'))
  }

  return (
    <button
      onClick={openSearch}
      aria-label="Open search (Cmd+K)"
      className="flex items-center gap-1.5 border border-terminal-border px-2.5 py-1.5 text-data-dim hover:border-primary hover:text-primary transition-all group"
    >
      <span className="material-symbols-outlined text-base">search</span>
      <span className="hidden sm:block font-mono text-[9px] uppercase">Cmd+K</span>
    </button>
  )
}
