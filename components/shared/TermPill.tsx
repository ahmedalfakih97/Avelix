import Link from 'next/link'

interface TermPillProps {
  title: string
  slug: string
}

export default function TermPill({ title, slug }: TermPillProps) {
  return (
    <Link
      href={`/glossary/${slug}`}
      className="inline-flex items-center gap-1 border border-terminal-border text-data-dim hover:border-primary hover:text-primary font-mono text-[9px] px-2 py-1 uppercase transition-all"
    >
      {title}
      <span className="material-symbols-outlined text-[10px]">north_east</span>
    </Link>
  )
}
