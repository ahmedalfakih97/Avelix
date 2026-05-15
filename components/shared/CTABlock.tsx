import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTABlockProps {
  title: string
  description?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'tool-cta' | 'service-cta' | 'guide-cta'
  className?: string
}

export default function CTABlock({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  className,
}: CTABlockProps) {
  return (
    <section
      className={cn(
        'px-4 py-16 bg-electromagnetic-ink border-t border-terminal-border text-center',
        className
      )}
    >
      <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">{title}</h2>
      {description && (
        <p className="font-body text-body-sm text-on-surface-variant max-w-sm mx-auto mb-8">
          {description}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={primaryHref}
          className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden transition-colors"
        >
          <span className="relative z-10">{primaryLabel}</span>
          <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
            {primaryLabel}
          </span>
        </Link>
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="bg-transparent border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
