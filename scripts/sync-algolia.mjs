import { createClient } from '@supabase/supabase-js'
import { algoliasearch } from 'algoliasearch'

const supabaseUrl = 'https://hgloedsnmpntnohvxhie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnbG9lZHNubXBudG5vaHZ4aGllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc5MTQ4MywiZXhwIjoyMDk0MzY3NDgzfQ.yRk_f_vL66Rwz5nF9nJsdzpI0CnflLBV1My2GEr55Xo'
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { autoRefreshToken: false, persistSession: false } })

const algoliaAppId = 'C4EKB7CITZ'
const algoliaAdminKey = '39b35cc2128657ebcd9616c6ae88c88d'
const client = algoliasearch(algoliaAppId, algoliaAdminKey)

async function syncTools() {
  console.log('Syncing tools to Algolia...')
  const { data, error } = await supabase
    .from('tools')
    .select('id, title, slug, short_description, category_name, tags, use_cases, pricing_model, has_free_plan, user_types, platforms, avelix_rating, status')
    .eq('status', 'published')
  if (error) { console.error('tools fetch error:', error.message); return }

  const objects = data.map(t => ({
    objectID: t.id,
    type: 'tool',
    title: t.title,
    slug: t.slug,
    short_description: t.short_description,
    category: t.category_name,
    tags: t.tags ?? [],
    use_cases: t.use_cases ?? [],
    pricing_model: t.pricing_model,
    has_free_plan: t.has_free_plan,
    user_types: t.user_types ?? [],
    platforms: t.platforms ?? [],
    avelix_rating: t.avelix_rating,
    url: `/tools/${t.slug}`
  }))

  await client.saveObjects({ indexName: 'tools', objects })
  console.log(`  ✓ ${objects.length} tools synced to Algolia`)
}

async function syncModels() {
  console.log('Syncing models to Algolia...')
  const { data, error } = await supabase
    .from('models')
    .select('id, title, slug, short_description, provider, model_type, tags, is_open_source, pricing_model, status')
    .eq('status', 'published')
  if (error) { console.error('models fetch error:', error.message); return }

  const objects = data.map(m => ({
    objectID: m.id,
    type: 'model',
    title: m.title,
    slug: m.slug,
    short_description: m.short_description,
    provider: m.provider,
    model_type: m.model_type,
    tags: m.tags ?? [],
    is_open_source: m.is_open_source,
    pricing_model: m.pricing_model,
    url: `/models/${m.slug}`
  }))

  await client.saveObjects({ indexName: 'models', objects })
  console.log(`  ✓ ${objects.length} models synced to Algolia`)
}

async function syncSkills() {
  console.log('Syncing skills to Algolia...')
  const { data, error } = await supabase
    .from('skills')
    .select('id, title, slug, short_description, tags, difficulty, estimated_hours, status')
    .eq('status', 'published')
  if (error) { console.error('skills fetch error:', error.message); return }

  const objects = data.map(s => ({
    objectID: s.id,
    type: 'skill',
    title: s.title,
    slug: s.slug,
    short_description: s.short_description,
    tags: s.tags ?? [],
    difficulty: s.difficulty,
    estimated_hours: s.estimated_hours,
    url: `/skills/${s.slug}`
  }))

  await client.saveObjects({ indexName: 'skills', objects })
  console.log(`  ✓ ${objects.length} skills synced to Algolia`)
}

async function configureIndexes() {
  console.log('Configuring Algolia index settings...')

  await client.setSettings({
    indexName: 'tools',
    indexSettings: {
      searchableAttributes: ['title', 'short_description', 'category', 'tags', 'use_cases'],
      attributesForFaceting: ['filterOnly(type)', 'category', 'pricing_model', 'has_free_plan', 'user_types', 'platforms', 'tags'],
      customRanking: ['desc(avelix_rating)']
    }
  })

  await client.setSettings({
    indexName: 'models',
    indexSettings: {
      searchableAttributes: ['title', 'short_description', 'provider', 'model_type', 'tags'],
      attributesForFaceting: ['filterOnly(type)', 'provider', 'model_type', 'is_open_source', 'pricing_model', 'tags']
    }
  })

  await client.setSettings({
    indexName: 'skills',
    indexSettings: {
      searchableAttributes: ['title', 'short_description', 'tags'],
      attributesForFaceting: ['filterOnly(type)', 'difficulty', 'tags']
    }
  })

  console.log('  ✓ Index settings configured')
}

async function main() {
  await configureIndexes()
  await syncTools()
  await syncModels()
  await syncSkills()
  console.log('\nAlgolia sync complete.')
}

main().catch(err => { console.error(err); process.exit(1) })
