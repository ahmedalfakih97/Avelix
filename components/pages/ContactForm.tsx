'use client'

import { useState, useTransition } from 'react'
import { submitContactForm, type ContactFormState } from '@/app/services/actions'

const BUDGET_OPTIONS = [
  'Under $500',
  '$500 – $2,000',
  '$2,000 – $5,000',
  '$5,000 – $10,000',
  '$10,000+',
  'Not sure yet',
]

export default function ContactForm() {
  const [state, setState] = useState<ContactFormState>({ status: 'idle', message: '' })
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await submitContactForm({ status: 'idle', message: '' }, formData)
      setState(result)
    })
  }

  if (state.status === 'success') {
    return (
      <div className="border border-primary bg-primary/5 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          <span className="font-mono text-[11px] text-primary uppercase">Transmission Received</span>
        </div>
        <p className="font-body text-body-sm text-on-surface-variant">{state.message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {state.status === 'error' && (
        <p className="font-mono text-[10px] text-signal-orange uppercase border border-signal-orange/30 px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-data-dim uppercase">Your Name *</label>
        <input
          name="name"
          required
          placeholder="FULL_NAME"
          className="bg-electromagnetic-ink border border-terminal-border px-4 py-2.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim uppercase focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-data-dim uppercase">Business / Role</label>
        <input
          name="business"
          placeholder="COMPANY_OR_ROLE"
          className="bg-electromagnetic-ink border border-terminal-border px-4 py-2.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim uppercase focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-data-dim uppercase">What Do You Want to Automate? *</label>
        <textarea
          name="goal"
          required
          rows={4}
          placeholder="DESCRIBE_YOUR_GOAL_OR_PROBLEM..."
          className="bg-electromagnetic-ink border border-terminal-border px-4 py-2.5 font-mono text-[11px] text-on-surface placeholder:text-data-dim uppercase focus:border-primary focus:outline-none transition-colors resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[9px] text-data-dim uppercase">Budget Range</label>
        <select
          name="budget"
          className="bg-electromagnetic-ink border border-terminal-border px-4 py-2.5 font-mono text-[11px] text-on-surface focus:border-primary focus:outline-none transition-colors appearance-none"
        >
          <option value="">SELECT_BUDGET_RANGE</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="relative group bg-transparent border border-electric-teal text-electric-teal font-mono text-[11px] py-3 px-6 uppercase overflow-hidden transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <span className="relative z-10">{isPending ? 'Transmitting...' : 'Send Message'}</span>
        <div className="absolute inset-0 bg-electric-teal -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-electromagnetic-ink transition-opacity duration-300 z-20 font-mono text-[11px] uppercase">
          {isPending ? 'Transmitting...' : 'Send Message'}
        </span>
      </button>
    </form>
  )
}
