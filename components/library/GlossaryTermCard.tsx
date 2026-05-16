import Link from 'next/link'
import type { GlossaryTerm } from '@/types/glossary'

interface GlossaryTermCardProps {
  term: Pick<GlossaryTerm, 'title' | 'slug' | 'simple_definition'>
}

export default function GlossaryTermCard({ term }: GlossaryTermCardProps) {
  return (
    <Link
      href={`/glossary/${term.slug}`}
      className="bg-surface-container-lowest p-4 flex justify-between items-start hover:bg-surface-container-low transition-colors group"
    >
      <div className="flex-1 min-w-0 pr-4">
        <span className="font-mono text-on-surface uppercase text-[12px] block mb-1 group-hover:text-primary transition-colors">
          {term.title}
        </span>
        <span className="font-body text-body-sm text-on-surface-variant line-clamp-1">
          {term.simple_definition}
        </span>
      </div>
      <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-base flex-shrink-0 transition-colors mt-0.5">
        north_east
      </span>
    </Link>
  )
}
