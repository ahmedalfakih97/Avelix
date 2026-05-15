import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'electromagnetic-ink': '#050A14',
        'electric-teal': '#00D4B4',
        'signal-orange': '#F5A623',
        'terminal-border': '#162544',
        'data-dim': '#4A5568',
        'primary': '#46f1cf',
        'primary-container': '#00d4b4',
        'surface': '#0e131e',
        'surface-container': '#1a202a',
        'surface-container-low': '#161c26',
        'surface-container-lowest': '#080e18',
        'surface-container-high': '#242a35',
        'surface-container-highest': '#2f3540',
        'on-surface': '#dde2f1',
        'on-surface-variant': '#bacac4',
        'secondary': '#ffb955',
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '0px',
        md: '0px',
        sm: '0px',
      },
      fontFamily: {
        display:     ['var(--font-syne)', 'sans-serif'],
        headline:    ['var(--font-syne)', 'sans-serif'],
        'headline-md': ['var(--font-syne)', 'sans-serif'],
        mono:        ['var(--font-jetbrains)', 'monospace'],
        'label-caps':  ['var(--font-jetbrains)', 'monospace'],
        'data-mono':   ['var(--font-jetbrains)', 'monospace'],
        body:        ['var(--font-jakarta)', 'sans-serif'],
        'body-sm':   ['var(--font-jakarta)', 'sans-serif'],
        'body-lg':   ['var(--font-jakarta)', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-md': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'label-caps': ['11px', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
        'data-mono': ['13px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}

export default config
