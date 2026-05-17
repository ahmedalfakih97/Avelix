import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SyncTriggerButton from '@/components/admin/SyncTriggerButton'
import { getAdminStats } from '@/lib/queries/admin'

export const metadata: Metadata = {
  title: { default: 'Admin — Avelix', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const stats = await getAdminStats()

  return (
    <div className="flex h-screen bg-electromagnetic-ink overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar pendingCount={stats.queue.pending} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-12 border-b border-terminal-border bg-surface-container-lowest flex items-center justify-between px-6 flex-shrink-0">
          <span className="font-mono text-[9px] text-data-dim uppercase">
            {stats.lastSync
              ? `Last sync: ${new Date(stats.lastSync).toLocaleString()}`
              : 'Sync: not configured'}
          </span>
          <div className="flex items-center gap-4">
            <SyncTriggerButton variant="link" />
            <span className="font-mono text-[8px] text-data-dim uppercase">
              {stats.queue.pending} pending review
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
