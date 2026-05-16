import type { Metadata } from 'next'
import { getSources } from '@/lib/queries/admin'

export const metadata: Metadata = { title: 'Sources' }

const TYPE_LABELS: Record<string, string> = {
  official_blog:      'Official Blog',
  product_hunt:       'Product Hunt',
  github:             'GitHub',
  huggingface:        'HuggingFace',
  newsletter:         'Newsletter',
  rss_feed:           'RSS Feed',
  model_release_page: 'Model Release',
  youtube:            'YouTube',
  x_account:          'X / Twitter',
}

export default async function AdminSourcesPage() {
  const sources = await getSources()
  const activeSources = sources.filter((s) => s.active)

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="border-b border-terminal-border pb-4 flex items-start justify-between">
        <div>
          <span className="font-mono text-label-caps text-primary uppercase block mb-1">[SOURCE_REGISTRY]</span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Sources</h1>
          <p className="font-mono text-[10px] text-data-dim uppercase mt-2">
            {activeSources.length} active sources monitored
          </p>
        </div>
        <button className="border border-primary text-primary font-mono text-[10px] uppercase px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Source
        </button>
      </div>

      <div className="border border-terminal-border">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-0 border-b border-terminal-border bg-surface-container-lowest px-4 py-2">
          {['Source', 'Type', 'Trust', 'Last Checked', 'Status'].map((h) => (
            <span key={h} className="font-mono text-[9px] text-data-dim uppercase">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {sources.map((source, i) => (
          <div
            key={source.id}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-0 px-4 py-3 items-center ${
              i < sources.length - 1 ? 'border-b border-terminal-border' : ''
            } ${i % 2 === 0 ? 'bg-electromagnetic-ink' : 'bg-surface-container-lowest'} hover:bg-surface-container-low transition-colors`}
          >
            {/* Name + URL */}
            <div>
              <span className="font-mono text-[11px] text-on-surface block">{source.name}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] text-data-dim hover:text-primary transition-colors truncate block max-w-[200px]"
              >
                {source.url.replace('https://', '')}
              </a>
            </div>

            {/* Type */}
            <span className="font-mono text-[9px] text-on-surface-variant uppercase">
              {TYPE_LABELS[source.type] ?? source.type}
            </span>

            {/* Trust score */}
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-surface-container">
                <div
                  className={`h-full ${source.trust_score >= 0.9 ? 'bg-primary' : source.trust_score >= 0.7 ? 'bg-signal-orange' : 'bg-red-400'}`}
                  style={{ width: `${source.trust_score * 100}%` }}
                />
              </div>
              <span className="font-mono text-[9px] text-data-dim">{Math.round(source.trust_score * 100)}%</span>
            </div>

            {/* Last checked */}
            <span className="font-mono text-[9px] text-data-dim">
              {source.last_checked
                ? new Date(source.last_checked).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                : 'Never'}
            </span>

            {/* Active toggle + actions */}
            <div className="flex items-center gap-3">
              <span className={`border font-mono text-[9px] uppercase px-2 py-0.5 ${
                source.active
                  ? 'border-primary/40 text-primary bg-primary/5'
                  : 'border-terminal-border text-data-dim'
              }`}>
                {source.active ? 'Active' : 'Inactive'}
              </span>
              <button
                className="material-symbols-outlined text-[16px] text-data-dim hover:text-primary transition-colors"
                title="Edit trust score"
              >
                edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
