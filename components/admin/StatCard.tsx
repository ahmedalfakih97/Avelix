interface StatCardProps {
  label: string
  value: number | string
  subLabel?: string
  icon: string
  accent?: 'primary' | 'orange' | 'dim'
}

export default function StatCard({ label, value, subLabel, icon, accent = 'primary' }: StatCardProps) {
  const accentColor = {
    primary: 'text-primary',
    orange:  'text-signal-orange',
    dim:     'text-data-dim',
  }[accent]

  return (
    <div className="border border-terminal-border bg-surface-container-lowest p-5 flex flex-col gap-3 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[9px] text-data-dim uppercase">{label}</span>
        <span className={`material-symbols-outlined text-[18px] ${accentColor}`}>{icon}</span>
      </div>
      <div>
        <span className={`font-headline text-[28px] font-bold ${accentColor} leading-none`}>{value}</span>
        {subLabel && (
          <span className="font-mono text-[9px] text-data-dim uppercase block mt-1">{subLabel}</span>
        )}
      </div>
    </div>
  )
}
