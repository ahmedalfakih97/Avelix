import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CTABlock from '@/components/shared/CTABlock'
import CompletionChecklist from '@/components/pages/CompletionChecklist'
import ToolCard from '@/components/library/ToolCard'
import ModelCard from '@/components/library/ModelCard'
import SkillCard from '@/components/library/SkillCard'
import {
  getLearningPathBySlug,
  getPublishedPathSlugs,
} from '@/lib/queries/learning-paths'
import { getRelatedTools } from '@/lib/queries/tools'
import { getRelatedModels } from '@/lib/queries/models'
import { getRelatedSkills } from '@/lib/queries/skills'
import { cn } from '@/lib/utils'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getPublishedPathSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = await getLearningPathBySlug(params.slug)
  if (!path) return {}
  return {
    title: `AI Learning Path for ${path.who_its_for ?? 'You'} — ${path.title} | Avelix`,
    description: path.short_description,
    openGraph: {
      title: path.title,
      description: path.short_description,
      type: 'article',
    },
  }
}

const LEVEL_CONFIG = {
  beginner:     { label: 'BEGINNER',     cls: 'text-electric-teal border-electric-teal/50' },
  intermediate: { label: 'INTERMEDIATE', cls: 'text-signal-orange border-signal-orange/50' },
  advanced:     { label: 'ADVANCED',     cls: 'text-primary border-primary/50' },
} as const

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

export default async function GuidePage({ params }: Props) {
  const path = await getLearningPathBySlug(params.slug)
  if (!path) notFound()

  const level = LEVEL_CONFIG[path.required_skill_level]
  const modules = Array.isArray(path.modules) ? path.modules : []

  const [relatedTools, relatedModels, relatedSkills] = await Promise.all([
    getRelatedTools(path.related_tool_slugs),
    getRelatedModels(path.related_model_slugs),
    getRelatedSkills(path.related_skill_slugs),
  ])

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/guides" className="font-mono text-[10px] text-data-dim uppercase hover:text-primary transition-colors">
                [LEARNING_PATHS]
              </Link>
              <span className="text-data-dim">/</span>
              <span className="font-mono text-[10px] text-primary uppercase">{path.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn('font-mono text-[10px] border px-2 py-0.5 uppercase', level.cls)}>
                {level.label}
              </span>
              {path.estimated_hours && (
                <span className="font-mono text-[10px] text-data-dim border border-terminal-border px-2 py-0.5 uppercase">
                  ~{path.estimated_hours}H TOTAL
                </span>
              )}
              {modules.length > 0 && (
                <span className="font-mono text-[10px] text-data-dim border border-terminal-border px-2 py-0.5 uppercase">
                  {modules.length} MODULES
                </span>
              )}
            </div>

            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
              {path.title}
            </h1>

            {path.who_its_for && (
              <p className="font-mono text-[10px] text-primary uppercase mb-2">
                FOR: {path.who_its_for}
              </p>
            )}

            <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mb-6">
              {path.short_description}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#modules"
                className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden inline-block"
              >
                <span className="relative z-10">Start Path →</span>
                <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                  Start Path →
                </span>
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">

          {/* What You'll Achieve */}
          {(path.goal || path.mini_projects.length > 0) && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[OUTCOMES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                What You&apos;ll Achieve
              </h2>
              {path.goal && (
                <p className="font-body text-body-lg text-on-surface-variant mb-6">{path.goal}</p>
              )}
              {path.mini_projects.length > 0 && (
                <>
                  <p className="font-mono text-[9px] text-data-dim uppercase mb-3">MINI_PROJECTS</p>
                  <div className="flex flex-col gap-2">
                    {path.mini_projects.map((project, i) => (
                      <div key={i} className="flex items-start gap-3 border-l-2 border-primary pl-4 py-2">
                        <span className="font-mono text-[9px] text-primary flex-shrink-0 w-6">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-body text-body-sm text-on-surface-variant">{project}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* Modules */}
          {modules.length > 0 && (
            <section id="modules" className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[MODULES]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Course Modules
              </h2>
              <div className="flex flex-col gap-px">
                {modules.map((mod) => (
                  <div
                    key={mod.module}
                    className="border border-terminal-border bg-electromagnetic-ink hover:border-l-2 hover:border-l-primary transition-all"
                  >
                    <div className="flex items-start gap-4 p-5">
                      <div className="flex-shrink-0 w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center">
                        <span className="font-mono text-[11px] text-primary">
                          {String(mod.module).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-headline text-on-surface uppercase text-[13px] font-bold">
                            {mod.title}
                          </h3>
                          {mod.duration_hours && (
                            <span className="font-mono text-[9px] text-data-dim uppercase flex-shrink-0">
                              ~{mod.duration_hours}H
                            </span>
                          )}
                        </div>
                        <p className="font-body text-body-sm text-on-surface-variant mb-3">{mod.description}</p>
                        {(mod.tools.length > 0 || mod.skills.length > 0) && (
                          <div className="flex flex-wrap gap-1.5">
                            {mod.tools.map((t) => (
                              <span key={t} className="font-mono text-[8px] border border-electric-teal/30 text-electric-teal/80 px-1.5 py-0.5 uppercase">
                                {t}
                              </span>
                            ))}
                            {mod.skills.map((s) => (
                              <span key={s} className="font-mono text-[8px] border border-terminal-border text-data-dim px-1.5 py-0.5 uppercase">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Practice Tasks */}
          {path.practice_tasks.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[PRACTICE_TASKS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Hands-On Exercises
              </h2>
              <div className="flex flex-col gap-2">
                {path.practice_tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border border-terminal-border bg-electromagnetic-ink hover:border-primary/30 transition-all">
                    <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">
                      task_alt
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant">{task}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommended Tools */}
          {relatedTools.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[RECOMMENDED_TOOLS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Tools Used in This Path
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {relatedTools.slice(0, 6).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Recommended Models */}
          {relatedModels.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[RECOMMENDED_MODELS]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                AI Models You&apos;ll Use
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                {relatedModels.slice(0, 4).map((model) => (
                  <ModelCard key={model.slug} model={model} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Skills in this path */}
          {relatedSkills.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
              <SectionLabel>[SKILLS_IN_THIS_PATH]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Skills You&apos;ll Develop
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                {relatedSkills.map((s) => (
                  <SkillCard key={s.slug} skill={s} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {/* Completion Checklist */}
          {path.completion_checklist.length > 0 && (
            <section className="px-4 py-12 border-b border-terminal-border">
              <SectionLabel>[COMPLETION_CHECKLIST]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase mb-6">
                Track Your Progress
              </h2>
              <CompletionChecklist
                items={path.completion_checklist}
                pathSlug={path.slug}
              />
            </section>
          )}

        </div>

        <CTABlock
          title="Need help implementing this?"
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
