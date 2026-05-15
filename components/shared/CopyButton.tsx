'use client'

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  return (
    <button
      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={() => navigator.clipboard.writeText(text)}
      aria-label="Copy prompt"
    >
      <span className="material-symbols-outlined text-data-dim hover:text-primary text-base transition-colors">
        content_copy
      </span>
    </button>
  )
}
