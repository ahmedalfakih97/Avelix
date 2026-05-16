import { NextRequest } from 'next/server'

export interface SearchResultItem {
  objectID: string
  slug: string
  title: string
  description: string
  badge?: string
  type: 'tool' | 'model' | 'skill' | 'term'
  href: string
}

export interface SearchResults {
  tools: SearchResultItem[]
  models: SearchResultItem[]
  skills: SearchResultItem[]
  terms: SearchResultItem[]
  query: string
}

const HITS_PER_TYPE = 4

export async function GET(req: NextRequest): Promise<Response> {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''

  if (!q || q.length < 1) {
    return Response.json({ tools: [], models: [], skills: [], terms: [], query: '' })
  }

  const appId  = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

  if (appId && apiKey) {
    try {
      return Response.json(await searchAlgolia(q, appId, apiKey))
    } catch {
      // fall through to mock
    }
  }

  return Response.json(await searchMock(q))
}

async function searchAlgolia(q: string, appId: string, apiKey: string): Promise<SearchResults> {
  const { algoliasearch } = await import('algoliasearch')
  const client = algoliasearch(appId, apiKey)

  const { results } = await client.search({
    requests: [
      { indexName: 'tools',  query: q, hitsPerPage: HITS_PER_TYPE },
      { indexName: 'models', query: q, hitsPerPage: HITS_PER_TYPE },
      { indexName: 'skills', query: q, hitsPerPage: HITS_PER_TYPE },
    ],
  })

  const [toolHits, modelHits, skillHits] = results as Array<{ hits: Record<string, unknown>[] }>

  return {
    query: q,
    tools: (toolHits.hits ?? []).map((h) => ({
      objectID:    String(h.objectID ?? h.id ?? ''),
      slug:        String(h.slug ?? ''),
      title:       String(h.title ?? ''),
      description: String(h.short_description ?? ''),
      badge:       String(h.category_name ?? h.category ?? 'Tool'),
      type:        'tool',
      href:        `/tools/${h.slug}`,
    })),
    models: (modelHits.hits ?? []).map((h) => ({
      objectID:    String(h.objectID ?? h.id ?? ''),
      slug:        String(h.slug ?? ''),
      title:       String(h.title ?? ''),
      description: String(h.short_description ?? ''),
      badge:       String(h.provider ?? 'Model'),
      type:        'model',
      href:        `/models/${h.slug}`,
    })),
    skills: (skillHits.hits ?? []).map((h) => ({
      objectID:    String(h.objectID ?? h.id ?? ''),
      slug:        String(h.slug ?? ''),
      title:       String(h.title ?? ''),
      description: String(h.short_description ?? ''),
      badge:       String(h.difficulty ?? 'Skill'),
      type:        'skill',
      href:        `/skills/${h.slug}`,
    })),
    terms: [],
  }
}

async function searchMock(q: string): Promise<SearchResults> {
  const { MOCK_TOOLS }     = await import('@/lib/mock-tools')
  const { MOCK_MODELS }    = await import('@/lib/mock-models')
  const { MOCK_SKILLS }    = await import('@/lib/mock-skills')
  const { MOCK_GLOSSARY }  = await import('@/lib/mock-glossary')

  const lower = q.toLowerCase()
  const match = (s: string) => s.toLowerCase().includes(lower)

  return {
    query: q,
    tools: MOCK_TOOLS.filter(
      (t) => match(t.title) || match(t.short_description)
    ).slice(0, HITS_PER_TYPE).map((t) => ({
      objectID: t.id, slug: t.slug, title: t.title,
      description: t.short_description,
      badge: t.category_name ?? 'Tool',
      type: 'tool', href: `/tools/${t.slug}`,
    })),
    models: MOCK_MODELS.filter(
      (m) => match(m.title) || match(m.provider) || match(m.short_description)
    ).slice(0, HITS_PER_TYPE).map((m) => ({
      objectID: m.id, slug: m.slug, title: m.title,
      description: m.short_description,
      badge: m.provider,
      type: 'model', href: `/models/${m.slug}`,
    })),
    skills: MOCK_SKILLS.filter(
      (s) => match(s.title) || match(s.short_description)
    ).slice(0, HITS_PER_TYPE).map((s) => ({
      objectID: s.id, slug: s.slug, title: s.title,
      description: s.short_description,
      badge: s.difficulty,
      type: 'skill', href: `/skills/${s.slug}`,
    })),
    terms: MOCK_GLOSSARY.filter(
      (t) => match(t.title) || match(t.simple_definition)
    ).slice(0, HITS_PER_TYPE).map((t) => ({
      objectID: t.id, slug: t.slug, title: t.title,
      description: t.simple_definition,
      badge: 'Term',
      type: 'term', href: `/glossary/${t.slug}`,
    })),
  }
}
