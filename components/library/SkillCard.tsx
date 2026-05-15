import Link from 'next/link'
import type { Skill } from '@/types/skill'
import { cn } from '@/lib/utils'

interface SkillCardProps {
  skill: Pick<Skill,
    'slug' | 'title' | 'short_description' | 'difficulty' |
    'estimated_hours' | 'tags' | 'required_tool_slugs' | 'last_reviewed_at'
  >
  variant?: 'default' | 'compact' | 'featured'
}

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'BEGINNER',     cls: 'text-electric-teal border-electric-teal/50' },
  intermediate: { label: 'INTERMEDIATE', cls: 'text-signal-orange border-signal-orange/50' },
  advanced:     { label: 'ADVANCED',     cls: 'text-primary border-primary/50' },
} as const

export default function SkillCard({ skill, variant = 'default' }: SkillCardProps) {
  const diff = DIFFICULTY_CONFIG[skill.difficulty]

  if (variant === 'compact') {
    return (
      <Link
        href={`/skills/${skill.slug}`}
        className="flex items-center gap-3 p-3 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
      >
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-lg transition-colors">
          school
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] text-on-surface uppercase truncate">{skill.title}</p>
          <p className="font-mono text-[9px] text-data-dim uppercase">
            {skill.estimated_hours ? `${skill.estimated_hours}H` : ''}{skill.estimated_hours ? ' · ' : ''}{diff.label}
          </p>
        </div>
        <span className={cn('font-mono text-[8px] border px-1.5 py-0.5 uppercase flex-shrink-0', diff.cls)}>
          {diff.label}
        </span>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/skills/${skill.slug}`}
        className="flex flex-col p-6 border border-primary/40 bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low transition-all group"
      >
        <div className="flex items-start justify-between mb-4">
          <span className="material-symbols-outlined text-primary text-2xl">school</span>
          <span className={cn('font-mono text-[9px] border px-2 py-0.5 uppercase', diff.cls)}>
            {diff.label}
          </span>
        </div>
        <h3 className="font-headline text-on-surface uppercase text-base font-bold mb-2 group-hover:text-primary transition-colors">
          {skill.title}
        </h3>
        <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 line-clamp-3">
          {skill.short_description}
        </p>
        <div className="flex items-center gap-3 pt-3 border-t border-terminal-border">
          {skill.estimated_hours && (
            <span className="font-mono text-[9px] text-data-dim uppercase">
              EST: {skill.estimated_hours}H
            </span>
          )}
          {skill.required_tool_slugs.slice(0, 2).map((t) => (
            <span key={t} className="font-mono text-[8px] text-data-dim border border-terminal-border px-1.5 py-0.5 uppercase">
              {t}
            </span>
          ))}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="flex flex-col p-5 border border-terminal-border hover:border-l-2 hover:border-l-primary bg-electromagnetic-ink hover:bg-surface-container-low transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-base">school</span>
          </div>
          <span className={cn('font-mono text-[9px] border px-1.5 py-0.5 uppercase', diff.cls)}>
            {diff.label}
          </span>
        </div>
        {skill.estimated_hours && (
          <span className="font-mono text-[9px] text-data-dim uppercase flex-shrink-0">
            ~{skill.estimated_hours}H
          </span>
        )}
      </div>

      <h3 className="font-headline text-on-surface uppercase text-[15px] font-bold mb-2 group-hover:text-primary transition-colors">
        {skill.title}
      </h3>
      <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 line-clamp-2">
        {skill.short_description}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-terminal-border">
        {skill.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="font-mono text-[8px] border border-terminal-border text-data-dim px-1.5 py-0.5 uppercase">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
