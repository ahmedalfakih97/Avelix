# Agent 02 — Database Schema (Supabase)

## Goal
Create the complete Supabase PostgreSQL schema for Avelix. Run all migrations. Generate TypeScript types from the schema.

## Prerequisites
- Agent 01 complete
- Supabase project created and credentials in `.env.local`
- Supabase CLI installed: `npm install -g supabase`

## Steps

### 1. Initialize Supabase locally
```bash
supabase init
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Create migration file
```bash
supabase migration new initial_schema
```

Edit the generated file at `supabase/migrations/[timestamp]_initial_schema.sql`:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for full-text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE status_enum AS ENUM ('draft', 'review', 'approved', 'published', 'archived');
CREATE TYPE difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE pricing_enum AS ENUM ('free', 'freemium', 'paid', 'open-source', 'enterprise');
CREATE TYPE content_type_enum AS ENUM ('tool', 'model', 'skill', 'guide', 'glossary', 'comparison', 'article', 'workflow', 'prompt');

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content_type content_type_enum,
  parent_id UUID REFERENCES categories(id),
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USE CASES
-- ============================================================

CREATE TABLE use_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOURCES (trusted external sources)
-- ============================================================

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  trust_score FLOAT DEFAULT 0.5 CHECK (trust_score >= 0 AND trust_score <= 1),
  source_type TEXT, -- 'official', 'news', 'product_hunt', 'github', 'huggingface', 'newsletter'
  last_checked_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TOOLS
-- ============================================================

CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  website_url TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  
  -- Classification
  best_for TEXT[],          -- ['writing', 'automation', 'research']
  not_ideal_for TEXT[],
  user_types TEXT[],        -- ['creator', 'developer', 'business', 'beginner']
  avelix_rating FLOAT CHECK (avelix_rating >= 0 AND avelix_rating <= 5),
  avelix_recommendation TEXT,
  
  -- Pricing
  pricing_model pricing_enum,
  has_free_plan BOOLEAN DEFAULT FALSE,
  pricing_summary TEXT,
  pricing_last_verified TIMESTAMPTZ,
  
  -- Technical
  has_api BOOLEAN DEFAULT FALSE,
  is_no_code BOOLEAN DEFAULT FALSE,
  platforms TEXT[],         -- ['web', 'ios', 'android', 'desktop']
  integrations TEXT[],
  has_arabic_support BOOLEAN DEFAULT FALSE,
  
  -- Relations (stored as slugs for portability)
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  
  -- Content
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  main_features TEXT[] DEFAULT '{}',
  example_prompts TEXT[] DEFAULT '{}',
  screenshots TEXT[],       -- Supabase storage URLs
  
  -- Meta
  status status_enum DEFAULT 'draft',
  source_urls TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODELS
-- ============================================================

CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  provider TEXT NOT NULL,
  model_type TEXT,          -- 'llm', 'image', 'video', 'audio', 'embedding', 'reasoning'
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  
  -- Technical specs
  context_window INT,       -- in tokens
  input_types TEXT[],       -- ['text', 'image', 'audio', 'video', 'code']
  output_types TEXT[],
  is_open_source BOOLEAN DEFAULT FALSE,
  has_api BOOLEAN DEFAULT FALSE,
  
  -- Use cases
  best_for TEXT[],
  not_ideal_for TEXT[],
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  
  -- Performance notes
  speed_notes TEXT,
  quality_notes TEXT,
  safety_notes TEXT,
  
  -- Pricing
  pricing_model pricing_enum,
  pricing_summary TEXT,
  pricing_last_verified TIMESTAMPTZ,
  
  -- Status
  release_date DATE,
  current_status TEXT,      -- 'active', 'deprecated', 'preview', 'research'
  official_source_url TEXT,
  
  -- Relations
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  source_urls TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  
  -- Learning metadata
  difficulty difficulty_enum DEFAULT 'beginner',
  estimated_hours FLOAT,
  who_should_learn TEXT,
  why_it_matters TEXT,
  
  -- Content
  learning_steps JSONB,     -- [{ order, title, description, resources }]
  practical_examples TEXT[] DEFAULT '{}',
  common_mistakes TEXT[] DEFAULT '{}',
  
  -- Relations
  required_tool_slugs TEXT[] DEFAULT '{}',
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  recommended_prompt_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  source_urls TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated BOOLEAN DEFAULT TRUE,
  last_reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEARNING PATHS / GUIDES
-- ============================================================

CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  goal TEXT,
  who_its_for TEXT,
  required_skill_level difficulty_enum DEFAULT 'beginner',
  
  -- Structure
  modules JSONB,            -- [{ order, title, description, skill_slugs[], tool_slugs[] }]
  practice_tasks TEXT[] DEFAULT '{}',
  mini_projects TEXT[] DEFAULT '{}',
  completion_checklist TEXT[] DEFAULT '{}',
  
  -- Relations
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  estimated_hours FLOAT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPARISONS
-- ============================================================

CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  comparison_type TEXT,     -- 'tools', 'models', 'mixed'
  
  -- Items being compared (slugs)
  item_slugs TEXT[] NOT NULL,
  item_type TEXT NOT NULL,  -- 'tool' or 'model'
  
  -- Content
  comparison_data JSONB,    -- structured comparison table data
  final_recommendation TEXT,
  recommendation_by_user_type JSONB, -- { creator: "...", developer: "...", beginner: "..." }
  
  -- Meta
  status status_enum DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GLOSSARY
-- ============================================================

CREATE TABLE glossary_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  simple_definition TEXT NOT NULL,
  full_explanation TEXT,
  example TEXT,
  why_it_matters TEXT,
  where_its_used TEXT,
  
  -- Relations
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  related_term_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROMPTS
-- ============================================================

CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  prompt_text TEXT NOT NULL,
  variables JSONB,          -- [{ name, description, example }]
  use_case TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  
  -- Relations
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKFLOWS
-- ============================================================

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  
  -- Structure
  steps JSONB,             -- [{ order, title, description, tool_slug, prompt_slug }]
  n8n_workflow_json JSONB, -- optional embedded n8n workflow
  
  -- Relations
  required_tool_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  difficulty difficulty_enum DEFAULT 'beginner',
  status status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ARTICLES / BLOG
-- ============================================================

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,             -- MDX or HTML
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Avelix',
  cover_image TEXT,
  
  -- Relations
  related_tool_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  
  -- Meta
  status status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description TEXT,
  who_its_for TEXT,
  problems_solved TEXT[] DEFAULT '{}',
  example_use_cases TEXT[] DEFAULT '{}',
  tools_used TEXT[] DEFAULT '{}',
  delivery_process TEXT,
  required_info_from_client TEXT,
  estimated_timeline TEXT,
  pricing_model TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOCIAL POSTS (mapping social content to website pages)
-- ============================================================

CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT,            -- 'instagram', 'tiktok', 'youtube', 'linkedin', 'x'
  post_type TEXT,           -- 'reel', 'carousel', 'video', 'post'
  title TEXT,
  post_url TEXT,
  linked_content_type content_type_enum,
  linked_content_slug TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPROVAL QUEUE
-- ============================================================

CREATE TABLE approval_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type_enum NOT NULL,
  content_id UUID NOT NULL,
  content_slug TEXT NOT NULL,
  content_title TEXT NOT NULL,
  action TEXT NOT NULL,     -- 'create', 'update', 'delete'
  source_url TEXT,
  ai_confidence FLOAT,
  summary_of_changes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  decision TEXT,            -- 'approved', 'rejected', 'needs_edit'
  review_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);

-- ============================================================
-- CHANGELOGS (per item history)
-- ============================================================

CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type_enum NOT NULL,
  content_id UUID NOT NULL,
  content_slug TEXT NOT NULL,
  change_type TEXT,         -- 'pricing', 'feature', 'deprecation', 'launch', 'update'
  description TEXT NOT NULL,
  source_url TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX idx_tools_search ON tools USING GIN(to_tsvector('english', title || ' ' || short_description));

CREATE INDEX idx_models_slug ON models(slug);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_provider ON models(provider);

CREATE INDEX idx_skills_slug ON skills(slug);
CREATE INDEX idx_skills_status ON skills(status);
CREATE INDEX idx_skills_difficulty ON skills(difficulty);

CREATE INDEX idx_glossary_slug ON glossary_terms(slug);
CREATE INDEX idx_approval_queue_status ON approval_queue(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue ENABLE ROW LEVEL SECURITY;

-- Public can only read published items
CREATE POLICY "Public read published tools" ON tools FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published models" ON models FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published skills" ON skills FOR SELECT USING (status = 'published');

-- Admin has full access (via service role key — bypasses RLS)

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER models_updated_at BEFORE UPDATE ON models FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 3. Run migration
```bash
supabase db push
```

### 4. Generate TypeScript types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/database.ts
```

### 5. Create typed query helpers
Create `lib/queries/tools.ts`, `lib/queries/models.ts`, `lib/queries/skills.ts` — each with typed fetch functions using the generated `Database` types.

Example for `lib/queries/tools.ts`:
```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getToolBySlug(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) throw error;
  return data;
}

export async function getTools({ 
  category, tags, pricing, search, limit = 24, offset = 0 
}: {
  category?: string;
  tags?: string[];
  pricing?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from('tools')
    .select('id, title, slug, short_description, category_id, tags, pricing_model, has_free_plan, avelix_rating, best_for, user_types')
    .eq('status', 'published')
    .order('avelix_rating', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (category) query = query.eq('category_id', category);
  if (pricing) query = query.eq('pricing_model', pricing);
  if (tags?.length) query = query.overlaps('tags', tags);
  if (search) query = query.textSearch('title', search, { type: 'websearch' });
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

### 6. Seed initial categories
Create `supabase/seed.sql` with the category data from the content brief (all tool categories, model types, skill categories).

## Done Criteria
- [ ] All tables created in Supabase
- [ ] RLS policies active
- [ ] TypeScript types generated at `types/database.ts`
- [ ] Query helpers created for tools, models, skills, glossary
- [ ] Indexes created
- [ ] `npm run build` passes with no type errors
