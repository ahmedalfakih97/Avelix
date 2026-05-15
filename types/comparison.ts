export type ComparisonType = 'head-to-head' | 'best-for'

export interface ComparisonRow {
  field: string
  label: string
  values: Record<string, string>
  winner?: string
}

export interface ComparisonScenario {
  title: string
  description: string
  winner: string
  reason: string
}

export interface Comparison {
  id: string
  slug: string
  title: string
  short_description: string
  comparison_type: ComparisonType
  item_slugs: string[]
  item_type: 'model' | 'tool'
  verdict: string
  comparison_rows: ComparisonRow[]
  scenarios: ComparisonScenario[]
  recommendation_by_user_type: Record<string, string>
  status: 'published'
  published_at: string
  last_reviewed_at: string
}
