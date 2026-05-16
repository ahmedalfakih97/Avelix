import { NextRequest, NextResponse } from 'next/server'

interface SyncPayload {
  content_type: 'tool' | 'model' | 'skill'
  title: string
  slug: string
  short_description: string
  source_url?: string
  ai_confidence?: number
  summary_of_changes?: string
  action?: 'create' | 'update' | 'delete'
  data?: Record<string, unknown>
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Validate webhook secret
  const incomingSecret = req.headers.get('x-webhook-secret')
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET

  if (expectedSecret && incomingSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: SyncPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { content_type, title, slug, short_description, source_url, ai_confidence, summary_of_changes, action = 'create', data = {} } = body

  if (!content_type || !title || !slug) {
    return NextResponse.json({ error: 'Missing required fields: content_type, title, slug' }, { status: 422 })
  }

  if (!['tool', 'model', 'skill'].includes(content_type)) {
    return NextResponse.json({ error: `Invalid content_type: ${content_type}` }, { status: 422 })
  }

  const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL
  if (USE_MOCK) {
    // In dev/mock mode, acknowledge without writing
    return NextResponse.json({
      success: true,
      message: 'Mock mode: item acknowledged but not persisted',
      item: { content_type, title, slug },
    })
  }

  try {
    const { createAdminSupabaseClient } = await import('@/lib/supabase-admin')
    const supabase = createAdminSupabaseClient()

    const basePayload = {
      slug,
      title,
      short_description: short_description ?? '',
      status: 'draft' as const,
      ai_generated: true,
      confidence_score: ai_confidence != null ? ai_confidence / 100 : 0.7,
      source_urls: source_url ? [source_url] : [],
      last_synced_at: new Date().toISOString(),
    }

    // Supabase strict TS requires explicit casts for upsert with dynamic spread
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    let contentId: string
    if (content_type === 'tool') {
      const { data: item, error } = await sb.from('tools')
        .upsert({ ...basePayload, ...data }, { onConflict: 'slug' })
        .select('id').single()
      if (error || !item) {
        console.error('[webhooks/sync] tool upsert', error)
        return NextResponse.json({ error: 'Failed to upsert tool' }, { status: 500 })
      }
      contentId = (item as { id: string }).id
    } else if (content_type === 'model') {
      const { data: item, error } = await sb.from('models')
        .upsert({ ...basePayload, ...data }, { onConflict: 'slug' })
        .select('id').single()
      if (error || !item) {
        console.error('[webhooks/sync] model upsert', error)
        return NextResponse.json({ error: 'Failed to upsert model' }, { status: 500 })
      }
      contentId = (item as { id: string }).id
    } else {
      const { data: item, error } = await sb.from('skills')
        .upsert({ ...basePayload, ...data }, { onConflict: 'slug' })
        .select('id').single()
      if (error || !item) {
        console.error('[webhooks/sync] skill upsert', error)
        return NextResponse.json({ error: 'Failed to upsert skill' }, { status: 500 })
      }
      contentId = (item as { id: string }).id
    }

    // Add to approval queue
    const { error: queueError } = await sb.from('approval_queue').insert({
      content_type,
      content_id:           contentId,
      content_slug:         slug,
      content_title:        title,
      action,
      source_url:           source_url ?? null,
      ai_confidence:        ai_confidence ?? null,
      summary_of_changes:   summary_of_changes ?? null,
      status:               'pending',
      submitted_at:         new Date().toISOString(),
    })

    if (queueError) {
      console.error('[webhooks/sync] queue insert error', queueError)
    }

    return NextResponse.json({
      success: true,
      message: 'Item queued for review',
      content_id: contentId,
    })
  } catch (err) {
    console.error('[webhooks/sync]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
