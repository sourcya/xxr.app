# Devtools

XXR ships with built-in development tools that overlay real-time diagnostics on
your scene. Enable them with a single prop:

```tsx
<XXR start="lobby" devtools>
```

## Built-in Overlays

When `devtools` is enabled, four tools activate automatically inside the canvas:

### PerfOverlay

Displays real-time renderer metrics in the upper area of the 3D viewport:

- **FPS** — frames per second
- **Draw Calls** — number of WebGL draw commands per frame
- **Triangles** — total triangle count being rendered
- **Geom+Tex** — number of geometries and textures in GPU memory

The overlay updates once per second using direct DOM mutation (no React
re-renders).

### SceneGraph

A live tree view of every Three.js object in the scene. Useful for debugging
unexpected nodes, verifying model structure, and checking that disposal is
working.

### PlacementGrid

A visual wireframe grid showing the semantic placement slots (`center`,
`front-left`, etc.) and their resolved 3D positions. Helps verify that `at`
props are placing objects where you expect.

### NavMap

A 2D graph overlay showing all scenes and their navigation connections
(hotspots). Useful for verifying that the scene graph is fully connected.

---

## Stats Monitoring (`withStats`)

For more detailed performance monitoring — especially outside of devtools mode —
use the `withStats` prop:

```tsx
<XXR start="lobby" withStats>
```

This automatically:

1. Renders a **StatsCollector** inside the canvas (headless, uses `useFrame`)
2. Renders a **StatsMonitor** as a DOM overlay in the top-right corner

### RendererStats

Both components share the `RendererStats` type:

```tsx
type RendererStats = {
  fps: number        // Frames per second
  frameTime: number  // Average frame time in ms
  drawCalls: number  // Draw calls per frame
  triangles: number  // Triangles rendered
  geometries: number // Geometries in GPU memory
  textures: number   // Textures in GPU memory
  programs: number   // Active shader programs
}
```

### Using Components Directly

You can also use `StatsCollector` and `StatsMonitor` as standalone components
for custom layouts:

```tsx
import { StatsCollector, StatsMonitor, EMPTY_STATS, type RendererStats } from '@xxr'
import { useState, useCallback } from 'react'

const App = () => {
  const [stats, setStats] = useState<RendererStats>(EMPTY_STATS)
  const handleStats = useCallback((s: RendererStats) => setStats(s), [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <StatsMonitor stats={stats} title="My Monitor" position="bottom-left" />
      <XXR start="lobby">
        <Scene id="lobby">
          <StatsCollector onStats={handleStats} interval={1000} />
        </Scene>
      </XXR>
    </div>
  )
}
```

### StatsCollector Props

| Prop       | Type                              | Default | Description                     |
| ---------- | --------------------------------- | ------- | ------------------------------- |
| `onStats`  | `(stats: RendererStats) => void`  | required | Callback with fresh stats       |
| `interval` | `number`                          | `500`   | Reporting interval in ms        |

### StatsMonitor Props

| Prop       | Type                                                        | Default          | Description              |
| ---------- | ----------------------------------------------------------- | ---------------- | ------------------------ |
| `stats`    | `RendererStats`                                             | required         | Stats to display         |
| `title`    | `string`                                                    | `"Stats Monitor"` | Panel title              |
| `position` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | `"top-right"`    | Overlay position         |

---

## Combining Devtools and Stats

You can enable both for maximum visibility during development:

```tsx
<XXR start="lobby" devtools withStats>
```

- `devtools` gives you the in-canvas PerfOverlay, SceneGraph, PlacementGrid,
  NavMap
- `withStats` gives you the detailed DOM overlay with frame time, shader
  programs, etc.

---

## See Also

- [Performance](./performance.md)
- [Stress Test](./stress-test.md)
- [XXR Component](./xxr.md)
