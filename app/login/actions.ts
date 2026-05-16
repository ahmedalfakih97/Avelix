'use server'

import { redirect } from 'next/navigation'

const USE_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL

export async function signIn(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (USE_MOCK) {
    // Mock mode: accept any credentials for local development
    redirect('/admin')
  }

  const { createServerSupabaseClient } = await import('@/lib/supabase-server')
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid credentials. Please try again.' }
  }

  const redirectTo = formData.get('redirect') as string
  redirect(redirectTo || '/admin')
}

export async function signOut(): Promise<void> {
  if (!USE_MOCK) {
    const { createServerSupabaseClient } = await import('@/lib/supabase-server')
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()
  }
  redirect('/login')
}
