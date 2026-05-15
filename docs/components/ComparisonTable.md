# ComparisonTable

**File:** `components/shared/ComparisonTable.tsx`

## Props

```typescript
interface ComparisonTableProps {
  rows: ComparisonRow[]     // Array of field rows
  slugs: string[]           // Ordered list of item slugs (columns)
  labels: Record<string, string>  // slug → display name
}

interface ComparisonRow {
  field: string             // Unique field key
  label: string             // Display label shown in first column
  values: Record<string, string>  // slug → cell value
  winner?: string           // Slug of the winner for this row (optional)
}
```

## Behavior
- Winner column gets: `border-l-2 border-l-primary bg-primary/5` + `check_circle` icon
- Non-winner cells: `text-on-surface-variant`
- Winner cells: `text-on-surface font-medium`
- Alternating row backgrounds: `bg-electromagnetic-ink` / `bg-surface-container-lowest`
- `overflow-x-auto` wrapper for mobile horizontal scroll
- `min-w-[480px]` on table to prevent extreme squishing

## Usage

```tsx
<ComparisonTable
  rows={comparison.comparison_rows}
  slugs={comparison.item_slugs}
  labels={{ 'gpt-4o': 'GPT-4o', 'claude-3-5-sonnet': 'Claude 3.5' }}
/>
```
