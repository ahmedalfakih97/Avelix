# MobileMenu

`components/layout/MobileMenu.tsx` — `'use client'`

Hamburger button + slide-down navigation overlay for mobile viewports.

## Purpose

Keeps `Header.tsx` as a Server Component while adding the interactive toggle state needed for mobile nav. Isolated to `md:hidden` so it has zero effect on desktop.

## Props

None. Nav links are hardcoded to match the desktop nav.

## Behavior

- Renders a `menu` icon button (switches to `close` when open)
- On click, toggles a full-width nav panel below the header
- Nav panel links call `setOpen(false)` on click to close after navigation
- Entire component is `hidden` at `md:` and above

## Usage

```tsx
// Inside Header.tsx
import MobileMenu from './MobileMenu'

<MobileMenu />
```
