# LearningPathCard

## Purpose
Displays a learning path in the `/guides` index grid. Shows the path goal, audience, level, estimated hours, and module count.

## Location
`components/library/LearningPathCard.tsx`

## Props
| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| path | Pick<LearningPath, ...> | yes | — | Partial learning path with display fields |

## Variants
Single variant only. Full card with icon, level badge, title, for-field, description, and bottom stats row.

## Usage Example
```tsx
<LearningPathCard path={path} />
```

## Design Notes
- Level badge: same color system as SkillCard difficulty badges
- Icon per level: beginner=start, intermediate=trending_up, advanced=rocket_launch
- Bottom row: module count + estimated hours + arrow (arrow changes color on hover)
- who_its_for truncated at 60 chars with ellipsis

## States
- Hover: border-l-2 border-l-primary + bg-surface-container-low
- Arrow icon transitions from text-data-dim to text-primary on group hover
