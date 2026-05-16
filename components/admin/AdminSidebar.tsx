'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { signOut } from '@/app/login/actions'

interface NavItem {
  href: string
  label: string
  icon: string
  badge?: number
}

interface AdminSidebarProps {
  pendingCount?: number
}

export default function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const navItems: NavItem[] = [
    { href: '/admin',          label: 'Dashboard',      icon: 'dashboard'  },
    { href: '/admin/queue',    label: 'Queue',          icon: 'pending_actions', badge: pendingCount },
    { href: '/admin/tools',    label: 'Tools',          icon: 'construction'    },
    { href: '/admin/models',   label: 'Models',         icon: 'memory'          },
    { href: '/admin/skills',   label: 'Skills',         icon: 'school'          },
    { href: '/admin/sources',  label: 'Sources',        icon: 'rss_feed'        },
    { href: '/admin/settings', label: 'Settings',       icon: 'settings'        },
  ]

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <aside className="flex flex-col h-full bg-surface-container-lowest border-r border-terminal-border w-56 flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-terminal-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Avelix" width={90} height={24} className="h-6 w-auto" />
        </Link>
        <span className="font-mono text-[8px] text-data-dim uppercase block mt-1 tracking-widest">
          [ADMIN_CONSOLE]
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <ul className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 font-mono text-[10px] uppercase transition-all ${
                    isActive
                      ? 'text-primary bg-primary/5 border-l-2 border-primary pl-[10px]'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-l-2 border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-signal-orange text-electromagnetic-ink font-mono text-[8px] px-1.5 py-0.5 min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* View site + logout */}
      <div className="border-t border-terminal-border p-3 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 font-mono text-[9px] text-data-dim uppercase hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-2 font-mono text-[9px] text-data-dim uppercase hover:text-signal-orange transition-colors disabled:opacity-50 text-left"
        >
          <span className="material-symbols-outlined text-[14px]">logout</span>
          {isPending ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
