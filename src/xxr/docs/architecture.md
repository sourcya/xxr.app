# Architecture

## Layer Diagram

```
┌─────────────────────────────────────────────────┐
│                   Developer DSL                  │
│  <XXR>, <Assets>, <Scene>, <Model>, <Hero>, ... │
├─────────────────────────────────────────────────┤
│              Asset Registry (ID-based)            │
│  <Assets> + loaders (GLB, FBX, HDR, ...) → ID   │
│  useAsset(id) → loaded Three.js object           │
├─────────────────────────────────────────────────┤
│                   Core (neutral)                 │
│   navigation, placement, interactions,          │
│   transitions, types, state                     │
├─────────────────────────────────────────────────┤
│              Runtime Adapter (R3F)               │
│   Canvas, XR store, drei helpers, three.js      │
└─────────────────────────────────────────────────┘
```

## Asset Flow

```
<Assets>                 Registry              Consumers
  <GLB id="fox" .../>  →  register(id, data)  →  <Model asset="fox" />
  <HDR id="env" .../>  →  register(id, data)  →  <Scene background="env" />
  <FBX id="char".../>  →  register(id, data)  →  <Hero character="char" />
```

## Core Layer

Pure TypeScript with no React or Three.js imports:

- `core/types.ts` — All shared types
- `core/placement.ts` — Semantic placement resolver (`at` → `[x,y,z]`)
- `core/context.ts` — React context (XXR state)
- `navigation/router.ts` — Scene navigation state machine
- `assets/context.ts` — Asset registry context + `useAsset` hook
- `assets/loaders/` — 12 format-specific loaders (GLB, FBX, DAE, 3DS, KMZ, STL,
  PLY, XYZ, HDR, EXR, SVG, IFC)

## Runtime Layer

`runtime/r3f/` adapts core logic to React Three Fiber:

- `canvas.tsx` — R3F Canvas + XR store + transitions + devtools
- `environment.tsx` — drei Environment wrapper
- `html.tsx` — drei Html wrapper

## Adding a New Runtime

1. Create `runtime/<name>/` directory
2. Implement adapters matching the R3F interface
3. Wire up in `core/xxr.tsx`
