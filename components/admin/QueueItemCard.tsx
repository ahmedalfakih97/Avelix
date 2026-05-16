'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { ApprovalQueueItem } from '@/lib/queries/admin'

const TYPE_COLORS: Record<string, string> = {
  tool:     'border-primary text-primary bg-primary/5',
  model:    'border-electric-teal text-electric-teal bg-electric-teal/5',
  skill:    'border-signal-orange text-signal-orange bg-signal-orange/5',
  default:  'border-terminal-border text-data-dim',
}

const ACTION_LABELS: Record<string, string> = {
  create: 'NEW',
  update: 'UPDATE',
  delete: 'DELETE',
}

function ConfidenceBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="font-mono text-[9px] text-data-dim uppercase">CONF: N/A</span>

  const color = score >= 90 ? 'text-primary' : score >= 70 ? 'text-signal-orange' : 'text-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 bg-surface-container">
        <div
          className={`h-full ${score >= 90 ? 'bg-primary' : score >= 70 ? 'bg-signal-orange' : 'bg-red-400'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono text-[9px] uppercase ${color}`}>CONF: {score}%</span>
    </div>
  )
}

interface QueueItemCardProps {
  item: ApprovalQueueItem
  readOnly?: boolean
}

export default function QueueItemCard({ item, readOnly }: QueueItemCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [localStatus, setLocalStatus] = useState(item.status)

  const typeColor = TYPE_COLORS[item.content_type] ?? TYPE_COLORS.default

  function handleApprove() {
    startTransition(async () => {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queue_id:     item.id,
          content_type: item.content_type,
          content_id:   item.content_id,
        }),
      })
      if (res.ok) {
        setLocalStatus('approved')
        router.refresh()
      }
    })
  }

  function handleReject() {
    if (!rejectReason.trim()) return
    startTransition(async () => {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queue_id: item.id, reason: rejectReason }),
      })
      if (res.ok) {
        setLocalStatus('rejected')
        setShowRejectForm(false)
        router.refresh()
      }
    })
  }

  const isDone = localStatus === 'approved' || localStatus === 'rejected'

  return (
    <div className={`border border-terminal-border bg-surface-container-lowest p-5 flex flex-col gap-4 ${isDone ? 'opacity-60' : ''} transition-opacity`}>
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`border font-mono text-[9px] uppercase px-2 py-0.5 ${typeColor}`}>
          {item.content_type}
        </span>
        <span className="border border-terminal-border font-mono text-[9px] uppercase px-2 py-0.5 text-data-dim">
          {ACTION_LABELS[item.action] ?? item.action}
        </span>
        {localStatus !== 'pending' && (
          <span className={`border font-mono text-[9px] uppercase px-2 py-0.5 ml-auto ${
            localStatus === 'approved' ? 'border-primary text-primary bg-primary/5' :
            localStatus === 'rejected' ? 'border-red-400/40 text-red-400 bg-red-400/5' :
            'border-signal-orange text-signal-orange'
          }`}>
            {localStatus.toUpperCase()}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 className="font-headline text-[16px] text-on-surface uppercase mb-1">{item.content_title}</h3>
        <span className="font-mono text-[9px] text-data-dim uppercase">/{item.content_slug}</span>
      </div>

      {/* Confidence + source */}
      <div className="flex flex-wrap items-center gap-4">
        <ConfidenceBadge score={item.ai_confidence} />
        {item.source_url && (
          <a
            href={item.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[9px] text-primary uppercase hover:underline truncate max-w-[200px]"
          >
            {new URL(item.source_url).hostname}
          </a>
        )}
      </div>

      {/* Summary */}
      {item.summary_of_changes && (
        <div className="border-l-2 border-terminal-border pl-3">
          <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">{item.summary_of_changes}</p>
        </div>
      )}

      {/* Review notes (if rejected) */}
      {item.review_notes && (
        <div className="border border-red-400/20 bg-red-400/5 px-3 py-2">
          <p className="font-mono text-[9px] text-red-400 uppercase">Rejection reason: {item.review_notes}</p>
        </div>
      )}

      {/* Actions */}
      {!readOnly && !isDone && (
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="border border-primary text-primary font-mono text-[9px] uppercase px-3 py-1.5 hover:bg-primary/10 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[12px] align-middle mr-1">check_circle</span>
            Approve
          </button>
          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            disabled={isPending}
            className="border border-red-400/40 text-red-400 font-mono text-[9px] uppercase px-3 py-1.5 hover:bg-red-400/5 transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[12px] align-middle mr-1">cancel</span>
            Reject
          </button>
          {item.source_url && (
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-terminal-border text-on-surface-variant font-mono text-[9px] uppercase px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[12px] align-middle mr-1">open_in_new</span>
              Source
            </a>
          )}
        </div>
      )}

      {/* Reject reason form */}
      {showRejectForm && (
        <div className="border border-red-400/20 bg-red-400/5 p-3 flex flex-col gap-2">
          <label className="font-mono text-[9px] text-red-400 uppercase">Rejection reason</label>
          <input
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Cannot verify — no source found..."
            className="bg-surface border border-terminal-border px-2 py-1.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim focus:outline-none focus:border-red-400 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={isPending || !rejectReason.trim()}
              className="border border-red-400/40 text-red-400 font-mono text-[9px] uppercase px-3 py-1 hover:bg-red-400/10 disabled:opacity-50 transition-colors"
            >
              Confirm Reject
            </button>
            <button
              onClick={() => setShowRejectForm(false)}
              className="font-mono text-[9px] text-data-dim uppercase hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer metadata */}
      <div className="flex justify-between items-center pt-1 border-t border-terminal-border">
        <span className="font-mono text-[9px] text-data-dim uppercase">
          Submitted {new Date(item.submitted_at).toLocaleDateString()}
        </span>
        {item.reviewed_by && (
          <span className="font-mono text-[9px] text-data-dim uppercase">
            Reviewed by {item.reviewed_by}
          </span>
        )}
      </div>
    </div>
  )
}
