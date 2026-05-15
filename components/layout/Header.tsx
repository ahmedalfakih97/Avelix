import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/tools',    label: 'Tools' },
  { href: '/models',   label: 'Models' },
  { href: '/skills',   label: 'Skills' },
  { href: '/guides',   label: 'Guides' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/services', label: 'Services' },
]

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-terminal-border flex justify-between items-center h-16 px-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Avelix" width={120} height={32} priority className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] text-on-surface-variant hover:text-primary uppercase tracking-wider transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <Link
        href="/services"
        className="bg-transparent border border-electric-teal text-electric-teal font-mono text-[10px] px-3 py-1.5 hover:bg-electric-teal/10 transition-all uppercase tracking-widest"
      >
        Get Started
      </Link>
    </header>
  )
}
