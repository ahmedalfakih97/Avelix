import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import SpecBadge from '@/components/shared/SpecBadge'
import CopyButton from '@/components/shared/CopyButton'
import { JsonLd } from '@/components/shared/JsonLd'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { getModelBySlug, getPublishedModelSlugs, getRelatedModelsByCategory } from '@/lib/queries/models'
import { formatDate } from '@/lib/utils'
import {
  cleanDisplayText,
  displayOrNull,
  capabilityDisplay,
  openSourceLabel,
  parseBenchmarks,
  parseList,
  isApiAvailable,
} from '@/lib/utils/display'

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
  const ogImageUrl = `/api/og/model?slug=${model.slug}`
  return {
    title: `${model.title} by ${model.provider} — Capabilities, Pricing & Use Cases`,
    description: `${model.short_description} Context window, strengths, weaknesses, and best use cases.`,
    alternates: { canonical: `/models/${model.slug}` },
    openGraph: {
      title: `${model.title} by ${model.provider}`,
      description: model.short_description,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${model.title} by ${model.provider}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${model.title} by ${model.provider}`,
      description: model.short_description,
      images: [ogImageUrl],
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

const PRICING_TIER_COLOR: Record<string, string> = {
  'Free':               'text-primary border-primary/40',
  'Open Source / Free': 'text-primary border-primary/40',
  'Budget':             'text-emerald-400 border-emerald-400/40',
  'Mid-Range':          'text-amber-400 border-amber-400/40',
  'Premium':            'text-rose-400 border-rose-400/40',
}

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

function formatCtx(n?: number): string {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  return `${(n / 1000).toFixed(0)}K`
}

function SpecCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-electromagnetic-ink p-4">
      <p className="font-mono text-[9px] text-data-dim uppercase mb-1">{label}</p>
      {children}
    </div>
  )
}

// Only rendered when capability === true — never shows ✗
function CapabilityChip({ label }: { label: string }) {
  return (
    <span className="font-mono text-[8px] uppercase border px-2 py-1 border-primary text-primary bg-primary/5">
      ✓ {label}
    </span>
  )
}

function buildModelSchema(model: {
  title: string
  slug: string
  short_description: string
  provider: string
  avelix_category?: string
  model_type: string
  last_reviewed_at?: string | null
  release_date?: string
  pricing_tier_label?: string
  api_input_price_usd_per_1m?: number
  has_free_tier?: boolean
}) {
  const offers =
    model.api_input_price_usd_per_1m != null
      ? {
          '@type': 'Offer',
          price: model.api_input_price_usd_per_1m,
          priceCurrency: 'USD',
          description: 'Per 1M input tokens',
          ...(model.has_free_tier ? { eligibleCustomerType: 'FreeTrialCustomer' } : {}),
        }
      : model.pricing_tier_label === 'Free' || model.pricing_tier_label === 'Open Source / Free'
        ? { '@type': 'Offer', price: 0, priceCurrency: 'USD' }
        : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: model.title,
    description: model.short_description,
    applicationCategory: 'ArtificialIntelligenceApplication',
    applicationSubCategory: model.avelix_category ?? model.model_type,
    url: `https://avelix.ai/models/${model.slug}`,
    author: { '@type': 'Organization', name: model.provider },
    publisher: { '@type': 'Organization', name: 'Avelix', url: 'https://avelix.ai' },
    ...(model.release_date ? { datePublished: model.release_date } : {}),
    ...(model.last_reviewed_at ? { dateModified: model.last_reviewed_at } : {}),
    ...(offers ? { offers } : {}),
  }
}

export default async function ModelPage({ params }: Props) {
  const model = await getModelBySlug(params.slug)
  if (!model) notFound()

  const relatedModels = await getRelatedModelsByCategory(model.avelix_category ?? '', model.slug, 4)
  const icon = MODEL_TYPE_ICON[model.model_type] ?? 'dataset'
  const modelSchema = buildModelSchema(model)

  const benchmarks = parseBenchmarks(model.benchmark_results)
  const integrations = parseList(model.known_integrations)

  const tierCls = model.pricing_tier_label
    ? (PRICING_TIER_COLOR[model.pricing_tier_label] ?? 'text-data-dim border-terminal-border')
    : ''

  const openSourceDisplay = openSourceLabel(model.is_open_source)
  const paramCount = displayOrNull(model.parameter_count)
  const qualityNotes = displayOrNull(model.quality_notes)
  const safetyFeatures = cleanDisplayText(model.safety_features)
  const safetyNotes = cleanDisplayText(model.safety_notes)
  const apiAvailable = isApiAvailable(model.has_api)

  return (
    <>
      <Header />
      <JsonLd data={modelSchema} />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="mb-4">
              <Breadcrumbs
                crumbs={[
                  { label: 'Avelix', href: '/' },
                  { label: 'Models', href: '/models' },
                  { label: model.provider, href: `/models?provider=${encodeURIComponent(model.provider)}` },
                  { label: model.title },
                ]}
              />
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">{icon}</span>
              </div>
              <div>
                <p className="font-mono text-[10px] text-data-dim uppercase mb-1">
                  {model.provider}
                  {model.provider_country && ` · ${model.provider_country}`}
                </p>
                <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">
                  {model.title}
                </h1>
                {model.avelix_category && (
                  <span className="font-mono text-[8px] text-primary/80 uppercase border border-primary/20 bg-primary/5 px-1.5 py-0.5 mt-1 inline-block">
                    {model.avelix_category}
                  </span>
                )}
              </div>
            </div>

            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-6">
              {model.short_description}
            </p>

            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <SpecBadge type="model-type" value={model.model_type} />
              <SpecBadge type="status" value={model.current_status} />
              {model.avg_response_latency ? (
                <span className="font-mono text-[8px] uppercase border border-terminal-border px-1.5 py-0.5 text-on-surface-variant">
                  {model.avg_response_latency}
                </span>
              ) : (
                <SpecBadge type="speed" value={model.speed} />
              )}
              {model.context_window && (
                <SpecBadge type="context" value={String(model.context_window)} />
              )}
              {model.is_open_source && <SpecBadge type="open-source" value="true" />}
              {apiAvailable === true && <SpecBadge type="api" value="true" />}
              {model.avelix_featured && (
                <span className="font-mono text-[8px] text-primary uppercase border border-primary/40 px-1.5 py-0.5">★ FEATURED</span>
              )}
              {model.popularity_tier === 'Trending' && (
                <span className="font-mono text-[8px] text-signal-orange uppercase border border-signal-orange/40 px-1.5 py-0.5">↑ TRENDING</span>
              )}
            </div>

            {/* Quick spec row */}
            <div className="flex flex-wrap gap-4 mb-6">
              {paramCount && (
                <div>
                  <span className="font-mono text-[8px] text-data-dim uppercase block">PARAMS</span>
                  <span className="font-mono text-[11px] text-on-surface">{paramCount}</span>
                </div>
              )}
              {model.max_output_tokens && (
                <div>
                  <span className="font-mono text-[8px] text-data-dim uppercase block">MAX_OUTPUT</span>
                  <span className="font-mono text-[11px] text-on-surface">{formatCtx(model.max_output_tokens)} tokens</span>
                </div>
              )}
              {model.modality && (
                <div>
                  <span className="font-mono text-[8px] text-data-dim uppercase block">MODALITY</span>
                  <span className="font-mono text-[11px] text-on-surface">{model.modality}</span>
                </div>
              )}
              {model.release_year && (
                <div>
                  <span className="font-mono text-[8px] text-data-dim uppercase block">RELEASE</span>
                  <span className="font-mono text-[11px] text-on-surface">{model.release_year}</span>
                </div>
              )}
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
              {model.consumer_url && (
                <a
                  href={model.consumer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all"
                >
                  Try It →
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

          {/* Overview */}
          {model.long_description && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[OVERVIEW]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
                What is {model.title}?
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">{model.long_description}</p>
            </section>
          )}

          {/* Feature Capabilities — only ✓ chips, never ✗ */}
          <section className="px-4 py-12 border-b border-terminal-border">
            <SectionLabel>[CAPABILITIES]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
              Feature Capabilities
            </h2>
            <div className="flex flex-wrap gap-2">
              {capabilityDisplay(model.vision_support)             && <CapabilityChip label="Vision" />}
              {capabilityDisplay(model.audio_support)              && <CapabilityChip label="Audio" />}
              {capabilityDisplay(model.video_support)              && <CapabilityChip label="Video" />}
              {capabilityDisplay(model.image_generation_support)   && <CapabilityChip label="Image Gen" />}
              {capabilityDisplay(model.tool_use_support)           && <CapabilityChip label="Tool Use" />}
              {capabilityDisplay(model.fine_tuning_support)        && <CapabilityChip label="Fine-Tuning" />}
              {capabilityDisplay(model.json_mode_support)          && <CapabilityChip label="JSON Mode" />}
              {capabilityDisplay(model.structured_output_support)  && <CapabilityChip label="Structured Output" />}
              {capabilityDisplay(model.embedding_support)          && <CapabilityChip label="Embeddings" />}
              {capabilityDisplay(model.enterprise_ready)           && <CapabilityChip label="Enterprise" />}
              {apiAvailable === true                               && <CapabilityChip label="API Access" />}
              {model.is_open_source                               && <CapabilityChip label="Open Source" />}
            </div>
            {model.rag_suitability && (
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-[9px] text-data-dim uppercase">RAG_SUITABILITY:</span>
                <span className="font-mono text-[9px] text-on-surface uppercase">{model.rag_suitability}</span>
              </div>
            )}
          </section>

          {/* Best For */}
          {model.best_for.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[USE_CASES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">Best For</h2>
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
              <SpecCell label="CONTEXT_WINDOW">
                <p className="font-mono text-[13px] text-on-surface">
                  {model.context_window ? `${formatCtx(model.context_window)} tokens` : '—'}
                </p>
                {model.context_window && (
                  <p className="font-body text-[11px] text-on-surface-variant mt-1">
                    ~{Math.round(model.context_window * 0.75).toLocaleString()} words
                  </p>
                )}
              </SpecCell>

              <SpecCell label="MAX_OUTPUT">
                <p className="font-mono text-[13px] text-on-surface">
                  {model.max_output_tokens ? `${formatCtx(model.max_output_tokens)} tokens` : '—'}
                </p>
              </SpecCell>

              <SpecCell label="RESPONSE_SPEED">
                {model.avg_response_latency ? (
                  <p className="font-mono text-[11px] text-on-surface">{model.avg_response_latency}</p>
                ) : (
                  <SpecBadge type="speed" value={model.speed} />
                )}
                {model.speed_notes && (
                  <p className="font-body text-[11px] text-on-surface-variant mt-1">{model.speed_notes}</p>
                )}
              </SpecCell>

              <SpecCell label="PARAMETER_COUNT">
                <p className="font-mono text-[13px] text-on-surface">{paramCount ?? '—'}</p>
              </SpecCell>

              <SpecCell label="INPUT_TYPES">
                <div className="flex flex-wrap gap-1">
                  {model.input_types.map((t) => <SpecBadge key={t} type="input" value={t} />)}
                </div>
              </SpecCell>

              <SpecCell label="OUTPUT_TYPES">
                <div className="flex flex-wrap gap-1">
                  {model.output_types.map((t) => <SpecBadge key={t} type="output" value={t} />)}
                </div>
              </SpecCell>

              <SpecCell label="MODALITY">
                <p className="font-mono text-[11px] text-on-surface">{model.modality ?? '—'}</p>
              </SpecCell>

              <SpecCell label="DEPLOYMENT">
                {model.deployment_options && model.deployment_options.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {model.deployment_options.map((d) => (
                      <span key={d} className="font-mono text-[8px] text-on-surface-variant border border-terminal-border px-1.5 py-0.5 uppercase">{d}</span>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-[11px] text-data-dim">—</p>
                )}
              </SpecCell>

              <SpecCell label="OPEN_SOURCE">
                {openSourceDisplay ? (
                  <span className={`inline-flex items-center gap-1 font-mono text-[9px] border px-2 py-0.5 uppercase ${
                    openSourceDisplay === 'Open Source'
                      ? 'text-signal-orange border-signal-orange/40'
                      : 'text-data-dim border-terminal-border'
                  }`}>
                    <span className="material-symbols-outlined text-[11px]">
                      {openSourceDisplay === 'Open Source' ? 'lock_open' : 'lock'}
                    </span>
                    {openSourceDisplay.toUpperCase()}
                  </span>
                ) : (
                  <p className="font-mono text-[11px] text-data-dim">—</p>
                )}
              </SpecCell>

              <SpecCell label="API_ACCESS">
                {apiAvailable !== null ? (
                  <SpecBadge type="api" value={apiAvailable ? 'true' : 'false'} />
                ) : (
                  <p className="font-mono text-[11px] text-data-dim">—</p>
                )}
              </SpecCell>
            </div>

            {qualityNotes && (
              <div className="mt-4 border-l-2 border-primary pl-4">
                <p className="font-mono text-[9px] text-primary uppercase mb-1">QUALITY_NOTES</p>
                <p className="font-body text-body-sm text-on-surface-variant">{qualityNotes}</p>
              </div>
            )}
          </section>

          {/* Benchmarks */}
          {benchmarks.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[BENCHMARKS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Benchmark Results
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {benchmarks.map(({ key, value }) => (
                  <div key={key} className="bg-electromagnetic-ink p-4">
                    <p className="font-mono text-[9px] text-data-dim uppercase mb-1">{key}</p>
                    <p className="font-mono text-[15px] text-primary">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strengths & Weaknesses */}
          {(model.strengths.length > 0 || model.weaknesses.length > 0) && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[SIGNAL_ANALYSIS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Strengths & Weaknesses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                <div className="bg-electromagnetic-ink p-5">
                  <p className="font-mono text-[10px] text-electric-teal uppercase mb-4">{'// Strengths'}</p>
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
                  <p className="font-mono text-[10px] text-signal-orange uppercase mb-4">{'// Weaknesses'}</p>
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
          {(model.pricing_model || model.pricing_summary || model.pricing_tier_label) && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[PRICING_PROTOCOL]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">Pricing</h2>
              <div className="border border-terminal-border p-5">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {model.pricing_tier_label && (
                    <span className={`font-mono text-[10px] border px-2 py-0.5 uppercase ${tierCls}`}>
                      {model.pricing_tier_label}
                    </span>
                  )}
                  {model.has_free_tier && (
                    <span className="font-mono text-[10px] border border-primary/40 text-primary px-2 py-0.5 uppercase">
                      Free Tier Available
                    </span>
                  )}
                  {model.pricing_model && (
                    <span className="font-mono text-[10px] border border-terminal-border text-data-dim px-2 py-0.5 uppercase">
                      {model.pricing_model}
                    </span>
                  )}
                </div>

                {(model.api_input_price_usd_per_1m || model.api_output_price_usd_per_1m) && (
                  <div className="grid grid-cols-2 gap-px bg-terminal-border border border-terminal-border mb-4">
                    {model.api_input_price_usd_per_1m != null && (
                      <div className="bg-electromagnetic-ink p-3">
                        <p className="font-mono text-[8px] text-data-dim uppercase mb-1">INPUT / 1M TOKENS</p>
                        <p className="font-mono text-[15px] text-on-surface">${model.api_input_price_usd_per_1m.toFixed(2)}</p>
                      </div>
                    )}
                    {model.api_output_price_usd_per_1m != null && (
                      <div className="bg-electromagnetic-ink p-3">
                        <p className="font-mono text-[8px] text-data-dim uppercase mb-1">OUTPUT / 1M TOKENS</p>
                        <p className="font-mono text-[15px] text-on-surface">${model.api_output_price_usd_per_1m.toFixed(2)}</p>
                      </div>
                    )}
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
                {model.pricing_url && (
                  <a
                    href={model.pricing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-primary uppercase mt-4 hover:underline"
                  >
                    View official pricing
                    <span className="material-symbols-outlined text-xs">north_east</span>
                  </a>
                )}
              </div>

              {/* Budget alternative card */}
              {model.similar_cheaper_model && (
                <div className="mt-4 border border-terminal-border p-4 flex items-center gap-4">
                  <span className="material-symbols-outlined text-data-dim text-xl">savings</span>
                  <div>
                    <p className="font-mono text-[9px] text-data-dim uppercase mb-1">BUDGET_ALTERNATIVE</p>
                    <p className="font-body text-body-sm text-on-surface-variant">
                      Consider <strong className="text-on-surface">{model.similar_cheaper_model}</strong> for a lower-cost option with similar capabilities.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Integrations */}
          {integrations.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[INTEGRATIONS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Known Integrations
              </h2>
              <div className="flex flex-wrap gap-2">
                {integrations.slice(0, 12).map((name) => (
                  <span
                    key={name}
                    className="font-mono text-[9px] text-on-surface-variant uppercase border border-terminal-border px-2 py-1"
                  >
                    {name}
                  </span>
                ))}
                {integrations.length > 12 && (
                  <span className="font-mono text-[9px] text-data-dim uppercase border border-terminal-border px-2 py-1">
                    +{integrations.length - 12} more
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Related models — category-based */}
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
                    <p className="font-mono text-[8px] text-data-dim uppercase mb-2">PROMPT_{String(i + 1).padStart(2, '0')}</p>
                    <p className="font-mono text-[11px] text-on-surface-variant pr-8">{prompt}</p>
                    <CopyButton text={prompt} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Safety & Compliance */}
          {(safetyNotes || safetyFeatures) && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SAFETY_PROTOCOL]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
                Safety & Compliance
              </h2>
              {safetyFeatures && (
                <div className="border-l-2 border-electric-teal pl-4 mb-4">
                  <p className="font-mono text-[9px] text-primary uppercase mb-1">SAFETY_FEATURES</p>
                  <p className="font-body text-body-sm text-on-surface-variant">{safetyFeatures}</p>
                </div>
              )}
              {safetyNotes && safetyNotes !== safetyFeatures && (
                <div className="border-l-2 border-terminal-border pl-4">
                  <p className="font-body text-body-sm text-on-surface-variant">{safetyNotes}</p>
                </div>
              )}
              {model.enterprise_ready && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                  <span className="font-mono text-[10px] text-on-surface uppercase">Enterprise Ready</span>
                </div>
              )}
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
