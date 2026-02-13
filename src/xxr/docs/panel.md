# Panel

Floating UI content in 3D space. Children are rendered as HTML, billboarded to face the user.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `at` | `PlacementSlot` | `"front"` | Semantic position |
| `height` | `"ground" \| "eye" \| "overhead"` | `"eye"` | Height override |
| `distance` | `"near" \| "mid" \| "far"` | `"mid"` | Distance override |
| `position` | `[x, y, z]` | — | Escape hatch for exact coordinates |
| `readable` | `boolean` | `false` | Proximity-gated visibility (Phase 2) |
| `near` | `number` | — | Distance in meters for proximity trigger |

## Example

```tsx
<Panel at="front">
  <h1>Welcome</h1>
  <p>Content rendered in 3D space</p>
</Panel>
```
