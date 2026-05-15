# SkillCard

## Purpose
Displays a single AI skill in card format. Used in the skills library grid, related skills sections, and featured skill highlights.

## Location
`components/library/SkillCard.tsx`

## Props
| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| skill | Pick<Skill, ...> | yes | — | Partial skill object with display fields |
| variant | 'default' \| 'compact' \| 'featured' | no | 'default' | Card size/layout variant |

## Variants

**default** — Full card for library grids. Shows difficulty badge, estimated time, title, short description, and tag pills. Used in `/skills` index.

**compact** — Horizontal row for related skills lists. Icon + title + difficulty/time. Used in related skills sections on skill and guide pages.

**featured** — Larger card with more visual weight. Primary color border, icon at top, 3-line description, tool pills. Reserved for homepage featured sections.

## Usage Example
```tsx
<SkillCard skill={skill} variant="default" />
<SkillCard skill={skill} variant="compact" />
<SkillCard skill={skill} variant="featured" />
```

## Design Notes
- Difficulty badge uses DESIGN.md color coding: beginner=electric-teal, intermediate=signal-orange, advanced=primary
- Font patterns: title=font-headline uppercase, meta=font-mono text-[9px] uppercase, description=font-body text-body-sm
- Hover: border-l-2 border-l-primary + bg-surface-container-low (standard card hover from DESIGN.md)
- Zero border radius everywhere

## Accessibility
- Entire card is a `<Link>` — keyboard navigable
- Title changes color on hover via group-hover for visual feedback
