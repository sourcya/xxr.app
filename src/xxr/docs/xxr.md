# XXR Component

The root component that manages the entire immersive experience.

## Import

```tsx
import { XXR } from "@xxr";
```

## Props

```tsx
type XXRProps = {
  readonly start: string; // Initial scene ID
  readonly devtools?: boolean; // Enable dev overlay
  readonly withXR?: boolean; // Show Enter XR button (opt-in, default false)
  readonly withLoading?: boolean; // Show loading screen while assets load
  readonly withProgress?: boolean; // Show progress bar on loading screen
  readonly withStats?: boolean; // Show real-time stats monitor overlay
  readonly withStressTest?: boolean; // Show stress test controls + provide StressContext
  readonly shadows?: boolean | "basic" | "percentage" | "soft" | "variance";
  readonly performance?: PerformanceConfig; // DPR, frameloop, adaptive perf
  readonly camera?: CameraConfig; // Global camera defaults
  readonly orbit?: OrbitConfig; // Global orbit controls defaults
  readonly children: ReactNode; // Scene and Assets components
};
```

### Camera & Orbit Defaults

Set global camera position, FOV, and orbit behavior for all scenes:

```tsx
<XXR
  start="lobby"
  camera={{ position: [0, 2, 5], fov: 60, target: [0, 0, 0] }}
  orbit={{ maxDistance: 20, enablePan: false, autoRotate: true }}
>
  {/* Scenes can override these per-scene */}
</XXR>;
```

## Examples

### Basic Tour

```tsx
import { Assets, GLB, Hotspot, Model, Scene, XXR } from "@xxr";

export const App = () => (
  <XXR start="lobby">
    <Assets>
      <GLB id="helmet" src="/helmet.glb" />
    </Assets>

    <Scene id="lobby" background="studio">
      <Model asset="helmet" at="center" />
      <Hotspot at="right" to="gallery">Next</Hotspot>
    </Scene>

    <Scene id="gallery" background="warehouse">
      <Hotspot at="left" to="lobby">Back</Hotspot>
    </Scene>
  </XXR>
);
```

### XR-Enabled Experience

```tsx
<XXR start="lobby" withXR devtools>
  {/* Enter VR button shown when device supports XR */}
</XXR>;
```

The `withXR` prop is opt-in and defaults to `false`. The Enter VR button only
appears when `withXR` is set **and** the device supports immersive VR.

## Navigation Context

XXR provides navigation context to all children:

```tsx
import { useXXR } from "@xxr";

const MyComponent = () => {
  const {
    navigate, // (to: string, transition?: TransitionType) => void
    back, // () => void
    home, // () => void
    activeScene, // string
    playerPosition, // [x, y, z]
  } = useXXR();

  return <button onClick={() => navigate("next-scene")}>Go</button>;
};
```

## Devtools

When `devtools={true}`:

- **Perf Overlay**: FPS, draw calls, triangles, memory
- **Scene Graph**: Live 3D object hierarchy
- **Placement Grid**: Visual placement helper
- **Nav Map**: Scene navigation graph

Press **`** (backtick) to toggle devtools visibility.

See [Devtools](./devtools.md) for full details.

## Stats Monitoring

Enable a real-time stats overlay with detailed renderer metrics:

```tsx
<XXR start="lobby" withStats>
```

Shows FPS, frame time, draw calls, triangles, geometries, textures, and shader
programs in a DOM overlay. Works independently of `devtools`.

## Stress Testing

Enable built-in stress test controls:

```tsx
<XXR start="stress" withStressTest withStats>
  <Scene id="stress">
    <StressGrid asset="helmet" spacing={2.5} />
  </Scene>
</XXR>;
```

- `withStressTest` renders a controls panel with a model count slider (1–100)
  and preset buttons
- `<StressGrid>` reads the count from context and renders a grid of models
- Pair with `withStats` to see real-time performance impact

See [Stress Test](./stress-test.md) for the full guide.

## Loading

Enable a loading screen to prevent users from seeing an incomplete scene while
models load:

```tsx
<XXR start="lobby" withLoading>
  {/* Loading overlay shown until all assets finish */}
</XXR>;
```

Add a progress bar with `withProgress`:

```tsx
<XXR start="lobby" withLoading withProgress>
  <Assets>
    <GLB id="helmet" src="/helmet.glb" />
    <GLB id="duck" src="/duck.glb" />
  </Assets>
  {/* Progress bar shows 0% → 50% → 100% as each asset loads */}
</XXR>;
```

- `withLoading` — renders a dark overlay with spinner that fades out when all
  registered assets are loaded or errored
- `withProgress` — adds a progress bar and percentage to the loading overlay
- The overlay renders as an HTML sibling to the Canvas, so it works even during
  initial Suspense
- Both props default to `false`

### Custom Loading (Advanced)

For custom loading UIs, use the `useLoadingProgress` hook inside the Canvas:

```tsx
import { useLoadingProgress } from "@xxr";

const { active, progress, loaded, total, errors } = useLoadingProgress();
```

## See Also

- [Scene](./scene.md)
- [Navigation](./navigation.md)
- [Examples](./examples.md)
