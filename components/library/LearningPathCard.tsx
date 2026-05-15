import Link from 'next/link'
import type { LearningPath } from '@/types/skill'
import { cn } from '@/lib/utils'

interface LearningPathCardProps {
  path: Pick<LearningPath,
    'slug' | 'title' | 'short_description' | 'who_its_for' |
    'required_skill_level' | 'estimated_hours' | 'modules'
  >
}

const LEVEL_CONFIG = {
  beginner:     { label: 'BEGINNER',     cls: 'text-electric-teal border-electric-teal/50' },
  intermediate: { label: 'INTERMEDIATE', cls: 'text-signal-orange border-signal-orange/50' },
  advanced:     { label: 'ADVANCED',     cls: 'text-primary border-primary/50' },
} as const

const LEVEL_ICON: Record<string, string> = {
  beginner:     'start',
  intermediate: 'trending_up',
  advanced:     'rocket_launch',
}

export default function LearningPathCard({ path }: LearningPathCardProps) {
  const level = LEVEL_CONFIG[path.required_skill_level]
  const icon  = LEVEL_ICON[path.required_skill_level] ?? 'school'
  const moduleCount = Array.isArray(path.modules) ? path.modules.length : 0

  return (
    <Link
      href={`/guides/${path.slug}`}
      className="flex flex-col p-5 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        </div>
        <span className={cn('font-mono text-[9px] border px-1.5 py-0.5 uppercase flex-shrink-0', level.cls)}>
          {level.label}
        </span>
      </div>

      <h3 className="font-headline text-on-surface uppercase text-[15px] font-bold mb-2 group-hover:text-primary transition-colors">
        {path.title}
      </h3>

      {path.who_its_for && (
        <p className="font-mono text-[9px] text-primary uppercase mb-2">
          FOR: {path.who_its_for.slice(0, 60)}{path.who_its_for.length > 60 ? '…' : ''}
        </p>
      )}

      <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 line-clamp-2">
        {path.short_description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-terminal-border">
        <div className="flex items-center gap-3">
          {moduleCount > 0 && (
            <span className="font-mono text-[9px] text-data-dim uppercase">
              {moduleCount} MODULES
            </span>
          )}
          {path.estimated_hours && (
            <span className="font-mono text-[9px] text-data-dim uppercase">
              ~{path.estimated_hours}H
            </span>
          )}
        </div>
        <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-base transition-colors">
          arrow_forward
        </span>
      </div>
    </Link>
  )
}
