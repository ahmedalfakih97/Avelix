export type Status = 'draft' | 'review' | 'approved' | 'published' | 'archived'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type PricingModel = 'free' | 'freemium' | 'paid' | 'open-source' | 'enterprise'

export interface BaseEntity {
  id: string
  title: string
  slug: string
  short_description: string
  long_description?: string
  status: Status
  tags: string[]
  source_urls: string[]
  last_synced_at?: string
  last_reviewed_at?: string
  published_at?: string
  created_at: string
  updated_at: string
  confidence_score?: number
  ai_generated?: boolean
}
