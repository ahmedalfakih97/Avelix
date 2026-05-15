import Link from 'next/link'
import type { Tool } from '@/types/tool'
import { cn } from '@/lib/utils'

interface ToolCardProps {
  tool: Pick<Tool,
    'slug' | 'title' | 'short_description' | 'category_name' | 'pricing_model' |
    'has_free_plan' | 'avelix_rating' | 'best_for' | 'has_api' | 'is_no_code' |
    'user_types' | 'last_reviewed_at'
  >
  variant?: 'default' | 'compact' | 'featured'
}

const PRICING_BADGE: Record<string, { label: string; cls: string }> = {
  free:        { label: 'FREE',        cls: 'bg-electric-teal/10 text-electric-teal' },
  freemium:    { label: 'FREEMIUM',    cls: 'bg-primary/10 text-primary' },
  paid:        { label: 'PAID',        cls: 'bg-secondary/10 text-secondary' },
  'open-source': { label: 'OPEN SOURCE', cls: 'bg-signal-orange/10 text-signal-orange' },
  enterprise:  { label: 'ENTERPRISE',  cls: 'bg-on-surface-variant/10 text-on-surface-variant' },
}

const CATEGORY_ICON: Record<string, string> = {
  'ai-assistant':    'smart_toy',
  'image-generation':'image',
  'ai-coding':       'code',
  'ai-voice':        'mic',
  'automation':      'webhook',
  'ai-research':     'query_stats',
  'ai-writing':      'edit_note',
  'ai-video':        'movie',
}

export default function ToolCard({ tool, variant = 'default' }: ToolCardProps) {
  const badge = tool.pricing_model ? PRICING_BADGE[tool.pricing_model] : null
  const icon  = CATEGORY_ICON[tool.category_name?.toLowerCase().replace(/ /g, '-') ?? ''] ?? 'dataset'

  if (variant === 'compact') {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className="flex items-center gap-3 p-3 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
      >
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg transition-colors">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-on-surface uppercase truncate">{tool.title}</p>
          {tool.category_name && (
            <p className="font-mono text-[9px] text-data-dim uppercase">{tool.category_name}</p>
          )}
        </div>
        {badge && (
          <span className={cn('font-mono text-[8px] px-1.5 py-0.5 uppercase', badge.cls)}>
            {badge.label}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex flex-col p-5 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-base">{icon}</span>
          </div>
          <div>
            <p className="font-mono text-[10px] text-data-dim uppercase">{tool.category_name ?? 'AI Tool'}</p>
          </div>
        </div>
        {badge && (
          <span className={cn('font-mono text-[8px] px-1.5 py-0.5 uppercase flex-shrink-0', badge.cls)}>
            {badge.label}
          </span>
        )}
      </div>

      <h3 className="font-headline text-on-surface uppercase text-[15px] font-bold mb-2 group-hover:text-primary transition-colors">
        {tool.title}
      </h3>
      <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 line-clamp-2">
        {tool.short_description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-terminal-border">
        <div className="flex items-center gap-2 flex-wrap">
          {tool.has_free_plan && (
            <span className="font-mono text-[8px] text-electric-teal border border-electric-teal/30 px-1.5 py-0.5 uppercase">
              Free plan
            </span>
          )}
          {tool.has_api && (
            <span className="font-mono text-[8px] text-data-dim border border-terminal-border px-1.5 py-0.5 uppercase">
              API
            </span>
          )}
          {tool.is_no_code && (
            <span className="font-mono text-[8px] text-data-dim border border-terminal-border px-1.5 py-0.5 uppercase">
              No-Code
            </span>
          )}
        </div>
        {tool.avelix_rating && (
          <span className="font-mono text-[10px] text-signal-orange">
            {tool.avelix_rating.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  )
}
