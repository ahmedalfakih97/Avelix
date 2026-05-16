import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToolCard from '@/components/library/ToolCard'
import ModelCard from '@/components/library/ModelCard'
import SkillCard from '@/components/library/SkillCard'
import GlossaryTermCard from '@/components/library/GlossaryTermCard'
import { getTools } from '@/lib/queries/tools'
import { getModels } from '@/lib/queries/models'
import { getSkills } from '@/lib/queries/skills'
import { getAllGlossaryTerms } from '@/lib/queries/glossary'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string }
}): Promise<Metadata> {
  const q = searchParams.q ?? ''
  return {
    title: q ? `Search: "${q}" — Avelix` : 'Search — Avelix',
    description: `Search results for "${q}" across AI tools, models, skills, and glossary terms.`,
    robots: { index: false },
  }
}

const TABS = ['all', 'tools', 'models', 'skills', 'glossary'] as const
type Tab = (typeof TABS)[number]

const TAB_LABELS: Record<Tab, string> = {
  all:      'All',
  tools:    'Tools',
  models:   'Models',
  skills:   'Skills',
  glossary: 'Glossary',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string }
}) {
  const q   = (searchParams.q ?? '').trim()
  const tab = (TABS.includes(searchParams.tab as Tab) ? searchParams.tab : 'all') as Tab

  const show = (t: Tab) => tab === 'all' || tab === t

  const [
    { tools, total: toolTotal },
    { models, total: modelTotal },
    { skills, total: skillTotal },
    terms,
  ] = await Promise.all([
    show('tools')    ? getTools({ search: q, sort: 'relevant', page: 1 }) : Promise.resolve({ tools: [], total: 0 }),
    show('models')   ? getModels({ search: q, sort: 'popular',  page: 1 }) : Promise.resolve({ models: [], total: 0 }),
    show('skills')   ? getSkills({ search: q, sort: 'popular',  page: 1 }) : Promise.resolve({ skills: [], total: 0 }),
    show('glossary') ? getAllGlossaryTerms({ search: q }) : Promise.resolve([]),
  ])

  const totalResults = toolTotal + modelTotal + skillTotal + terms.length
  const hasResults   = totalResults > 0

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border bg-surface-container-lowest px-4 py-8">
          <span className="font-mono text-label-caps text-primary uppercase block mb-2">[SEARCH_RESULTS]</span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-2">
            {q ? (
              <>
                Results for{' '}
                <span className="text-electric-teal">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              'Search'
            )}
          </h1>
          {q && (
            <p className="font-mono text-[10px] text-data-dim uppercase">
              {totalResults} result{totalResults !== 1 ? 's' : ''} across all categories
            </p>
          )}
        </section>

        {/* Tabs */}
        <div className="border-b border-terminal-border bg-surface-container-lowest px-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-0 min-w-max">
            {TABS.map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(q)}&tab=${t}`}
                className={`font-mono text-[10px] uppercase px-4 py-3 border-b-2 transition-colors ${
                  tab === t
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {TAB_LABELS[t]}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-4 py-8">
          {!q && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-data-dim text-4xl block mb-4">manage_search</span>
              <p className="font-mono text-[11px] text-data-dim uppercase">Enter a search term to find AI tools, models, skills &amp; glossary terms</p>
              <Link href="/tools" className="mt-4 inline-block font-mono text-[10px] text-primary uppercase hover:underline">
                Browse all tools →
              </Link>
            </div>
          )}

          {q && !hasResults && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-data-dim text-4xl block mb-4">search_off</span>
              <p className="font-mono text-[11px] text-data-dim uppercase mb-2">No results for &ldquo;{q}&rdquo;</p>
              <p className="font-body text-body-sm text-on-surface-variant mb-6">Try different keywords or browse by category.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/tools" className="font-mono text-[10px] text-primary uppercase border border-primary/30 px-3 py-1.5 hover:bg-primary/5 transition-colors">Browse Tools</Link>
                <Link href="/models" className="font-mono text-[10px] text-primary uppercase border border-primary/30 px-3 py-1.5 hover:bg-primary/5 transition-colors">Browse Models</Link>
                <Link href="/skills" className="font-mono text-[10px] text-primary uppercase border border-primary/30 px-3 py-1.5 hover:bg-primary/5 transition-colors">Browse Skills</Link>
              </div>
            </div>
          )}

          {q && hasResults && (
            <div className="flex flex-col gap-12">

              {/* Tools */}
              {show('tools') && tools.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] text-primary uppercase">// Tools ({toolTotal})</span>
                    <Link href={`/tools?search=${encodeURIComponent(q)}`} className="font-mono text-[9px] text-data-dim uppercase hover:text-primary transition-colors">
                      See all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                    {tools.slice(0, 6).map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              {/* Models */}
              {show('models') && models.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] text-primary uppercase">// Models ({modelTotal})</span>
                    <Link href={`/models?search=${encodeURIComponent(q)}`} className="font-mono text-[9px] text-data-dim uppercase hover:text-primary transition-colors">
                      See all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
                    {models.slice(0, 6).map((model) => (
                      <ModelCard key={model.slug} model={model} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {show('skills') && skills.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] text-primary uppercase">// Skills ({skillTotal})</span>
                    <Link href={`/skills?search=${encodeURIComponent(q)}`} className="font-mono text-[9px] text-data-dim uppercase hover:text-primary transition-colors">
                      See all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
                    {skills.slice(0, 4).map((skill) => (
                      <SkillCard key={skill.slug} skill={skill} variant="default" />
                    ))}
                  </div>
                </section>
              )}

              {/* Glossary */}
              {show('glossary') && terms.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] text-primary uppercase">// Glossary ({terms.length})</span>
                    <Link href="/glossary" className="font-mono text-[9px] text-data-dim uppercase hover:text-primary transition-colors">
                      Browse glossary →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-px bg-terminal-border border border-terminal-border">
                    {terms.slice(0, 6).map((term) => (
                      <GlossaryTermCard key={term.slug} term={term} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </>
  )
}
