-- ============================================================
-- Avelix — Initial Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  content_type content_type_enum,
  parent_id   UUID REFERENCES categories(id),
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USE CASES
-- ============================================================

CREATE TABLE use_cases (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOURCES
-- ============================================================

CREATE TABLE sources (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  url             TEXT NOT NULL UNIQUE,
  trust_score     FLOAT DEFAULT 0.5 CHECK (trust_score >= 0 AND trust_score <= 1),
  source_type     TEXT,
  last_checked_at TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TOOLS
-- ============================================================

CREATE TABLE tools (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description  TEXT,
  website_url TEXT,
  category_id UUID REFERENCES categories(id),
  category_name TEXT,
  tags        TEXT[] DEFAULT '{}',
  use_cases   TEXT[] DEFAULT '{}',

  -- Classification
  best_for              TEXT[] DEFAULT '{}',
  not_ideal_for         TEXT[] DEFAULT '{}',
  user_types            TEXT[] DEFAULT '{}',
  avelix_rating         FLOAT CHECK (avelix_rating >= 0 AND avelix_rating <= 5),
  avelix_recommendation TEXT,

  -- Pricing
  pricing_model         pricing_enum,
  has_free_plan         BOOLEAN DEFAULT FALSE,
  pricing_summary       TEXT,
  pricing_last_verified TIMESTAMPTZ,

  -- Technical
  has_api           BOOLEAN DEFAULT FALSE,
  is_no_code        BOOLEAN DEFAULT FALSE,
  platforms         TEXT[] DEFAULT '{}',
  integrations      TEXT[] DEFAULT '{}',
  has_arabic_support BOOLEAN DEFAULT FALSE,

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',

  -- Content
  pros             TEXT[] DEFAULT '{}',
  cons             TEXT[] DEFAULT '{}',
  main_features    TEXT[] DEFAULT '{}',
  example_prompts  TEXT[] DEFAULT '{}',
  screenshots      TEXT[] DEFAULT '{}',

  -- Meta
  status          status_enum DEFAULT 'draft',
  source_urls     TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated    BOOLEAN DEFAULT TRUE,
  last_synced_at  TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODELS
-- ============================================================

CREATE TABLE models (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description  TEXT,
  provider    TEXT NOT NULL,
  model_type  TEXT,
  category_id UUID REFERENCES categories(id),
  tags        TEXT[] DEFAULT '{}',
  use_cases   TEXT[] DEFAULT '{}',

  -- Technical specs
  context_window INT,
  input_types    TEXT[] DEFAULT '{}',
  output_types   TEXT[] DEFAULT '{}',
  is_open_source BOOLEAN DEFAULT FALSE,
  has_api        BOOLEAN DEFAULT FALSE,
  speed          TEXT,

  -- Use cases
  best_for      TEXT[] DEFAULT '{}',
  not_ideal_for TEXT[] DEFAULT '{}',
  strengths     TEXT[] DEFAULT '{}',
  weaknesses    TEXT[] DEFAULT '{}',

  -- Performance notes
  speed_notes   TEXT,
  quality_notes TEXT,
  safety_notes  TEXT,

  -- Pricing
  pricing_model         pricing_enum,
  pricing_summary       TEXT,
  pricing_last_verified TIMESTAMPTZ,

  -- Status
  release_date        DATE,
  current_status      TEXT,
  official_source_url TEXT,

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',

  -- Content
  example_prompts TEXT[] DEFAULT '{}',

  -- Meta
  status           status_enum DEFAULT 'draft',
  source_urls      TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated     BOOLEAN DEFAULT TRUE,
  last_synced_at   TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description  TEXT,
  category_id UUID REFERENCES categories(id),
  tags        TEXT[] DEFAULT '{}',
  use_cases   TEXT[] DEFAULT '{}',

  -- Learning metadata
  difficulty       difficulty_enum DEFAULT 'beginner',
  estimated_hours  FLOAT,
  who_should_learn TEXT,
  why_it_matters   TEXT,

  -- Content
  learning_steps     JSONB DEFAULT '[]',
  practical_examples TEXT[] DEFAULT '{}',
  common_mistakes    TEXT[] DEFAULT '{}',

  -- Relations
  required_tool_slugs       TEXT[] DEFAULT '{}',
  related_tool_slugs        TEXT[] DEFAULT '{}',
  related_model_slugs       TEXT[] DEFAULT '{}',
  related_skill_slugs       TEXT[] DEFAULT '{}',
  recommended_prompt_slugs  TEXT[] DEFAULT '{}',

  -- Meta
  status           status_enum DEFAULT 'draft',
  source_urls      TEXT[] DEFAULT '{}',
  confidence_score FLOAT DEFAULT 0.5,
  ai_generated     BOOLEAN DEFAULT TRUE,
  last_reviewed_at TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEARNING PATHS
-- ============================================================

CREATE TABLE learning_paths (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description  TEXT,
  goal        TEXT,
  who_its_for TEXT,
  required_skill_level difficulty_enum DEFAULT 'beginner',

  -- Structure
  modules              JSONB DEFAULT '[]',
  practice_tasks       TEXT[] DEFAULT '{}',
  mini_projects        TEXT[] DEFAULT '{}',
  completion_checklist TEXT[] DEFAULT '{}',

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',

  -- Meta
  status          status_enum DEFAULT 'draft',
  estimated_hours FLOAT,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPARISONS
-- ============================================================

CREATE TABLE comparisons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  comparison_type   TEXT,

  -- Items
  item_slugs TEXT[] NOT NULL,
  item_type  TEXT NOT NULL,

  -- Content
  verdict                    TEXT,
  comparison_rows            JSONB DEFAULT '[]',
  scenarios                  JSONB DEFAULT '[]',
  recommendation_by_user_type JSONB DEFAULT '{}',

  -- Meta
  status           status_enum DEFAULT 'draft',
  last_reviewed_at TIMESTAMPTZ,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GLOSSARY
-- ============================================================

CREATE TABLE glossary_terms (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  simple_definition TEXT NOT NULL,
  full_explanation  TEXT,
  example           TEXT,
  why_it_matters    TEXT,
  where_its_used    TEXT,

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  related_term_slugs  TEXT[] DEFAULT '{}',

  -- Meta
  status       status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROMPTS
-- ============================================================

CREATE TABLE prompts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  prompt_text TEXT NOT NULL,
  variables   JSONB DEFAULT '[]',
  use_case    TEXT,
  category_id UUID REFERENCES categories(id),
  tags        TEXT[] DEFAULT '{}',

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',

  -- Meta
  status       status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORKFLOWS
-- ============================================================

CREATE TABLE workflows (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  long_description  TEXT,
  category_id UUID REFERENCES categories(id),
  tags        TEXT[] DEFAULT '{}',

  -- Structure
  steps            JSONB DEFAULT '[]',
  n8n_workflow_json JSONB,

  -- Relations
  required_tool_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',

  -- Meta
  difficulty   difficulty_enum DEFAULT 'beginner',
  status       status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ARTICLES / BLOG
-- ============================================================

CREATE TABLE articles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  excerpt     TEXT,
  content     TEXT,
  category_id UUID REFERENCES categories(id),
  tags        TEXT[] DEFAULT '{}',
  author      TEXT DEFAULT 'Avelix',
  cover_image TEXT,

  -- Relations
  related_tool_slugs  TEXT[] DEFAULT '{}',
  related_model_slugs TEXT[] DEFAULT '{}',
  related_skill_slugs TEXT[] DEFAULT '{}',

  -- Meta
  status       status_enum DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================

CREATE TABLE services (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                    TEXT NOT NULL,
  slug                     TEXT NOT NULL UNIQUE,
  short_description        TEXT NOT NULL,
  long_description         TEXT,
  who_its_for              TEXT,
  problems_solved          TEXT[] DEFAULT '{}',
  example_use_cases        TEXT[] DEFAULT '{}',
  tools_used               TEXT[] DEFAULT '{}',
  delivery_process         TEXT,
  required_info_from_client TEXT,
  estimated_timeline        TEXT,
  pricing_model             TEXT,
  is_active                 BOOLEAN DEFAULT TRUE,
  sort_order                INT DEFAULT 0,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SOCIAL POSTS
-- ============================================================

CREATE TABLE social_posts (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform             TEXT,
  post_type            TEXT,
  title                TEXT,
  post_url             TEXT,
  linked_content_type  content_type_enum,
  linked_content_slug  TEXT,
  published_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPROVAL QUEUE
-- ============================================================

CREATE TABLE approval_queue (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type       content_type_enum NOT NULL,
  content_id         UUID NOT NULL,
  content_slug       TEXT NOT NULL,
  content_title      TEXT NOT NULL,
  action             TEXT NOT NULL,
  source_url         TEXT,
  ai_confidence      FLOAT,
  summary_of_changes TEXT,
  reviewed_by        TEXT,
  reviewed_at        TIMESTAMPTZ,
  decision           TEXT,
  review_notes       TEXT,
  submitted_at       TIMESTAMPTZ DEFAULT NOW(),
  status             TEXT DEFAULT 'pending'
);

-- ============================================================
-- CHANGELOGS
-- ============================================================

CREATE TABLE changelogs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type_enum NOT NULL,
  content_id   UUID NOT NULL,
  content_slug TEXT NOT NULL,
  change_type  TEXT,
  description  TEXT NOT NULL,
  source_url   TEXT,
  changed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_tools_slug     ON tools(slug);
CREATE INDEX idx_tools_status   ON tools(status);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_tags     ON tools USING GIN(tags);
CREATE INDEX idx_tools_search   ON tools USING GIN(to_tsvector('english', title || ' ' || short_description));

CREATE INDEX idx_models_slug     ON models(slug);
CREATE INDEX idx_models_status   ON models(status);
CREATE INDEX idx_models_provider ON models(provider);
CREATE INDEX idx_models_type     ON models(model_type);
CREATE INDEX idx_models_search   ON models USING GIN(to_tsvector('english', title || ' ' || short_description));

CREATE INDEX idx_skills_slug       ON skills(slug);
CREATE INDEX idx_skills_status     ON skills(status);
CREATE INDEX idx_skills_difficulty ON skills(difficulty);

CREATE INDEX idx_glossary_slug     ON glossary_terms(slug);
CREATE INDEX idx_glossary_status   ON glossary_terms(status);

CREATE INDEX idx_comparisons_slug  ON comparisons(slug);
CREATE INDEX idx_comparisons_status ON comparisons(status);

CREATE INDEX idx_approval_queue_status ON approval_queue(status);
CREATE INDEX idx_approval_queue_type   ON approval_queue(content_type);

CREATE INDEX idx_changelogs_content    ON changelogs(content_type, content_slug);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tools_updated_at         BEFORE UPDATE ON tools         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER models_updated_at        BEFORE UPDATE ON models        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skills_updated_at        BEFORE UPDATE ON skills        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER articles_updated_at      BEFORE UPDATE ON articles      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER categories_updated_at    BEFORE UPDATE ON categories    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER comparisons_updated_at   BEFORE UPDATE ON comparisons   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER learning_paths_updated_at BEFORE UPDATE ON learning_paths FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER workflows_updated_at     BEFORE UPDATE ON workflows     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER services_updated_at      BEFORE UPDATE ON services      FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE tools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE models          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons     ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary_terms  ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths  ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows       ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_queue  ENABLE ROW LEVEL SECURITY;

-- Public: read-only, published items only
CREATE POLICY "Public read published tools"        ON tools        FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published models"       ON models       FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published skills"       ON skills       FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published comparisons"  ON comparisons  FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published glossary"     ON glossary_terms FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published articles"     ON articles     FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published paths"        ON learning_paths FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published prompts"      ON prompts      FOR SELECT USING (status = 'published');
CREATE POLICY "Public read published workflows"    ON workflows    FOR SELECT USING (status = 'published');

-- Admin queue: no public access (service role only)
-- (no policy = no access for anon/authenticated; service role bypasses RLS)
