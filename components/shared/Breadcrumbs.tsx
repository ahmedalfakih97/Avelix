import Link from 'next/link'
import { JsonLd } from './JsonLd'

interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  crumbs: Crumb[]
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const schemaItems = crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.label,
    ...(crumb.href ? { item: `https://avelix.ai${crumb.href}` } : {}),
  }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems,
  }

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-data-dim">/</span>}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-mono text-[10px] text-primary uppercase">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
