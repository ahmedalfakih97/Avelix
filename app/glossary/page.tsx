import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GlossaryIndexClient from '@/components/pages/GlossaryIndexClient'
import { getAllGlossaryTerms } from '@/lib/queries/glossary'

export const metadata: Metadata = {
  title: 'AI Glossary — Every AI Term Explained Simply',
  description: 'Clear, beginner-friendly definitions for every AI term you will encounter. LLM, RAG, MCP, embeddings, agents, and more — explained without jargon.',
  alternates: { canonical: '/glossary' },
  openGraph: {
    title: 'AI Glossary | Avelix',
    description: 'Clear definitions for LLM, RAG, MCP, embeddings, agents, and 30+ more AI terms.',
    type: 'website',
  },
}

export default async function GlossaryPage() {
  const terms = await getAllGlossaryTerms()

  return (
    <>
      <Header />
      <main className="pt-16 bg-electromagnetic-ink min-h-screen">

        {/* Hero */}
        <section className="border-b border-terminal-border px-4 py-12 bg-surface-container-lowest">
          <span className="font-mono text-label-caps text-primary uppercase block mb-2">
            [GLOSSARY_V01]
          </span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none mb-4">
            AI Terms, Decoded.
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant max-w-lg mb-4">
            {terms.length} AI terms explained in plain language. No jargon, no fluff — just clear definitions with real examples.
          </p>
          <div className="flex flex-wrap gap-2">
            {['LLM', 'RAG', 'MCP', 'Agent', 'Token', 'Embeddings'].map((tag) => (
              <span key={tag} className="font-mono text-[9px] border border-terminal-border text-data-dim px-2 py-1 uppercase">
                {tag}
              </span>
            ))}
            <span className="font-mono text-[9px] text-data-dim px-2 py-1">+ {Math.max(0, terms.length - 6)} more</span>
          </div>
        </section>

        <GlossaryIndexClient terms={terms} />

      </main>
      <Footer />
    </>
  )
}
