import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const secret     = process.env.N8N_WEBHOOK_SECRET

  if (!webhookUrl) {
    return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-webhook-secret': secret } : {}),
      },
      body: JSON.stringify({ trigger: 'manual', timestamp: new Date().toISOString() }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `n8n responded with ${res.status}` }, { status: 502 })
    }

    return NextResponse.json({ success: true, message: 'Sync triggered successfully' })
  } catch (err) {
    console.error('[sync/trigger]', err)
    return NextResponse.json({ error: 'Failed to reach n8n webhook' }, { status: 502 })
  }
}
