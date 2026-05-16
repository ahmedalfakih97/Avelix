# ContactForm

`components/pages/ContactForm.tsx` — `'use client'`

Contact/lead capture form for the Services page. Submits to a Server Action.

## Props

None. Self-contained.

## Behavior

- Fields: Name (required), Business/Role, Goal (required), Budget (select)
- On submit: calls `submitContactForm` Server Action via `useTransition`
- Shows "Transmitting..." on the button while pending
- On success: replaces form with a confirmation panel
- On error: shows an error message above the form

## Server Action

`app/services/actions.ts` — `submitContactForm`

1. Validates required fields
2. Inserts into Supabase `leads` table (silent fail if table doesn't exist)
3. Sends Resend notification email (silent fail if `RESEND_API_KEY` not set)
4. Returns `{ status: 'success' | 'error', message: string }`

## Why `useTransition` instead of `useFormState`

Next.js 14 uses React 18 where `useActionState` (React 19) and `useFormState` are not reliably available. `useState` + `useTransition` achieves the same result with zero extra dependencies.

## Usage

```tsx
import ContactForm from '@/components/pages/ContactForm'

<ContactForm />
```
