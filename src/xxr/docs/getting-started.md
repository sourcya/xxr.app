# Getting Started with XXR

## Installation

```bash
pnpm add @xxr
```

## Quick Start

```tsx
import {
  Assets,
  Floor,
  GLB,
  Hero,
  Hotspot,
  Model,
  Panel,
  Scene,
  XXR,
} from "@xxr";

export const MyExperience = () => (
  <XXR start="intro">
    <Assets>
      <GLB id="product" src="/models/product.glb" />
    </Assets>

    <Scene id="intro" background="sunset">
      <Panel>
        <h1>Welcome</h1>
      </Panel>
      <Model asset="product" at="center" scale={1.5} />
      <Hotspot at="front-right" to="next">Next</Hotspot>
    </Scene>

    <Scene id="next" background="warehouse">
      <Floor teleportable />
      <Hero as="first-person" />
      <Panel>
        <h2>Explore</h2>
      </Panel>
      <Hotspot at="back" to="intro">Back</Hotspot>
    </Scene>
  </XXR>
);
```

## Assets DSL

Declare assets at the top level with `<Assets>`, reference them by `id` in
scenes:

```tsx
<Assets>
  <GLB id="fox" src="/models/fox.glb" />
  <HDR id="env" src="/env/city.hdr" />
</Assets>

<Scene id="world" background="env">
  <Model asset="fox" at="center" animate />
  <Hero as="third-person" character="fox" />
</Scene>
```

Supported formats: GLB, FBX, DAE, 3DS, KMZ, STL, PLY, XYZ, HDR, EXR, SVG, IFC.

## Semantic Placement

Use `at` instead of coordinates:

```
           front
      front-left  front-right
left       center       right
      back-left   back-right
           back
```

Override with `distance="near|mid|far"` and `height="ground|eye|overhead"`.

Escape hatch: `position={[x, y, z]}` is always available.
