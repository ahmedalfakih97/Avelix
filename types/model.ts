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

export type ModelStatus  = 'active' | 'preview' | 'deprecated' | 'research'
export type ModelSpeed   = 'very_fast' | 'fast' | 'medium' | 'slow'
export type PopularityTier = 'Trending' | 'Popular' | 'Niche'
export type PricingTierLabel = 'Free' | 'Budget' | 'Mid-Range' | 'Premium' | 'Open Source / Free' | 'Unknown'

export interface Model extends BaseEntity {
  provider: string
  model_type: ModelType
  current_status: ModelStatus
  release_date?: string
  official_source_url?: string

  // Technical specs
  context_window?: number
  input_types: string[]
  output_types: string[]
  is_open_source: boolean
  has_api: boolean
  speed: ModelSpeed

  // Use cases
  best_for: string[]
  not_ideal_for: string[]
  strengths: string[]
  weaknesses: string[]

  // Notes
  speed_notes?: string
  quality_notes?: string
  safety_notes?: string

  // Pricing
  pricing_model?: PricingModel
  pricing_summary?: string
  pricing_last_verified?: string

  use_cases: string[]

  // Relations
  related_tool_slugs: string[]
  related_model_slugs: string[]
  related_skill_slugs: string[]

  example_prompts: string[]

  // ── Enriched columns (from AI Models Library import) ──────────────────────
  avelix_category?: string
  avelix_featured?: boolean
  avelix_tags?: string[]
  avelix_data_flags?: string
  popularity_tier?: PopularityTier
  model_type_detail?: string
  modality?: string
  provider_country?: string
  model_family?: string
  model_version?: string
  release_year?: number
  max_output_tokens?: number
  parameter_count?: string
  has_free_tier?: boolean
  pricing_tier_label?: PricingTierLabel
  api_input_price_usd_per_1m?: number
  api_output_price_usd_per_1m?: number
  tool_use_support?: boolean
  structured_output_support?: boolean
  json_mode_support?: boolean
  vision_support?: boolean
  audio_support?: boolean
  video_support?: boolean
  image_generation_support?: boolean
  fine_tuning_support?: boolean
  rag_suitability?: string
  embedding_support?: boolean
  avg_response_latency?: string
  benchmark_results?: string
  enterprise_ready?: boolean
  safety_features?: string
  known_integrations?: string
  primary_competitors?: string
  similar_cheaper_model?: string
  deployment_options?: string[]
  consumer_url?: string
  documentation_url?: string
  pricing_url?: string
  model_card_url?: string
  github_hf_url?: string
}

export type SortOption = 'trending' | 'newest' | 'alpha' | 'price_asc' | 'price_desc'
export type ContextWindowBucket = '8k' | '32k' | '128k' | '1m' | 'max'
export type SizeGroup = '<7B' | '7B–70B' | '70B–200B' | '200B+' | 'Unknown'
export type RagGroup = 'High' | 'Medium' | 'Low'
export type SourceFilter = 'Open Source' | 'Closed Source'
export type ModalityGroup = 'Text' | 'Multimodal' | 'Image' | 'Audio' | 'Video' | 'Code'

export interface ModelFilters {
  // Search + pagination + sort
  search?: string
  sort?: SortOption
  page?: number

  // Multi-select (arrays → .in() in Supabase query)
  categories?: string[]          // avelix_category — e.g. ['Language','Reasoning']
  statuses?: string[]            // current_status — e.g. ['Active','Legacy']
  pricing_tiers?: string[]       // pricing_tier_label
  providers?: string[]           // provider name
  countries?: string[]           // provider_country
  popularity_tiers?: string[]    // popularity_tier
  modality_groups?: ModalityGroup[] // grouped modality

  // Single-select
  context_window_bucket?: ContextWindowBucket
  avg_response_latency?: string  // exact DB value e.g. 'Fast (<500ms)'
  release_year?: number
  rag?: RagGroup
  size?: SizeGroup
  source?: SourceFilter          // maps to is_open_source boolean

  // Boolean toggles
  vision_support?: boolean
  audio_support?: boolean
  fine_tuning_support?: boolean
  tool_use_support?: boolean
  has_free_tier?: boolean
  has_api?: boolean
  embedding_support?: boolean
  json_mode_support?: boolean
  structured_output_support?: boolean
  enterprise_ready?: boolean
}
