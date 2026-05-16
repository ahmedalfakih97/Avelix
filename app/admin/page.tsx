import type { Metadata } from 'next'
import Link from 'next/link'
import StatCard from '@/components/admin/StatCard'
import ActivityFeed from '@/components/admin/ActivityFeed'
import { getAdminStats, getRecentChangelogs } from '@/lib/queries/admin'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const [stats, changelogs] = await Promise.all([
    getAdminStats(),
    getRecentChangelogs(10),
  ])

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Page header */}
      <div className="border-b border-terminal-border pb-4">
        <span className="font-mono text-label-caps text-primary uppercase block mb-1">[ADMIN_CONSOLE]</span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <section>
        <span className="font-mono text-[9px] text-data-dim uppercase block mb-3">// Content Overview</span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-terminal-border border border-terminal-border">
          <StatCard label="Tools Published"   value={stats.tools.published}  subLabel={`${stats.tools.total} total`}  icon="construction"  accent="primary" />
          <StatCard label="Tools Pending"     value={stats.tools.pending}   subLabel={`${stats.tools.draft} drafts`} icon="pending"       accent="orange"  />
          <StatCard label="Models Published"  value={stats.models.published} subLabel={`${stats.models.total} total`} icon="memory"        accent="primary" />
          <StatCard label="Models Pending"    value={stats.models.pending}  subLabel="awaiting review"               icon="hourglass_top" accent="orange"  />
          <StatCard label="Skills Published"  value={stats.skills.published} subLabel={`${stats.skills.total} total`} icon="school"        accent="primary" />
          <StatCard label="Skills Pending"    value={stats.skills.pending}  subLabel="awaiting review"               icon="hourglass_top" accent="orange"  />
          <StatCard label="Queue Pending"     value={stats.queue.pending}   subLabel={`${stats.queue.total} total`}  icon="pending_actions" accent="orange" />
          <StatCard label="Last Sync"         value={stats.lastSync ? new Date(stats.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'} subLabel={stats.lastSync ? new Date(stats.lastSync).toLocaleDateString() : 'never'} icon="sync" accent="dim" />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <span className="font-mono text-[9px] text-data-dim uppercase block mb-3">// Quick Actions</span>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/queue"
            className="flex items-center gap-2 border border-primary text-primary font-mono text-[10px] uppercase px-4 py-2.5 hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">pending_actions</span>
            Review Queue ({stats.queue.pending} items)
          </Link>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 border border-terminal-border text-on-surface-variant font-mono text-[10px] uppercase px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            Trigger Manual Sync
          </button>
          <Link
            href="/tools"
            target="_blank"
            className="flex items-center gap-2 border border-terminal-border text-on-surface-variant font-mono text-[10px] uppercase px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            View Live Site
          </Link>
        </div>
      </section>

      {/* Activity feed */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[9px] text-data-dim uppercase">// Recent Activity</span>
          <span className="font-mono text-[9px] text-data-dim uppercase">Last 10 changes</span>
        </div>
        <div className="border border-terminal-border bg-surface-container-lowest">
          <ActivityFeed entries={changelogs} />
        </div>
      </section>
    </div>
  )
}
