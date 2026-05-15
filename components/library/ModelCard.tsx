import Link from 'next/link'
import type { Model } from '@/types/model'
import SpecBadge from '@/components/shared/SpecBadge'
import { cn } from '@/lib/utils'

interface ModelCardProps {
  model: Pick<Model,
    'slug' | 'title' | 'provider' | 'model_type' | 'short_description' |
    'context_window' | 'is_open_source' | 'has_api' | 'speed' | 'best_for' |
    'pricing_model' | 'current_status' | 'input_types' | 'output_types'
  >
  variant?: 'default' | 'compact' | 'featured'
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

const PROVIDER_ABBR: Record<string, string> = {
  OpenAI:          'OAI',
  Anthropic:       'ANT',
  Google:          'GGL',
  Meta:            'META',
  Mistral:         'MST',
  'Stability AI':  'STA',
  Cohere:          'COH',
}

function formatCtx(n?: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return `${(n / 1000).toFixed(0)}K`
}

export default function ModelCard({ model, variant = 'default' }: ModelCardProps) {
  const icon   = MODEL_TYPE_ICON[model.model_type] ?? 'dataset'
  const abbr   = PROVIDER_ABBR[model.provider] ?? model.provider.slice(0, 3).toUpperCase()

  if (variant === 'compact') {
    return (
      <Link
        href={`/models/${model.slug}`}
        className="flex items-center gap-3 p-3 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
      >
        <div className="w-6 h-6 bg-surface-container flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:text-primary transition-colors">
            {icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-on-surface uppercase truncate">{model.title}</p>
          <p className="font-mono text-[9px] text-data-dim uppercase">{model.provider}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="font-mono text-[8px] text-data-dim uppercase">CTX: {formatCtx(model.context_window)}</span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/models/${model.slug}`}
      className="flex flex-col p-5 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-base">{icon}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-data-dim uppercase block">{model.provider}</span>
            <span className="font-mono text-[8px] text-primary/60 uppercase">{abbr}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SpecBadge type="model-type" value={model.model_type} />
          <SpecBadge type="status" value={model.current_status} />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-headline text-on-surface uppercase text-[15px] font-bold mb-2 group-hover:text-primary transition-colors">
        {model.title}
      </h3>
      <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 line-clamp-2">
        {model.short_description}
      </p>

      {/* Spec row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {model.context_window && (
          <SpecBadge type="context" value={String(model.context_window)} />
        )}
        <SpecBadge type="speed" value={model.speed} />
        {model.is_open_source && (
          <SpecBadge type="open-source" value="true" />
        )}
        {model.has_api && (
          <SpecBadge type="api" value="true" />
        )}
      </div>

      {/* Input / Output types */}
      <div className="flex items-center gap-1 flex-wrap pt-3 border-t border-terminal-border">
        {model.input_types.slice(0, 3).map((t) => (
          <SpecBadge key={`in-${t}`} type="input" value={t} />
        ))}
        <span className="font-mono text-[9px] text-data-dim">→</span>
        {model.output_types.slice(0, 2).map((t) => (
          <SpecBadge key={`out-${t}`} type="output" value={t} />
        ))}
      </div>
    </Link>
  )
}
