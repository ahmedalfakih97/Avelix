import type { BaseEntity, PricingModel } from './shared'

export interface Tool extends BaseEntity {
  website_url?: string
  category_id?: string
  category_name?: string
  use_cases: string[]

  best_for: string[]
  not_ideal_for: string[]
  user_types: string[]
  avelix_rating?: number
  avelix_recommendation?: string

  pricing_model?: PricingModel
  has_free_plan: boolean
  pricing_summary?: string
  pricing_last_verified?: string

  has_api: boolean
  is_no_code: boolean
  platforms: string[]
  integrations: string[]
  has_arabic_support: boolean

  related_tool_slugs: string[]
  related_model_slugs: string[]
  related_skill_slugs: string[]

  pros: string[]
  cons: string[]
  main_features: string[]
  example_prompts: string[]
  screenshots: string[]

  logo_url?: string
}

export interface ToolFilters {
  category?: string
  use_case?: string
  user_type?: string
  pricing?: PricingModel
  has_free_plan?: boolean
  has_api?: boolean
  no_code?: boolean
  arabic_support?: boolean
  platform?: string
  search?: string
  sort?: 'relevant' | 'newest' | 'top_rated' | 'free_first'
  page?: number
}
