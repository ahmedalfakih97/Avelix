import CopyButton from '@/components/shared/CopyButton'

interface PromptBlockProps {
  text: string
  title?: string
  model?: string
}

export default function PromptBlock({ text, title, model }: PromptBlockProps) {
  return (
    <div className="relative border border-terminal-border bg-surface-container-lowest group">
      {(title || model) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border">
          {title && (
            <span className="font-mono text-[9px] text-primary uppercase">{title}</span>
          )}
          {model && (
            <span className="font-mono text-[8px] text-data-dim uppercase">MODEL: {model}</span>
          )}
        </div>
      )}
      <div className="p-4 pr-12">
        <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
      <CopyButton text={text} />
    </div>
  )
}
