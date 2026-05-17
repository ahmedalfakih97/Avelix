import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToolCard from '@/components/library/ToolCard'
import ModelCard from '@/components/library/ModelCard'
import LearningPathCard from '@/components/library/LearningPathCard'
import { JsonLd } from '@/components/shared/JsonLd'
import { getFeaturedTools } from '@/lib/queries/tools'
import { getRecentModels } from '@/lib/queries/models'
import { getLearningPaths } from '@/lib/queries/learning-paths'
import { getAllGlossaryTerms } from '@/lib/queries/glossary'

export const metadata: Metadata = {
  title: 'Avelix — Your Practical Map for the AI World',
  description: 'Find the right AI tool, learn the right skills, and understand AI models — without getting lost. Avelix is the structured AI knowledge system for creators, professionals, and businesses.',
  openGraph: {
    title: 'Avelix — Navigate the AI Universe',
    description: 'Find the right AI tool, learn the right skills, and understand AI models — without getting lost.',
    type: 'website',
  },
  alternates: { canonical: '/' },
}

const QUICK_NAV = [
  { label: 'Write Content',       code: 'WRITE_CONTENT',    href: '/tools?search=writing' },
  { label: 'Build an AI Agent',   code: 'BUILD_AGENT',      href: '/guides/build-first-ai-agent' },
  { label: 'Automate Business',   code: 'AUTOMATE_TASKS',   href: '/tools?search=automation' },
  { label: 'Generate Images',     code: 'GEN_IMAGES',       href: '/tools?search=image+generation' },
  { label: 'Clone a Voice',       code: 'VOICE_CLONE',      href: '/tools?search=voice' },
  { label: 'Build a Chatbot',     code: 'BUILD_CHATBOT',    href: '/tools?search=chatbot' },
  { label: 'Research Faster',     code: 'RESEARCH_AI',      href: '/tools?search=research' },
  { label: 'Create Videos',       code: 'CREATE_VIDEO',     href: '/tools?search=video' },
  { label: 'Learn Prompting',     code: 'LEARN_PROMPTS',    href: '/skills/prompt-engineering' },
]

const FEATURES = [
  {
    icon: 'dataset',
    title: 'Find the Right Tool',
    description: 'Browse 200+ AI tools, filtered by category, pricing, and use case. No paid placements — just honest, curated reviews.',
    href: '/tools',
    cta: 'Browse Tools',
  },
  {
    icon: 'school',
    title: 'Learn AI Skills',
    description: 'Structured learning paths from complete beginner to advanced practitioner. Follow step-by-step guides with real examples.',
    href: '/skills',
    cta: 'Start Learning',
  },
  {
    icon: 'psychology',
    title: 'Understand AI Models',
    description: 'Compare GPT-4o, Claude, Gemini, Llama, and more. Understand what each model does best before you commit.',
    href: '/models',
    cta: 'Explore Models',
  },
  {
    icon: 'hub',
    title: 'Apply AI in Business',
    description: 'From workflow automation to custom AI agents — we help you move from confused to deployed, fast.',
    href: '/services',
    cta: 'See Services',
  },
]

const BLOG_TEASERS = [
  {
    label: 'GUIDE',
    title: 'The Best AI Tools for Content Creators in 2025',
    description: 'From writing to video and audio — a curated breakdown of what actually works for creators.',
    href: '/blog',
    date: 'May 2025',
  },
  {
    label: 'COMPARISON',
    title: 'GPT-4o vs Claude 3.5 Sonnet: Which One Should You Use?',
    description: 'We ran both through 10 real tasks. Here\'s what we found and when to use each.',
    href: '/blog',
    date: 'May 2025',
  },
  {
    label: 'TUTORIAL',
    title: 'How to Build Your First n8n Workflow in 30 Minutes',
    description: 'A beginner-friendly walkthrough from zero to your first automated workflow running in production.',
    href: '/blog',
    date: 'Apr 2025',
  },
]

const STATS = [
  { value: '200+', label: 'AI Tools Reviewed', icon: 'dataset' },
  { value: '50+',  label: 'AI Models Tracked',  icon: 'psychology' },
  { value: '30+',  label: 'Skills Available',    icon: 'school' },
]

function SectionLabel({ children }: { children: string }) {
  return <p className="font-mono text-label-caps text-primary uppercase mb-4">{children}</p>
}

function SeeAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 font-mono text-[10px] text-primary uppercase hover:text-electric-teal transition-colors"
    >
      {label}
      <span className="material-symbols-outlined text-sm">north_east</span>
    </Link>
  )
}

export default async function HomePage() {
  const [featuredTools, recentModels, { paths: allPaths }, glossaryTerms] = await Promise.all([
    getFeaturedTools(6),
    getRecentModels(3),
    getLearningPaths(),
    getAllGlossaryTerms(),
  ])
  const learningPaths = allPaths.slice(0, 4)

  const previewTerms = glossaryTerms.slice(0, 6)

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://avelix.ai/#organization',
        name: 'Avelix',
        url: 'https://avelix.ai',
        description: 'Practical AI learning and discovery platform — AI tools, models, skills, and glossary.',
        sameAs: ['https://twitter.com/avelix_ai'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://avelix.ai/#website',
        url: 'https://avelix.ai',
        name: 'Avelix',
        description: 'Navigate the AI Universe.',
        publisher: { '@id': 'https://avelix.ai/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: 'https://avelix.ai/search?q={search_term_string}' },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <>
      <Header />
      <JsonLd data={organizationSchema} />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* ── Section 1: Hero ── */}
        <section className="relative min-h-[580px] flex flex-col justify-center px-4 py-20 overflow-hidden grid-bg border-b border-terminal-border">
          <div className="signal-scan" />
          <div className="z-10 max-w-lg">
            <div className="inline-block border border-primary px-2 py-0.5 mb-6">
              <span className="font-mono text-label-caps text-primary uppercase">Signal_Layer_v.1.04</span>
            </div>
            <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-6">
              Your Practical Map for the{' '}
              <span className="text-electric-teal">AI World.</span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-sm">
              Find the right AI tool, learn the right skills, and understand AI models — without getting lost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools"
                className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-4 px-6 uppercase overflow-hidden text-center"
              >
                <span className="relative z-10">Find My AI Tool</span>
                <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                  Find My AI Tool
                </span>
              </Link>
              <Link
                href="/guides"
                className="bg-transparent border border-terminal-border text-on-surface font-mono text-[11px] py-4 px-6 uppercase hover:border-primary transition-all text-center"
              >
                Start Learning AI
              </Link>
            </div>
          </div>
          <div className="absolute right-[-12%] top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <span className="material-symbols-outlined text-[320px] text-primary">radar</span>
          </div>
        </section>

        {/* ── Section 2: Problem Statement ── */}
        <section className="border-b border-terminal-border bg-electromagnetic-ink px-4 py-12">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="border-l-2 border-primary pl-5 py-2">
              <span className="font-mono text-label-caps text-data-dim uppercase block mb-2">01 // SIGNAL</span>
              <h3 className="font-headline text-headline-md text-on-surface uppercase mb-2">Too Many AI Tools</h3>
              <p className="font-body text-body-sm text-on-surface-variant">New tools launch daily. We review and rank them so you don&apos;t have to wade through the noise.</p>
            </div>
            <div className="border-l-2 border-terminal-border pl-5 py-2 hover:border-primary transition-colors">
              <span className="font-mono text-label-caps text-data-dim uppercase block mb-2">02 // CLARITY</span>
              <h3 className="font-headline text-headline-md text-on-surface uppercase mb-2">Don&apos;t Know Which Model</h3>
              <p className="font-body text-body-sm text-on-surface-variant">GPT, Claude, Gemini, Llama — each excels at different tasks. We compare them clearly so you pick right.</p>
            </div>
            <div className="border-l-2 border-terminal-border pl-5 py-2 hover:border-primary transition-colors">
              <span className="font-mono text-label-caps text-data-dim uppercase block mb-2">03 // DIRECTION</span>
              <h3 className="font-headline text-headline-md text-on-surface uppercase mb-2">Not Sure Where to Start</h3>
              <p className="font-body text-body-sm text-on-surface-variant">AI moves fast. We give you structured paths — from first tool to advanced automation — step by step.</p>
            </div>
          </div>
        </section>

        {/* ── Section 3: What Avelix Helps You Do ── */}
        <section className="border-b border-terminal-border bg-surface-container-lowest py-16">
          <div className="px-4 mb-8">
            <SectionLabel>[CORE_SYSTEM_FEATURES]</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase">What Avelix Helps You Do</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Link
                key={f.href}
                href={f.href}
                className={`border-b border-terminal-border p-6 hover:border-l-2 hover:border-primary transition-all group ${
                  i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-primary mb-4 block text-2xl">{f.icon}</span>
                <h4 className="font-headline text-on-surface uppercase text-[14px] font-bold mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h4>
                <p className="font-body text-body-sm text-on-surface-variant mb-4">{f.description}</p>
                <span className="font-mono text-[10px] text-primary uppercase inline-flex items-center gap-1">
                  {f.cta}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 4: Featured Tools ── */}
        {featuredTools.length > 0 && (
          <section className="px-4 py-16 border-b border-terminal-border bg-electromagnetic-ink">
            <div className="flex items-end justify-between mb-8">
              <div>
                <SectionLabel>[TOOL_DIRECTORY]</SectionLabel>
                <h2 className="font-headline text-headline-md text-on-surface uppercase">Top AI Tools This Month</h2>
              </div>
              <SeeAllLink href="/tools" label="Browse all tools" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} variant="default" />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 5: Learning Paths ── */}
        {learningPaths.length > 0 && (
          <section className="px-4 py-16 border-b border-terminal-border bg-surface-container-lowest">
            <div className="flex items-end justify-between mb-8">
              <div>
                <SectionLabel>[LEARNING_PATHS]</SectionLabel>
                <h2 className="font-headline text-headline-md text-on-surface uppercase">Where Do You Want to Start?</h2>
              </div>
              <SeeAllLink href="/guides" label="See all paths" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-terminal-border border border-terminal-border">
              {learningPaths.map((path) => (
                <LearningPathCard key={path.slug} path={path} />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 6: Recent Models ── */}
        {recentModels.length > 0 && (
          <section className="px-4 py-16 border-b border-terminal-border bg-electromagnetic-ink">
            <div className="flex items-end justify-between mb-8">
              <div>
                <SectionLabel>[MODEL_INDEX]</SectionLabel>
                <h2 className="font-headline text-headline-md text-on-surface uppercase">AI Model Updates</h2>
              </div>
              <SeeAllLink href="/models" label="Explore all models" />
            </div>
            <div className="flex flex-col gap-px bg-terminal-border border border-terminal-border">
              {recentModels.map((model) => (
                <ModelCard key={model.slug} model={model} variant="compact" />
              ))}
            </div>
          </section>
        )}

        {/* ── Section 7: "I want to..." Quick Nav ── */}
        <section className="py-12 bg-surface-container border-b border-terminal-border overflow-hidden">
          <div className="px-4 mb-6">
            <SectionLabel>Target_Action_Selector</SectionLabel>
            <h2 className="font-headline text-headline-md text-on-surface uppercase">I Want To...</h2>
          </div>
          <div className="flex overflow-x-auto gap-3 px-4 pb-4 custom-scrollbar">
            {QUICK_NAV.map((item, i) => (
              <Link
                key={item.code}
                href={item.href}
                className={`whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase transition-all flex-shrink-0 ${
                  i === 0
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-terminal-border text-on-surface hover:border-primary hover:text-primary'
                }`}
              >
                {item.code}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 px-4 mt-4">
            {QUICK_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-body text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 8: From the Blog ── */}
        <section className="px-4 py-16 border-b border-terminal-border bg-surface-container-lowest">
          <div className="flex items-end justify-between mb-8">
            <div>
              <SectionLabel>[SIGNAL_FEED]</SectionLabel>
              <h2 className="font-headline text-headline-md text-on-surface uppercase">From the Avelix Blog</h2>
            </div>
            <SeeAllLink href="/blog" label="Read all articles" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
            {BLOG_TEASERS.map((article, i) => (
              <Link
                key={i}
                href={article.href}
                className="flex flex-col p-5 bg-surface-container-lowest hover:bg-surface-container-low transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[8px] text-primary border border-primary/30 px-1.5 py-0.5 uppercase">
                    {article.label}
                  </span>
                  <span className="font-mono text-[9px] text-data-dim uppercase">{article.date}</span>
                </div>
                <h3 className="font-headline text-on-surface uppercase text-[13px] font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant flex-1 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-terminal-border">
                  <span className="font-mono text-[9px] text-primary uppercase">Read article</span>
                  <span className="material-symbols-outlined text-primary text-sm">north_east</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 9: Glossary Teasers ── */}
        {previewTerms.length > 0 && (
          <section className="py-16 px-4 border-b border-terminal-border bg-electromagnetic-ink">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-terminal-border" />
              <span className="font-mono text-label-caps text-on-surface-variant uppercase">Glossary_V01</span>
              <div className="h-px flex-1 bg-terminal-border" />
            </div>
            <div className="flex items-end justify-between mb-4">
              <h2 className="font-headline text-headline-md text-on-surface uppercase">AI Terms, Decoded</h2>
              <SeeAllLink href="/glossary" label="Full glossary" />
            </div>
            <div className="grid grid-cols-1 gap-px bg-terminal-border border border-terminal-border">
              {previewTerms.map((term) => (
                <Link
                  key={term.slug}
                  href={`/glossary/${term.slug}`}
                  className="bg-surface-container-lowest p-4 flex justify-between items-center hover:bg-surface-container-low transition-colors group"
                >
                  <div className="flex-1 pr-4">
                    <span className="font-mono text-on-surface uppercase text-[11px] block mb-0.5 group-hover:text-primary transition-colors">
                      {term.title}
                    </span>
                    <span className="font-body text-body-sm text-on-surface-variant line-clamp-1">
                      {term.simple_definition}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-data-dim group-hover:text-primary text-sm flex-shrink-0 transition-colors">
                    north_east
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 10: Services CTA ── */}
        <section className="px-4 py-20 bg-electromagnetic-ink text-center border-b border-terminal-border">
          <SectionLabel>[INITIATE_PROTOCOL]</SectionLabel>
          <h2 className="font-headline text-headline-md text-on-surface uppercase mb-4">
            Skip the Learning Curve.{' '}
            <span className="text-electric-teal">We&apos;ll Build It for You.</span>
          </h2>
          <p className="font-body text-body-sm text-on-surface-variant mb-10 max-w-sm mx-auto">
            From AI workflow automation to custom AI agents — we design, build, and deploy AI solutions for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-4 px-6 uppercase overflow-hidden"
            >
              <span className="relative z-10">See Our Services</span>
              <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
                See Our Services
              </span>
            </Link>
            <Link
              href="/services#contact"
              className="bg-transparent border border-terminal-border text-on-surface font-mono text-[11px] py-4 px-6 uppercase hover:border-primary transition-all"
            >
              Book a Free Call
            </Link>
          </div>
        </section>

        {/* ── Section 11: Trust Signals ── */}
        <section className="px-4 py-12 border-b border-terminal-border bg-surface-container-lowest">
          <div className="grid grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest text-center">
                <span className="material-symbols-outlined text-primary text-2xl mb-2">{stat.icon}</span>
                <span className="font-headline text-display-lg text-on-surface uppercase leading-none block">{stat.value}</span>
                <span className="font-mono text-[9px] text-data-dim uppercase mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] text-data-dim text-center mt-4 uppercase">
            Updated daily · Verified by the Avelix team
          </p>
        </section>

      </main>
      <Footer />
    </>
  )
}
