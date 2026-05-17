'use client'

import { useState } from 'react'

interface SyncTriggerButtonProps {
  variant?: 'link' | 'button'
}

export default function SyncTriggerButton({ variant = 'button' }: SyncTriggerButtonProps) {
  const [syncing, setSyncing] = useState(false)

  async function trigger() {
    if (syncing) return
    setSyncing(true)
    try {
      await fetch('/api/admin/sync/trigger', { method: 'POST' })
    } finally {
      setSyncing(false)
    }
  }

  if (variant === 'link') {
    return (
      <button
        onClick={trigger}
        disabled={syncing}
        className="font-mono text-[9px] text-primary uppercase hover:underline flex items-center gap-1 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[12px]">{syncing ? 'sync' : 'sync'}</span>
        {syncing ? 'Syncing...' : 'Trigger Sync'}
      </button>
    )
  }

  return (
    <button
      onClick={trigger}
      disabled={syncing}
      className="flex items-center gap-2 border border-terminal-border text-on-surface-variant font-mono text-[10px] uppercase px-4 py-2.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[16px]">sync</span>
      {syncing ? 'Syncing...' : 'Trigger Manual Sync'}
    </button>
  )
}
