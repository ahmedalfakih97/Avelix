import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LearningPathCard from '@/components/library/LearningPathCard'
import { getLearningPaths } from '@/lib/queries/learning-paths'

export const metadata: Metadata = {
  title: 'AI Learning Paths — Start Here | Avelix',
  description: 'Structured AI learning paths for beginners, business owners, creators, and developers. Choose your goal and follow a proven path.',
}

const AUDIENCE_PATHS = [
  {
    label: "I'm a complete beginner",
    icon: 'start',
    slug: 'start-learning-ai-from-zero',
    description: 'No experience needed. Go from zero to confident AI user.',
  },
  {
    label: "I'm a business owner",
    icon: 'business',
    slug: 'ai-for-business',
    description: 'Save hours every week with AI for content, support, and ops.',
  },
  {
    label: "I'm a content creator",
    icon: 'movie_creation',
    slug: 'ai-for-creators',
    description: 'Create more content faster without losing your voice.',
  },
  {
    label: "I want to automate with n8n",
    icon: 'account_tree',
    slug: 'ai-automation-n8n',
    description: 'Build AI-powered workflows that run on autopilot.',
  },
  {
    label: "I want to build AI agents",
    icon: 'smart_toy',
    slug: 'build-first-ai-agent',
    description: 'Build autonomous agents that take actions and complete tasks.',
  },
]

export default async function GuidesPage() {
  const { paths } = await getLearningPaths()

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <span className="font-mono text-label-caps text-primary uppercase block mb-2">[LEARNING_PATHS]</span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
            Where Do You Want to Go?
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant max-w-lg">
            Choose your goal. Each path is a structured sequence of skills, tools, and hands-on projects — designed to get you results, not just knowledge.
          </p>
        </section>

        {/* Audience first nav */}
        <section className="border-b border-terminal-border px-4 py-8 bg-electromagnetic-ink">
          <span className="font-mono text-label-caps text-data-dim uppercase block mb-6">SELECT_YOUR_PATH</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
            {AUDIENCE_PATHS.map((audience) => (
              <Link
                key={audience.slug}
                href={`/guides/${audience.slug}`}
                className="flex items-center gap-4 p-5 bg-electromagnetic-ink hover:bg-surface-container-low hover:border-l-2 hover:border-l-primary transition-all group"
              >
                <div className="w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{audience.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline text-on-surface uppercase text-[13px] font-bold mb-0.5 group-hover:text-primary transition-colors">
                    {audience.label}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-variant line-clamp-1">
                    {audience.description}
                  </p>
                </div>
                <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-base transition-colors flex-shrink-0">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* All learning paths */}
        <section className="px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-terminal-border" />
            <span className="font-mono text-label-caps text-on-surface-variant uppercase">ALL_PATHS</span>
            <div className="h-px flex-1 bg-terminal-border" />
          </div>

          {paths.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-data-dim text-4xl mb-4 block">school</span>
              <p className="font-mono text-[11px] text-data-dim uppercase">No learning paths available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
              {paths.map((path) => (
                <LearningPathCard key={path.slug} path={path} />
              ))}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  )
}
