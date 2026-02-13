# Hero

The player avatar and camera rig. Controls locomotion, view mode, and animation.

## Props

| Prop               | Type                               | Default          | Description                                   |
| ------------------ | ---------------------------------- | ---------------- | --------------------------------------------- |
| `as`               | `"first-person" \| "third-person"` | `"first-person"` | View mode                                     |
| `character`        | `string`                           | —                | Asset ID for third-person avatar model        |
| `speed`            | `number`                           | `3`              | Movement speed (meters/second)                |
| `mouseSensitivity` | `number`                           | `1`              | PointerLock look speed (first-person only)    |
| `followOffset`     | `Vec3`                             | `[0, 3, -5]`     | Camera offset behind character (third-person) |
| `followDamping`    | `number`                           | `5`              | Camera follow lerp speed (third-person)       |
| `rotationSpeed`    | `number`                           | `8`              | Character turn slerp speed (third-person)     |
| `idleClip`         | `string`                           | —                | Animation clip name for idle state            |
| `walkClip`         | `string`                           | —                | Animation clip name for walk state            |
| `runClip`          | `string`                           | —                | Animation clip name for run state (reserved)  |

## View Modes

### First Person

- **Mouse look** via `PointerLockControls` — click canvas to lock cursor, Escape
  to release
- **Camera-relative movement** — WASD moves in the direction you're looking
- Camera at eye height via `<XROrigin>`, no visible avatar
- VR: head-tracked + right thumbstick
- `mouseSensitivity` controls look speed (default `1`)

### Third Person (Game-Like)

- **Orbit camera** — drag mouse to rotate camera around character
- **Camera-relative WASD** — movement direction is relative to camera angle
- **Character rotation** — model slerps to face movement direction
- **Follow camera** — OrbitControls target smoothly tracks character position
- **Animation states** — idle ↔ walk crossfade based on movement
- VR: thumbstick movement
- `followOffset` sets camera position behind/above character
- `followDamping` controls how quickly camera follows (higher = snappier)
- `rotationSpeed` controls how quickly the character turns

## Animation Clips

GLB models contain named `AnimationClip` objects. Specify clip names to control
which animations play for each state:

```tsx
<Hero
  as="third-person"
  character="fox"
  idleClip="Survey" // plays when stationary
  walkClip="Walk" // plays when moving, crossfades from idle
/>;
```

**Fallback behavior:**

- If `idleClip` is not specified or not found, falls back to `animations[0]`
- If `walkClip` is not specified or not found, falls back to `animations[1]`
- If only one clip exists, it plays continuously regardless of movement state
- Crossfade duration is 0.3 seconds

## Example

```tsx
<Assets>
  <GLB id="fox" src="/models/fox.glb" />
</Assets>;

{/* First-person with mouse look */}
<Scene id="arena" background="park">
  <Hero as="first-person" speed={4} mouseSensitivity={0.8} />
</Scene>;

{/* Third-person with game-like controls and animation clips */}
<Scene id="world" background="forest">
  <Hero
    as="third-person"
    character="fox"
    speed={3}
    idleClip="Survey"
    walkClip="Walk"
    followOffset={[0, 4, -7]}
    rotationSpeed={6}
  />
</Scene>;
```

The `character` prop references an asset ID from `<Assets>`. Animation clips are
selected by name from the model's embedded animations.
