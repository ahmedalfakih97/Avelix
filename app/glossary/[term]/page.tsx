import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import TermPill from '@/components/shared/TermPill'
import ToolCard from '@/components/library/ToolCard'
import SkillCard from '@/components/library/SkillCard'
import {
  getGlossaryTermBySlug,
  getPublishedTermSlugs,
  getRelatedGlossaryTerms,
} from '@/lib/queries/glossary'
import { getRelatedTools } from '@/lib/queries/tools'
import { getRelatedSkills } from '@/lib/queries/skills'

interface Props {
  params: { term: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedTermSlugs()
  return slugs.map((s) => ({ term: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const term = await getGlossaryTermBySlug(params.term)
  if (!term) return {}
  return {
    title: `What is ${term.title}? — AI Glossary | Avelix`,
    description: term.simple_definition,
    openGraph: {
      title: `What is ${term.title}?`,
      description: term.simple_definition,
      type: 'article',
    },
    alternates: {
      canonical: `/glossary/${term.slug}`,
    },
  }
}

function buildFaqSchema(term: { title: string; simple_definition: string; full_explanation?: string }) {
  const answer = term.full_explanation
    ? `${term.simple_definition} ${term.full_explanation.split('\n\n')[0]}`
    : term.simple_definition

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${term.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      },
      ...(term.full_explanation
        ? [
            {
              '@type': 'Question',
              name: `How does ${term.title} work?`,
              acceptedAnswer: {
                '@type': 'Answer',
                text: term.full_explanation.split('\n\n').slice(1).join(' ') || term.full_explanation,
              },
            },
          ]
        : []),
    ],
  }
}

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

export default async function GlossaryTermPage({ params }: Props) {
  const term = await getGlossaryTermBySlug(params.term)
  if (!term) notFound()

  const [relatedTerms, relatedTools, relatedSkills] = await Promise.all([
    getRelatedGlossaryTerms(term.related_term_slugs),
    getRelatedTools(term.related_tool_slugs),
    getRelatedSkills(term.related_skill_slugs),
  ])

  const faqSchema = buildFaqSchema(term)
  const paragraphs = term.full_explanation?.split('\n\n').filter(Boolean) ?? []

  return (
    <>
      <Header />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/glossary"
                className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors"
              >
                [GLOSSARY_V01]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{term.title}</span>
            </div>

            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-6">
              {term.title}
            </h1>

            {/* Quick definition box */}
            <div className="border-l-2 border-primary pl-5 py-3 bg-surface-container-lowest">
              <p className="font-mono text-[9px] text-primary uppercase mb-2">SIMPLE_DEFINITION</p>
              <p className="font-body text-body-lg text-on-surface">
                {term.simple_definition}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto">

          {/* Full Explanation */}
          {paragraphs.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[FULL_EXPLANATION]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                How It Works
              </h2>
              <div className="flex flex-col gap-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-body-lg text-on-surface-variant leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Example */}
          {term.example && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[EXAMPLE]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Real-World Example
              </h2>
              <div className="border border-terminal-border p-5 bg-electromagnetic-ink">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
                  <span className="font-mono text-[9px] text-primary uppercase">Example</span>
                </div>
                <p className="font-body text-body-lg text-on-surface-variant">{term.example}</p>
              </div>
            </section>
          )}

          {/* Why It Matters */}
          {term.why_it_matters && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[WHY_IT_MATTERS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Why You Should Care
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">{term.why_it_matters}</p>
            </section>
          )}

          {/* Where It's Used */}
          {term.where_its_used && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[WHERE_ITS_USED]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Where You'll See This
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant">{term.where_its_used}</p>
            </section>
          )}

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[RELATED_TOOLS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Tools That Use This
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {relatedTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Related Skills */}
          {relatedSkills.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[LEARN_MORE]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Skills to Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {relatedSkills.map((skill) => (
                  <SkillCard key={skill.slug} skill={skill} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[RELATED_TERMS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Related Concepts
              </h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {relatedTerms.map((t) => (
                  <TermPill key={t.slug} title={t.title} slug={t.slug} />
                ))}
              </div>

              {/* Related term definitions preview */}
              <div className="grid grid-cols-1 gap-px bg-terminal-border border border-terminal-border">
                {relatedTerms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/glossary/${t.slug}`}
                    className="flex items-start justify-between p-4 bg-electromagnetic-ink hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="flex-1 pr-4">
                      <span className="font-mono text-[11px] text-on-surface uppercase block mb-1 group-hover:text-primary transition-colors">
                        {t.title}
                      </span>
                      <span className="font-body text-body-sm text-on-surface-variant line-clamp-1">
                        {t.simple_definition}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-base flex-shrink-0 transition-colors">
                      north_east
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Go Deeper — external sources */}
          {term.related_tool_slugs.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[GO_DEEPER]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Go Deeper
              </h2>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(term.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-terminal-border text-on-surface-variant hover:border-primary hover:text-primary font-mono text-[10px] px-4 py-2 uppercase transition-all"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  Wikipedia
                </a>
                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-2 border border-terminal-border text-on-surface-variant hover:border-primary hover:text-primary font-mono text-[10px] px-4 py-2 uppercase transition-all"
                >
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  Full Glossary
                </Link>
              </div>
            </section>
          )}

        </div>

        <CTABlock
          title="Ready to apply what you've learned?"
          description="Browse AI skills and tools that put these concepts into practice."
          primaryLabel="Browse Skills"
          primaryHref="/skills"
          secondaryLabel="Explore Tools"
          secondaryHref="/tools"
        />

      </main>
      <Footer />
    </>
  )
}
