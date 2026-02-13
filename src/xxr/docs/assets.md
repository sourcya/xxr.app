# Assets

Declarative asset loading via the `<Assets>` DSL. Assets are declared at the top
level (sibling to `<Scene>`) and referenced by ID throughout the experience.

## Architecture

`<Assets>` is a **load-only** container. Each child loader gets an `id` prop and
registers the loaded Three.js object in an ID-based registry. Consumer
components (`<Model>`, `<Scene>`, `<Hero>`, `<Floor>`) look up assets by ID via
the `useAsset(id)` hook.

## Usage

```tsx
import { XXR, Scene, Model, Floor, Hero, Assets, GLB, FBX, HDR } from '@xxr'

<XXR start="lobby">
  <Assets onAllLoaded={() => console.log('ready')}>
    <GLB id="helmet" src="/models/helmet.glb" />
    <GLB id="fox" src="/models/fox.glb" />
    <FBX id="room" src="/models/room.fbx" />
    <HDR id="city-env" src="/env/city.hdr" />
  </Assets>

  <Scene id="lobby" background="city-env">
    <Model asset="helmet" at="center" scale={1.5} />
    <Model asset="fox" at="right" scale={0.02} animate />
    <Hero as="third-person" character="fox" />
    <Floor />
  </Scene>
</XXR>
```

## Supported Formats

| Component | Format     | Three.js Loader | Asset Type    |
| --------- | ---------- | --------------- | ------------- |
| `<GLB>`   | .glb/.gltf | GLTFLoader      | `model`       |
| `<FBX>`   | .fbx       | FBXLoader       | `model`       |
| `<DAE>`   | .dae       | ColladaLoader   | `model`       |
| `<TDS>`   | .3ds       | TDSLoader       | `model`       |
| `<KMZ>`   | .kmz       | KMZLoader       | `model`       |
| `<STL>`   | .stl       | STLLoader       | `geometry`    |
| `<PLY>`   | .ply       | PLYLoader       | `geometry`    |
| `<XYZ>`   | .xyz       | XYZLoader       | `points`      |
| `<HDR>`   | .hdr       | RGBELoader      | `environment` |
| `<EXR>`   | .exr       | EXRLoader       | `environment` |
| `<SVG>`   | .svg       | SVGLoader       | `svg`         |
| `<IFC>`   | .ifc       | IFCLoader*      | `model`       |

\* IFC requires `web-ifc-three` package (not included by default).

## Loader Props

All loaders accept `AssetLoaderBaseProps`:

| Prop      | Type                     | Description                           |
| --------- | ------------------------ | ------------------------------------- |
| `id`      | `string`                 | **Required.** Unique asset identifier |
| `src`     | `string`                 | **Required.** URL or import path      |
| `onLoad`  | `() => void`             | Called when asset finishes loading    |
| `onError` | `(error: Error) => void` | Called on load failure                |

## Consumer Props

- `<Scene background="asset-id">` — References an `environment` asset
- `<Model asset="asset-id">` — Renders a loaded model with placement + animation
- `<Hero character="asset-id">` — Uses a model as third-person character
- `<Floor asset="asset-id">` — Uses a model as custom floor geometry

## Hooks

- `useAsset(id)` — Returns `AssetRegistryEntry | undefined`

## Modules

### `loader.ts` — Asset Tracker (legacy)

### `manifest.ts` — Asset Manifest Builder

### `prefetch.ts` — Prefetch Heuristics (priority-based by scene proximity)
