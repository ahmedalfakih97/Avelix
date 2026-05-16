'use client'

export interface ActiveTag {
  key: string
  label: string
  onRemove: () => void
}

interface ActiveFilterTagsProps {
  tags: ActiveTag[]
  onClearAll: () => void
}

export default function ActiveFilterTags({ tags, onClearAll }: ActiveFilterTagsProps) {
  if (!tags.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-terminal-border bg-surface-container-lowest">
      <span className="font-mono text-[9px] text-data-dim uppercase flex-shrink-0">Active:</span>
      {tags.map((tag) => (
        <button
          key={tag.key}
          onClick={tag.onRemove}
          className="inline-flex items-center gap-1 border border-primary/40 text-primary bg-primary/5 font-mono text-[9px] px-2 py-0.5 uppercase hover:bg-primary/10 transition-colors group"
        >
          {tag.label}
          <span className="material-symbols-outlined text-[11px] group-hover:text-electric-teal transition-colors">
            close
          </span>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="font-mono text-[9px] text-signal-orange uppercase hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}
