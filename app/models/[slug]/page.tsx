import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import SpecBadge from '@/components/shared/SpecBadge'
import CopyButton from '@/components/shared/CopyButton'
import { getModelBySlug, getPublishedModelSlugs, getRelatedModels } from '@/lib/queries/models'
import { formatDate } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedModelSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await getModelBySlug(params.slug)
  if (!model) return {}
  return {
    title: `${model.title} by ${model.provider} — Use Cases, Pricing & Review | Avelix`,
    description: model.short_description,
    openGraph: {
      title: `${model.title} by ${model.provider}`,
      description: model.short_description,
      type: 'article',
    },
  }
}

const MODEL_TYPE_ICON: Record<string, string> = {
  llm:        'psychology',
  reasoning:  'calculate',
  image:      'image',
  video:      'movie',
  audio:      'mic',
  embedding:  'hub',
  coding:     'code',
  multimodal: 'all_inclusive',
}

const BEST_FOR_ICON: Record<string, string> = {
  writing:    'edit_note',
  coding:     'code',
  research:   'search',
  reasoning:  'calculate',
  agents:     'smart_toy',
  automation: 'auto_mode',
  vision:     'visibility',
  audio:      'mic',
  video:      'movie',
  general:    'all_inclusive',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
  )
}

function formatCtx(n?: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return `${(n / 1000).toFixed(0)}K`
}

export default async function ModelPage({ params }: Props) {
  const model = await getModelBySlug(params.slug)
  if (!model) notFound()

  const relatedModels = await getRelatedModels(model.related_model_slugs)
  const icon = MODEL_TYPE_ICON[model.model_type] ?? 'dataset'

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/models" className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors">
                [MODEL_INDEX]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{model.title}</span>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">{icon}</span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-data-dim uppercase mb-1">{model.provider}</p>
                <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">
                  {model.title}
                </h1>
              </div>
            </div>

            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-6">
              {model.short_description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <SpecBadge type="model-type" value={model.model_type} />
              <SpecBadge type="status" value={model.current_status} />
              <SpecBadge type="speed" value={model.speed} />
              {model.context_window && (
                <SpecBadge type="context" value={String(model.context_window)} />
              )}
              {model.is_open_source && <SpecBadge type="open-source" value="true" />}
              {model.has_api && <SpecBadge type="api" value="true" />}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {model.official_source_url && (
                <a
                  href={model.official_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden inline-block"
                >
                  <span className="relative z-10">View Official Docs →</span>
                  <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                    View Official Docs →
                  </span>
                </a>
              )}
              <Link
                href="/compare"
                className="border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all"
              >
                Compare Models
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {model.release_date && (
                <p className="font-mono text-[9px] text-data-dim uppercase">
                  RELEASED: {formatDate(model.release_date)}
                </p>
              )}
              {model.last_reviewed_at && (
                <p className="font-mono text-[9px] text-data-dim uppercase">
                  REVIEWED: {formatDate(model.last_reviewed_at)}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">

          {/* What is it */}
          {model.long_description && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[OVERVIEW]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
                What is {model.title}?
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">{model.long_description}</p>
            </section>
          )}

          {/* Best For */}
          {model.best_for.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[USE_CASES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Best For
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {model.best_for.map((useCase, i) => {
                  const ucKey = useCase.toLowerCase().split(' ')[0]
                  const ucIcon = BEST_FOR_ICON[ucKey] ?? 'check_circle'
                  return (
                    <div key={i} className="bg-electromagnetic-ink p-4 flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-base flex-shrink-0">{ucIcon}</span>
                      <span className="font-body text-body-sm text-on-surface">{useCase}</span>
                    </div>
                  )
                })}
              </div>

              {model.not_ideal_for.length > 0 && (
                <div className="mt-4 border border-terminal-border p-4">
                  <p className="font-mono text-[9px] text-data-dim uppercase mb-2">NOT_IDEAL_FOR</p>
                  <div className="flex flex-col gap-2">
                    {model.not_ideal_for.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-signal-orange/60 text-sm">remove</span>
                        <span className="font-body text-body-sm text-on-surface-variant">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Technical Specs */}
          <section className="px-4 py-12 border-b border-terminal-border">
            <SectionLabel>[TECHNICAL_SPECS]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-1">CONTEXT_WINDOW</p>
                <p className="font-mono text-[13px] text-on-surface">
                  {model.context_window
                    ? `${formatCtx(model.context_window)} tokens`
                    : '—'}
                </p>
                {model.context_window && (
                  <p className="font-body text-[11px] text-on-surface-variant mt-1">
                    Can process ~{Math.round(model.context_window * 0.75).toLocaleString()} words at once
                  </p>
                )}
              </div>
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-1">SPEED</p>
                <SpecBadge type="speed" value={model.speed} />
                {model.speed_notes && (
                  <p className="font-body text-[11px] text-on-surface-variant mt-2">{model.speed_notes}</p>
                )}
              </div>
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-2">INPUT_TYPES</p>
                <div className="flex flex-wrap gap-1">
                  {model.input_types.map((t) => (
                    <SpecBadge key={t} type="input" value={t} />
                  ))}
                </div>
              </div>
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-2">OUTPUT_TYPES</p>
                <div className="flex flex-wrap gap-1">
                  {model.output_types.map((t) => (
                    <SpecBadge key={t} type="output" value={t} />
                  ))}
                </div>
              </div>
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-2">OPEN_SOURCE</p>
                <SpecBadge type="open-source" value={model.is_open_source ? 'true' : 'false'} />
              </div>
              <div className="bg-electromagnetic-ink p-4">
                <p className="font-mono text-[9px] text-data-dim uppercase mb-2">API_ACCESS</p>
                <SpecBadge type="api" value={model.has_api ? 'true' : 'false'} />
              </div>
            </div>
            {model.quality_notes && (
              <div className="mt-4 border-l-2 border-primary pl-4">
                <p className="font-mono text-[9px] text-primary uppercase mb-1">QUALITY_NOTES</p>
                <p className="font-body text-body-sm text-on-surface-variant">{model.quality_notes}</p>
              </div>
            )}
          </section>

          {/* Strengths & Weaknesses */}
          {(model.strengths.length > 0 || model.weaknesses.length > 0) && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SIGNAL_ANALYSIS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Strengths & Weaknesses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                <div className="bg-electromagnetic-ink p-5">
                  <p className="font-mono text-[10px] text-electric-teal uppercase mb-4">
                    {'// Strengths'}
                  </p>
                  <div className="flex flex-col gap-3">
                    {model.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-electric-teal text-base flex-shrink-0 mt-0.5">add</span>
                        <span className="font-body text-body-sm text-on-surface-variant">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5">
                  <p className="font-mono text-[10px] text-signal-orange uppercase mb-4">
                    {'// Weaknesses'}
                  </p>
                  <div className="flex flex-col gap-3">
                    {model.weaknesses.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-signal-orange text-base flex-shrink-0 mt-0.5">remove</span>
                        <span className="font-body text-body-sm text-on-surface-variant">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Pricing */}
          {(model.pricing_model || model.pricing_summary) && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[PRICING_PROTOCOL]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">Pricing</h2>
              <div className="border border-terminal-border p-5">
                {model.pricing_model && (
                  <div className="mb-4">
                    <span className="font-mono text-[10px] border px-2 py-0.5 uppercase border-primary/40 text-primary">
                      {model.pricing_model.toUpperCase()}
                    </span>
                  </div>
                )}
                {model.pricing_summary && (
                  <p className="font-body text-body-sm text-on-surface-variant mb-4">
                    {model.pricing_summary}
                  </p>
                )}
                {model.pricing_last_verified && (
                  <p className="font-mono text-[9px] text-data-dim uppercase">
                    VERIFIED: {formatDate(model.pricing_last_verified)}
                  </p>
                )}
                {model.official_source_url && (
                  <a
                    href={model.official_source_url}
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

          {/* Compared With Similar Models */}
          {relatedModels.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SIMILAR_MODELS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Compare With Similar Models
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border mb-6">
                {relatedModels.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${m.slug}`}
                    className="flex items-center gap-3 p-4 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      {MODEL_TYPE_ICON[m.model_type] ?? 'dataset'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-on-surface uppercase truncate">{m.title}</p>
                      <p className="font-mono text-[9px] text-data-dim uppercase">{m.provider}</p>
                    </div>
                    <SpecBadge type="speed" value={m.speed} />
                  </Link>
                ))}
              </div>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1 font-mono text-[10px] text-primary uppercase hover:underline"
              >
                <span className="material-symbols-outlined text-xs">compare</span>
                View full comparison tables
              </Link>
            </section>
          )}

          {/* Example Prompts */}
          {model.example_prompts.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[PROMPT_LIBRARY]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Example Prompts
              </h2>
              <div className="flex flex-col gap-3">
                {model.example_prompts.map((prompt, i) => (
                  <div key={i} className="relative border border-terminal-border bg-surface-container-lowest p-4 group">
                    <p className="font-mono text-[11px] text-on-surface-variant pr-8">{prompt}</p>
                    <CopyButton text={prompt} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Safety Notes */}
          {model.safety_notes && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SAFETY_PROTOCOL]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
                Safety & Alignment
              </h2>
              <div className="border-l-2 border-electric-teal pl-4">
                <p className="font-body text-body-sm text-on-surface-variant">{model.safety_notes}</p>
              </div>
            </section>
          )}

        </div>

        {/* CTA */}
        <CTABlock
          title={`Need help building with ${model.title}?`}
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
