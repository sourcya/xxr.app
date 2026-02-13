# Model

Renders a loaded asset from the `<Assets>` registry with semantic placement and
optional animation.

## Props

| Prop            | Type                              | Default      | Description                                     |
| --------------- | --------------------------------- | ------------ | ----------------------------------------------- |
| `asset`         | `string`                          | **required** | Asset ID (must match an `id` in `<Assets>`)     |
| `at`            | `PlacementSlot \| Vec3`           | `"front"`    | Semantic slot or raw `[x, y, z]` coordinates    |
| `height`        | `"ground" \| "eye" \| "overhead"` | `"ground"`   | Height override (ignored when `at` is Vec3)     |
| `distance`      | `"near" \| "mid" \| "far"`        | `"mid"`      | Distance override (ignored when `at` is Vec3)   |
| `offset`        | `Vec3`                            | —            | Additive offset applied after position resolves |
| `lookAt`        | `"camera" \| "center" \| Vec3`    | —            | Orient model toward a target                    |
| `position`      | `Vec3`                            | —            | ⚠️ Deprecated — use `at` with Vec3 instead      |
| `scale`         | `number \| Vec3`                  | `1`          | Uniform or per-axis scale                       |
| `rotation`      | `Vec3`                            | —            | Euler rotation in radians                       |
| `animate`       | `boolean`                         | `false`      | Play embedded animations (GLB/FBX)              |
| `grounded`      | `boolean`                         | `false`      | Snap bbox bottom to floor surface               |
| `castShadow`    | `boolean`                         | —            | Cast shadows                                    |
| `receiveShadow` | `boolean`                         | —            | Receive shadows                                 |

## Example

```tsx
<Assets>
  <GLB id="helmet" src="/models/helmet.glb" />
  <GLB id="fox" src="/models/fox.glb" />
</Assets>

<Scene id="gallery" background="studio">
  {/* Semantic placement */}
  <Model asset="helmet" at="center" scale={1.5} />
  <Model asset="fox" at="right" scale={0.02} animate />

  {/* Raw Vec3 placement with offset */}
  <Model asset="helmet" at={[2, 0, -3]} offset={[0, 0.5, 0]} />

  {/* Grounded model that snaps to floor */}
  <Model asset="fox" at="front" grounded />

  {/* Model that always faces the camera */}
  <Model asset="helmet" at="left" lookAt="camera" />
</Scene>
```

The `animate` prop will play all embedded animation clips using
`AnimationMixer`.

## Grounding

When `grounded` is `true`, the model's bounding box is computed and the Y
position is adjusted so the bottom of the model sits on the floor. If a
`<Floor position={[0, 0.5, 0]}>` is present, the model snaps to that floor's
elevation via `SceneContext.groundY`.
