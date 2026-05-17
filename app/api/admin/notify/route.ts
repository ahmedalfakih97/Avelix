import { NextRequest, NextResponse } from 'next/server'

interface SyncSummaryItem {
  title: string
  content_type: 'tool' | 'model' | 'skill'
  slug: string
  ai_confidence: number
  source_url?: string
  action: 'create' | 'update'
}

interface NotifyPayload {
  queued: SyncSummaryItem[]
  rejected_count: number
  run_at: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.headers.get('x-webhook-secret')
  const expected = process.env.N8N_WEBHOOK_SECRET
  if (expected && secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: NotifyPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { queued = [], rejected_count = 0, run_at } = body
  const adminEmail = process.env.ADMIN_EMAIL
  const resendKey  = process.env.RESEND_API_KEY

  if (!adminEmail || !resendKey) {
    // Notification skipped — not configured. Not an error.
    return NextResponse.json({
      success: true,
      message: 'Notification skipped: ADMIN_EMAIL or RESEND_API_KEY not set',
    })
  }

  const runDate = run_at ? new Date(run_at).toLocaleString() : new Date().toLocaleString()

  const itemRows = queued
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #162544;font-family:monospace;font-size:12px;color:#E8F4F8;">${item.title}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #162544;font-family:monospace;font-size:12px;color:#00D4B4;text-transform:uppercase;">${item.content_type}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #162544;font-family:monospace;font-size:12px;color:#7A9BB5;">${item.action}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #162544;font-family:monospace;font-size:12px;color:${item.ai_confidence >= 90 ? '#00D4B4' : item.ai_confidence >= 70 ? '#F5A623' : '#FF5E6C'};">${item.ai_confidence}%</td>
        </tr>`
    )
    .join('\n')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#050A14;color:#E8F4F8;font-family:monospace;padding:24px;margin:0;">
  <div style="max-width:640px;margin:0 auto;">
    <h1 style="color:#00D4B4;font-size:20px;margin-bottom:4px;letter-spacing:0.05em;">AVELIX SYNC REPORT</h1>
    <p style="color:#7A9BB5;font-size:11px;margin-top:0;">${runDate}</p>

    <div style="border:1px solid #162544;padding:16px;margin:16px 0;display:flex;gap:32px;">
      <div>
        <div style="font-size:28px;color:#00D4B4;font-weight:bold;">${queued.length}</div>
        <div style="font-size:10px;color:#7A9BB5;text-transform:uppercase;">Queued for review</div>
      </div>
      <div>
        <div style="font-size:28px;color:#FF5E6C;font-weight:bold;">${rejected_count}</div>
        <div style="font-size:10px;color:#7A9BB5;text-transform:uppercase;">Rejected (low confidence)</div>
      </div>
    </div>

    ${
      queued.length > 0
        ? `<table style="width:100%;border-collapse:collapse;border:1px solid #162544;margin:16px 0;">
        <thead>
          <tr style="background:#0A1628;">
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A9BB5;text-transform:uppercase;">Title</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A9BB5;text-transform:uppercase;">Type</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A9BB5;text-transform:uppercase;">Action</th>
            <th style="padding:8px 12px;text-align:left;font-size:10px;color:#7A9BB5;text-transform:uppercase;">Confidence</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>`
        : `<p style="color:#7A9BB5;font-size:12px;">No new items discovered this run.</p>`
    }

    <a href="https://avelix.ai/admin/queue" style="display:inline-block;background:#00D4B4;color:#050A14;padding:10px 20px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;font-weight:bold;margin-top:8px;">
      Review Queue →
    </a>
  </div>
</body>
</html>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Avelix Sync <sync@avelix.ai>',
        to: [adminEmail],
        subject: `Avelix Sync: ${queued.length} item${queued.length !== 1 ? 's' : ''} queued for review`,
        html,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[notify] Resend error', res.status, text)
      return NextResponse.json({ error: 'Email send failed', detail: text }, { status: 502 })
    }

    return NextResponse.json({ success: true, sent_to: adminEmail, queued_count: queued.length })
  } catch (err) {
    console.error('[notify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
