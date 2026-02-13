# Performance Optimization

XXR is designed for smooth real-time 3D in the browser. This guide covers every
built-in optimization and best practice for keeping your experience fast.

---

## Canvas Performance Config

The `performance` prop on `<XXR>` controls renderer-level optimizations:

```tsx
<XXR
  start="lobby"
  shadows="soft"
  performance={{
    dpr: [1, 2],
    frameloop: 'always',
    adaptiveDpr: true,
    adaptiveEvents: true,
    minDpr: 0.5,
  }}
>
```

### PerformanceConfig

| Prop             | Type                              | Default    | Description                                            |
| ---------------- | --------------------------------- | ---------- | ------------------------------------------------------ |
| `dpr`            | `number \| [min, max]`            | `[1, 2]`   | Device pixel ratio clamp — prevents 3× retina overhead |
| `frameloop`      | `"always" \| "demand" \| "never"` | `"always"` | `"demand"` only renders when state changes             |
| `adaptiveDpr`    | `boolean`                         | `false`    | Auto-reduce pixel density when FPS drops               |
| `adaptiveEvents` | `boolean`                         | `false`    | Pause raycasting during performance dips               |
| `minDpr`         | `number`                          | `0.5`      | Floor for adaptive DPR regression                      |

### Shadows

The `shadows` prop on `<XXR>` configures shadow map quality:

```tsx
<XXR shadows="soft">
```

| Value            | Quality / Cost              |
| ---------------- | --------------------------- |
| `false`          | No shadows (fastest)        |
| `true`/`"basic"` | Hard shadows, low cost      |
| `"percentage"`   | Soft edges, moderate cost   |
| `"soft"`         | Smooth shadows, higher cost |
| `"variance"`     | Very smooth, highest cost   |

### WebGL Renderer Defaults

XXR automatically configures the WebGL renderer for performance:

- `powerPreference: "high-performance"` — forces discrete GPU on dual-GPU
  laptops
- `stencil: false` — saves framebuffer memory (stencil buffer not needed)
- `antialias: true` — enabled by default for visual quality
- `depth: true` — required for 3D rendering

---

## DRACO & Meshopt Compression

XXR's `<GLB>` loader uses drei's `useGLTF`, which automatically detects and
decompresses DRACO and Meshopt compressed models. No configuration needed.

```tsx
<Assets>
  {/* Works with plain, DRACO-compressed, or Meshopt-compressed GLB files */}
  <GLB id="building" src="/models/building.glb" />
</Assets>;
```

**Impact**: DRACO can reduce geometry size by **90%+**, dramatically cutting
download time and initial parse cost for heavy models.

To compress your models:

```bash
# DRACO compression via gltf-transform
npx @gltf-transform/cli optimize input.glb output.glb --compress draco

# Meshopt compression
npx @gltf-transform/cli optimize input.glb output.glb --compress meshopt
```

---

## Throttling Utilities

### Frame-Based Throttling

Execute expensive operations every N frames:

```tsx
import { throttleFrames } from "@xxr/utils/throttle";
import { useFrame } from "@react-three/fiber";

const MyComponent = () => {
  const throttledUpdate = throttleFrames(() => {
    console.log("Updated every 10 frames");
  }, 10);

  useFrame(() => {
    throttledUpdate();
  });
};
```

### Time-Based Throttling

```tsx
import { throttleTime } from "@xxr/utils/throttle";

const handleMouseMove = throttleTime((e) => {
  updateRaycast(e);
}, 100); // Max once per 100ms
```

### Debouncing

```tsx
import { debounce } from "@xxr/utils/throttle";

const handleResize = debounce(() => {
  recalculateLayout();
}, 300);
```

---

## Level of Detail (LOD)

Render different quality models based on camera distance. The LOD component
switches visibility directly on the Three.js objects — no React re-renders.

```tsx
import { LOD } from "@xxr/model/lod";

<LOD
  levels={[
    { distance: 20, object: highPolyScene },
    { distance: 50, object: midPolyScene },
    { distance: 100, object: lowPolyScene },
  ]}
  position={[10, 0, 10]}
  hysteresis={0.5}
/>;
```

| Prop         | Type         | Default   | Description                                   |
| ------------ | ------------ | --------- | --------------------------------------------- |
| `levels`     | `LODLevel[]` | required  | Distance thresholds + Object3D per level      |
| `position`   | `Vec3`       | `[0,0,0]` | World position of the LOD group               |
| `hysteresis` | `number`     | `0.1`     | Distance change threshold to avoid flickering |

---

## Frame Budget Manager

Spread expensive work across multiple frames to stay within a target frame time:

```tsx
import { FrameBudgetManager } from "@xxr/utils/frame-budget";

const budgetManager = new FrameBudgetManager(8); // 8ms budget per frame

budgetManager.addTask({
  id: "compute-pathfinding",
  priority: 1,
  execute: () => {/* expensive work */},
});

useFrame((_, delta) => {
  budgetManager.executeFrame(delta * 1000);
});
```

---

## Memory Management

### Asset Lifecycle

Automatic garbage collection of unused assets:

```tsx
import { AssetLifecycleManager } from "@xxr/assets/lifecycle";

const lifecycle = new AssetLifecycleManager({
  gcDelayMs: 30000, // GC after 30s of inactivity
  memoryBudgetMB: 512, // 512MB budget
  maxCacheSize: 50, // Max 50 cached assets
});

lifecycle.registerAssetUsage("model-id", "scene-id");
lifecycle.setActiveScene("current-scene");
lifecycle.setInactiveScene("old-scene", (assetIds) => {
  assetIds.forEach((id) => registry.remove(id));
});
```

### LRU Cache

Least-recently-used cache for textures, geometries, or any resource:

```tsx
import { LRUCache } from "@xxr/assets/lru-cache";

const cache = new LRUCache<Texture>(100);
cache.set("texture-1", texture, 5);
const tex = cache.get("texture-1");
```

### Resource Disposal

XXR automatically disposes cloned scenes. For custom resources:

```tsx
import { disposeObject3D } from "@xxr/utils/three-disposal";

useEffect(() => {
  return () => disposeObject3D(myCustomObject);
}, [myCustomObject]);
```

---

## React Re-render Best Practices

Avoid triggering React re-renders inside the frame loop. XXR follows these
patterns internally:

### Use Refs in useFrame

```tsx
// Bad — triggers re-render every frame
const [value, setValue] = useState(0);
useFrame(() => setValue((prev) => prev + 1));

// Good — mutate ref, update DOM directly
const ref = useRef(0);
useFrame(() => {
  ref.current++;
});
```

### Stable useSyncExternalStore Snapshots

Return the same object reference when data hasn't changed:

```tsx
const prevRef = useRef(initialValue);
useSyncExternalStore(subscribe, () => {
  const next = computeSnapshot();
  if (shallowEqual(prevRef.current, next)) return prevRef.current;
  prevRef.current = next;
  return next;
});
```

### Stable useMemo Dependencies

Track the underlying data, not wrapper objects:

```tsx
// Bad — re-clones whenever entry wrapper changes
const scene = useMemo(() => extractScene(entry), [entry]);

// Good — only re-clones when actual data changes
const rawData = entry?.status === "loaded" ? entry.data : null;
const scene = useMemo(() => extractScene(rawData), [rawData]);
```

---

## Build Optimization

XXR's Vite config includes manual chunk splitting for optimal caching and
parallel loading:

```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'three': ['three'],
        'r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/xr'],
        'react-vendor': ['react', 'react-dom'],
      },
    },
  },
  target: 'esnext',
  minify: 'esbuild',
}
```

This separates the large Three.js bundle (~500KB) from the React runtime and R3F
libraries, enabling independent cache invalidation.

---

## General Best Practices

### Memoize Expensive Computations

```tsx
const position = useMemo(
  () => resolvePosition(undefined, at, distance, height, "model"),
  [at, distance, height],
);
```

### Use Instancing for Repeated Geometry

```tsx
import { Instances, Instance } from '@react-three/drei'

<Instances geometry={boxGeometry} material={material}>
  {positions.map((pos, i) => (
    <Instance key={i} position={pos} />
  ))}
</Instances>
```

### Conditional Rendering

Only render what's visible:

```tsx
const { activeScene } = useXXR();
{
  activeScene === "gallery" && <Model asset="expensive-sculpture" />;
}
```

---

## Performance Monitoring

### Devtools Overlay

```tsx
<XXR start="lobby" devtools>
```

Shows FPS, draw calls, triangles, and memory inside the 3D viewport.

### Stats Monitor

```tsx
<XXR start="lobby" withStats>
```

Detailed DOM overlay with FPS, frame time, draw calls, triangles, geometries,
textures, and shader programs. See [Devtools](./devtools.md) for details.

### Stress Testing

```tsx
<XXR start="stress" withStressTest withStats>
```

Adjustable model count with real-time performance tracking. See
[Stress Test](./stress-test.md).

---

## See Also

- [Devtools](./devtools.md) — overlay tools and stats monitoring
- [Stress Test](./stress-test.md) — load testing guide
- [Lifecycle Management](./lifecycle.md)
- [Assets](./assets.md)
- [Concepts](./concepts.md) — foundational 3D concepts
