import Link from 'next/link'
import type { Model } from '@/types/model'
import { openSourceLabel, displayOrNull } from '@/lib/utils/display'

type CardModel = Pick<Model,
  | 'slug' | 'title' | 'provider' | 'model_type' | 'short_description'
  | 'context_window' | 'is_open_source' | 'has_api' | 'speed'
  | 'pricing_model' | 'current_status' | 'input_types' | 'output_types'
  | 'avelix_category' | 'pricing_tier_label' | 'has_free_tier'
  | 'avg_response_latency' | 'avelix_featured' | 'popularity_tier'
  | 'vision_support' | 'audio_support' | 'modality' | 'avelix_tags'
  | 'api_input_price_usd_per_1m' | 'api_output_price_usd_per_1m'
>

interface ModelCardProps {
  model: CardModel
  variant?: 'default' | 'compact' | 'featured'
}

// ── Colour maps ────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; cls: string; dot: string }> = {
  active:           { label: 'ACTIVE',    cls: 'text-primary border-primary/40',               dot: 'bg-primary' },
  legacy:           { label: 'LEGACY',    cls: 'text-amber-400 border-amber-400/40',            dot: 'bg-amber-400' },
  retired:          { label: 'RETIRED',   cls: 'text-rose-400 border-rose-400/40',              dot: 'bg-rose-400' },
  'research preview': { label: 'RESEARCH', cls: 'text-sky-400 border-sky-400/40',               dot: 'bg-sky-400' },
  preview:          { label: 'PREVIEW',   cls: 'text-sky-400 border-sky-400/40',               dot: 'bg-sky-400' },
  deprecated:       { label: 'LEGACY',    cls: 'text-amber-400 border-amber-400/40',            dot: 'bg-amber-400' },
  research:         { label: 'RESEARCH',  cls: 'text-sky-400 border-sky-400/40',               dot: 'bg-sky-400' },
}

const PRICING_BADGE: Record<string, string> = {
  'Free':               'text-primary border-primary/40 bg-primary/5',
  'Open Source / Free': 'text-primary border-primary/40 bg-primary/5',
  'Budget':             'text-emerald-400 border-emerald-400/40',
  'Mid-Range':          'text-amber-400 border-amber-400/40',
  'Premium':            'text-rose-400 border-rose-400/40',
  'Unknown':            'text-data-dim border-terminal-border',
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

const MODALITY_ICON: Record<string, string> = {
  text:        'text_fields',
  vision:      'visibility',
  audio:       'volume_up',
  video:       'movie',
  image:       'image',
  multimodal:  'all_inclusive',
  code:        'code',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getStatusKey(s?: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function formatCtx(n?: number | null): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return `${(n / 1000).toFixed(0)}K`
}

function formatPrice(p?: number | null): string {
  if (p == null) return '—'
  if (p === 0) return 'Free'
  if (p < 1) return `$${(p * 1000).toFixed(2)}/1B`
  return `$${p.toFixed(2)}/1M`
}

function providerInitials(name: string): string {
  return name
    .split(/[\s/]/)[0]
    .slice(0, 2)
    .toUpperCase()
}

// ── Compact variant ────────────────────────────────────────────────────────────

function CompactCard({ model }: { model: CardModel }) {
  const icon = MODEL_TYPE_ICON[model.model_type] ?? 'dataset'
  return (
    <Link
      href={`/models/${model.slug}`}
      className="flex items-center gap-3 p-3 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
    >
      <div className="w-6 h-6 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:text-primary transition-colors">
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-[11px] text-on-surface uppercase truncate">{model.title}</p>
        <p className="font-mono text-[9px] text-data-dim uppercase">{model.provider}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {model.avelix_category && (
          <span className="font-mono text-[8px] text-primary/70 uppercase hidden sm:block">{model.avelix_category}</span>
        )}
        <span className="font-mono text-[8px] text-data-dim uppercase">
          {formatCtx(model.context_window)}
        </span>
      </div>
    </Link>
  )
}

// ── Default / Featured variant ─────────────────────────────────────────────────

export default function ModelCard({ model, variant = 'default' }: ModelCardProps) {
  if (variant === 'compact') return <CompactCard model={model} />

  const icon      = MODEL_TYPE_ICON[model.model_type] ?? 'dataset'
  const initials  = providerInitials(model.provider)
  const statusKey = getStatusKey(model.current_status)
  const statusCfg = STATUS_BADGE[statusKey] ?? { label: (model.current_status ?? 'UNKNOWN').toUpperCase(), cls: 'text-data-dim border-terminal-border', dot: 'bg-data-dim' }
  const tier      = model.pricing_tier_label
  const tierCls   = tier ? (PRICING_BADGE[tier] ?? PRICING_BADGE['Unknown']) : ''
  const tags      = model.avelix_tags ?? []
  const hasPrice  = model.api_input_price_usd_per_1m != null || model.api_output_price_usd_per_1m != null

  const modalityKey = (model.modality ?? '').toLowerCase().split(/[,/\s]/)[0]
  const modalityIcon = MODALITY_ICON[modalityKey] ?? 'hub'

  return (
    <Link
      href={`/models/${model.slug}`}
      className="flex flex-col p-5 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group relative"
    >
      {/* Top-right badges */}
      {(model.avelix_featured || model.popularity_tier === 'Trending') && (
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {model.avelix_featured && (
            <span className="font-mono text-[8px] text-primary uppercase border border-primary/40 bg-primary/5 px-1.5 py-0.5">
              ★ FEATURED
            </span>
          )}
          {model.popularity_tier === 'Trending' && !model.avelix_featured && (
            <span className="font-mono text-[8px] text-amber-400 uppercase border border-amber-400/40 px-1.5 py-0.5">
              ↑ TRENDING
            </span>
          )}
        </div>
      )}

      {/* Header: provider avatar + model type + status */}
      <div className="flex items-start gap-3 mb-3">
        {/* Provider avatar */}
        <div className="w-9 h-9 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-[10px] text-primary font-bold">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] text-data-dim uppercase truncate">{model.provider}</p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {/* Model type chip */}
            <span className="inline-flex items-center gap-0.5 font-mono text-[8px] text-primary/70 border border-primary/20 px-1.5 py-0.5 uppercase">
              <span className="material-symbols-outlined text-[10px]">{icon}</span>
              {model.model_type.toUpperCase()}
            </span>
            {/* Status badge */}
            <span className={`inline-flex items-center gap-1 font-mono text-[8px] border px-1.5 py-0.5 uppercase ${statusCfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Category chip */}
      {model.avelix_category && (
        <div className="mb-2">
          <span className="font-mono text-[8px] text-primary uppercase border border-primary/25 bg-primary/5 px-2 py-0.5">
            {model.avelix_category.toUpperCase()}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="font-headline text-on-surface uppercase text-[14px] font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
        {model.title}
      </h3>

      {/* Description */}
      <p className="font-body text-[12px] text-on-surface-variant flex-1 mb-3 line-clamp-2 leading-relaxed">
        {model.short_description}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="font-mono text-[7px] text-data-dim uppercase border border-terminal-border px-1.5 py-0.5">
              {t}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="font-mono text-[7px] text-data-dim uppercase border border-terminal-border px-1.5 py-0.5">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Spec row: context + latency + modality */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {model.context_window && (
          <span className="inline-flex items-center gap-0.5 font-mono text-[8px] border border-terminal-border text-on-surface-variant px-1.5 py-0.5 uppercase">
            <span className="material-symbols-outlined text-[10px]">memory</span>
            {formatCtx(model.context_window)}
          </span>
        )}
        {displayOrNull(model.avg_response_latency) && (
          <span className="font-mono text-[8px] text-on-surface-variant border border-terminal-border px-1.5 py-0.5 uppercase">
            {model.avg_response_latency!.startsWith('Fast')   ? 'FAST'
             : model.avg_response_latency!.startsWith('Medium') ? 'MED'
             : model.avg_response_latency!.startsWith('Slow')   ? 'SLOW'
             : model.avg_response_latency!.toUpperCase()}
          </span>
        )}
        {model.modality && (
          <span className="inline-flex items-center gap-0.5 font-mono text-[8px] text-on-surface-variant border border-terminal-border px-1.5 py-0.5 uppercase">
            <span className="material-symbols-outlined text-[10px]">{modalityIcon}</span>
            {model.modality.split(',')[0].trim().toUpperCase()}
          </span>
        )}
      </div>

      {/* Source / license + pricing tier row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {/* Open / Closed source — hidden when unknown/pending */}
        {openSourceLabel(model.is_open_source) && (
          <span className={`inline-flex items-center gap-0.5 font-mono text-[8px] border px-1.5 py-0.5 uppercase ${
            openSourceLabel(model.is_open_source) === 'Open Source'
              ? 'text-primary border-primary/40'
              : 'text-data-dim border-terminal-border'
          }`}>
            <span className="material-symbols-outlined text-[10px]">
              {openSourceLabel(model.is_open_source) === 'Open Source' ? 'lock_open' : 'lock'}
            </span>
            {openSourceLabel(model.is_open_source)!.toUpperCase()}
          </span>
        )}

        {/* Pricing tier */}
        {tier && tier !== 'Unknown' && (
          <span className={`font-mono text-[8px] border px-1.5 py-0.5 uppercase ${tierCls}`}>
            {tier.toUpperCase()}
          </span>
        )}

        {/* Free tier flag */}
        {model.has_free_tier && (
          <span className="font-mono text-[8px] text-primary uppercase border border-primary/30 px-1.5 py-0.5">
            FREE TIER
          </span>
        )}
      </div>

      {/* API pricing — shown when has_api and at least one price */}
      {model.has_api && hasPrice && (
        <div className="flex items-center gap-3 mb-3 py-2 px-2 bg-surface-container border border-terminal-border">
          <span className="material-symbols-outlined text-[11px] text-data-dim">api</span>
          {model.api_input_price_usd_per_1m != null && (
            <span className="font-mono text-[8px] text-on-surface-variant uppercase">
              IN: <span className="text-on-surface">{formatPrice(model.api_input_price_usd_per_1m)}</span>
            </span>
          )}
          {model.api_output_price_usd_per_1m != null && (
            <span className="font-mono text-[8px] text-on-surface-variant uppercase">
              OUT: <span className="text-on-surface">{formatPrice(model.api_output_price_usd_per_1m)}</span>
            </span>
          )}
        </div>
      )}

      {/* Footer: modality support icons + input→output */}
      <div className="flex items-center justify-between pt-3 border-t border-terminal-border mt-auto">
        <div className="flex items-center gap-1.5">
          {model.vision_support && (
            <span className="material-symbols-outlined text-[13px] text-on-surface-variant" title="Vision">visibility</span>
          )}
          {model.audio_support && (
            <span className="material-symbols-outlined text-[13px] text-on-surface-variant" title="Audio">volume_up</span>
          )}
          {model.has_api && (
            <span className="material-symbols-outlined text-[13px] text-primary/60" title="API Available">api</span>
          )}
        </div>
        <span className="font-mono text-[8px] text-data-dim uppercase group-hover:text-primary transition-colors">
          VIEW →
        </span>
      </div>
    </Link>
  )
}
