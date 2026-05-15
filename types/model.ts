import type { BaseEntity, PricingModel } from './shared'

export type ModelType =
  | 'llm'
  | 'reasoning'
  | 'image'
  | 'video'
  | 'audio'
  | 'embedding'
  | 'coding'
  | 'multimodal'

export type ModelStatus = 'active' | 'preview' | 'deprecated' | 'research'
export type ModelSpeed = 'very_fast' | 'fast' | 'medium' | 'slow'

export interface Model extends BaseEntity {
  provider: string
  model_type: ModelType
  current_status: ModelStatus
  release_date?: string
  official_source_url?: string

  context_window?: number
  input_types: string[]
  output_types: string[]
  is_open_source: boolean
  has_api: boolean
  speed: ModelSpeed

  best_for: string[]
  not_ideal_for: string[]
  strengths: string[]
  weaknesses: string[]

  speed_notes?: string
  quality_notes?: string
  safety_notes?: string

  pricing_model?: PricingModel
  pricing_summary?: string
  pricing_last_verified?: string

  use_cases: string[]

  related_tool_slugs: string[]
  related_model_slugs: string[]
  related_skill_slugs: string[]

  example_prompts: string[]
}

export interface ModelFilters {
  provider?: string
  model_type?: ModelType
  is_open_source?: boolean
  has_api?: boolean
  pricing?: PricingModel
  input_type?: string
  output_type?: string
  search?: string
  sort?: 'popular' | 'newest' | 'context_window' | 'beginner'
  page?: number
}
