import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as {
      queue_id: string
      content_type: string
      content_id: string
      edits?: Record<string, unknown>
    }

    const { queue_id, content_type, content_id } = body

    if (!queue_id || !content_type || !content_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
    }

    const { approveQueueItem } = await import('@/lib/queries/admin')
    await approveQueueItem(queue_id, content_type, content_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[approve]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
