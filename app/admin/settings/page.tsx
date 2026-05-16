import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default function AdminSettingsPage() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="border-b border-terminal-border pb-4">
        <span className="font-mono text-label-caps text-primary uppercase block mb-1">[SYSTEM_CONFIG]</span>
        <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Settings</h1>
      </div>

      {/* Sync Settings */}
      <section>
        <span className="font-mono text-[9px] text-data-dim uppercase block mb-4">// Sync Settings</span>
        <div className="border border-terminal-border bg-surface-container-lowest divide-y divide-terminal-border">
          <SettingRow
            label="Sync Frequency"
            description="How often the pipeline auto-runs"
            control={
              <select className="bg-surface border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-on-surface focus:outline-none focus:border-primary transition-colors">
                <option value="daily">Daily (recommended)</option>
                <option value="twice_daily">Twice daily</option>
                <option value="manual">Manual only</option>
              </select>
            }
          />
          <SettingRow
            label="Min Confidence to Draft"
            description="Items below this threshold are not added to the queue"
            control={
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={60}
                  min={0}
                  max={100}
                  className="bg-surface border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-on-surface focus:outline-none focus:border-primary w-20 transition-colors"
                />
                <span className="font-mono text-[10px] text-data-dim">%</span>
              </div>
            }
          />
          <SettingRow
            label="Notification Email"
            description="Receive email when new items are added to the queue"
            control={
              <input
                type="email"
                defaultValue="ahmedalfakih97@gmail.com"
                className="bg-surface border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-on-surface focus:outline-none focus:border-primary w-64 transition-colors"
              />
            }
          />
        </div>
      </section>

      {/* Content Rules */}
      <section>
        <span className="font-mono text-[9px] text-data-dim uppercase block mb-4">// Content Rules</span>
        <div className="border border-terminal-border bg-surface-container-lowest divide-y divide-terminal-border">
          <SettingRow
            label="Require Source URL"
            description="Block publish if no verified source URL is attached"
            control={<Toggle defaultChecked />}
          />
          <SettingRow
            label="Block Low-Confidence Publish"
            description="Prevent publishing items with confidence below threshold"
            control={<Toggle defaultChecked />}
          />
          <SettingRow
            label="Auto-Archive Stale Items"
            description="Archive items not reviewed within N days"
            control={
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={30}
                  min={1}
                  className="bg-surface border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-on-surface focus:outline-none focus:border-primary w-20 transition-colors"
                />
                <span className="font-mono text-[10px] text-data-dim">days</span>
              </div>
            }
          />
        </div>
      </section>

      {/* Algolia */}
      <section>
        <span className="font-mono text-[9px] text-data-dim uppercase block mb-4">// Search Index (Algolia)</span>
        <div className="border border-terminal-border bg-surface-container-lowest divide-y divide-terminal-border">
          <SettingRow
            label="Algolia Status"
            description="Search index connection status"
            control={
              <span className={`border font-mono text-[9px] uppercase px-2 py-0.5 ${
                process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
                  ? 'border-primary/40 text-primary bg-primary/5'
                  : 'border-terminal-border text-data-dim'
              }`}>
                {process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ? 'Connected' : 'Not configured'}
              </span>
            }
          />
          <SettingRow
            label="Re-sync All Indexes"
            description="Force re-index all published content to Algolia"
            control={
              <button className="border border-primary text-primary font-mono text-[9px] uppercase px-3 py-1.5 hover:bg-primary/10 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">sync</span>
                Re-sync Now
              </button>
            }
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[10px] uppercase px-6 py-2.5 overflow-hidden">
          <span className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <span className="relative z-10 group-hover:text-electromagnetic-ink transition-colors duration-300">
            Save Settings
          </span>
        </button>
      </div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  control,
}: {
  label: string
  description: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-6">
      <div className="flex-1 min-w-0">
        <span className="font-mono text-[11px] text-on-surface uppercase block">{label}</span>
        <span className="font-body text-body-sm text-on-surface-variant">{description}</span>
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  )
}

function Toggle({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-9 h-5 bg-surface-container border border-terminal-border peer-checked:bg-primary/20 peer-checked:border-primary transition-colors relative">
        <div className="w-3 h-3 bg-data-dim peer-checked:bg-primary absolute top-0.5 left-0.5 peer-checked:translate-x-4 transition-transform" />
      </div>
    </label>
  )
}
