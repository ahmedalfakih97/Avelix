'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { signIn } from './actions'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('redirect', redirect)
    startTransition(async () => {
      const result = await signIn({ error: null }, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-electromagnetic-ink flex items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Signal scan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="signal-scan" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image src="/logo.png" alt="Avelix" width={120} height={32} className="h-8 w-auto mx-auto mb-4" />
          <span className="font-mono text-[9px] text-data-dim uppercase tracking-widest block">
            [ADMIN_CONSOLE] — RESTRICTED ACCESS
          </span>
        </div>

        <div className="border border-terminal-border bg-surface-container-lowest p-8">
          {/* Header */}
          <div className="mb-6 border-b border-terminal-border pb-4">
            <span className="font-mono text-label-caps text-primary uppercase block mb-1">AUTHENTICATE</span>
            <h1 className="font-headline text-headline-md text-on-surface uppercase">Admin Login</h1>
          </div>

          {error && (
            <div className="mb-4 border border-signal-orange/40 bg-signal-orange/5 px-3 py-2">
              <p className="font-mono text-[10px] text-signal-orange uppercase">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-[9px] text-data-dim uppercase block mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                autoComplete="email"
                className="w-full bg-surface border border-terminal-border px-3 py-2.5 font-mono text-[12px] text-on-surface placeholder:text-data-dim focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                placeholder="admin@avelix.ai"
              />
            </div>

            <div>
              <label className="font-mono text-[9px] text-data-dim uppercase block mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                disabled={isPending}
                autoComplete="current-password"
                className="w-full bg-surface border border-terminal-border px-3 py-2.5 font-mono text-[12px] text-on-surface placeholder:text-data-dim focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] uppercase py-3 overflow-hidden mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
              <span className="relative z-10 group-hover:text-electromagnetic-ink transition-colors duration-300">
                {isPending ? 'AUTHENTICATING...' : 'INITIATE_LOGIN'}
              </span>
            </button>
          </form>

          <p className="font-mono text-[9px] text-data-dim uppercase mt-6 text-center">
            Access restricted to authorized personnel only
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
