# SpecBadge

**File:** `components/shared/SpecBadge.tsx`

## Props

```typescript
interface SpecBadgeProps {
  type: 'speed' | 'context' | 'open-source' | 'api' | 'model-type' | 'status' | 'input' | 'output'
  value: string
  className?: string
}
```

## Badge Types

| Type | Value examples | Notes |
|---|---|---|
| `speed` | `very_fast`, `fast`, `medium`, `slow` | Color-coded: teal/primary/secondary/orange |
| `status` | `active`, `preview`, `deprecated`, `research` | Color-coded with filled circle icon |
| `context` | `128000`, `200000`, `1000000` | Auto-formats: 128000 → "CTX: 128K" |
| `open-source` | `true`, `false` | Orange lock_open / grey lock |
| `api` | `true`, `false` | Primary/grey with api icon |
| `model-type` | `llm`, `image`, `audio`, etc. | Primary border with matching Material icon |
| `input` | `text`, `image`, `audio`, `video`, `code` | Grey border with type icon |
| `output` | same as input | Same styling as input |

## Usage

```tsx
<SpecBadge type="speed" value={model.speed} />
<SpecBadge type="context" value={String(model.context_window)} />
<SpecBadge type="model-type" value={model.model_type} />
<SpecBadge type="status" value={model.current_status} />
<SpecBadge type="open-source" value={model.is_open_source ? 'true' : 'false'} />
<SpecBadge type="api" value={model.has_api ? 'true' : 'false'} />
<SpecBadge type="input" value="text" />
<SpecBadge type="output" value="image" />
```

## Design
All badges: `font-mono text-[9px] border px-2 py-0.5 uppercase inline-flex items-center gap-1`. Material Symbols icon at `text-[11px]`.
