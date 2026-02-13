# Scene Background Types Guide

The Scene component now supports explicit background configuration with multiple types for better clarity and type safety.

## Background Types

### 1. **Color Background**
```tsx
<Scene 
  id="myScene" 
  background={{ type: 'color', value: '#1a1a2e' }}
>
```

Supports:
- Hex colors: `#ff0000`
- RGB: `rgb(255, 0, 0)`
- HSL: `hsl(0, 100%, 50%)`
- Named colors: `skyblue`, `crimson`, etc.

### 2. **Drei Preset**
```tsx
<Scene 
  id="myScene" 
  background={{ type: 'preset', value: 'sunset' }}
>
```

Available presets:
- `apartment`, `city`, `dawn`, `forest`, `lobby`, `night`, `park`, `studio`, `sunset`, `warehouse`

### 3. **Asset Reference**
```tsx
<Assets>
  <HDR id="city-env" src={cityHdrUrl} />
</Assets>

<Scene 
  id="myScene" 
  background={{ type: 'asset', value: 'city-env' }}
>
```

References HDR/EXR assets loaded via `<Assets>`.

### 4. **Direct File Path**
```tsx
<Scene 
  id="myScene" 
  background={{ type: 'file', value: '/textures/environment.hdr' }}
>
```

Direct path to HDR/EXR file (not recommended, use asset references instead).

## Legacy String Support (Backward Compatible)

```tsx
// Still works - auto-detects type
<Scene id="myScene" background="park" />          // Drei preset
<Scene id="myScene" background="sky-env" />       // Asset ID (if registered)
<Scene id="myScene" background="#1a1a2e" />       // Color
```

## Examples

### Colored Background
```tsx
<Scene id="studio" background={{ type: 'color', value: '#0f0f23' }}>
  <Model asset="product" at="center" />
</Scene>
```

### Drei Environment
```tsx
<Scene id="outdoor" background={{ type: 'preset', value: 'park' }}>
  <Model asset="character" at="center" />
</Scene>
```

### HDR Environment (Explicit Asset)
```tsx
<Assets>
  <HDR id="city-bg" src={cityHdrUrl} />
</Assets>

<Scene id="city" background={{ type: 'asset', value: 'city-bg' }}>
  <Model asset="building" at="center" />
</Scene>
```

## Type Safety

TypeScript will provide autocomplete for:
- Background types: `'color' | 'preset' | 'asset' | 'file'`
- Drei presets: Full list of available presets
- Proper value typing based on type selection

## Migration

Existing code using string backgrounds continues to work without changes:

```tsx
// Old code - still works
<Scene id="test" background="sunset" />

// New code - explicit and type-safe
<Scene id="test" background={{ type: 'preset', value: 'sunset' }} />
```
