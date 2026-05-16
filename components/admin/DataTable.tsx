'use client'

import { useState, useMemo } from 'react'

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  rowKey: keyof T
  statusFilter?: boolean
  statusField?: keyof T
  emptyMessage?: string
}

function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[part]
    return undefined
  }, obj)
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  statusFilter = false,
  statusField = 'status' as keyof T,
  emptyMessage = 'No items found.',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [statusVal, setStatusVal] = useState('all')
  const [search, setSearch] = useState('')

  const statuses = useMemo(() => {
    if (!statusFilter) return []
    const vals = new Set(data.map((row) => String(row[statusField] ?? '')))
    return ['all', ...Array.from(vals).sort()]
  }, [data, statusFilter, statusField])

  const sorted = useMemo(() => {
    let rows = [...data]

    if (statusFilter && statusVal !== 'all') {
      rows = rows.filter((r) => String(r[statusField] ?? '') === statusVal)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((r) =>
        columns.some((col) => {
          const val = getNestedValue(r, String(col.key))
          return String(val ?? '').toLowerCase().includes(q)
        })
      )
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(getNestedValue(a, sortKey) ?? '')
        const bv = String(getNestedValue(b, sortKey) ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }

    return rows
  }, [data, sortKey, sortDir, statusFilter, statusVal, search, columns, statusField])

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH..."
          className="bg-surface-container-lowest border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim focus:outline-none focus:border-primary transition-colors min-w-[200px]"
        />
        {statusFilter && (
          <div className="flex gap-0 border border-terminal-border">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusVal(s)}
                className={`font-mono text-[9px] uppercase px-3 py-1.5 transition-colors ${
                  statusVal === s
                    ? 'bg-primary/10 text-primary border-r border-terminal-border last:border-0'
                    : 'text-data-dim hover:text-on-surface border-r border-terminal-border last:border-0'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <span className="font-mono text-[9px] text-data-dim uppercase ml-auto">
          {sorted.length} item{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="border border-terminal-border overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-terminal-border bg-surface-container-lowest">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`text-left px-4 py-3 font-mono text-[9px] text-data-dim uppercase ${col.sortable ? 'cursor-pointer hover:text-primary select-none' : ''} ${col.className ?? ''}`}
                  onClick={col.sortable ? () => toggleSort(String(col.key)) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      <span className="material-symbols-outlined text-[11px]">
                        {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <p className="font-mono text-[10px] text-data-dim uppercase">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={String(row[rowKey])}
                  className={`border-b border-terminal-border last:border-0 hover:bg-surface-container-low transition-colors ${i % 2 === 0 ? 'bg-electromagnetic-ink' : 'bg-surface-container-lowest'}`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`px-4 py-3 ${col.className ?? ''}`}>
                      {col.render
                        ? col.render(row)
                        : (
                          <span className="font-mono text-[11px] text-on-surface">
                            {String(getNestedValue(row, String(col.key)) ?? '—')}
                          </span>
                        )
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
