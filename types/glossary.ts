export interface GlossaryTerm {
  id: string
  title: string
  slug: string
  simple_definition: string
  full_explanation?: string
  example?: string
  why_it_matters?: string
  where_its_used?: string
  related_tool_slugs: string[]
  related_skill_slugs: string[]
  related_term_slugs: string[]
  status: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface GlossaryFilters {
  search?: string
  letter?: string
}
