# Error Handling

XXR provides built-in error boundaries and error handling utilities.

## Asset Error Boundary

Automatically wraps all asset loaders to catch loading errors.

```tsx
import { Assets, GLB } from '@xxr'

<Assets onAllLoaded={() => console.log('ready')}>
  <GLB id="model" src="/broken-path.glb" />
  {/* Error is caught, won't crash app */}
</Assets>
```

### Custom Error Handling

```tsx
<GLB 
  id="model" 
  src="/model.glb"
  onLoad={(data) => console.log('Loaded:', data)}
  onError={(error) => console.error('Failed:', error)}
/>
```

## Generic Error Boundary

For wrapping custom components:

```tsx
import { ErrorBoundary } from '@xxr'

<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error)
    // Send to error tracking service
  }}
>
  <MyCustomComponent />
</ErrorBoundary>
```

### Custom Fallback Function

```tsx
<ErrorBoundary
  fallback={(error) => (
    <div style={{ padding: 20, color: 'red' }}>
      <h3>Error: {error.message}</h3>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### Reset Keys

Auto-reset error boundary when props change:

```tsx
const [key, setKey] = useState(0)

<ErrorBoundary resetKeys={[key]}>
  <MyComponent />
</ErrorBoundary>

<button onClick={() => setKey(k => k + 1)}>
  Reset
</button>
```

## Asset Status Tracking

```tsx
import { useAsset } from '@xxr'

const MyComponent = () => {
  const entry = useAsset('my-model')

  if (!entry) return <div>Asset not registered</div>
  
  switch (entry.status) {
    case 'loading':
      return <div>Loading...</div>
    case 'error':
      return <div>Error: {entry.error}</div>
    case 'loaded':
      return <div>Ready!</div>
  }
}
```

## Error Recovery Patterns

### Fallback Model

```tsx
const ModelWithFallback = ({ asset, fallback }) => {
  const entry = useAsset(asset)
  const fallbackEntry = useAsset(fallback)

  if (entry?.status === 'error' && fallbackEntry?.status === 'loaded') {
    return <Model asset={fallback} />
  }

  return <Model asset={asset} />
}

// Usage
<ModelWithFallback asset="premium-model" fallback="simple-model" />
```

### Retry Logic

```tsx
const [retryCount, setRetryCount] = useState(0)

<ErrorBoundary 
  resetKeys={[retryCount]}
  fallback={(error) => (
    <div>
      <p>Failed to load</p>
      <button onClick={() => setRetryCount(c => c + 1)}>
        Retry ({retryCount})
      </button>
    </div>
  )}
>
  <Model asset="complex-model" />
</ErrorBoundary>
```

## Best Practices

1. **Always provide onError handlers** for critical assets
2. **Use ErrorBoundary** for experimental or user-generated content
3. **Implement fallbacks** for essential 3D models
4. **Log errors** to monitoring services in production
5. **Test error states** during development

## See Also

- [Assets](./assets.md)
- [Lifecycle Management](./lifecycle.md)
