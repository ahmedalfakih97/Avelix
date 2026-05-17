import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SkillsLibraryClient from '@/components/pages/SkillsLibraryClient'
import { getSkills } from '@/lib/queries/skills'
import type { SkillFilters } from '@/types/skill'

export const metadata: Metadata = {
  title: 'AI Skills Library — Learn How to Use AI Effectively',
  description: 'Structured, practical AI skills from beginner to advanced. Step-by-step guides for prompt engineering, automation, agents, and more.',
  alternates: { canonical: '/skills' },
  openGraph: {
    title: 'AI Skills Library | Avelix',
    description: 'Learn AI skills from beginner to advanced. Prompt engineering, automation, agents — step-by-step.',
    type: 'website',
  },
}

interface SearchParams {
  search?: string
  difficulty?: string
  time_max?: string
  sort?: string
  page?: string
}

function parseFilters(params: SearchParams): SkillFilters {
  return {
    search:     params.search || undefined,
    difficulty: (params.difficulty as SkillFilters['difficulty']) || undefined,
    time_max:   params.time_max ? Number(params.time_max) : undefined,
    sort:       (params.sort as SkillFilters['sort']) || 'popular',
    page:       params.page ? Number(params.page) : 1,
  }
}

export default async function SkillsPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(searchParams)
  const { skills, total } = await getSkills(filters)

  return (
    <>
      <Header />
      <Suspense>
        <SkillsLibraryClient
          initialSkills={skills}
          initialTotal={total}
          initialFilters={filters}
        />
      </Suspense>
      <Footer />
    </>
  )
}
