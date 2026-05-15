import Link from 'next/link'
import Image from 'next/image'

const LINKS = [
  { href: '/tools',    label: 'Tools' },
  { href: '/models',   label: 'Models' },
  { href: '/skills',   label: 'Skills' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/services', label: 'Services' },
  { href: '/blog',     label: 'Blog' },
]

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-terminal-border py-12 px-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Image src="/logo.png" alt="Avelix" width={96} height={24} className="h-6 w-auto opacity-60" />
        <span className="font-mono text-[10px] text-data-dim uppercase tracking-widest">
          High-Velocity Signal Layer
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-on-surface-variant hover:text-primary text-[11px] uppercase transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="border-t border-terminal-border pt-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-data-dim hover:text-primary cursor-pointer transition-colors text-xl">
            terminal
          </span>
          <span className="material-symbols-outlined text-data-dim hover:text-primary cursor-pointer transition-colors text-xl">
            rss_feed
          </span>
          <span className="material-symbols-outlined text-data-dim hover:text-primary cursor-pointer transition-colors text-xl">
            hub
          </span>
        </div>
        <p className="font-mono text-[9px] text-data-dim">
          © {new Date().getFullYear()} AVELIX // NAVIGATE THE AI UNIVERSE. avelix.ai
        </p>
      </div>
    </footer>
  )
}
