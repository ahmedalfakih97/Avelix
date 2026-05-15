# ModelCard

**File:** `components/library/ModelCard.tsx`

## Props

```typescript
interface ModelCardProps {
  model: Pick<Model,
    'slug' | 'title' | 'provider' | 'model_type' | 'short_description' |
    'context_window' | 'is_open_source' | 'has_api' | 'speed' | 'best_for' |
    'pricing_model' | 'current_status' | 'input_types' | 'output_types'
  >
  variant?: 'default' | 'compact' | 'featured'
}
```

## Variants

### `default`
Full card with: provider icon + abbr, model-type badge, status badge, title, description, spec badges (context, speed, open-source, api), input→output type strip.

### `compact`
Minimal row: icon, title, provider, context window. Used in related-items lists and sidebars.

### `featured`
Falls back to `default` (same layout, reserved for future differentiation).

## Design Patterns
- `hover:border-l-2 hover:border-l-primary` — left border accent on hover
- `hover:bg-surface-container-low` — subtle background lift on hover
- All text: `font-mono uppercase` for metadata, `font-headline uppercase` for title
- Provider abbreviation: `PROVIDER_ABBR` map (OAI, ANT, GGL, META, MST, STA, COH)
- Context window formatting: `formatCtx()` — 128000 → "128K", 1000000 → "1M"
- Uses `SpecBadge` for all badge types

## Usage

```tsx
// In a grid
<ModelCard model={model} variant="default" />

// In a sidebar/list
<ModelCard model={model} variant="compact" />
```
