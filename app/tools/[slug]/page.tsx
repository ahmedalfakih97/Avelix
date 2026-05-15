import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import RelatedItems from '@/components/shared/RelatedItems'
import CopyButton from '@/components/shared/CopyButton'
import { getToolBySlug, getPublishedToolSlugs, getRelatedTools } from '@/lib/queries/tools'
import { formatDate } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedToolSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug)
  if (!tool) return {}
  return {
    title: `${tool.title} Review — ${tool.best_for[0] ?? tool.category_name} | Avelix`,
    description: tool.short_description,
    openGraph: {
      title: tool.title,
      description: tool.short_description,
      type: 'website',
    },
  }
}

const PRICING_LABEL: Record<string, string> = {
  free: 'FREE', freemium: 'FREEMIUM', paid: 'PAID',
  'open-source': 'OPEN SOURCE', enterprise: 'ENTERPRISE',
}

function PricingBadge({ model }: { model?: string }) {
  if (!model) return null
  const colors: Record<string, string> = {
    free: 'text-electric-teal border-electric-teal/50',
    freemium: 'text-primary border-primary/50',
    paid: 'text-secondary border-secondary/50',
    'open-source': 'text-signal-orange border-signal-orange/50',
    enterprise: 'text-on-surface-variant border-terminal-border',
  }
  return (
    <span className={`font-mono text-[10px] border px-2 py-0.5 uppercase ${colors[model] ?? ''}`}>
      {PRICING_LABEL[model] ?? model}
    </span>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span className="font-mono text-[9px] border border-terminal-border text-data-dim px-2 py-0.5 uppercase">
      {label}
    </span>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
  )
}

export default async function ToolPage({ params }: Props) {
  const tool = await getToolBySlug(params.slug)
  if (!tool) notFound()

  const relatedTools = await getRelatedTools(tool.related_tool_slugs)

  const rating = tool.avelix_rating ?? 0
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating))

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/tools" className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors">
                [TOOL_DIRECTORY]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{tool.title}</span>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">dataset</span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-data-dim uppercase mb-1">
                  {tool.category_name ?? 'AI Tool'}
                </p>
                <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">
                  {tool.title}
                </h1>
              </div>
            </div>

            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-6">
              {tool.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <PricingBadge model={tool.pricing_model} />
              {tool.has_free_plan && (
                <Tag label="Free Plan" />
              )}
              {tool.has_api && <Tag label="API" />}
              {tool.is_no_code && <Tag label="No-Code" />}
              {tool.has_arabic_support && <Tag label="Arabic" />}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {tool.website_url && (
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden inline-block"
                >
                  <span className="relative z-10">Try Tool →</span>
                  <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                    Try Tool →
                  </span>
                </a>
              )}
              <Link
                href="/services"
                className="border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all"
              >
                Need help building with this?
              </Link>
            </div>

            {tool.last_reviewed_at && (
              <p className="font-mono text-[9px] text-data-dim uppercase mt-4">
                LAST_REVIEWED: {formatDate(tool.last_reviewed_at)}
              </p>
            )}
          </div>
        </section>

        <div className="max-w-4xl mx-auto">

          {/* What is it */}
          {tool.long_description && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[OVERVIEW]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
                What is {tool.title}?
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">{tool.long_description}</p>
            </section>
          )}

          {/* Best use cases */}
          {tool.best_for.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[USE_CASES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Best Use Cases
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {tool.best_for.map((useCase, i) => (
                  <div key={i} className="bg-electromagnetic-ink p-4 flex items-center gap-3">
                    <span className="font-mono text-[9px] text-primary w-8 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-body-sm text-on-surface">{useCase}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Main features */}
          {tool.main_features.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[FEATURE_SET]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Main Features
              </h2>
              <div className="flex flex-col gap-2">
                {tool.main_features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 border-l-2 border-terminal-border hover:border-l-primary pl-4 py-2 transition-colors">
                    <span className="material-symbols-outlined text-primary text-base">arrow_forward</span>
                    <span className="font-body text-body-sm text-on-surface">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pros & Cons */}
          {(tool.pros.length > 0 || tool.cons.length > 0) && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SIGNAL_ANALYSIS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Pros & Cons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                <div className="bg-electromagnetic-ink p-5">
                  <p className="font-mono text-[10px] text-electric-teal uppercase mb-4">
                    {'// Strengths'}
                  </p>
                  <div className="flex flex-col gap-3">
                    {tool.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-electric-teal text-base flex-shrink-0 mt-0.5">add</span>
                        <span className="font-body text-body-sm text-on-surface-variant">{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5">
                  <p className="font-mono text-[10px] text-signal-orange uppercase mb-4">
                    {'// Limitations'}
                  </p>
                  <div className="flex flex-col gap-3">
                    {tool.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-signal-orange text-base flex-shrink-0 mt-0.5">remove</span>
                        <span className="font-body text-body-sm text-on-surface-variant">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Pricing */}
          {(tool.pricing_model || tool.pricing_summary) && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[PRICING_PROTOCOL]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">Pricing</h2>
              <div className="border border-terminal-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <PricingBadge model={tool.pricing_model} />
                  {tool.has_free_plan && (
                    <span className="font-mono text-[10px] text-electric-teal uppercase">
                      Free plan available
                    </span>
                  )}
                </div>
                {tool.pricing_summary && (
                  <p className="font-body text-body-sm text-on-surface-variant mb-4">
                    {tool.pricing_summary}
                  </p>
                )}
                {tool.pricing_last_verified && (
                  <p className="font-mono text-[9px] text-data-dim uppercase">
                    VERIFIED: {formatDate(tool.pricing_last_verified)}
                  </p>
                )}
                {tool.website_url && (
                  <a
                    href={`${tool.website_url}/pricing`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-primary uppercase mt-4 hover:underline"
                  >
                    View official pricing
                    <span className="material-symbols-outlined text-xs">north_east</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Avelix Rating */}
          {tool.avelix_rating && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[AVELIX_RATING]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Avelix Assessment
              </h2>
              <div className="border border-terminal-border p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {stars.map((filled, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xl ${filled ? 'text-signal-orange' : 'text-data-dim'}`}
                        style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[13px] text-signal-orange">
                    {rating.toFixed(1)} / 5.0
                  </span>
                </div>
                {tool.avelix_recommendation && (
                  <p className="font-body text-body-lg text-on-surface">
                    {tool.avelix_recommendation}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Example Prompts */}
          {tool.example_prompts.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[PROMPT_LIBRARY]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Example Prompts
              </h2>
              <div className="flex flex-col gap-3">
                {tool.example_prompts.map((prompt, i) => (
                  <div key={i} className="relative border border-terminal-border bg-surface-container-lowest p-4 group">
                    <p className="font-mono text-[11px] text-on-surface-variant pr-8">{prompt}</p>
                    <CopyButton text={prompt} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <RelatedItems title="Similar_Tools" tools={relatedTools} />
            </section>
          )}

        </div>

        {/* CTA */}
        <CTABlock
          title={`Need help building with ${tool.title}?`}
          description="We build AI-powered systems and automations for businesses. Book a free discovery call."
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
