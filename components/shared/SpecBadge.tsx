import { cn } from '@/lib/utils'

type SpecType = 'speed' | 'context' | 'open-source' | 'api' | 'model-type' | 'status' | 'input' | 'output'

interface SpecBadgeProps {
  type: SpecType
  value: string
  className?: string
}

const SPEED_CONFIG: Record<string, { label: string; cls: string }> = {
  very_fast: { label: 'VERY FAST', cls: 'text-electric-teal border-electric-teal/40' },
  fast:      { label: 'FAST',      cls: 'text-primary border-primary/40' },
  medium:    { label: 'MEDIUM',    cls: 'text-secondary border-secondary/40' },
  slow:      { label: 'SLOW',      cls: 'text-signal-orange border-signal-orange/40' },
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  active:     { label: 'ACTIVE',     cls: 'text-electric-teal border-electric-teal/40' },
  preview:    { label: 'PREVIEW',    cls: 'text-secondary border-secondary/40' },
  deprecated: { label: 'DEPRECATED', cls: 'text-signal-orange border-signal-orange/40' },
  research:   { label: 'RESEARCH',   cls: 'text-on-surface-variant border-terminal-border' },
}

const MODEL_TYPE_ICON: Record<string, string> = {
  llm:        'psychology',
  reasoning:  'calculate',
  image:      'image',
  video:      'movie',
  audio:      'mic',
  embedding:  'hub',
  coding:     'code',
  multimodal: 'all_inclusive',
}

const INPUT_ICON: Record<string, string> = {
  text:  'text_fields',
  image: 'image',
  audio: 'mic',
  video: 'movie',
  code:  'code',
}

function formatContextWindow(tokens: string): string {
  const n = parseInt(tokens)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1000)      return `${(n / 1000).toFixed(0)}K`
  return tokens
}

export default function SpecBadge({ type, value, className }: SpecBadgeProps) {
  if (type === 'speed') {
    const cfg = SPEED_CONFIG[value] ?? { label: value.toUpperCase(), cls: 'text-data-dim border-terminal-border' }
    return (
      <span className={cn('inline-flex items-center gap-1 font-mono text-[9px] border px-2 py-0.5 uppercase', cfg.cls, className)}>
        <span className="material-symbols-outlined text-[11px]">speed</span>
        {cfg.label}
      </span>
    )
  }

  if (type === 'status') {
    const cfg = STATUS_CONFIG[value] ?? { label: value.toUpperCase(), cls: 'text-data-dim border-terminal-border' }
    return (
      <span className={cn('inline-flex items-center gap-1 font-mono text-[9px] border px-2 py-0.5 uppercase', cfg.cls, className)}>
        <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {value === 'active' ? 'circle' : value === 'deprecated' ? 'cancel' : 'pending'}
        </span>
        {cfg.label}
      </span>
    )
  }

  if (type === 'context') {
    return (
      <span className={cn('inline-flex items-center gap-1 font-mono text-[9px] border border-terminal-border text-on-surface-variant px-2 py-0.5 uppercase', className)}>
        <span className="material-symbols-outlined text-[11px]">memory</span>
        CTX: {formatContextWindow(value)}
      </span>
    )
  }

  if (type === 'open-source') {
    const isOpen = value === 'true'
    return (
      <span className={cn(
        'inline-flex items-center gap-1 font-mono text-[9px] border px-2 py-0.5 uppercase',
        isOpen ? 'text-signal-orange border-signal-orange/40' : 'text-data-dim border-terminal-border',
        className
      )}>
        <span className="material-symbols-outlined text-[11px]">{isOpen ? 'lock_open' : 'lock'}</span>
        {isOpen ? 'OPEN SOURCE' : 'CLOSED'}
      </span>
    )
  }

  if (type === 'api') {
    const hasApi = value === 'true'
    return (
      <span className={cn(
        'inline-flex items-center gap-1 font-mono text-[9px] border px-2 py-0.5 uppercase',
        hasApi ? 'text-primary border-primary/40' : 'text-data-dim border-terminal-border',
        className
      )}>
        <span className="material-symbols-outlined text-[11px]">api</span>
        {hasApi ? 'API' : 'NO API'}
      </span>
    )
  }

  if (type === 'model-type') {
    const icon = MODEL_TYPE_ICON[value] ?? 'dataset'
    return (
      <span className={cn('inline-flex items-center gap-1 font-mono text-[9px] border border-primary/40 text-primary px-2 py-0.5 uppercase', className)}>
        <span className="material-symbols-outlined text-[11px]">{icon}</span>
        {value.toUpperCase()}
      </span>
    )
  }

  if (type === 'input' || type === 'output') {
    const icon = INPUT_ICON[value] ?? 'data_object'
    return (
      <span className={cn('inline-flex items-center gap-1 font-mono text-[9px] border border-terminal-border text-on-surface-variant px-2 py-0.5 uppercase', className)}>
        <span className="material-symbols-outlined text-[11px]">{icon}</span>
        {value.toUpperCase()}
      </span>
    )
  }

  return null
}
