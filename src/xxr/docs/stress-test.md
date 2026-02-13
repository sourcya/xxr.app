# Stress Testing

XXR includes a built-in stress test system for evaluating scene performance
under load. It lets you scale the number of rendered models in real time and
observe the effect on FPS, draw calls, and GPU memory.

## Quick Start

Enable with a single prop:

```tsx
<XXR start="stress" withStressTest withStats shadows="soft">
  <Assets>
    <GLB id="helmet" src="/models/helmet.glb" />
  </Assets>

  <Scene id="stress" lighting="studio">
    <Floor size={100} grid gridSize={2.5} />
    <StressGrid asset="helmet" spacing={2.5} />
  </Scene>
</XXR>
```

This gives you:

- A **controls panel** (top-left) with a model count slider and preset buttons
- A **stats monitor** (top-right) with real-time FPS, frame time, draw calls,
  triangles, geometries, textures, and shader programs
- A **model grid** in the scene that grows/shrinks as you adjust the count

## How It Works

### `withStressTest`

When set on `<XXR>`, this prop:

1. Creates a `StressContext` with `modelCount` state (default: 4)
2. Renders a `StressControls` DOM overlay with:
   - Slider from 1 to 100
   - Quick preset buttons: 4, 16, 36, 64, 100

The context wraps the entire `<XXR>` subtree, so any `<StressGrid>` inside will
read from it automatically.

### `withStats`

Pair with `withStressTest` to see the performance impact in real time. See
[Devtools — Stats Monitoring](./devtools.md) for details.

### `<StressGrid>`

A component that reads `modelCount` from the stress context and renders a
square grid of `<Model>` instances:

```tsx
<StressGrid asset="helmet" spacing={2.5} scale={0.6} />
```

| Prop         | Type      | Default | Description                        |
| ------------ | --------- | ------- | ---------------------------------- |
| `asset`      | `string`  | required | Asset ID to render in each cell    |
| `spacing`    | `number`  | `2.5`   | Distance between grid cells (meters) |
| `scale`      | `number`  | `0.6`   | Scale applied to each model        |
| `grounded`   | `boolean` | `true`  | Snap models to ground              |
| `castShadow` | `boolean` | `true`  | Models cast shadows                |

The grid arranges models in a square pattern centered on the origin. For
example, 16 models with spacing 2.5 creates a 4×4 grid spanning 7.5×7.5 meters.

## Recommended Test Procedure

1. Start with 4 models — establish your baseline FPS
2. Increase to 16 — watch for the first FPS dip
3. Jump to 36 then 64 — find where FPS drops below 30
4. Try 100 — stress the limits of the GPU
5. Toggle shadows off and re-test to see the shadow cost
6. Enable `performance.adaptiveDpr` to see if adaptive scaling helps

## Using the Context Directly

For custom stress test UIs, read the stress context in your own components:

```tsx
import { useStressContext } from '@xxr'

const MyControls = () => {
  const { modelCount, setModelCount } = useStressContext()

  return (
    <button onClick={() => setModelCount(modelCount + 10)}>
      Add 10 models ({modelCount} total)
    </button>
  )
}
```

## Full Example

The library includes a complete stress test example:

```tsx
import { XXR, Scene, Floor, Assets, GLB, StressGrid } from '@xxr'

export const StressTest = () => (
  <XXR
    start="stress"
    devtools
    withStats
    withStressTest
    shadows="soft"
    performance={{
      dpr: [1, 2],
      adaptiveDpr: true,
      adaptiveEvents: true,
    }}
    camera={{ position: [0, 8, 12], target: [0, 0, 0], fov: 60 }}
    orbit={{ minDistance: 3, maxDistance: 50, enableDamping: true }}
  >
    <Assets>
      <GLB id="helmet" src="/models/helmet.glb" />
    </Assets>

    <Scene
      id="stress"
      background={{ type: 'color', value: '#0a0a14' }}
      lighting={{
        ambient: 0.3,
        directional: 0.8,
        direction: [5, 10, 5],
        shadows: { enabled: true, mapSize: 2048 },
      }}
    >
      <Floor size={100} color="#1a1a2a" opacity={0.5} grid gridSize={2.5} />
      <StressGrid asset="helmet" spacing={2.5} />
    </Scene>
  </XXR>
)
```

## See Also

- [Performance](./performance.md) — optimization techniques
- [Devtools](./devtools.md) — stats monitoring details
- [Model](./model.md) — model component reference
