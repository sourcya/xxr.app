# Asset Lifecycle Management

Advanced asset management with automatic garbage collection and memory budgets.

## Overview

XXR provides automatic memory management for 3D assets through:
- Reference counting per scene
- LRU cache with size limits
- Automatic garbage collection
- Priority-based loading

## Asset Lifecycle Manager

```tsx
import { AssetLifecycleManager } from '@xxr/assets/lifecycle'

const lifecycle = new AssetLifecycleManager({
  gcDelayMs: 30000,        // GC after 30s of scene inactivity
  memoryBudgetMB: 512,     // Total memory budget
  maxCacheSize: 50         // Max cached assets
})
```

### Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `gcDelayMs` | 30000 | Delay before GC after scene becomes inactive |
| `memoryBudgetMB` | 512 | Memory budget in megabytes |
| `maxCacheSize` | 50 | Maximum number of cached assets |

### Usage

```tsx
// Register asset usage in a scene
lifecycle.registerAssetUsage('helmet-model', 'lobby-scene', 5)

// Mark scene as active
lifecycle.setActiveScene('lobby-scene')

// Mark scene as inactive (schedules GC)
lifecycle.setInactiveScene('old-scene', (assetIds) => {
  console.log('GC assets:', assetIds)
  assetIds.forEach(id => registry.remove(id))
})

// Get unused assets
const unused = lifecycle.getUnusedAssets()

// Get LRU-sorted assets
const lru = lifecycle.getLRUSortedAssets()

// Get memory estimate
const memoryMB = lifecycle.getTotalMemoryEstimate()

// Cleanup
lifecycle.cleanup()
```

## LRU Cache

Least Recently Used cache with automatic eviction:

```tsx
import { LRUCache } from '@xxr/assets/lru-cache'

const cache = new LRUCache<Texture>(100) // 100 size units

// Set with size weight
cache.set('texture-1', texture, 10) // Size: 10 units
cache.set('texture-2', texture2, 5)  // Size: 5 units

// Get (updates access time)
const tex = cache.get('texture-1')

// Check existence
if (cache.has('texture-1')) {
  // ...
}

// Remove
cache.delete('texture-1')

// Clear all
cache.clear()

// Get current size
const currentSize = cache.getSize() // 15

// Adjust max size (triggers eviction if needed)
cache.setMaxSize(80)

// Get all keys
const keys = cache.keys()
```

### Automatic Eviction

When adding an item would exceed `maxSize`, the least recently used items are automatically evicted:

```tsx
const cache = new LRUCache(100)

cache.set('a', dataA, 50) // Size: 50/100
cache.set('b', dataB, 40) // Size: 90/100
cache.set('c', dataC, 30) // Size: 70/100 (evicts 'a' automatically)

cache.get('b') // Updates 'b' access time
cache.set('d', dataD, 50) // Size: 90/100 (evicts 'c', keeps 'b')
```

## Loading Queue

Priority-based asset loading:

```tsx
import { LoadingQueue } from '@xxr/assets/loading-queue'

const queue = new LoadingQueue()

// Enqueue with priority
queue.enqueue({
  assetId: 'hero-model',
  src: '/models/hero.glb',
  priority: 'high',
  sceneId: 'main'
})

queue.enqueue({
  assetId: 'background-model',
  src: '/models/bg.glb',
  priority: 'low',
  sceneId: 'main'
})

// Dequeue (highest priority first)
const next = queue.dequeue() // Gets 'hero-model'

// Mark as loaded
queue.markLoaded('hero-model')

// Mark as failed
queue.markFailed('broken-asset')

// Check status
const isLoading = queue.isLoading('hero-model')
const isLoaded = queue.isLoaded('hero-model')

// Get stats
const queueLength = queue.getQueueLength()
const loadingCount = queue.getLoadingCount()

// Clear
queue.clear()
```

### Priority Levels

- `high` - Critical assets (hero character, current scene models)
- `normal` - Standard assets (adjacent scene content)
- `low` - Background assets (distant scene content)

## Asset Registry GC

Enhanced registry with disposal and garbage collection:

```tsx
import { createAssetRegistry } from '@xxr/assets/registry'

const registry = createAssetRegistry()

// Standard operations
registry.register('model-1', 'model', modelData)
registry.reportError('model-2', 'model', 'Failed to load')

// Removal with disposal
registry.remove('model-1') // Auto-disposes Three.js resources

// Batch garbage collection
registry.gc(['model-1', 'model-2', 'texture-1'])

// Clear all
registry.clear() // Disposes all assets
```

### Automatic Disposal

The registry automatically disposes resources based on type:

```tsx
// Models - disposes scene graph
registry.remove('model-id') 
// → disposeObject3D(data.scene)

// Environments - disposes texture
registry.remove('env-id')
// → disposeTexture(data)
```

## Integration Example

```tsx
import { 
  AssetLifecycleManager,
  LRUCache,
  createAssetRegistry 
} from '@xxr/assets'

// Create managers
const registry = createAssetRegistry()
const lifecycle = new AssetLifecycleManager()
const cache = new LRUCache(100)

// Scene navigation handler
const onSceneChange = (newScene: string, oldScene: string) => {
  // Mark new scene active
  lifecycle.setActiveScene(newScene)
  
  // Mark old scene inactive with GC callback
  lifecycle.setInactiveScene(oldScene, (assetIds) => {
    assetIds.forEach(id => {
      const entry = registry.get(id)
      if (entry) {
        // Add to LRU cache instead of immediate disposal
        cache.set(id, entry.data, estimateSize(entry))
      }
      registry.remove(id)
    })
  })
}

// Estimate asset size
const estimateSize = (entry: AssetRegistryEntry): number => {
  if (entry.type === 'model' && entry.data?.scene) {
    let size = 0
    entry.data.scene.traverse((node: any) => {
      if (node.geometry) size += 1
      if (node.material) size += 1
    })
    return size
  }
  return 1
}
```

## Best Practices

1. **Track asset sizes** accurately for effective memory management
2. **Adjust GC delay** based on navigation patterns
3. **Use priority loading** for critical assets
4. **Monitor memory usage** in devtools
5. **Dispose custom resources** that aren't auto-detected
6. **Cache reusable assets** across scenes

## Performance Monitoring

```tsx
// Get lifecycle stats
const stats = {
  unused: lifecycle.getUnusedAssets().length,
  total: lifecycle.getTotalMemoryEstimate(),
  cached: cache.getSize(),
  maxCache: cache.getMaxSize(),
  pending: queue.getQueueLength(),
  loading: queue.getLoadingCount()
}

console.table(stats)
```

## See Also

- [Performance](./performance.md)
- [Assets](./assets.md)
- [Error Handling](./error-handling.md)
