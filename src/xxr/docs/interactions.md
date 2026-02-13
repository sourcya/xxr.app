# Interactions

All interaction methods decoupled into a single domain.

## Hotspot

Navigation anchor placed semantically in 3D space. Children are the label text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string` | required | Target scene ID |
| `at` | `PlacementSlot` | `"front"` | Semantic position |
| `icon` | `string` | — | Optional icon before label |
| `position` | `[x, y, z]` | — | Escape hatch |

### Example

```tsx
<Hotspot at="front-right" to="next-scene">Next</Hotspot>
```

## Planned (Phase 2)

- **Raycast** — Raycast-based intersection detection
- **Gaze** — Dwell/timer activation (look at target for N seconds)
- **Pointer** — VR controller + mouse/touch input
