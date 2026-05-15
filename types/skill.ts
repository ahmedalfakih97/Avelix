import type { BaseEntity, DifficultyLevel } from './shared'

export interface LearningStep {
  step: number
  title: string
  description: string
  duration_hours?: number
  resources?: string[]
}

export interface LearningModule {
  module: number
  title: string
  description: string
  skills: string[]
  tools: string[]
  duration_hours?: number
}

export interface Skill extends BaseEntity {
  category_id?: string
  use_cases: string[]

  difficulty: DifficultyLevel
  estimated_hours?: number
  who_should_learn?: string
  why_it_matters?: string

  learning_steps: LearningStep[]
  practical_examples: string[]
  common_mistakes: string[]

  required_tool_slugs: string[]
  related_tool_slugs: string[]
  related_model_slugs: string[]
  related_skill_slugs: string[]
  recommended_prompt_slugs: string[]
}

export interface LearningPath extends BaseEntity {
  goal?: string
  who_its_for?: string
  required_skill_level: DifficultyLevel
  estimated_hours?: number

  modules: LearningModule[]
  practice_tasks: string[]
  mini_projects: string[]
  completion_checklist: string[]

  related_tool_slugs: string[]
  related_model_slugs: string[]
  related_skill_slugs: string[]
}

export interface SkillFilters {
  difficulty?: DifficultyLevel
  category?: string
  search?: string
  time_max?: number
  sort?: 'popular' | 'newest' | 'easiest' | 'quickest'
  page?: number
}

export interface LearningPathFilters {
  level?: DifficultyLevel
  search?: string
}
