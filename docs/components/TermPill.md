# TermPill

`components/shared/TermPill.tsx`

A compact pill-shaped link to a related glossary term.

## Props

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Display name of the term |
| `slug` | `string` | URL slug — links to `/glossary/{slug}` |

## Appearance

`border border-terminal-border text-data-dim` at rest → `border-primary text-primary` on hover. Includes a `north_east` icon at 10px.

## Usage

```tsx
<TermPill title={t.title} slug={t.slug} />
```

Rendered inside a `flex flex-wrap gap-2` container on term detail pages.
