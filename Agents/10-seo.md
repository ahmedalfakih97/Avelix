# Agent 10 — SEO & Structured Data

## Goal
Implement complete SEO infrastructure across all Avelix pages: metadata, structured data, sitemaps, robots.txt, Open Graph images, and canonical URLs. Avelix lives and dies by organic search — SEO is not optional.

## Prerequisites
- Agents 03–07 complete (all page types built)
- Vercel deployment configured

---

## Part 1: Base SEO Config

### `app/layout.tsx` — Root Metadata
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://avelix.ai'),
  title: {
    default: 'Avelix — Navigate the AI Universe',
    template: '%s | Avelix'
  },
  description: 'Find the right AI tool, learn AI skills, compare AI models, and apply AI in your business. The practical AI learning and discovery platform.',
  keywords: ['AI tools', 'AI models', 'AI skills', 'artificial intelligence', 'AI learning'],
  openGraph: {
    type: 'website',
    siteName: 'Avelix',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@avelix_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};
```

---

## Part 2: Page-Level Metadata

### Tool Pages
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const tool = await getToolBySlug(params.slug);
  return {
    title: `${tool.title} — ${tool.best_for[0]} AI Tool Review`,
    description: `${tool.short_description} Pricing, features, pros & cons, and alternatives.`,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: tool.title,
      description: tool.short_description,
      images: [{ url: `/api/og/tool?slug=${tool.slug}`, width: 1200, height: 630 }],
    },
    other: {
      'article:modified_time': tool.last_reviewed_at,
    }
  };
}
```

### Model Pages
```typescript
title: `${model.title} by ${model.provider} — Capabilities, Pricing & Use Cases`
description: `${model.short_description} Context window, strengths, weaknesses, and best use cases.`
```

### Skill Pages
```typescript
title: `How to ${skill.title} — Step-by-Step AI Guide`
description: `Learn ${skill.title}. ${skill.who_should_learn} Estimated time: ${skill.estimated_hours} hours.`
```

### Comparison Pages
```typescript
title: `${item1} vs ${item2} — Which is Better in ${new Date().getFullYear()}?`
description: `Honest comparison of ${item1} vs ${item2}. Side-by-side features, pricing, strengths, and our recommendation.`
```

### Glossary Pages
```typescript
title: `What is ${term.title}? — AI Glossary`
description: term.simple_definition
```

---

## Part 3: Dynamic OG Image Generation

### `app/api/og/tool/route.tsx`
Use `@vercel/og` to generate dynamic Open Graph images:

```typescript
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const tool = await getToolBySlug(slug!);
  
  return new ImageResponse(
    (
      <div style={{ 
        display: 'flex', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        width: '100%', height: '100%',
        padding: 60,
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#6366f1', fontSize: 24, fontWeight: 700 }}>Avelix</span>
          <span style={{ color: '#475569', fontSize: 20 }}>Tool Review</span>
        </div>
        <div>
          <div style={{ color: 'white', fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
            {tool.title}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 28, marginTop: 16 }}>
            {tool.short_description.slice(0, 100)}...
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {tool.best_for.slice(0, 3).map(tag => (
            <span style={{ background: '#312e81', color: '#a5b4fc', padding: '8px 16px', borderRadius: 9999, fontSize: 18 }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

Create equivalent routes for:
- `/api/og/model?slug=...`
- `/api/og/skill?slug=...`
- `/api/og/compare?slug=...`
- `/api/og/glossary?term=...`

---

## Part 4: Structured Data (JSON-LD)

### Tool Pages — SoftwareApplication schema
```typescript
const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": tool.title,
  "description": tool.short_description,
  "applicationCategory": "ArtificialIntelligenceApplication",
  "url": tool.website_url,
  "offers": tool.has_free_plan ? {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan available"
  } : undefined,
  "dateModified": tool.last_reviewed_at,
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": tool.avelix_rating,
      "bestRating": 5
    },
    "author": { "@type": "Organization", "name": "Avelix" }
  }
};
```

### Glossary Pages — FAQ schema
```typescript
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": `What is ${term.title}?`,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": term.simple_definition
    }
  }]
};
```

### Learning Path Pages — Course schema
```typescript
const schema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": path.title,
  "description": path.short_description,
  "provider": { "@type": "Organization", "name": "Avelix" },
  "timeRequired": `PT${path.estimated_hours}H`
};
```

### Comparison Pages — Article schema with breadcrumbs

Create a reusable `<JsonLd>` component:
```typescript
// components/shared/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

---

## Part 5: Sitemap

### `app/sitemap.ts`
```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = await getPublishedSlugs('tools');
  const models = await getPublishedSlugs('models');
  const skills = await getPublishedSlugs('skills');
  const glossary = await getPublishedSlugs('glossary_terms');
  
  const toolUrls = tools.map(t => ({
    url: `https://avelix.ai/tools/${t.slug}`,
    lastModified: t.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
  
  // ... similar for models, skills, glossary
  
  return [
    { url: 'https://avelix.ai', priority: 1.0, changeFrequency: 'daily' },
    { url: 'https://avelix.ai/tools', priority: 0.9, changeFrequency: 'daily' },
    { url: 'https://avelix.ai/models', priority: 0.9, changeFrequency: 'daily' },
    { url: 'https://avelix.ai/skills', priority: 0.9, changeFrequency: 'weekly' },
    { url: 'https://avelix.ai/glossary', priority: 0.8, changeFrequency: 'weekly' },
    ...toolUrls,
    ...modelUrls,
    ...skillUrls,
    ...glossaryUrls,
  ];
}
```

---

## Part 6: Robots.txt
### `app/robots.ts`
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }
    ],
    sitemap: 'https://avelix.ai/sitemap.xml'
  };
}
```

---

## Part 7: Breadcrumbs

All library pages need visible + schema breadcrumbs:
```
Avelix > Tools > AI Voice Tools > ElevenLabs
Avelix > Models > LLMs > Claude 3.5 Sonnet
Avelix > Skills > AI Automation > Build an n8n Workflow
Avelix > Glossary > R > RAG
```

Create `components/shared/Breadcrumbs.tsx` with schema.org `BreadcrumbList`.

---

## Done Criteria
- [ ] All page types have `generateMetadata()` with correct title/description
- [ ] OG images generate dynamically for tools, models, skills
- [ ] JSON-LD on all tool, glossary, guide, and comparison pages
- [ ] `sitemap.xml` includes all published items
- [ ] `robots.txt` blocks admin and API routes
- [ ] Breadcrumbs visible on all library pages
- [ ] Canonical URLs set on all pages
- [ ] Google Search Console test passes (structured data tool)
- [ ] Lighthouse SEO score = 100
