'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/tools',    label: 'Tools' },
  { href: '/models',   label: 'Models' },
  { href: '/skills',   label: 'Skills' },
  { href: '/guides',   label: 'Guides' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/services', label: 'Services' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-xl">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-surface border-b border-terminal-border z-40 md:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-mono text-[11px] text-on-surface-variant hover:text-primary px-4 py-3 border-b border-terminal-border uppercase tracking-wider transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="font-mono text-[11px] text-electric-teal px-4 py-3 uppercase tracking-widest"
            >
              Book a Call →
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
