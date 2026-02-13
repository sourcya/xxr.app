# Core Concepts

Before building with XXR, it helps to understand the foundational ideas behind
immersive 3D experiences. This page explains each concept in plain language so
you can build a mental model of how everything fits together.

---

## The Immersive Realm

An **immersive realm** is a 3D space that a person can look around, move
through, and interact with. Think of it as a virtual room — or a series of
connected rooms — rendered in real time inside the browser. XXR lets you
describe these rooms declaratively, the same way you write HTML for a web page.

---

## Scenes

A **scene** is a single environment — one room, one view, one moment. Your
experience is made of one or more scenes. Only the active scene is rendered at a
time. Moving between scenes is called **navigation**.

```tsx
<Scene id="lobby" background="sunset" lighting="studio">
  {/* Everything in this block belongs to the lobby scene */}
</Scene>
```

Think of scenes like slides in a presentation or rooms in a building. Each scene
can have its own background, lighting, camera angle, and content.

---

## Camera

The **camera** is the viewer's eye. It defines *where* you are looking from and
*what* you can see. Key properties:

- **Position** — the 3D coordinates `[x, y, z]` of the camera. By convention,
  `y` is up, `z` points toward the viewer, and `x` is left-right.
- **Target** — the point the camera looks at. Changing the target rotates the
  view.
- **FOV (Field of View)** — how wide the camera sees, in degrees. A lower FOV
  zooms in; a higher FOV gives a wider, more panoramic view. Typical values are
  50–80.

```tsx
<XXR start="room" camera={{ position: [0, 1.6, 3], target: [0, 1, 0], fov: 60 }}>
```

`[0, 1.6, 3]` puts the camera roughly at human eye height (1.6 m) and 3 m back
from center — a comfortable default.

---

## Orbit Controls

**Orbit controls** let the user rotate, zoom, and pan the camera around a
target point by clicking and dragging. Imagine holding a camera on an invisible
arm and swinging it around a subject.

| Term            | What it does                                     |
| --------------- | ------------------------------------------------ |
| **Rotate**      | Drag to swing the camera around the target       |
| **Zoom**        | Scroll to move closer or farther                 |
| **Pan**         | Right-drag to slide the entire view sideways     |
| **Damping**     | Smooth deceleration after you release the mouse  |
| **Auto-rotate** | Camera slowly circles the target hands-free      |
| **Polar angle** | Limits how far you can look up or down           |
| **Azimuth**     | Limits how far you can swing left or right       |

```tsx
<XXR orbit={{ maxDistance: 15, enablePan: false, autoRotate: true }}>
```

---

## Lighting

Without light, nothing is visible. Lighting in 3D works like studio
photography — you position lights to shape mood, highlight details, and cast
shadows.

### Light Types

| Type            | Behavior                                                     |
| --------------- | ------------------------------------------------------------ |
| **Ambient**     | Uniform glow everywhere. No direction, no shadows.           |
| **Directional** | Parallel rays from infinitely far away, like sunlight.       |
| **Point**       | Radiates in all directions from a single position, like a bulb. |
| **Spot**        | Cone-shaped beam from a point toward a target, like a flashlight. |

### Presets

XXR ships with quick presets so you don't have to dial every setting:

| Preset     | Feel                                 |
| ---------- | ------------------------------------ |
| `"studio"` | Bright, even, neutral — product shots |
| `"outdoor"`| Warm directional sun + soft ambient  |
| `"dim"`    | Low ambient, moody atmosphere        |

```tsx
<Scene lighting="outdoor" />

<Scene lighting={{ ambient: 0.3, directional: 0.8, direction: [5, 10, 5] }} />
```

### Shadows

Shadows ground objects in the scene and add depth. Enabling them costs
performance, so XXR gives you control:

```tsx
<XXR shadows="soft">
```

| Mode           | Quality vs Cost |
| -------------- | --------------- |
| `true`/`"basic"` | Fast, hard edges |
| `"percentage"` | Soft edges, moderate cost |
| `"soft"`       | Smooth, higher cost |
| `"variance"`   | Very smooth, highest cost |

---

## Placement & Spacing

**Placement** is how you position objects in the scene. XXR offers two
approaches:

### Semantic Slots

Named positions on an invisible clock-like grid:

```
           front
      front-left  front-right
left       center       right
      back-left   back-right
           back
```

Each slot can be refined with **distance** (`near`, `mid`, `far`) and
**height** (`ground`, `eye`, `overhead`).

```tsx
<Model asset="vase" at="front-right" distance="near" height="ground" />
```

### Raw Coordinates

For precise control, pass a `[x, y, z]` tuple:

```tsx
<Model asset="vase" at={[2.5, 0, -1.0]} />
```

### Offset

Add a small nudge to any placement:

```tsx
<Model asset="vase" at="center" offset={[0, 0.5, 0]} />
```

### Spacing

When placing many objects (e.g., a grid of products), **spacing** is the
distance between each item's center. A spacing of `2.5` means each object is
2.5 meters apart.

---

## Floor

The **floor** is the ground plane of your scene. It serves multiple purposes:

- **Visual ground** — a colored or textured surface
- **Grid overlay** — optional reference grid for alignment
- **Teleport target** — in VR mode, the user can point at the floor to teleport
- **Contact shadows** — subtle shadows where objects meet the ground

```tsx
<Floor size={20} color="#1a1a2a" grid gridSize={2} contactShadows />
```

The floor also tells the rest of the system where "ground level" is, so
`<Model grounded>` can snap its bottom edge to the correct height.

---

## Models

A **model** is a 3D object loaded from a file (GLB, FBX, etc.). Models are the
main visual content of your experience.

```tsx
<Assets>
  <GLB id="chair" src="/models/chair.glb" />
</Assets>

<Model asset="chair" at="center" scale={1.2} grounded castShadow />
```

Key concepts:

- **Scale** — multiplier for the model's size. `1` is original, `0.5` is half,
  `2` is double.
- **Grounded** — snaps the bottom of the model to the floor, regardless of how
  the artist set the origin.
- **Animate** — plays all animation clips embedded in the file.
- **lookAt** — orients the model toward a target: `"camera"` (always faces you),
  `"center"`, or a `[x, y, z]` point.

---

## Hero (Player Character)

The **hero** is the user's avatar in the scene. XXR supports two movement modes:

### First-Person

The camera *is* the player. Mouse look rotates the view, WASD keys move the
camera through the scene. This feels like a walking tour.

```tsx
<Hero as="first-person" speed={3} mouseSensitivity={0.002} />
```

- The cursor locks to the center of the screen (pointer lock)
- Movement is relative to the camera direction
- No visible character model

### Third-Person

The camera follows a character model from behind. WASD moves the character, and
orbit controls let you rotate the camera around them.

```tsx
<Hero
  as="third-person"
  character="fox"
  speed={3}
  followOffset={[0, 2, 4]}
  idleClip="Idle"
  walkClip="Walk"
/>
```

- The character model plays idle/walk animations automatically
- The camera smoothly follows the character
- The character rotates toward the movement direction

---

## Interactions

**Interactions** are the ways users engage with the scene:

### Hotspot

A clickable 3D element that triggers navigation:

```tsx
<Hotspot at="right" to="gallery">Enter Gallery</Hotspot>
```

### Gaze

Triggers an action when the user looks at an object for a duration (useful for
VR headsets without controllers):

```tsx
<Gaze at="center" duration={1500} onGaze={() => navigate('next')} />
```

### Pointer

Custom 3D raycasting for advanced interactions:

```tsx
<Pointer at="center" onClick={handleClick} />
```

---

## Transitions

**Transitions** are visual effects that play when switching between scenes:

| Type        | Effect                                        |
| ----------- | --------------------------------------------- |
| `"none"`    | Instant cut                                   |
| `"fade"`    | Fade to black and back                        |
| `"dissolve"`| Cross-dissolve between scenes                 |

```tsx
<Hotspot at="right" to="gallery" transition="fade">Enter</Hotspot>
```

### Camera Transitions

Within a scene, you can also animate the camera between positions:

```tsx
<Scene cameraTransition="smooth" cameraTransitionDuration={0.8}>
```

---

## Navigation

Navigation is the act of moving between scenes. XXR manages a scene stack
(like browser history) with three actions:

- **navigate(to)** — push a new scene
- **back()** — return to the previous scene
- **home()** — jump back to the start scene

```tsx
const { navigate, back, home } = useXXR()
```

---

## Assets & Loading

**Assets** are external files (3D models, HDR environments, textures) that need
to be downloaded before they can appear in a scene. XXR's asset system:

1. **Declare** — list assets in an `<Assets>` block with unique IDs
2. **Load** — assets download in parallel via Suspense
3. **Reference** — use the `asset` prop to place loaded content in scenes
4. **Dispose** — XXR automatically cleans up GPU resources when assets are
   removed

```tsx
<Assets>
  <GLB id="helmet" src="/models/helmet.glb" />
  <HDR id="env" src="/env/city.hdr" />
</Assets>

<Scene id="intro" background="env">
  <Model asset="helmet" at="center" />
</Scene>
```

### Loading Screen

Show a loading overlay while assets download:

```tsx
<XXR start="intro" withLoading withProgress>
```

---

## Performance

Running real-time 3D in a browser is demanding. XXR provides built-in tools to
keep your experience smooth:

- **Adaptive DPR** — automatically reduces pixel density when framerate drops
- **Adaptive Events** — pauses raycasting during performance dips
- **DRACO compression** — compressed 3D models load faster and use less bandwidth
- **LOD (Level of Detail)** — swap high-poly models for simpler ones at a distance
- **Frame budgeting** — spread expensive work across multiple frames
- **Throttling** — limit how often expensive operations run

See [Performance](./performance.md) for details.

---

## Devtools

When building, enable devtools to see what's happening inside your scene:

```tsx
<XXR devtools>
```

This overlays real-time metrics (FPS, draw calls, triangles) and visual helpers
(scene graph, placement grid, navigation map). See [Devtools](./devtools.md).

---

## Coordinate System

XXR uses the standard Three.js / WebGL coordinate system:

```
      +Y (up)
       |
       |
       +---- +X (right)
      /
     /
   +Z (toward viewer)
```

- Distances are in **meters** by convention
- `[0, 0, 0]` is the center of the scene
- `[0, 1.6, 0]` is roughly human eye height
- Rotations are in **radians** (π ≈ 3.14 = 180°)

---

## Summary

| Concept       | One-liner                                      |
| ------------- | ---------------------------------------------- |
| Scene         | One room / environment                         |
| Camera        | The viewer's eye position and direction         |
| Orbit         | Mouse-drag to rotate/zoom around a target      |
| Lighting      | Ambient + directional + point + spot lights     |
| Shadows       | Ground objects visually, cost GPU performance   |
| Placement     | Named slots or raw `[x, y, z]` coordinates     |
| Floor         | Ground plane, grid, teleport target             |
| Model         | 3D object from a file                          |
| Hero          | Player avatar (first-person or third-person)   |
| Interaction   | Hotspot, gaze, pointer click                   |
| Transition    | Visual effect between scenes (fade, dissolve)  |
| Navigation    | Moving between scenes (navigate, back, home)   |
| Assets        | External files loaded before rendering         |
| Devtools      | Debug overlays for development                 |

---

## Next Steps

- [Getting Started](./getting-started.md) — build your first experience
- [XXR Component](./xxr.md) — root component reference
- [Scene](./scene.md) — scene configuration
- [Performance](./performance.md) — optimization guide
