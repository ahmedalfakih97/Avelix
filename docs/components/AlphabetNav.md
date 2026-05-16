# AlphabetNav

`components/shared/AlphabetNav.tsx` — `'use client'`

A-Z button grid for jump navigation on the Glossary index page.

## Props

| Prop | Type | Description |
|---|---|---|
| `availableLetters` | `string[]` | Letters that have at least one term |
| `activeLetter` | `string \| undefined` | Letter currently in view (from IntersectionObserver) |

## Behavior

- Renders all 26 uppercase letters as 32×32px buttons
- Letters not in `availableLetters` are dimmed and non-interactive
- Active letter (scroll position) gets `bg-primary text-electromagnetic-ink` highlight
- Click smooth-scrolls to `#letter-{X}` with a 112px offset to clear the sticky header + nav bar

## Scroll Offset

```ts
const offset = 112 // header (64px) + alphabet nav (~48px)
const top = el.getBoundingClientRect().top + window.scrollY - offset
window.scrollTo({ top, behavior: 'smooth' })
```

## Usage

```tsx
<AlphabetNav availableLetters={letters} activeLetter={activeLetter} />
```
