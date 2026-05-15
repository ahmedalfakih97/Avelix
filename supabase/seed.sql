-- ============================================================
-- Avelix — Seed Data
-- ============================================================

-- Tool Categories
INSERT INTO categories (name, slug, description, content_type, icon, sort_order) VALUES
  ('AI Writing',          'ai-writing',          'Tools for writing, editing, and content generation',    'tool', 'edit_note',      1),
  ('AI Coding',           'ai-coding',           'Code assistants, debuggers, and dev tools',             'tool', 'code',           2),
  ('AI Image Generation', 'ai-image-generation', 'Generate images from text prompts',                     'tool', 'image',          3),
  ('AI Video',            'ai-video',            'Generate or edit video with AI',                        'tool', 'movie',          4),
  ('AI Audio & Voice',    'ai-audio-voice',      'Text-to-speech, voice cloning, music generation',       'tool', 'mic',            5),
  ('AI Automation',       'ai-automation',       'Workflow automation and AI agents',                     'tool', 'auto_mode',      6),
  ('AI Research',         'ai-research',         'AI-powered research and knowledge tools',               'tool', 'search',         7),
  ('AI Productivity',     'ai-productivity',     'Productivity, summarization, and meeting tools',        'tool', 'productivity',   8),
  ('AI Design',           'ai-design',           'UI, graphic design, and creative tools',                'tool', 'brush',          9),
  ('AI Business',         'ai-business',         'CRM, sales, marketing, and business automation',        'tool', 'business_center',10)
ON CONFLICT (slug) DO NOTHING;

-- Model Categories
INSERT INTO categories (name, slug, description, content_type, icon, sort_order) VALUES
  ('Large Language Models', 'large-language-models', 'General-purpose text generation models',            'model', 'psychology',     1),
  ('Reasoning Models',      'reasoning-models',      'Models optimized for step-by-step reasoning',       'model', 'calculate',      2),
  ('Image Generation',      'image-generation-models','Text-to-image models',                             'model', 'image',          3),
  ('Audio Models',          'audio-models',          'Speech recognition and generation models',          'model', 'mic',            4),
  ('Embedding Models',      'embedding-models',      'Vector embedding models for search and retrieval',  'model', 'hub',            5),
  ('Coding Models',         'coding-models',         'Models specialized for code generation and review', 'model', 'code',           6)
ON CONFLICT (slug) DO NOTHING;

-- Skill Categories
INSERT INTO categories (name, slug, description, content_type, icon, sort_order) VALUES
  ('Prompt Engineering',    'prompt-engineering',    'Writing effective prompts for AI models',           'skill', 'tune',           1),
  ('AI Workflows',          'ai-workflows',          'Building automated workflows with AI',              'skill', 'account_tree',   2),
  ('AI for Business',       'ai-for-business',       'Using AI in professional and business contexts',    'skill', 'business',       3),
  ('AI for Creators',       'ai-for-creators',       'Using AI for content creation and design',          'skill', 'palette',        4),
  ('AI Development',        'ai-development',        'Building apps and integrations with AI APIs',       'skill', 'terminal',       5),
  ('AI Research Skills',    'ai-research-skills',    'Using AI effectively for research and analysis',    'skill', 'lab_research',   6)
ON CONFLICT (slug) DO NOTHING;

-- Common Use Cases
INSERT INTO use_cases (name, slug, description) VALUES
  ('Writing',              'writing',         'Creating written content of any kind'),
  ('Coding',               'coding',          'Writing, debugging, and reviewing code'),
  ('Research',             'research',        'Finding and synthesizing information'),
  ('Automation',           'automation',      'Automating repetitive tasks and workflows'),
  ('Design',               'design',          'Creating visual assets and UI'),
  ('Video Production',     'video',           'Creating or editing video content'),
  ('Audio Production',     'audio',           'Creating or editing audio content'),
  ('Business Operations',  'business',        'Running and optimizing business processes'),
  ('Customer Support',     'customer-support','Handling customer queries and support'),
  ('Data Analysis',        'data-analysis',   'Analyzing and visualizing data'),
  ('Marketing',            'marketing',       'Marketing content and campaigns'),
  ('Education',            'education',       'Learning and teaching with AI'),
  ('AI Agents',            'ai-agents',       'Building autonomous AI agents')
ON CONFLICT (slug) DO NOTHING;

-- Common Tags
INSERT INTO tags (name, slug) VALUES
  ('llm',          'llm'),
  ('multimodal',   'multimodal'),
  ('open-source',  'open-source'),
  ('api',          'api'),
  ('no-code',      'no-code'),
  ('free',         'free'),
  ('openai',       'openai'),
  ('anthropic',    'anthropic'),
  ('google',       'google'),
  ('meta',         'meta'),
  ('automation',   'automation'),
  ('image-gen',    'image-gen'),
  ('voice',        'voice'),
  ('coding',       'coding'),
  ('writing',      'writing')
ON CONFLICT (slug) DO NOTHING;
