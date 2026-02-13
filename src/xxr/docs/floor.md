# Floor

Walkable/teleportable surface. Declares that locomotion is possible in a scene.

## Props

| Prop             | Type      | Default   | Description                                                     |
| ---------------- | --------- | --------- | --------------------------------------------------------------- |
| `size`           | `number`  | `20`      | Square size in meters                                           |
| `teleportable`   | `boolean` | `true`    | Wrap in `<TeleportTarget>` for VR teleportation                 |
| `asset`          | `string`  | —         | Asset ID for custom floor geometry from `<Assets>`              |
| `position`       | `Vec3`    | `[0,0,0]` | Floor world position (Y sets ground elevation)                  |
| `color`          | `string`  | `"#333"`  | Default floor color                                             |
| `opacity`        | `number`  | `0.3`     | Floor opacity (0–1)                                             |
| `visible`        | `boolean` | `true`    | Show/hide floor mesh (invisible floor still works for teleport) |
| `grid`           | `boolean` | `false`   | Show grid lines on the floor                                    |
| `gridSize`       | `number`  | `1`       | Grid cell size in meters                                        |
| `contactShadows` | `boolean` | `false`   | Enable contact shadows on the floor                             |

## Example

```tsx
{/* Basic floor */}
<Floor size={30} teleportable />

{/* Styled floor with grid */}
<Floor color="#1a1a2e" opacity={0.5} grid gridSize={2} />

{/* Elevated floor */}
<Floor position={[0, 0.5, 0]} contactShadows />

{/* Custom floor from a loaded model */}
<Assets>
  <GLB id="terrain" src="/models/terrain.glb" />
</Assets>
<Floor asset="terrain" teleportable />
```

## Ground Elevation

The floor's Y position is shared with sibling components via `SceneContext`.
When a `<Model grounded>` is placed in the same scene, its bounding box is
snapped to the floor's elevation automatically.

```tsx
<Scene id="gallery">
  <Floor position={[0, 0.5, 0]} />
  <Model asset="statue" at="center" grounded />
  {/* statue bottom sits at y=0.5 */}
</Scene>;
```

When `teleportable` is true, the floor is wrapped in `<TeleportTarget>` from
`@react-three/xr`, enabling VR teleport locomotion. The `asset` prop replaces
the default plane with a loaded 3D model.
