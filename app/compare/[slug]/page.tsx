import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import ComparisonTable from '@/components/shared/ComparisonTable'
import { getComparisonBySlug, getPublishedComparisonSlugs } from '@/lib/queries/comparisons'
import { getRelatedModels } from '@/lib/queries/models'
import { formatDate } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedComparisonSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = await getComparisonBySlug(params.slug)
  if (!comparison) return {}
  const year = new Date().getFullYear()
  const title = comparison.comparison_type === 'head-to-head'
    ? `${comparison.title} — Which is Better in ${year}? | Avelix`
    : `${comparison.title} | Avelix`
  return {
    title,
    description: comparison.short_description,
    openGraph: {
      title,
      description: comparison.short_description,
      type: 'article',
    },
  }
}

const USER_TYPE_ICON: Record<string, string> = {
  beginner:  'person',
  creator:   'brush',
  developer: 'code',
  business:  'business',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
  )
}

export default async function ComparisonPage({ params }: Props) {
  const comparison = await getComparisonBySlug(params.slug)
  if (!comparison) notFound()

  const models = comparison.item_type === 'model'
    ? await getRelatedModels(comparison.item_slugs)
    : []

  const labels: Record<string, string> = {}
  models.forEach((m) => { labels[m.slug] = m.title })
  comparison.item_slugs.forEach((slug) => {
    if (!labels[slug]) labels[slug] = slug
  })

  const year = new Date().getFullYear()

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/compare" className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors">
                [COMPARISON_ENGINE]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{comparison.slug}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[9px] border border-primary/40 text-primary px-2 py-0.5 uppercase">
                {comparison.comparison_type === 'head-to-head' ? 'HEAD TO HEAD' : 'RANKING'}
              </span>
            </div>

            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
              {comparison.comparison_type === 'head-to-head'
                ? `${comparison.title} — Which Should You Use in ${year}?`
                : comparison.title}
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
              {comparison.short_description}
            </p>

            <p className="font-mono text-[9px] text-data-dim uppercase mt-4">
              REVIEWED: {formatDate(comparison.last_reviewed_at)}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">

          {/* Quick Verdict */}
          <section className="px-4 py-12 border-b border-terminal-border">
            <SectionLabel>[VERDICT]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
              {comparison.comparison_type === 'head-to-head' ? 'Quick Verdict' : 'Our Ranking'}
            </h2>
            <div className="border-l-2 border-primary pl-5 bg-primary/5 py-4 pr-4">
              <p className="font-body text-body-lg text-on-surface">{comparison.verdict}</p>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
            <SectionLabel>[COMPARISON_TABLE]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
              Side-by-Side Comparison
            </h2>
            <ComparisonTable
              rows={comparison.comparison_rows}
              slugs={comparison.item_slugs}
              labels={labels}
            />
          </section>

          {/* Real Use Case Scenarios */}
          {comparison.scenarios.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[USE_CASE_SCENARIOS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Real Use Cases
              </h2>
              <div className="flex flex-col gap-px bg-terminal-border border border-terminal-border">
                {comparison.scenarios.map((scenario, i) => (
                  <div key={i} className="bg-electromagnetic-ink p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className="font-mono text-[9px] text-data-dim uppercase mr-2">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-headline text-[14px] text-on-surface uppercase inline">
                          {scenario.title}
                        </h3>
                      </div>
                      <span className="font-mono text-[9px] text-electric-teal uppercase border border-electric-teal/40 px-2 py-0.5 flex-shrink-0">
                        {labels[scenario.winner] ?? scenario.winner}
                      </span>
                    </div>
                    <p className="font-body text-body-sm text-on-surface-variant mb-3">
                      {scenario.description}
                    </p>
                    <div className="border-l-2 border-electric-teal pl-3">
                      <p className="font-body text-body-sm text-on-surface">{scenario.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendation by User Type */}
          {Object.keys(comparison.recommendation_by_user_type).length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[RECOMMENDATION_MATRIX]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Which Should You Choose?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {Object.entries(comparison.recommendation_by_user_type).map(([userType, rec]) => (
                  <div key={userType} className="bg-electromagnetic-ink p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-base">
                        {USER_TYPE_ICON[userType] ?? 'person'}
                      </span>
                      <span className="font-mono text-[10px] text-primary uppercase">
                        For {userType}s
                      </span>
                    </div>
                    <p className="font-body text-body-sm text-on-surface-variant">{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Models */}
          {models.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[MODELS_IN_THIS_COMPARISON]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Explore Each Model
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {models.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${m.slug}`}
                    className="flex items-center gap-3 p-4 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-on-surface uppercase truncate group-hover:text-primary transition-colors">{m.title}</p>
                      <p className="font-mono text-[9px] text-data-dim uppercase">{m.provider}</p>
                    </div>
                    <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-base transition-colors">arrow_forward</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Comparisons nav */}
          <section className="px-4 py-8">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 font-mono text-[10px] text-primary uppercase hover:underline"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span>
              All Comparisons
            </Link>
          </section>

        </div>

        <CTABlock
          title="Need help choosing the right AI stack?"
          description="We help businesses evaluate and implement AI models. Book a free strategy call."
          primaryLabel="See Our Services"
          primaryHref="/services"
          secondaryLabel="Book a Free Call"
          secondaryHref="/services#contact"
        />

      </main>
      <Footer />
    </>
  )
}
