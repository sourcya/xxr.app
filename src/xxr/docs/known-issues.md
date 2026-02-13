# Known Issues

## VR Mode Warnings

### 1. Zustand Deprecation Warning

**Warning:**

```
[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`
```

**Source:** `@react-three/xr` library

**Impact:** Cosmetic only - does not affect functionality

**Status:** Third-party dependency issue. The `@react-three/xr` package uses an
older Zustand API. This will be resolved when the library updates to the new
Zustand API.

**Workaround:** None needed - the warning can be safely ignored in development.

---

### 2. MeshLineMaterial Resolution Warning

**Warning:**

```
THREE.Material: parameter 'resolution' has value of undefined
```

**Source:** `@react-three/xr` teleport pointer component

**Impact:** Cosmetic only - teleport rays still render correctly

**Status:** Third-party dependency issue in `@react-three/xr`. The
`TeleportPointerRayModel` component doesn't pass a required `resolution`
parameter to `MeshLineMaterial`.

**Workaround:** None needed - the teleport functionality works despite the
warning.

---

## Suppressing Console Warnings

If these warnings are distracting during development, you can filter them in
your browser DevTools:

### Chrome/Edge DevTools

1. Open Console
2. Click "Filter" (funnel icon)
3. Add negative filters:
   - `-createWithEqualityFn`
   - `-resolution`

### Firefox DevTools

1. Open Console
2. Use filter box
3. Enter: `-createWithEqualityFn -resolution`

---

### 3. FBXLoader Unknown Light Type Warning

**Warning:**

```
THREE.FBXLoader: Unknown light type 3, defaulting to a PointLight
```

**Source:** Three.js FBXLoader parsing FBX files with unsupported light types

**Impact:** Minimal - lights are imported as PointLights instead of the original
type. Scene will still render correctly but lighting may differ slightly from
the original FBX file.

**Status:** Limitation of THREE.FBXLoader. The FBX format supports more light
types than Three.js currently implements.

**Explanation:** FBX files exported from 3D software (Maya, 3ds Max, etc.) can
contain various light types. Three.js only supports:

- Type 0: Point Light
- Type 1: Directional Light
- Type 2: Spot Light

Any other light type defaults to PointLight.

**Workaround:**

- If precise lighting is critical, export lights separately and add them
  programmatically in your scene
- Use GLB/GLTF format which has better standardization for lights
- Accept the PointLight default (usually acceptable for most scenes)

---

## Future Updates

These issues will be resolved when:

- `@react-three/xr` updates to Zustand v5 API
- `@react-three/xr` fixes the MeshLineMaterial initialization

**Tracking:**

- Zustand v5 migration: https://github.com/pmndrs/zustand/discussions/1937
- `@react-three/xr` repo: https://github.com/pmndrs/xr

---

## Resolved Issues

### WASD Movement Not Working on Desktop

**Fixed:** The `useWASD` hook in `hero.tsx` previously only moved the `XROrigin`
ref, which had no effect on the camera in desktop (non-VR) mode. The fix
translates `camera.position` and `OrbitControls.target` alongside the XROrigin
ref. Additionally, `useDisableOrbitControls` now fully disables rotate, zoom,
and pan to prevent OrbitControls from overriding WASD movement.

### Enter XR Button Persisting After Navigation

**Fixed:** XR is now opt-in via `<XXR withXR>`. The Enter VR button only appears
when `withXR` is set and the device supports immersive VR. XR session cleanup on
unmount properly ends any active session.

---

## Other Known Issues

### PointerLock Requires User Gesture (First-Person Mode)

Browser security requires a user click to activate pointer lock. This is
standard behavior for all web-based FPS games and not an XXR bug. The user must
click the canvas to enable mouse look; pressing Escape releases the lock.

---

If you encounter other issues, please report them.
