# ModelCard

**File:** `components/library/ModelCard.tsx`

Renders a single AI model entry in the models library grid or compact list.

## Props

```typescript
interface ModelCardProps {
  model: Pick<Model,
    // Core
    'slug' | 'title' | 'provider' | 'model_type' | 'short_description' |
    'context_window' | 'is_open_source' | 'has_api' | 'speed' | 'best_for' |
    'pricing_model' | 'current_status' | 'input_types' | 'output_types' |
    // Enriched (all optional — gracefully hidden if absent)
    'avelix_category' | 'pricing_tier_label' | 'has_free_tier' |
    'avg_response_latency' | 'avelix_featured' | 'popularity_tier' |
    'vision_support' | 'audio_support' | 'modality'
  >
  variant?: 'default' | 'compact' | 'featured'
}
```

## Variants

| Variant | Use Case | Layout |
|---------|----------|--------|
| `default` | Models library grid | Full card with all badges |
| `compact` | Related items, sidebars | Single row with icon, title, CTX |

## Visual Elements

### Overlay Badges (top-right, conditional)
- `avelix_featured: true` → `★ FEATURED` chip (teal border)
- `popularity_tier === 'Trending'` → `↑ TRENDING` chip (signal-orange border)

### Category Chip
- `avelix_category` → teal-tinted monospace pill below header
- Visible only when present

### Spec Row
- **Response latency** → `FAST` / `MED` / `SLOW` with color coding (teal/amber/rose); falls back to SpecBadge speed if absent
- **FREE TIER** → teal-bordered chip (shown if `has_free_tier: true`)

### Pricing Tier Colors
- Free / Open Source / Free → teal
- Budget → emerald
- Mid-Range → amber
- Premium → rose
- Unknown → hidden

### Modality Icons (14px Material Symbols)
- `vision_support` → `visibility`
- `audio_support` → `volume_up`

## Design Tokens Used

| Token | Purpose |
|-------|---------|
| `bg-electromagnetic-ink` | Card background |
| `border-terminal-border` | Card border |
| `hover:border-l-2 hover:border-l-primary` | Left accent on hover |
| `text-primary` (#00D4B4) | Featured/free tier chips |
| `text-signal-orange` | Trending chip |

Zero border radius everywhere. Material Symbols Outlined only.
