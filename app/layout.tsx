import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import GlobalSearch from '@/components/library/GlobalSearch'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Avelix — Navigate the AI Universe', template: '%s | Avelix' },
  description: 'Find the right AI tool, learn the right skills, understand AI models — without the noise.',
  metadataBase: new URL('https://avelix.ai'),
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${syne.variable} ${jetbrainsMono.variable} ${plusJakarta.variable} font-body antialiased overflow-x-hidden`}
      >
        {children}
        <GlobalSearch />
      </body>
    </html>
  )
}
