# GlossaryTermCard

`components/library/GlossaryTermCard.tsx`

A single row in the glossary index. The entire row is a `<Link>` to the term's detail page.

## Props

| Prop | Type | Description |
|---|---|---|
| `term` | `GlossaryTerm` | Glossary term object |

## Renders

- Term title (uppercase, mono)
- `simple_definition` truncated to one line
- `north_east` arrow icon (fades in on hover via `group-hover`)

## Usage

```tsx
<GlossaryTermCard term={term} />
```

Rendered inside a `grid grid-cols-1 gap-px bg-terminal-border border border-terminal-border` container, producing bordered rows with 1px gutters.
