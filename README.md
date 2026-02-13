# XXR

Declarative JSX DSL for building immersive VR/web experiences — presentations,
tours, and walkthroughs — powered by React Three Fiber.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Usage

```tsx
import {
    Assets,
    Floor,
    GLB,
    HDR,
    Hero,
    Hotspot,
    Model,
    Panel,
    Scene,
    XXR,
} from "@xxr";

export const MyExperience = () => (
    <XXR as="tour" start="lobby">
        <Assets onAllLoaded={() => console.log("ready")}>
            <GLB id="helmet" src="/models/helmet.glb" />
            <GLB id="fox" src="/models/fox.glb" />
            <HDR id="city-env" src="/env/city.hdr" />
        </Assets>

        <Scene id="lobby" background="city-env">
            <Floor teleportable />
            <Model asset="helmet" at="center" scale={1.5} />
            <Hotspot at="front-right" to="park">Park</Hotspot>
        </Scene>

        <Scene id="park" background="forest">
            <Floor size={40} />
            <Hero as="third-person" character="fox" speed={3} />
            <Model asset="fox" at="center" scale={0.02} animate />
            <Panel at="front">
                <p>An animated fox</p>
            </Panel>
            <Hotspot at="back" to="lobby">Back</Hotspot>
        </Scene>
    </XXR>
);
```

## Assets DSL

Declare assets once at the top level, reference by ID everywhere:

| Loader  | Format     | Asset Type    |
| ------- | ---------- | ------------- |
| `<GLB>` | .glb/.gltf | `model`       |
| `<FBX>` | .fbx       | `model`       |
| `<DAE>` | .dae       | `model`       |
| `<TDS>` | .3ds       | `model`       |
| `<KMZ>` | .kmz       | `model`       |
| `<STL>` | .stl       | `geometry`    |
| `<PLY>` | .ply       | `geometry`    |
| `<XYZ>` | .xyz       | `points`      |
| `<HDR>` | .hdr       | `environment` |
| `<EXR>` | .exr       | `environment` |
| `<SVG>` | .svg       | `svg`         |
| `<IFC>` | .ifc       | `model`*      |

Consumers: `<Model asset="id">`, `<Scene background="id">`,
`<Hero character="id">`, `<Floor asset="id">`

## Architecture

```
Developer DSL  →  Asset Registry (ID-based)  →  Core  →  Runtime Adapter (R3F)
```

- **`src/xxr/core/`** — Types, placement resolver, context
- **`src/xxr/assets/`** — `<Assets>` registry, 12 loaders, `useAsset` hook,
  prefetch
- **`src/xxr/scene/`** — `<Scene>` (background via asset ID or drei preset)
- **`src/xxr/model/`** — `<Model>` (renders asset with placement + animation)
- **`src/xxr/hero/`** — `<Hero>` (1st/3rd person with animated character model)
- **`src/xxr/floor/`** — `<Floor>` (teleportable, optional asset-based geometry)
- **`src/xxr/panel/`** — `<Panel>` (3D UI, proximity-gated)
- **`src/xxr/interactions/`** — `<Hotspot>`, `<Gaze>`, `<Pointer>`, raycast
- **`src/xxr/navigation/`** — Scene router (navigate/back/home)
- **`src/xxr/transitions/`** — Fade, dissolve scene transitions
- **`src/xxr/presets/`** — Presentation auto-navigation preset
- **`src/xxr/devtools/`** — Perf overlay, scene graph, placement grid, nav map
- **`src/xxr/runtime/r3f/`** — R3F adapter (Canvas, XR, drei)

## Examples

| Example          | Features                                                   |
| ---------------- | ---------------------------------------------------------- |
| Presentation     | Auto-nav preset, GLB model in scene                        |
| Office Tour      | Multi-scene hotspot navigation, Floor, Models              |
| City Walkthrough | First-person WASD, animated model, teleportable floor      |
| Animated Hero    | Third-person with Fox/CesiumMan character models           |
| Multi-Format     | GLB + FBX loading, animated wolf, shared assets            |
| Devtools         | Perf overlay, scene graph, placement grid, proximity panel |

## Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start dev server              |
| `pnpm build`      | Type-check + production build |
| `pnpm test`       | Run unit tests                |
| `pnpm test:watch` | Run tests in watch mode       |

## Tests

```bash
pnpm test
```

70 tests across 7 test files (placement, router, prefetch, raycast,
normalize-scale, asset registry, loader exports).

## Routes

| Path              | Description                             |
| ----------------- | --------------------------------------- |
| `/`               | Landing page — enter an experience ID   |
| `/x/:id`          | Renders a user-level experience by UUID |
| `/xxr`            | Library showcase — example gallery      |
| `/xxr/:exampleId` | Run a specific library example          |
| `/xxr/docs`       | Library documentation                   |
| `/xxr/docs/:slug` | Individual doc page                     |

## Documentation

Full documentation is available at [/xxr/docs](/xxr/docs) when running the dev
server, or browse the source in [`src/xxr/docs/`](./src/xxr/docs/).

## License

MIT — see [LICENSE](./LICENSE)
