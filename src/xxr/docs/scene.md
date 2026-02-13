# Scene

A single immersive environment. Only the active scene renders.

## Props

| Prop                       | Type                               | Default     | Description                                      |
| -------------------------- | ---------------------------------- | ----------- | ------------------------------------------------ |
| `id`                       | `string`                           | required    | Unique scene identifier                          |
| `background`               | `BackgroundConfig`                 | —           | Asset ID, drei preset name, or HDR/EXR file path |
| `lighting`                 | `LightingPreset \| LightingConfig` | `"studio"`  | Lighting preset or custom config                 |
| `transition`               | `"none" \| "fade" \| "dissolve"`   | `"none"`    | Entry transition                                 |
| `camera`                   | `CameraConfig`                     | —           | Per-scene camera position/target/fov             |
| `orbit`                    | `OrbitConfig`                      | —           | Per-scene orbit controls override                |
| `cameraTransition`         | `"instant" \| "smooth"`            | `"instant"` | Camera transition on scene enter                 |
| `cameraTransitionDuration` | `number`                           | `0.5`       | Smooth transition duration in seconds            |

## Lighting

The `lighting` prop accepts a preset string or a custom config object:

```tsx
// Preset
<Scene lighting="outdoor" />

// Custom config
<Scene lighting={{
  ambient: 0.4,
  ambientColor: '#ffe4c4',
  directional: 0.9,
  direction: [3, 8, 2],
  shadows: { mapSize: 2048, radius: 3 },
}} />
```

## Camera & Orbit

Per-scene overrides merge with global `<XXR>` defaults:

```tsx
<XXR start="gallery" camera={{ fov: 60 }} orbit={{ maxDistance: 10 }}>
  <Scene
    id="gallery"
    camera={{ position: [0, 2, 5], target: [0, 0, 0] }}
    orbit={{ autoRotate: true, enablePan: false }}
    cameraTransition="smooth"
  >
    ...
  </Scene>
</XXR>;
```

## Background Formats

- **Asset ID**: References an `environment` asset from `<Assets>` (HDR/EXR
  loaded via `<HDR>` or `<EXR>` loaders)
- **Drei presets**: `"apartment"`, `"city"`, `"dawn"`, `"forest"`, `"lobby"`,
  `"night"`, `"park"`, `"studio"`, `"sunset"`, `"warehouse"`
- **File paths**: `/path/to/environment.hdr` or `.exr` (direct, no `<Assets>`
  needed)

## Example

```tsx
{/* Using a drei preset */}
<Scene id="intro" background="sunset" lighting="studio">
  <Panel><h1>Hello</h1></Panel>
</Scene>

{/* Using an asset ID */}
<Assets>
  <HDR id="city-env" src="/env/city.hdr" />
</Assets>
<Scene id="city" background="city-env">
  <Panel><h1>City</h1></Panel>
</Scene>
```

When `background` matches an `environment` asset ID, the loaded texture is
applied as both `scene.environment` and `scene.background`. Otherwise, it falls
through to drei presets or direct file paths.
