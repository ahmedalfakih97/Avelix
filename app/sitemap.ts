import type { MetadataRoute } from 'next'
import {
  getSitemapTools,
  getSitemapModels,
  getSitemapSkills,
  getSitemapGlossaryTerms,
} from '@/lib/queries/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, models, skills, glossaryTerms] = await Promise.all([
    getSitemapTools(),
    getSitemapModels(),
    getSitemapSkills(),
    getSitemapGlossaryTerms(),
  ])

  const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `https://avelix.ai/tools/${t.slug}`,
    lastModified: t.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const modelUrls: MetadataRoute.Sitemap = models.map((m) => ({
    url: `https://avelix.ai/models/${m.slug}`,
    lastModified: m.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const skillUrls: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `https://avelix.ai/skills/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const glossaryUrls: MetadataRoute.Sitemap = glossaryTerms.map((g) => ({
    url: `https://avelix.ai/glossary/${g.slug}`,
    lastModified: g.updated_at,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: 'https://avelix.ai', changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://avelix.ai/tools', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://avelix.ai/models', changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://avelix.ai/skills', changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://avelix.ai/glossary', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://avelix.ai/services', changeFrequency: 'monthly', priority: 0.7 },
    ...toolUrls,
    ...modelUrls,
    ...skillUrls,
    ...glossaryUrls,
  ]
}
