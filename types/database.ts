export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          content_type: Database['public']['Enums']['content_type_enum'] | null
          parent_id: string | null
          icon: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          content_type?: Database['public']['Enums']['content_type_enum'] | null
          parent_id?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      tools: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          long_description: string | null
          website_url: string | null
          category_id: string | null
          category_name: string | null
          tags: string[]
          use_cases: string[]
          best_for: string[]
          not_ideal_for: string[]
          user_types: string[]
          avelix_rating: number | null
          avelix_recommendation: string | null
          pricing_model: Database['public']['Enums']['pricing_enum'] | null
          has_free_plan: boolean
          pricing_summary: string | null
          pricing_last_verified: string | null
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
          status: Database['public']['Enums']['status_enum']
          source_urls: string[]
          confidence_score: number
          ai_generated: boolean
          last_synced_at: string | null
          last_reviewed_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          long_description?: string | null
          website_url?: string | null
          category_id?: string | null
          category_name?: string | null
          tags?: string[]
          use_cases?: string[]
          best_for?: string[]
          not_ideal_for?: string[]
          user_types?: string[]
          avelix_rating?: number | null
          avelix_recommendation?: string | null
          pricing_model?: Database['public']['Enums']['pricing_enum'] | null
          has_free_plan?: boolean
          pricing_summary?: string | null
          pricing_last_verified?: string | null
          has_api?: boolean
          is_no_code?: boolean
          platforms?: string[]
          integrations?: string[]
          has_arabic_support?: boolean
          related_tool_slugs?: string[]
          related_model_slugs?: string[]
          related_skill_slugs?: string[]
          pros?: string[]
          cons?: string[]
          main_features?: string[]
          example_prompts?: string[]
          screenshots?: string[]
          status?: Database['public']['Enums']['status_enum']
          source_urls?: string[]
          confidence_score?: number
          ai_generated?: boolean
          last_synced_at?: string | null
          last_reviewed_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['tools']['Insert']>
      }
      models: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          long_description: string | null
          provider: string
          model_type: string | null
          category_id: string | null
          tags: string[]
          use_cases: string[]
          context_window: number | null
          input_types: string[]
          output_types: string[]
          is_open_source: boolean
          has_api: boolean
          speed: string | null
          best_for: string[]
          not_ideal_for: string[]
          strengths: string[]
          weaknesses: string[]
          speed_notes: string | null
          quality_notes: string | null
          safety_notes: string | null
          pricing_model: Database['public']['Enums']['pricing_enum'] | null
          pricing_summary: string | null
          pricing_last_verified: string | null
          release_date: string | null
          current_status: string | null
          official_source_url: string | null
          related_tool_slugs: string[]
          related_model_slugs: string[]
          related_skill_slugs: string[]
          example_prompts: string[]
          status: Database['public']['Enums']['status_enum']
          source_urls: string[]
          confidence_score: number
          ai_generated: boolean
          last_synced_at: string | null
          last_reviewed_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          long_description?: string | null
          provider: string
          model_type?: string | null
          category_id?: string | null
          tags?: string[]
          use_cases?: string[]
          context_window?: number | null
          input_types?: string[]
          output_types?: string[]
          is_open_source?: boolean
          has_api?: boolean
          speed?: string | null
          best_for?: string[]
          not_ideal_for?: string[]
          strengths?: string[]
          weaknesses?: string[]
          speed_notes?: string | null
          quality_notes?: string | null
          safety_notes?: string | null
          pricing_model?: Database['public']['Enums']['pricing_enum'] | null
          pricing_summary?: string | null
          pricing_last_verified?: string | null
          release_date?: string | null
          current_status?: string | null
          official_source_url?: string | null
          related_tool_slugs?: string[]
          related_model_slugs?: string[]
          related_skill_slugs?: string[]
          example_prompts?: string[]
          status?: Database['public']['Enums']['status_enum']
          source_urls?: string[]
          confidence_score?: number
          ai_generated?: boolean
          last_synced_at?: string | null
          last_reviewed_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['models']['Insert']>
      }
      skills: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          long_description: string | null
          category_id: string | null
          tags: string[]
          use_cases: string[]
          difficulty: Database['public']['Enums']['difficulty_enum']
          estimated_hours: number | null
          who_should_learn: string | null
          why_it_matters: string | null
          learning_steps: Json
          practical_examples: string[]
          common_mistakes: string[]
          required_tool_slugs: string[]
          related_tool_slugs: string[]
          related_model_slugs: string[]
          related_skill_slugs: string[]
          recommended_prompt_slugs: string[]
          status: Database['public']['Enums']['status_enum']
          source_urls: string[]
          confidence_score: number
          ai_generated: boolean
          last_reviewed_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          long_description?: string | null
          category_id?: string | null
          tags?: string[]
          use_cases?: string[]
          difficulty?: Database['public']['Enums']['difficulty_enum']
          estimated_hours?: number | null
          who_should_learn?: string | null
          why_it_matters?: string | null
          learning_steps?: Json
          practical_examples?: string[]
          common_mistakes?: string[]
          required_tool_slugs?: string[]
          related_tool_slugs?: string[]
          related_model_slugs?: string[]
          related_skill_slugs?: string[]
          recommended_prompt_slugs?: string[]
          status?: Database['public']['Enums']['status_enum']
          source_urls?: string[]
          confidence_score?: number
          ai_generated?: boolean
          last_reviewed_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['skills']['Insert']>
      }
      comparisons: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          comparison_type: string | null
          item_slugs: string[]
          item_type: string
          verdict: string | null
          comparison_rows: Json
          scenarios: Json
          recommendation_by_user_type: Json
          status: Database['public']['Enums']['status_enum']
          last_reviewed_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          comparison_type?: string | null
          item_slugs: string[]
          item_type: string
          verdict?: string | null
          comparison_rows?: Json
          scenarios?: Json
          recommendation_by_user_type?: Json
          status?: Database['public']['Enums']['status_enum']
          last_reviewed_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['comparisons']['Insert']>
      }
      glossary_terms: {
        Row: {
          id: string
          title: string
          slug: string
          simple_definition: string
          full_explanation: string | null
          example: string | null
          why_it_matters: string | null
          where_its_used: string | null
          related_tool_slugs: string[]
          related_skill_slugs: string[]
          related_term_slugs: string[]
          status: Database['public']['Enums']['status_enum']
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          simple_definition: string
          full_explanation?: string | null
          example?: string | null
          why_it_matters?: string | null
          where_its_used?: string | null
          related_tool_slugs?: string[]
          related_skill_slugs?: string[]
          related_term_slugs?: string[]
          status?: Database['public']['Enums']['status_enum']
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['glossary_terms']['Insert']>
      }
      approval_queue: {
        Row: {
          id: string
          content_type: Database['public']['Enums']['content_type_enum']
          content_id: string
          content_slug: string
          content_title: string
          action: string
          source_url: string | null
          ai_confidence: number | null
          summary_of_changes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          decision: string | null
          review_notes: string | null
          submitted_at: string
          status: string
        }
        Insert: {
          id?: string
          content_type: Database['public']['Enums']['content_type_enum']
          content_id: string
          content_slug: string
          content_title: string
          action: string
          source_url?: string | null
          ai_confidence?: number | null
          summary_of_changes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          decision?: string | null
          review_notes?: string | null
          submitted_at?: string
          status?: string
        }
        Update: Partial<Database['public']['Tables']['approval_queue']['Insert']>
      }
      changelogs: {
        Row: {
          id: string
          content_type: Database['public']['Enums']['content_type_enum']
          content_id: string
          content_slug: string
          change_type: string | null
          description: string
          source_url: string | null
          changed_at: string
        }
        Insert: {
          id?: string
          content_type: Database['public']['Enums']['content_type_enum']
          content_id: string
          content_slug: string
          change_type?: string | null
          description: string
          source_url?: string | null
          changed_at?: string
        }
        Update: Partial<Database['public']['Tables']['changelogs']['Insert']>
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          category_id: string | null
          tags: string[]
          author: string
          cover_image: string | null
          related_tool_slugs: string[]
          related_model_slugs: string[]
          related_skill_slugs: string[]
          status: Database['public']['Enums']['status_enum']
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          category_id?: string | null
          tags?: string[]
          author?: string
          cover_image?: string | null
          related_tool_slugs?: string[]
          related_model_slugs?: string[]
          related_skill_slugs?: string[]
          status?: Database['public']['Enums']['status_enum']
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string
          long_description: string | null
          who_its_for: string | null
          problems_solved: string[]
          example_use_cases: string[]
          tools_used: string[]
          delivery_process: string | null
          required_info_from_client: string | null
          estimated_timeline: string | null
          pricing_model: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description: string
          long_description?: string | null
          who_its_for?: string | null
          problems_solved?: string[]
          example_use_cases?: string[]
          tools_used?: string[]
          delivery_process?: string | null
          required_info_from_client?: string | null
          estimated_timeline?: string | null
          pricing_model?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
    }
    Enums: {
      status_enum: 'draft' | 'review' | 'approved' | 'published' | 'archived'
      difficulty_enum: 'beginner' | 'intermediate' | 'advanced'
      pricing_enum: 'free' | 'freemium' | 'paid' | 'open-source' | 'enterprise'
      content_type_enum: 'tool' | 'model' | 'skill' | 'guide' | 'glossary' | 'comparison' | 'article' | 'workflow' | 'prompt'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
