import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import { getComparisons } from '@/lib/queries/comparisons'

export const metadata: Metadata = {
  title: 'AI Model Comparisons — Head-to-Head & Best-For Rankings | Avelix',
  description: 'Compare AI models side-by-side. ChatGPT vs Claude, Gemini vs GPT-4o, best model for coding, writing, and more.',
  openGraph: {
    title: 'AI Model Comparisons | Avelix',
    description: 'Head-to-head comparisons and best-for rankings for every major AI model.',
    type: 'website',
  },
}

const TYPE_ICON: Record<string, string> = {
  'head-to-head': 'compare_arrows',
  'best-for':     'military_tech',
}

export default async function ComparePage() {
  const comparisons = await getComparisons()

  const headToHead = comparisons.filter((c) => c.comparison_type === 'head-to-head')
  const bestFor    = comparisons.filter((c) => c.comparison_type === 'best-for')

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest grid-bg">
          <div className="relative z-10 max-w-4xl">
            <div className="signal-scan" />
            <span className="font-mono text-label-caps text-primary uppercase block mb-2">
              [COMPARISON_ENGINE]
            </span>
            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
              AI Model Comparisons
            </h1>
            <p className="font-body text-body-sm text-on-surface-variant max-w-lg">
              Head-to-head comparisons and best-for rankings. Stop guessing — find the right model for your exact task.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">

          {/* Head-to-Head */}
          {headToHead.length > 0 && (
            <section className="py-12 border-b border-terminal-border">
              <p className="font-mono text-label-caps text-primary uppercase mb-2">[HEAD_TO_HEAD]</p>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Direct Comparisons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {headToHead.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="flex flex-col p-5 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-primary text-base">
                        {TYPE_ICON[c.comparison_type]}
                      </span>
                      <span className="font-mono text-[9px] text-primary uppercase border border-primary/40 px-2 py-0.5">
                        {c.comparison_type.replace('-', ' ')}
                      </span>
                    </div>
                    <h3 className="font-headline text-[15px] text-on-surface uppercase font-bold mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="font-body text-body-sm text-on-surface-variant flex-1 line-clamp-2">
                      {c.short_description}
                    </p>
                    <div className="flex items-center gap-1 mt-4">
                      {c.item_slugs.map((slug, i) => (
                        <span key={slug} className="flex items-center gap-1">
                          <span className="font-mono text-[9px] text-data-dim uppercase border border-terminal-border px-2 py-0.5">{slug}</span>
                          {i < c.item_slugs.length - 1 && (
                            <span className="font-mono text-[9px] text-data-dim">vs</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Best-For Rankings */}
          {bestFor.length > 0 && (
            <section className="py-12 border-b border-terminal-border">
              <p className="font-mono text-label-caps text-primary uppercase mb-2">[BEST_FOR]</p>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Best Model For...
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {bestFor.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="flex flex-col p-5 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-signal-orange text-base">
                        {TYPE_ICON[c.comparison_type]}
                      </span>
                      <span className="font-mono text-[9px] text-signal-orange uppercase border border-signal-orange/40 px-2 py-0.5">
                        RANKING
                      </span>
                    </div>
                    <h3 className="font-headline text-[15px] text-on-surface uppercase font-bold mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="font-body text-body-sm text-on-surface-variant flex-1 line-clamp-2">
                      {c.short_description}
                    </p>
                    <p className="font-mono text-[9px] text-data-dim uppercase mt-4">
                      {c.item_slugs.length} models ranked
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* What next */}
          <section className="py-12">
            <p className="font-mono text-label-caps text-primary uppercase mb-2">[EXPLORE_MORE]</p>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
              Explore the Model Index
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
              <Link
                href="/models"
                className="flex items-center gap-3 p-5 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
              >
                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                <div>
                  <p className="font-mono text-[11px] text-on-surface uppercase group-hover:text-primary transition-colors">Browse All Models</p>
                  <p className="font-body text-body-sm text-on-surface-variant">Filter by provider, type, and capability</p>
                </div>
              </Link>
              <Link
                href="/tools"
                className="flex items-center gap-3 p-5 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
              >
                <span className="material-symbols-outlined text-primary text-xl">dataset</span>
                <div>
                  <p className="font-mono text-[11px] text-on-surface uppercase group-hover:text-primary transition-colors">Explore AI Tools</p>
                  <p className="font-body text-body-sm text-on-surface-variant">Apps and services powered by these models</p>
                </div>
              </Link>
            </div>
          </section>

        </div>

        <CTABlock
          title="Not sure which model to use?"
          description="We help businesses choose and integrate the right AI stack. Book a free strategy call."
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
