'use server'

export interface ContactFormState {
  status: 'idle' | 'success' | 'error'
  message: string
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name        = String(formData.get('name') ?? '').trim()
  const business    = String(formData.get('business') ?? '').trim()
  const goal        = String(formData.get('goal') ?? '').trim()
  const budget      = String(formData.get('budget') ?? '').trim()

  if (!name || !goal) {
    return { status: 'error', message: 'Name and goal are required.' }
  }

  // Insert into Supabase leads table
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await supabase.from('leads').insert({
      name,
      business,
      goal,
      budget,
      source: 'services-page',
      created_at: new Date().toISOString(),
    })
  } catch {
    // Table may not exist yet — log silently and continue
  }

  // Send Resend notification email
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from:    'Avelix <no-reply@avelix.ai>',
        to:      ['ahmedalfakih97@gmail.com'],
        subject: `New lead from services page: ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business/Role:</strong> ${business || '—'}</p>
          <p><strong>Goal:</strong> ${goal}</p>
          <p><strong>Budget:</strong> ${budget || '—'}</p>
        `,
      })
    }
  } catch {
    // Email failure shouldn't block form success
  }

  return { status: 'success', message: 'Message received. We\'ll be in touch within 24 hours.' }
}
