import type { XXRPlugin, PluginContext } from './types'

export class PluginRegistry {
  private plugins = new Map<string, XXRPlugin>()
  private context: PluginContext | null = null

  setContext(context: PluginContext): void {
    this.context = context
  }

  register(plugin: XXRPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`[XXR] Plugin "${plugin.name}" is already registered`)
      return
    }

    this.plugins.set(plugin.name, plugin)

    // Register components
    if (plugin.components && this.context) {
      for (const [name, component] of Object.entries(plugin.components)) {
        this.context.registerComponent(name, component)
      }
    }

    // Register loaders
    if (plugin.loaders && this.context) {
      for (const [ext, loader] of Object.entries(plugin.loaders)) {
        this.context.registerLoader(ext, loader)
      }
    }

    // Call init hook
    plugin.hooks?.onInit?.()
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.hooks?.onDestroy?.()
      this.plugins.delete(name)
    }
  }

  get(name: string): XXRPlugin | undefined {
    return this.plugins.get(name)
  }

  getAll(): XXRPlugin[] {
    return Array.from(this.plugins.values())
  }

  getAllMiddleware(): XXRPlugin['middleware'][] {
    return this.getAll()
      .map(p => p.middleware)
      .filter((m): m is NonNullable<typeof m> => !!m)
  }

  notifySceneMount(sceneId: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.hooks?.onSceneMount?.(sceneId)
    }
  }

  notifySceneUnmount(sceneId: string): void {
    for (const plugin of this.plugins.values()) {
      plugin.hooks?.onSceneUnmount?.(sceneId)
    }
  }

  clear(): void {
    for (const plugin of this.plugins.values()) {
      plugin.hooks?.onDestroy?.()
    }
    this.plugins.clear()
  }
}

export const createPluginRegistry = (): PluginRegistry => new PluginRegistry()
