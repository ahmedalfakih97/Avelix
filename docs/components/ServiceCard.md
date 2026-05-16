# ServiceCard

`components/shared/ServiceCard.tsx`

A card for a single AI service offering on the Services page.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `service.title` | string | yes | Service name |
| `service.description` | string | yes | What the service does |
| `service.who_its_for` | string | yes | Target persona |
| `service.icon` | string | yes | Material Symbols icon name |
| `service.slug` | string | yes | URL slug (for future individual service pages) |
| `service.index` | number | yes | Position in the grid (1-13), shown as zero-padded number |

## Design

Follows the Standard Card pattern from DESIGN.md: `border border-terminal-border hover:border-l-2 hover:border-primary`. Icon is in a `bg-surface-container` square. Index number appears in top-right as `text-data-dim`.

## Usage

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
  {SERVICES.map((service) => (
    <ServiceCard key={service.slug} service={service} />
  ))}
</div>
```
