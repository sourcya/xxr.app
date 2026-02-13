# Examples

Four realistic examples demonstrating all XXR features in practical scenarios.

## Example List

### 1. Museum Tour (First-Person)

**File:** `src/xxr/examples/first-person-tour.tsx`

First-person WASD walkthrough across themed museum galleries with
proximity-activated exhibit panels.

**Scenes:** Lobby, Ancient Gallery, Nature Hall, Design Studio

**Features:**

- First-person Hero with **mouse look** (PointerLockControls) and
  **camera-relative WASD**
- `mouseSensitivity` configuration
- Proximity panels (`readable` + `near`) for exhibit info
- Teleportable floors with grid overlays
- Animated models (fox, wolf)
- Multiple lighting presets (studio, dim, outdoor)
- FBX model loading (living room backdrop)
- `grounded` and `lookAt="camera"` on models

```tsx
<XXR start="lobby">
  <Assets>
    <GLB id="helmet" src={helmetUrl} />
    <GLB id="fox" src={foxUrl} />
  </Assets>

  <Scene
    id="lobby"
    background={{ type: "preset", value: "city" }}
    lighting="studio"
  >
    <Hero as="first-person" speed={4} mouseSensitivity={0.8} />
    <Floor size={30} grid gridSize={2} />
    <Model asset="helmet" at="center" grounded />
    <Panel at="front" height="eye">Welcome</Panel>
    <Hotspot at="front-left" to="ancient">Ancient Gallery</Hotspot>
  </Scene>
</XXR>;
```

---

### 2. Wildlife Sanctuary (Third-Person)

**File:** `src/xxr/examples/third-person-tour.tsx`

Third-person character exploration with animated wildlife, character switching,
and varied environments.

**Scenes:** Entrance, Safari Zone, Observatory, Rest Area

**Features:**

- Third-person Hero with **game-like controls** (orbit camera, camera-relative
  WASD)
- **Character rotation** — model slerps to face movement direction
- **Animation state machine** — idle ↔ walk crossfade via named clips
  (`idleClip`, `walkClip`)
- **Follow camera** with configurable offset and damping
- Character switching (fox → cesium-man) between scenes
- Smooth camera transitions (`cameraTransition="smooth"`)
- Per-scene camera/orbit config
- Auto-rotate orbit in rest area
- Contact shadows on floors
- Multiple background presets

```tsx
<Scene
  id="observatory"
  camera={{ position: [0, 3, 6], target: [0, 1.5, 0], fov: 60 }}
  cameraTransition="smooth"
  cameraTransitionDuration={1.2}
>
  <Hero
    as="third-person"
    character="cesium-man"
    speed={3}
    followOffset={[0, 4, -7]}
  />
  <Model asset="helmet" at="center" scale={2} grounded lookAt="camera" />
</Scene>;
```

---

### 3. Product Launch (Multi-Slide Presentation)

**File:** `src/xxr/examples/multi-slide-presentation.tsx`

A 6-slide cinematic product presentation with transitions, auto-rotating product
views, and an interactive demo slide.

**Slides:** Title, Challenge, Solution, Features, Live Demo, Closing

**Features:**

- Linear prev/next navigation across 6 slides
- Scene transitions (fade, dissolve)
- Auto-rotating orbit for product showcase
- Smooth camera transitions with custom duration
- Color + preset backgrounds
- Proximity feature panels
- Interactive demo slide with teleportable floor and animated model
- Contact shadows

```tsx
<Scene
  id="solution"
  transition="fade"
  orbit={{ autoRotate: true, autoRotateSpeed: 1.5 }}
  cameraTransition="smooth"
>
  <Model asset="duck" at="center" scale={2} grounded lookAt="camera" />
</Scene>;
```

---

### 4. Feature Showcase (Advanced)

**File:** `src/xxr/examples/advanced-features.tsx`

Comprehensive demonstration of every DSL feature with devtools enabled.

**Scenes:** Backgrounds, Preset BG, Placement Grid, Lighting Lab, Lighting
Presets, Camera & Orbit Lab

**Features:**

- **All background types:** color, preset
- **All 9 placement slots** + all 3 heights (ground, eye, overhead)
- **Custom lighting config:** colored ambient/directional, shadows (2048px)
- **Light component:** point lights with color accents
- **Lighting presets:** studio, outdoor, dim comparison
- **Camera config:** custom position, FOV, target
- **Orbit config:** distance constraints, polar angles, damping
- **Smooth camera transitions** with custom duration
- **Contact shadows** and **floor grid**
- **Devtools** overlays
- **Error handling** callbacks (onLoad, onError, onAllLoaded)
- **Animated models** with proper disposal
- **Model lookAt** (camera, center)

```tsx
<XXR start="backgrounds" devtools>
  <Assets onAllLoaded={() => console.log('ready')}>
    <GLB id="helmet" src={url} onLoad={...} onError={...} />
  </Assets>

  <Scene
    id="lighting"
    lighting={{
      ambient: 0.2, ambientColor: '#4fc3f7',
      directional: 1.2, directionalColor: '#ff9800',
      shadows: { enabled: true, mapSize: 2048 },
    }}
  >
    <Light type="point" at={[3, 4, 0]} color="#ff6b9d" intensity={2} />
    <Model asset="helmet" at="center" castShadow receiveShadow />
  </Scene>
</XXR>
```

---

## Running Examples

### Development

```bash
pnpm dev
```

Navigate to the example selector at the root URL.

### Standalone

Each example can be used standalone:

```tsx
import { FirstPersonTour } from "@xxr/examples/first-person-tour";

<FirstPersonTour />;
```

---

## Feature Coverage Matrix

| Feature              | Museum Tour | Wildlife Sanctuary | Product Launch | Feature Showcase |
| -------------------- | :---------: | :----------------: | :------------: | :--------------: |
| First-Person Hero    |      ✓      |         -          |       -        |        -         |
| Third-Person Hero    |      -      |         ✓          |       -        |        -         |
| Mouse Look (FPS)     |      ✓      |         -          |       -        |        -         |
| Camera-Relative WASD |      ✓      |         ✓          |       -        |        -         |
| Follow Camera (TPS)  |      -      |         ✓          |       -        |        -         |
| Character Rotation   |      -      |         ✓          |       -        |        -         |
| Animation States     |      -      |         ✓          |       -        |        -         |
| Preset Backgrounds   |      ✓      |         ✓          |       ✓        |        ✓         |
| Color Backgrounds    |      -      |         -          |       ✓        |        ✓         |
| Proximity Panels     |      ✓      |         ✓          |       ✓        |        -         |
| Animated Models      |      ✓      |         ✓          |       ✓        |        ✓         |
| Teleportation        |      ✓      |         ✓          |       ✓        |        ✓         |
| Scene Transitions    |      -      |         -          |       ✓        |        ✓         |
| Camera Transitions   |      -      |         ✓          |       ✓        |        ✓         |
| Camera Config        |      -      |         ✓          |       ✓        |        ✓         |
| Orbit Config         |      -      |         ✓          |       ✓        |        ✓         |
| Auto-Rotate          |      -      |         ✓          |       ✓        |        -         |
| Lighting Presets     |      ✓      |         ✓          |       ✓        |        ✓         |
| Custom Lighting      |      -      |         -          |       -        |        ✓         |
| Light Component      |      -      |         -          |       -        |        ✓         |
| Shadows              |      -      |         -          |       ✓        |        ✓         |
| Contact Shadows      |      ✓      |         ✓          |       ✓        |        ✓         |
| Floor Grid           |      ✓      |         -          |       ✓        |        ✓         |
| FBX Loading          |      ✓      |         ✓          |       -        |        -         |
| All Placements       |      -      |         -          |       -        |        ✓         |
| Grounded Models      |      ✓      |         ✓          |       ✓        |        ✓         |
| Model lookAt         |      ✓      |         ✓          |       ✓        |        ✓         |
| Error Handling       |      -      |         -          |       -        |        ✓         |
| Devtools             |      -      |         -          |       -        |        ✓         |
| withXR               |      -      |         -          |       -        |        -         |
| Character Switching  |      -      |         ✓          |       -        |        -         |

---

## Creating Custom Examples

### Template

```tsx
import { Assets, GLB, Model, Scene, XXR } from "@xxr";
export const MyExample = () => (
  <XXR start="main">
    <Assets>
      <GLB id="my-model" src="/path/to/model.glb" />
    </Assets>

    <Scene id="main" background={{ type: "preset", value: "studio" }}>
      <Model asset="my-model" at="center" />
    </Scene>
  </XXR>
);
```

### Best Practices

1. **Use typed background configs** for clarity
2. **Add error handlers** for production assets
3. **Enable devtools** during development
4. **Use `withXR`** only when XR is needed
5. **Use meaningful scene IDs**
6. **Test all navigation paths**

---

## See Also

- [Getting Started](./getting-started.md)
- [Background Types](./background-types.md)
- [Error Handling](./error-handling.md)
- [Performance](./performance.md)
