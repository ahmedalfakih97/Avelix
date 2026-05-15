import type { ComparisonRow } from '@/types/comparison'
import { cn } from '@/lib/utils'

interface ComparisonTableProps {
  rows: ComparisonRow[]
  slugs: string[]
  labels: Record<string, string>
}

export default function ComparisonTable({ rows, slugs, labels }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full border-collapse border border-terminal-border min-w-[480px]">
        <thead>
          <tr className="border-b border-terminal-border">
            <th className="text-left p-3 bg-surface-container-lowest border-r border-terminal-border w-[140px]">
              <span className="font-mono text-[9px] text-data-dim uppercase">FIELD</span>
            </th>
            {slugs.map((slug) => (
              <th key={slug} className="text-left p-3 bg-surface-container-lowest border-r last:border-r-0 border-terminal-border">
                <span className="font-mono text-[10px] text-primary uppercase">{labels[slug] ?? slug}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.field}
              className={cn(
                'border-b border-terminal-border',
                i % 2 === 0 ? 'bg-electromagnetic-ink' : 'bg-surface-container-lowest'
              )}
            >
              <td className="p-3 border-r border-terminal-border">
                <span className="font-mono text-[9px] text-data-dim uppercase">{row.label}</span>
              </td>
              {slugs.map((slug) => {
                const isWinner = row.winner === slug
                return (
                  <td
                    key={slug}
                    className={cn(
                      'p-3 border-r last:border-r-0 border-terminal-border transition-colors',
                      isWinner && 'border-l-2 border-l-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {isWinner && (
                        <span className="material-symbols-outlined text-primary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      )}
                      <span className={cn(
                        'font-body text-body-sm',
                        isWinner ? 'text-on-surface font-medium' : 'text-on-surface-variant'
                      )}>
                        {row.values[slug] ?? '—'}
                      </span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
