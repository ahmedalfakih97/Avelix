import type { Metadata } from 'next'
import QueueItemCard from '@/components/admin/QueueItemCard'
import { getApprovalQueue } from '@/lib/queries/admin'

export const metadata: Metadata = { title: 'Approval Queue' }

const STATUS_TABS = ['all', 'pending', 'approved', 'rejected', 'needs_edit'] as const
type StatusTab = (typeof STATUS_TABS)[number]

const TAB_LABELS: Record<StatusTab, string> = {
  all:        'All',
  pending:    'Pending',
  approved:   'Approved',
  rejected:   'Rejected',
  needs_edit: 'Needs Edit',
}

export default async function QueuePage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const tab = (STATUS_TABS.includes(searchParams.status as StatusTab)
    ? searchParams.status
    : 'all') as StatusTab

  const items = await getApprovalQueue(tab)
  const pending = items.filter((i) => i.status === 'pending')

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page header */}
      <div className="border-b border-terminal-border pb-4">
        <span className="font-mono text-label-caps text-primary uppercase block mb-1">[APPROVAL_QUEUE]</span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Review Queue</h1>
        <p className="font-mono text-[10px] text-data-dim uppercase mt-2">
          {pending.length} item{pending.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {/* Bulk action for high-confidence items */}
      {tab === 'pending' || tab === 'all' ? (
        (() => {
          const highConf = items.filter(
            (i) => i.status === 'pending' && (i.ai_confidence ?? 0) >= 90
          )
          return highConf.length > 0 ? (
            <div className="border border-primary/30 bg-primary/5 px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-[10px] text-primary uppercase">
                {highConf.length} high-confidence item{highConf.length !== 1 ? 's' : ''} (&gt;90%) ready to bulk approve
              </span>
              <button className="border border-primary text-primary font-mono text-[9px] uppercase px-3 py-1.5 hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[12px] align-middle mr-1">done_all</span>
                Approve All High-Confidence
              </button>
            </div>
          ) : null
        })()
      ) : null}

      {/* Status tabs */}
      <div className="border-b border-terminal-border">
        <div className="flex gap-0">
          {STATUS_TABS.map((t) => (
            <a
              key={t}
              href={`/admin/queue?status=${t}`}
              className={`font-mono text-[9px] uppercase px-4 py-2.5 border-b-2 transition-colors ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-data-dim hover:text-on-surface'
              }`}
            >
              {TAB_LABELS[t]}
            </a>
          ))}
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-data-dim text-4xl block mb-3">check_circle</span>
          <p className="font-mono text-[11px] text-data-dim uppercase">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((item) => (
            <QueueItemCard
              key={item.id}
              item={item}
              readOnly={item.status !== 'pending'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
