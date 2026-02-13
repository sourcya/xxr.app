# API Reference

Complete API reference for all XXR components and utilities.

## Core Components

### `<XXR>`

Main entry point component.

```tsx
type XXRProps = {
  start: string;
  devtools?: boolean;
  withXR?: boolean;
  withLoading?: boolean;
  withProgress?: boolean;
  camera?: CameraConfig;
  orbit?: OrbitConfig;
  children: ReactNode;
};
```

### `<Scene>`

Scene container with background and lighting.

```tsx
type SceneProps = {
  id: string;
  background?: BackgroundConfig;
  lighting?: LightingPreset | LightingConfig;
  transition?: "none" | "fade" | "dissolve";
  camera?: CameraConfig;
  orbit?: OrbitConfig;
  cameraTransition?: "instant" | "smooth";
  cameraTransitionDuration?: number;
  children?: ReactNode;
};

type BackgroundConfig =
  | { type: "color"; value: string }
  | { type: "preset"; value: DreiPreset }
  | { type: "asset"; value: string }
  | { type: "file"; value: string }
  | string; // Legacy support
```

### `<Assets>`

Asset loading container.

```tsx
type AssetsProps = {
  onAllLoaded?: () => void;
  children: ReactNode;
};
```

---

## Asset Loaders

All loaders share base props:

```tsx
type AssetLoaderBaseProps = {
  id: string;
  src: string;
  onLoad?: (data: any) => void;
  onError?: (error: string) => void;
};
```

### Model Loaders

- `<GLB>` - GLTF/GLB models
- `<FBX>` - FBX models
- `<DAE>` - Collada models
- `<TDS>` - 3DS models
- `<KMZ>` - KMZ models

### Geometry Loaders

- `<STL>` - STL geometry
- `<PLY>` - PLY point clouds

### Environment Loaders

- `<HDR>` - HDR environment maps
- `<EXR>` - EXR environment maps

### Other Loaders

- `<XYZ>` - XYZ point clouds
- `<SVG>` - SVG shapes
- `<IFC>` - IFC models (stub)

---

## 3D Content Components

### `<Model>`

Render 3D models.

```tsx
type ModelProps = PlacementProps & {
  asset: string;
  scale?: number | Vec3;
  rotation?: Vec3;
  castShadow?: boolean;
  receiveShadow?: boolean;
  animate?: boolean;
  grounded?: boolean; // snap bbox bottom to floor
};

type PlacementProps = {
  at?: PlacementSlot | Vec3; // named slot OR raw coordinates
  height?: "ground" | "eye" | "overhead";
  distance?: "near" | "mid" | "far";
  offset?: Vec3; // additive offset from resolved position
  lookAt?: "camera" | "center" | Vec3; // face toward target
  /** @deprecated Use `at` with a Vec3 instead */
  position?: Vec3;
};

type PlacementSlot =
  | "front"
  | "front-left"
  | "front-right"
  | "left"
  | "right"
  | "center"
  | "back"
  | "back-left"
  | "back-right";
```

### `<Hero>`

First/third-person character.

```tsx
type HeroProps = {
  as?: "first-person" | "third-person";
  character?: string; // Asset ID for third-person
  speed?: number;
  mouseSensitivity?: number; // PointerLock look speed (first-person)
  followOffset?: Vec3; // Camera offset behind character (third-person)
  followDamping?: number; // Camera follow lerp speed (third-person)
  rotationSpeed?: number; // Character turn slerp speed (third-person)
  idleClip?: string; // Animation clip name for idle state
  walkClip?: string; // Animation clip name for walk state
  runClip?: string; // Animation clip name for run state (reserved)
};
```

### `<Floor>`

Ground plane with teleportation.

```tsx
type FloorProps = {
  asset?: string;
  size?: number;
  teleportable?: boolean;
  position?: Vec3;
  color?: string;
  opacity?: number;
  visible?: boolean; // false = invisible but still teleportable
  grid?: boolean; // show grid lines
  gridSize?: number;
  contactShadows?: boolean;
};
```

### `<Light>`

Custom light source.

```tsx
type LightProps = {
  type: "ambient" | "directional" | "point" | "spot";
  intensity?: number;
  color?: string;
  at?: PlacementSlot | Vec3;
  target?: PlacementSlot | Vec3;
  castShadow?: boolean;
  angle?: number; // spot only
  penumbra?: number; // spot only
  decay?: number; // point/spot falloff
  distance?: number;
};
```

---

## UI Components

### `<Panel>`

3D UI panel.

```tsx
type PanelProps = PlacementProps & {
  readable?: boolean;
  near?: number;
  children: ReactNode;
};
```

### `<Hotspot>`

Navigation hotspot.

```tsx
type HotspotProps = PlacementProps & {
  to: string;
  icon?: string;
  children?: ReactNode;
};
```

### `<Gaze>`

Gaze-based interaction.

```tsx
type GazeProps = PlacementProps & {
  duration?: number;
  onGaze: () => void;
  children?: ReactNode;
};
```

---

## Hooks

### `useXXR()`

Access XXR context.

```tsx
const {
  activeScene, // string
  sceneIds, // readonly string[]
  transition, // TransitionType
  navigate, // (to: string, transition?: TransitionType) => void
  back, // () => void
  home, // () => void
  playerPosition, // Vec3
  setPlayerPosition, // (pos: Vec3) => void
  devtools, // boolean
} = useXXR();
```

### `useLoadingProgress()`

Access loading progress from the asset registry. Must be used inside `<XXR>`.

```tsx
type LoadingProgress = {
  active: boolean; // true while assets are still loading
  progress: number; // 0–100 percentage
  loaded: number; // number of loaded assets
  total: number; // total registered assets
  errors: readonly string[]; // IDs of errored assets
};

const { active, progress, loaded, total, errors } = useLoadingProgress();
```

### `useAsset(id: string)`

Access asset registry entry.

```tsx
const entry = useAsset("model-id");

if (entry?.status === "loaded") {
  // entry.data contains the loaded asset
}
```

---

## Utilities

### Disposal

```tsx
import {
  disposeMaterial,
  disposeObject3D,
  disposeTexture,
} from "@xxr/utils/three-disposal";

disposeObject3D(scene);
disposeMaterial(material);
disposeTexture(texture);
```

### Throttling

```tsx
import { debounce, throttleFrames, throttleTime } from "@xxr/utils/throttle";

const throttled = throttleFrames(fn, 10);
const timeBased = throttleTime(fn, 100);
const debounced = debounce(fn, 300);
```

### Frame Budget

```tsx
import { FrameBudgetManager } from "@xxr/utils/frame-budget";

const budget = new FrameBudgetManager(8);
budget.addTask({ id: "task-1", priority: 1, execute: fn });
budget.executeFrame(deltaMs);
```

### Branded Types

```tsx
import {
  asAssetId,
  asSceneId,
  unwrapAssetId,
  unwrapSceneId,
} from "@xxr/utils/brand";

const assetId = asAssetId("my-model");
const sceneId = asSceneId("main-scene");
```

---

## Advanced Features

### Error Boundary

```tsx
import { ErrorBoundary } from '@xxr/error/boundary'

<ErrorBoundary
  fallback={<div>Error occurred</div>}
  onError={(error, info) => console.error(error)}
  resetKeys={[key]}
>
  <MyComponent />
</ErrorBoundary>
```

### LOD

```tsx
import { LOD } from "@xxr/model/lod";

<LOD
  levels={[
    { distance: 20, object: highRes },
    { distance: 50, object: midRes },
    { distance: 100, object: lowRes },
  ]}
  position={[0, 0, 0]}
  hysteresis={0.5}
/>;
```

### Asset Lifecycle

```tsx
import { AssetLifecycleManager } from "@xxr/assets/lifecycle";

const lifecycle = new AssetLifecycleManager({
  gcDelayMs: 30000,
  memoryBudgetMB: 512,
  maxCacheSize: 50,
});

lifecycle.registerAssetUsage("asset-id", "scene-id", 5);
lifecycle.setActiveScene("scene-id");
lifecycle.setInactiveScene("old-scene", (ids) => {
  // Clean up
});
```

### LRU Cache

```tsx
import { LRUCache } from "@xxr/assets/lru-cache";

const cache = new LRUCache<Texture>(100);
cache.set("key", value, 10);
const value = cache.get("key");
```

### Loading Queue

```tsx
import { LoadingQueue } from "@xxr/assets/loading-queue";

const queue = new LoadingQueue();
queue.enqueue({
  assetId: "id",
  src: "/path",
  priority: "high",
  sceneId: "scene",
});
```

### Plugins

```tsx
import type { XXRPlugin } from "@xxr/plugins/types";
import { createPluginRegistry } from "@xxr/plugins/registry";

const myPlugin: XXRPlugin = {
  name: "my-plugin",
  components: { CustomComponent },
  loaders: { "obj": OBJLoader },
  middleware: [loggingMiddleware],
  hooks: {
    onInit: () => {},
    onSceneMount: (id) => {},
    onSceneUnmount: (id) => {},
    onDestroy: () => {},
  },
};

const registry = createPluginRegistry();
registry.register(myPlugin);
```

### Navigation Middleware

```tsx
import type { NavigationMiddleware } from "@xxr/navigation/middleware";

const logger: NavigationMiddleware = (action, state, next) => {
  console.log(action);
  next(action);
};
```

### HOC

```tsx
import { withPlacement } from "@xxr/hoc/withPlacement";

const EnhancedComponent = withPlacement(MyComponent, "model");
```

---

## Type Definitions

### Core Types

```tsx
type Vec3 = [number, number, number];
type TransitionType = "none" | "fade" | "dissolve";
type ComponentType = "panel" | "hotspot" | "model" | "floor" | "hero";
```

### Camera & Orbit Types

```tsx
type CameraConfig = {
  position?: Vec3;
  target?: Vec3;
  fov?: number;
};

type OrbitConfig = {
  enabled?: boolean;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minAzimuthAngle?: number;
  maxAzimuthAngle?: number;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableDamping?: boolean;
  dampingFactor?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};
```

### Lighting Types

```tsx
type LightingPreset = "studio" | "outdoor" | "dim";

type LightingConfig = {
  ambient?: number;
  ambientColor?: string;
  directional?: number;
  directionalColor?: string;
  direction?: Vec3;
  shadows?: boolean | ShadowConfig;
};

type ShadowConfig = {
  enabled?: boolean;
  mapSize?: number;
  bias?: number;
  radius?: number;
};
```

### Asset Types

```tsx
type AssetType = "model" | "environment" | "geometry" | "points" | "svg";
type AssetStatus = "loading" | "loaded" | "error";

type AssetRegistryEntry = {
  id: string;
  type: AssetType;
  status: AssetStatus;
  data: any;
  error?: string;
};
```

---

## See Also

- [Getting Started](./getting-started.md)
- [Examples](./examples.md)
- [XXR Component](./xxr.md)
