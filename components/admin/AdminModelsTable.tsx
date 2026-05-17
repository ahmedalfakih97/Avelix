'use client'

import Link from 'next/link'
import DataTable, { type Column } from '@/components/admin/DataTable'

const STATUS_COLORS: Record<string, string> = {
  published: 'text-primary border-primary/40 bg-primary/5',
  draft:     'text-data-dim border-terminal-border',
  review:    'text-signal-orange border-signal-orange/40 bg-signal-orange/5',
  approved:  'text-electric-teal border-electric-teal/40 bg-electric-teal/5',
  archived:  'text-data-dim border-terminal-border opacity-60',
}

const columns: Column<Record<string, unknown>>[] = [
  {
    key: 'title',
    label: 'Model',
    sortable: true,
    render: (row) => (
      <div>
        <span className="font-mono text-[11px] text-on-surface block">{String(row.title)}</span>
        <span className="font-mono text-[9px] text-data-dim">{String(row.provider ?? '—')}</span>
      </div>
    ),
  },
  {
    key: 'model_type',
    label: 'Type',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-[10px] text-on-surface-variant uppercase">
        {String(row.model_type ?? '—')}
      </span>
    ),
  },
  {
    key: 'context_window',
    label: 'Context',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-[10px] text-on-surface-variant">
        {row.context_window != null ? `${(Number(row.context_window) / 1000).toFixed(0)}K` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => {
      const s = String(row.status ?? 'draft')
      return (
        <span className={`border font-mono text-[9px] uppercase px-2 py-0.5 ${STATUS_COLORS[s] ?? STATUS_COLORS.draft}`}>
          {s}
        </span>
      )
    },
  },
  {
    key: 'confidence_score',
    label: 'Confidence',
    sortable: true,
    render: (row) => {
      const score = Number(row.confidence_score ?? 0)
      return (
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-surface-container">
            <div className="h-full bg-primary" style={{ width: `${score * 100}%` }} />
          </div>
          <span className="font-mono text-[9px] text-data-dim">{Math.round(score * 100)}%</span>
        </div>
      )
    },
  },
  {
    key: 'updated_at',
    label: 'Updated',
    sortable: true,
    render: (row) => (
      <span className="font-mono text-[9px] text-data-dim">
        {new Date(String(row.updated_at)).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/models/${String(row.slug)}`}
          target="_blank"
          className="material-symbols-outlined text-[16px] text-data-dim hover:text-primary transition-colors"
          title="Preview"
        >
          open_in_new
        </Link>
        <button
          className="material-symbols-outlined text-[16px] text-data-dim hover:text-signal-orange transition-colors"
          title="Archive"
        >
          archive
        </button>
      </div>
    ),
  },
]

interface AdminModelsTableProps {
  data: Record<string, unknown>[]
}

export default function AdminModelsTable({ data }: AdminModelsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey="id"
      statusFilter
      emptyMessage="No models found."
    />
  )
}
