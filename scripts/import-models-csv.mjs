import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const CSV_PATH = join(__dir, '..', 'avelix_models_import.csv')
const BATCH_SIZE = 50

const supabase = createClient(
  'https://hgloedsnmpntnohvxhie.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── helpers ────────────────────────────────────────────────────────────────

function bool(val) {
  if (!val) return false
  const v = val.trim().toLowerCase()
  return v === 'yes' || v === 'true' || v.startsWith('yes (')
}

function boolLoose(val) {
  if (!val) return false
  const v = val.trim().toLowerCase()
  return v !== 'no' && v !== 'not publicly disclosed' && v !== 'unknown' && v !== ''
}

function int(val) {
  if (!val || val.includes('Unknown') || val.includes('unknown')) return null
  const n = parseInt(String(val).replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? null : n
}

function float(val) {
  if (!val || val.trim() === '' || val.includes('Unknown')) return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

function arr(val, sep = '|') {
  if (!val || val.trim() === '') return []
  return val.split(sep).map(s => s.trim()).filter(Boolean)
}

function arrComma(val) {
  if (!val || val.trim() === '') return []
  return val.split(',').map(s => s.trim()).filter(Boolean)
}

function str(val) {
  if (!val || val.trim() === '') return null
  const v = val.trim()
  if (v.toLowerCase().includes('unknown') || v.includes('[needs-review]')) return null
  return v
}

function shortDesc(overview) {
  if (!overview || overview.trim() === '') return ''
  const sentence = overview.split(/\.\s/)[0].trim()
  if (sentence.length <= 220) return sentence.length < overview.length ? sentence + '.' : sentence
  const cut = overview.slice(0, 220)
  const last = cut.lastIndexOf(' ')
  return cut.slice(0, last > 100 ? last : 220) + '…'
}

function mapModelType(category) {
  const map = {
    'Language':         'llm',
    'Reasoning':        'reasoning',
    'Coding':           'coding',
    'Image Generation': 'image',
    'Video':            'video',
    'Audio':            'audio',
    'Embeddings':       'embedding',
    'Multimodal':       'multimodal',
    'Safety':           'llm',
    'On-Device':        'llm',
    'Agents':           'multimodal',
  }
  return map[category] ?? 'llm'
}

function mapCurrentStatus(raw) {
  const map = {
    'Active':           'active',
    'Legacy':           'deprecated',
    'Research Preview': 'preview',
    'Retired':          'deprecated',
  }
  return map[raw] ?? 'active'
}

function mapPricingModel(tier) {
  const map = {
    'Free':               'free',
    'Open Source / Free': 'open-source',
    'Budget':             'freemium',
    'Mid-Range':          'paid',
    'Premium':            'paid',
    'Unknown':            'paid',
  }
  return map[tier] ?? 'paid'
}

function mapSpeed(latency) {
  if (!latency || latency.includes('Unknown')) return 'medium'
  if (latency.startsWith('Fast'))   return 'fast'
  if (latency.startsWith('Medium')) return 'medium'
  if (latency.startsWith('Slow'))   return 'slow'
  return 'medium'
}

function mapIsOpenSource(raw) {
  return raw === 'Open Source'
}

function mapHasApi(raw) {
  if (!raw) return false
  const v = raw.toLowerCase()
  return v.includes('available') || (v.startsWith('limited') && !v.includes('invitation'))
}

function mapEnterpriseReady(raw) {
  if (!raw) return false
  const v = raw.toLowerCase()
  return v.includes('enterprise') || v.includes('cloud') || v.includes('self-host')
}

function mapRagSuitability(raw) {
  if (!raw || raw.includes('Unknown') || raw.includes('Not publicly')) return null
  return raw
}

function mapDeploymentOptions(raw) {
  if (!raw || raw.trim() === '' || raw.includes('Unknown')) return []
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

// ── row mapper ─────────────────────────────────────────────────────────────

function mapRow(r) {
  const confidence = float(r['confidence_score']) ?? 0.5
  const status = confidence >= 0.7 ? 'published' : 'draft'

  const examplePrompts = [
    r['example_prompt_1'], r['example_prompt_2'], r['example_prompt_3']
  ].map(s => s?.trim()).filter(Boolean)

  return {
    // ── BaseEntity ──────────────────────────────────────────────────────────
    slug:              r['avelix_slug'],
    title:             r['avelix_display_name'],
    short_description: shortDesc(r['avelix_overview']),
    long_description:  str(r['avelix_overview']),
    status,
    tags:              arr(r['avelix_tags'], '|'),
    source_urls:       arr(r['Source links'], '|'),
    confidence_score:  confidence,
    ai_generated:      true,

    // ── Model core ──────────────────────────────────────────────────────────
    provider:           str(r['Provider name']) ?? '',
    model_type:         mapModelType(r['avelix_category']),
    current_status:     mapCurrentStatus(r['status_norm']),
    release_date:       str(r['Release date']),
    official_source_url: str(r['Official model URL']),

    // ── Technical specs ─────────────────────────────────────────────────────
    context_window:  int(r['Context window']),
    input_types:     arrComma(r['Input types']),
    output_types:    arrComma(r['Output types']),
    is_open_source:  mapIsOpenSource(r['open_source_norm']),
    has_api:         mapHasApi(r['API availability']),
    speed:           mapSpeed(r['avg_response_latency']),

    // ── Use cases ───────────────────────────────────────────────────────────
    best_for:      arrComma(r['Best use cases']),
    not_ideal_for: arrComma(r['Not recommended use cases']),
    strengths:     arrComma(r['Key capabilities']),
    weaknesses:    arrComma(r['Limitations']),
    use_cases:     arrComma(r['Best use cases']),

    // ── Notes ───────────────────────────────────────────────────────────────
    speed_notes:   str(r['Latency profile']),
    quality_notes: str(r['Benchmark results']),
    safety_notes:  str(r['Safety features']),

    // ── Pricing ─────────────────────────────────────────────────────────────
    pricing_model:         mapPricingModel(r['pricing_tier_label']),
    pricing_summary:       str(r['price_summary']),
    pricing_last_verified: str(r['Last verified date']),

    // ── Relations ───────────────────────────────────────────────────────────
    related_tool_slugs:  [],
    related_model_slugs: [],
    related_skill_slugs: [],

    // ── Content ─────────────────────────────────────────────────────────────
    example_prompts: examplePrompts,

    // ── New enriched columns ─────────────────────────────────────────────────
    avelix_category:    str(r['avelix_category']),
    avelix_featured:    bool(r['avelix_featured']),
    avelix_tags:        arr(r['avelix_tags'], '|'),
    avelix_data_flags:  str(r['avelix_data_flags']),
    popularity_tier:    str(r['popularity_tier']),
    model_type_detail:  str(r['model_type_norm']),
    modality:           str(r['modality_norm']),
    provider_country:   str(r['provider_country_norm']),
    model_family:       str(r['Model family']),
    model_version:      str(r['Model version']),
    release_year:       int(r['release_year']),
    max_output_tokens:  int(r['max_output_tokens']),
    parameter_count:    str(r['parameter_count']),
    has_free_tier:      bool(r['has_free_tier']),
    pricing_tier_label: str(r['pricing_tier_label']),
    api_input_price_usd_per_1m:  float(r['api_input_price_usd_per_1m']),
    api_output_price_usd_per_1m: float(r['api_output_price_usd_per_1m']),
    tool_use_support:            bool(r['Tool use support']),
    structured_output_support:   bool(r['Structured output support']),
    json_mode_support:           bool(r['JSON mode support']),
    vision_support:              bool(r['Vision support']),
    audio_support:               bool(r['Audio support']),
    video_support:               bool(r['Video support']),
    image_generation_support:    bool(r['Image generation support']),
    fine_tuning_support:         boolLoose(r['Fine-tuning support']),
    rag_suitability:             mapRagSuitability(r['RAG suitability']),
    embedding_support:           bool(r['Embedding support']),
    avg_response_latency:        str(r['avg_response_latency']),
    benchmark_results:           str(r['Benchmark results']),
    enterprise_ready:            mapEnterpriseReady(r['Enterprise readiness']),
    safety_features:             str(r['Safety features']),
    known_integrations:          str(r['Known integrations']),
    primary_competitors:         str(r['Primary competitors']),
    similar_cheaper_model:       str(r['similar_cheaper_model']),
    deployment_options:          mapDeploymentOptions(r['Deployment options']),
    consumer_url:                str(r['consumer_url']),
    documentation_url:           str(r['Documentation URL']),
    pricing_url:                 str(r['Pricing URL']),
    model_card_url:              str(r['Model card URL']),
    github_hf_url:               str(r['GitHub or Hugging Face URL']),
  }
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading CSV…')
  const raw = readFileSync(CSV_PATH, 'utf8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true, bom: true })
  console.log(`  ${rows.length} rows parsed`)

  const records = rows.map(mapRow)

  let inserted = 0
  let updated  = 0
  let errors   = 0

  console.log(`\nUpserting in batches of ${BATCH_SIZE}…`)

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE)
    const { data, error } = await supabase
      .from('models')
      .upsert(batch, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id, slug, status')

    if (error) {
      console.error(`  ✗ Batch ${Math.floor(i / BATCH_SIZE) + 1} error: ${error.message}`)
      errors += batch.length
    } else {
      const batchInserted = data?.length ?? batch.length
      inserted += batchInserted
      console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchInserted} rows (${i + 1}–${Math.min(i + BATCH_SIZE, records.length)})`)
    }
  }

  console.log('\n── Summary ──────────────────────────────')
  console.log(`  Total rows:  ${records.length}`)
  console.log(`  Upserted:    ${inserted}`)
  console.log(`  Errors:      ${errors}`)

  const published = records.filter(r => r.status === 'published').length
  const draft     = records.filter(r => r.status === 'draft').length
  console.log(`  Published:   ${published}`)
  console.log(`  Draft:       ${draft}`)
  console.log('─────────────────────────────────────────')

  if (errors === 0) {
    console.log('\nAll rows imported. Run sync-algolia.mjs next.')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
