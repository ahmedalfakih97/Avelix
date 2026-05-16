import type { ChangelogEntry } from '@/lib/queries/admin'
import { formatDistanceToNow } from 'date-fns'

const TYPE_ICON: Record<string, string> = {
  tool:     'construction',
  model:    'memory',
  skill:    'school',
  guide:    'map',
  glossary: 'book',
  default:  'update',
}

const CHANGE_COLOR: Record<string, string> = {
  pricing:   'text-signal-orange',
  new_model: 'text-primary',
  feature:   'text-electric-teal',
  content:   'text-on-surface-variant',
  default:   'text-data-dim',
}

interface ActivityFeedProps {
  entries: ChangelogEntry[]
}

export default function ActivityFeed({ entries }: ActivityFeedProps) {
  if (!entries.length) {
    return (
      <div className="py-10 text-center">
        <span className="material-symbols-outlined text-data-dim text-3xl block mb-2">history</span>
        <p className="font-mono text-[10px] text-data-dim uppercase">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {entries.map((entry, i) => {
        const icon  = TYPE_ICON[entry.content_type]  ?? TYPE_ICON.default
        const color = CHANGE_COLOR[entry.content_type ?? ''] ?? CHANGE_COLOR.default
        const timeAgo = formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })

        return (
          <div
            key={entry.id}
            className={`flex gap-3 px-4 py-3 ${i < entries.length - 1 ? 'border-b border-terminal-border' : ''} hover:bg-surface-container-low transition-colors`}
          >
            <span className={`material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0 ${color}`}>{icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] text-on-surface leading-snug">
                <span className={`uppercase font-bold ${color}`}>{entry.content_type}</span>
                {': '}
                <span className="text-primary">{entry.content_slug}</span>
                {' — '}
                {entry.description}
              </p>
              <span className="font-mono text-[9px] text-data-dim uppercase mt-0.5 block">{timeAgo}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
