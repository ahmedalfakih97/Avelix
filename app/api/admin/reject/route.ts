import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { queue_id: string; reason: string }
    const { queue_id, reason } = body

    if (!queue_id) {
      return NextResponse.json({ error: 'Missing queue_id' }, { status: 422 })
    }

    const { rejectQueueItem } = await import('@/lib/queries/admin')
    await rejectQueueItem(queue_id, reason ?? 'No reason provided')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[reject]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
