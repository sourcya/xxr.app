# Plugin System

Extend XXR with custom components, loaders, and middleware.

## Plugin Structure

```tsx
import type { XXRPlugin } from '@xxr/plugins/types'

const myPlugin: XXRPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  
  components: {
    CustomModel: MyCustomModelComponent,
    SpecialEffect: MyEffectComponent
  },
  
  loaders: {
    'obj': OBJLoader,
    'mtl': MTLLoader
  },
  
  middleware: [
    loggingMiddleware,
    analyticsMiddleware
  ],
  
  hooks: {
    onInit: async () => {
      console.log('Plugin initialized')
    },
    onSceneMount: (sceneId) => {
      console.log(`Scene mounted: ${sceneId}`)
    },
    onSceneUnmount: (sceneId) => {
      console.log(`Scene unmounted: ${sceneId}`)
    },
    onDestroy: () => {
      console.log('Plugin destroyed')
    }
  }
}
```

## Plugin Registry

```tsx
import { createPluginRegistry } from '@xxr/plugins/registry'

const registry = createPluginRegistry()

// Register plugin
registry.register(myPlugin)

// Get plugin
const plugin = registry.get('my-plugin')

// Unregister
registry.unregister('my-plugin')
```

## Navigation Middleware

Intercept and modify navigation actions:

```tsx
import type { NavigationMiddleware } from '@xxr/plugins/types'

const loggingMiddleware: NavigationMiddleware = (action, state, next) => {
  console.log('[Nav]', action.type, {
    from: state.activeScene,
    to: 'to' in action ? action.to : null
  })
  next(action)
}

const validationMiddleware = (validScenes: string[]): NavigationMiddleware => {
  return (action, state, next) => {
    if (action.type === 'navigate' && !validScenes.includes(action.to)) {
      console.warn(`Invalid scene: ${action.to}`)
      return
    }
    next(action)
  }
}

// Usage in plugin
const myPlugin: XXRPlugin = {
  name: 'navigation-guard',
  middleware: [
    loggingMiddleware,
    validationMiddleware(['lobby', 'gallery', 'exit'])
  ]
}
```

## Custom Components

### Registering Custom Components

```tsx
import { ComponentType } from 'react'

const CustomSky: ComponentType<{ color: string }> = ({ color }) => {
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial color={color} side={2} />
    </mesh>
  )
}

const skyPlugin: XXRPlugin = {
  name: 'custom-sky',
  components: {
    Sky: CustomSky
  }
}
```

### Using Plugin Components

```tsx
// After registering the plugin
const { Sky } = pluginRegistry.get('custom-sky').components

<Scene id="outdoor">
  <Sky color="#87CEEB" />
</Scene>
```

## Custom Loaders

```tsx
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const OBJ: ComponentType<AssetLoaderProps> = ({ id, src, onLoad, onError }) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const obj = useLoader(OBJLoader, src)

  useEffect(() => {
    if (obj) reportLoaded(obj)
  }, [obj, reportLoaded])

  return null
}

const objPlugin: XXRPlugin = {
  name: 'obj-loader',
  loaders: {
    'obj': OBJ
  }
}
```

## Lifecycle Hooks

### onInit

Called when plugin is registered:

```tsx
hooks: {
  onInit: async () => {
    // Load external dependencies
    await loadExternalLibrary()
    
    // Initialize services
    analyticsService.init()
  }
}
```

### onSceneMount / onSceneUnmount

Track scene changes:

```tsx
hooks: {
  onSceneMount: (sceneId) => {
    // Track analytics
    analytics.track('scene_view', { sceneId })
    
    // Preload adjacent scenes
    preloadService.loadAdjacentScenes(sceneId)
  },
  
  onSceneUnmount: (sceneId) => {
    // Cleanup scene-specific resources
    cleanupSceneResources(sceneId)
  }
}
```

### onDestroy

Cleanup when plugin is unregistered:

```tsx
hooks: {
  onDestroy: () => {
    // Cleanup services
    analyticsService.destroy()
    
    // Cancel pending requests
    cancelAllRequests()
  }
}
```

## Example: Analytics Plugin

```tsx
import type { XXRPlugin, NavigationMiddleware } from '@xxr/plugins/types'

const analyticsMiddleware: NavigationMiddleware = (action, state, next) => {
  if (action.type === 'navigate') {
    analytics.track('navigation', {
      from: state.activeScene,
      to: action.to,
      transition: action.transition
    })
  }
  next(action)
}

export const analyticsPlugin: XXRPlugin = {
  name: 'analytics',
  version: '1.0.0',
  
  middleware: [analyticsMiddleware],
  
  hooks: {
    onInit: async () => {
      await analytics.init({
        apiKey: process.env.ANALYTICS_KEY
      })
    },
    
    onSceneMount: (sceneId) => {
      analytics.track('scene_view', {
        sceneId,
        timestamp: Date.now()
      })
    },
    
    onDestroy: () => {
      analytics.flush()
    }
  }
}
```

## Example: Performance Plugin

```tsx
const performancePlugin: XXRPlugin = {
  name: 'performance-monitor',
  
  hooks: {
    onSceneMount: (sceneId) => {
      const start = performance.now()
      
      requestAnimationFrame(() => {
        const loadTime = performance.now() - start
        console.log(`Scene ${sceneId} loaded in ${loadTime}ms`)
        
        if (loadTime > 1000) {
          console.warn(`Slow scene load: ${sceneId}`)
        }
      })
    }
  }
}
```

## Best Practices

1. **Namespace components** to avoid conflicts
2. **Validate middleware** actions before modifying
3. **Cleanup resources** in onDestroy
4. **Use TypeScript** for type safety
5. **Version plugins** for compatibility tracking
6. **Document dependencies** in plugin metadata

## See Also

- [Navigation](./navigation.md)
- [Architecture](./architecture.md)
- [Examples](./examples.md)
