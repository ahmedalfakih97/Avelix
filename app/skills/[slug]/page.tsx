import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import LearningStep from '@/components/shared/LearningStep'
import SkillCard from '@/components/library/SkillCard'
import ToolCard from '@/components/library/ToolCard'
import ModelCard from '@/components/library/ModelCard'
import {
  getSkillBySlug,
  getPublishedSkillSlugs,
  getRelatedSkills,
} from '@/lib/queries/skills'
import { getRelatedTools } from '@/lib/queries/tools'
import { getRelatedModels } from '@/lib/queries/models'
import { cn } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedSkillSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug)
  if (!skill) return {}
  return {
    title: `How to ${skill.title} with AI — Step-by-Step Guide | Avelix`,
    description: skill.short_description,
    openGraph: {
      title: skill.title,
      description: skill.short_description,
      type: 'article',
    },
  }
}

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'BEGINNER',     cls: 'text-electric-teal border-electric-teal/50' },
  intermediate: { label: 'INTERMEDIATE', cls: 'text-signal-orange border-signal-orange/50' },
  advanced:     { label: 'ADVANCED',     cls: 'text-primary border-primary/50' },
} as const

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

function DividerLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-px flex-1 bg-terminal-border" />
      <span className="font-mono text-label-caps text-on-surface-variant uppercase">{children}</span>
      <div className="h-px flex-1 bg-terminal-border" />
    </div>
  )
}

export default async function SkillPage({ params }: Props) {
  const skill = await getSkillBySlug(params.slug)
  if (!skill) notFound()

  const diff = DIFFICULTY_CONFIG[skill.difficulty]

  const [relatedTools, requiredTools, relatedModels, relatedSkills] = await Promise.all([
    getRelatedTools(skill.related_tool_slugs),
    getRelatedTools(skill.required_tool_slugs),
    getRelatedModels(skill.related_model_slugs),
    getRelatedSkills(skill.related_skill_slugs),
  ])

  const steps = Array.isArray(skill.learning_steps) ? skill.learning_steps : []

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/skills" className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors">
                [SKILL_MATRIX]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{skill.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn('font-mono text-[10px] border px-2 py-0.5 uppercase', diff.cls)}>
                {diff.label}
              </span>
              {skill.estimated_hours && (
                <span className="font-mono text-[10px] text-data-dim border border-terminal-border px-2 py-0.5 uppercase">
                  ~{skill.estimated_hours}H
                </span>
              )}
              {steps.length > 0 && (
                <span className="font-mono text-[10px] text-data-dim border border-terminal-border px-2 py-0.5 uppercase">
                  {steps.length} STEPS
                </span>
              )}
            </div>

            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
              {skill.title}
            </h1>

            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-6">
              {skill.short_description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#learning-path"
                className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden inline-block"
              >
                <span className="relative z-10">Start Learning →</span>
                <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                  Start Learning →
                </span>
              </a>
              <Link
                href="/services"
                className="border border-terminal-border text-on-surface font-mono text-[11px] py-3 px-6 uppercase hover:border-primary transition-all"
              >
                Get Expert Help
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">

          {/* What Is This Skill */}
          {(skill.long_description || skill.who_should_learn || skill.why_it_matters) && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[OVERVIEW]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                What Is This Skill?
              </h2>
              {skill.long_description && (
                <p className="font-body text-body-lg text-on-surface-variant mb-6">{skill.long_description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {skill.who_should_learn && (
                  <div className="bg-electromagnetic-ink p-5">
                    <p className="font-mono text-[9px] text-primary uppercase mb-2">WHO_SHOULD_LEARN</p>
                    <p className="font-body text-body-sm text-on-surface-variant">{skill.who_should_learn}</p>
                  </div>
                )}
                {skill.why_it_matters && (
                  <div className="bg-surface-container-lowest p-5">
                    <p className="font-mono text-[9px] text-primary uppercase mb-2">WHY_IT_MATTERS</p>
                    <p className="font-body text-body-sm text-on-surface-variant">{skill.why_it_matters}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Tools You'll Need */}
          {requiredTools.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[REQUIRED_TOOLS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Tools You'll Need
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border mb-6">
                {requiredTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} variant="compact" />
                ))}
              </div>
              {relatedTools.length > 0 && (
                <>
                  <p className="font-mono text-[9px] text-data-dim uppercase mb-3">ALSO_COMPATIBLE_WITH</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                    {relatedTools.slice(0, 3).map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} variant="compact" />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* Learning Path */}
          {steps.length > 0 && (
            <section id="learning-path" className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[LEARNING_PATH]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Step-by-Step Guide
              </h2>
              <div className="flex flex-col gap-px">
                {steps.map((step) => (
                  <LearningStep key={step.step} step={step} total={steps.length} />
                ))}
              </div>
            </section>
          )}

          {/* Practical Examples */}
          {skill.practical_examples.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[PRACTICAL_EXAMPLES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Real-World Examples
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {skill.practical_examples.map((example, i) => (
                  <div key={i} className="bg-electromagnetic-ink p-5 flex items-start gap-3">
                    <span className="font-mono text-[9px] text-primary flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant">{example}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Common Mistakes */}
          {skill.common_mistakes.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[COMMON_MISTAKES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Common Mistakes to Avoid
              </h2>
              <div className="flex flex-col gap-2">
                {skill.common_mistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-3 border-l-2 border-signal-orange/50 pl-4 py-2">
                    <span className="material-symbols-outlined text-signal-orange text-base flex-shrink-0 mt-0.5">
                      warning
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant">{mistake}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Models */}
          {relatedModels.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <DividerLabel>RECOMMENDED_MODELS</DividerLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {relatedModels.slice(0, 4).map((model) => (
                  <ModelCard key={model.slug} model={model} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Related Skills */}
          {relatedSkills.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <DividerLabel>RELATED_SKILLS</DividerLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {relatedSkills.map((s) => (
                  <SkillCard key={s.slug} skill={s} variant="compact" />
                ))}
              </div>
            </section>
          )}

        </div>

        <CTABlock
          title={`Need help applying ${skill.title}?`}
          description="We implement AI systems for businesses. Book a free discovery call to discuss your use case."
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
