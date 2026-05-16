interface ServiceCardProps {
  service: {
    title: string
    description: string
    who_its_for: string
    icon: string
    slug: string
    index: number
  }
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const num = String(service.index).padStart(2, '0')

  return (
    <div className="flex flex-col p-5 border border-terminal-border bg-electromagnetic-ink hover:border-l-2 hover:border-primary transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">{service.icon}</span>
        </div>
        <span className="font-mono text-[9px] text-data-dim uppercase">{num}</span>
      </div>

      <h3 className="font-headline text-on-surface uppercase text-[14px] font-bold mb-2 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      <p className="font-body text-body-sm text-on-surface-variant flex-1 mb-4 leading-relaxed">
        {service.description}
      </p>

      <div className="pt-3 border-t border-terminal-border">
        <span className="font-mono text-[9px] text-data-dim uppercase block">FOR: </span>
        <span className="font-mono text-[9px] text-primary uppercase">{service.who_its_for}</span>
      </div>
    </div>
  )
}
