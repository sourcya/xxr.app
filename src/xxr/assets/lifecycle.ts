export type AssetLifecycleConfig = {
  readonly gcDelayMs?: number
  readonly memoryBudgetMB?: number
  readonly maxCacheSize?: number
}

export type AssetUsage = {
  readonly assetId: string
  readonly sceneIds: Set<string>
  lastAccessed: number
  readonly sizeEstimate: number
}

export class AssetLifecycleManager {
  private usageMap = new Map<string, AssetUsage>()
  private activeScenes = new Set<string>()
  private config: Required<AssetLifecycleConfig>
  private gcTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

  constructor(config: AssetLifecycleConfig = {}) {
    this.config = {
      gcDelayMs: config.gcDelayMs ?? 30000,
      memoryBudgetMB: config.memoryBudgetMB ?? 512,
      maxCacheSize: config.maxCacheSize ?? 50,
    }
  }

  registerAssetUsage(assetId: string, sceneId: string, sizeEstimate = 1): void {
    const existing = this.usageMap.get(assetId)
    if (existing) {
      existing.sceneIds.add(sceneId)
      existing.lastAccessed = Date.now()
    } else {
      this.usageMap.set(assetId, {
        assetId,
        sceneIds: new Set([sceneId]),
        lastAccessed: Date.now(),
        sizeEstimate,
      })
    }
  }

  setActiveScene(sceneId: string): void {
    this.activeScenes.add(sceneId)
    
    // Cancel GC for assets used in now-active scene
    for (const [assetId, usage] of this.usageMap) {
      if (usage.sceneIds.has(sceneId)) {
        const timeout = this.gcTimeouts.get(assetId)
        if (timeout) {
          clearTimeout(timeout)
          this.gcTimeouts.delete(assetId)
        }
      }
    }
  }

  setInactiveScene(sceneId: string, onGC: (assetIds: string[]) => void): void {
    this.activeScenes.delete(sceneId)
    
    // Schedule GC for assets only used in this scene
    const assetsToGC: string[] = []
    for (const [assetId, usage] of this.usageMap) {
      if (usage.sceneIds.has(sceneId) && !this.isAssetUsedByActiveScene(assetId)) {
        assetsToGC.push(assetId)
      }
    }

    if (assetsToGC.length > 0) {
      const timeout = setTimeout(() => {
        onGC(assetsToGC)
        assetsToGC.forEach(id => {
          this.usageMap.delete(id)
          this.gcTimeouts.delete(id)
        })
      }, this.config.gcDelayMs)

      assetsToGC.forEach(id => this.gcTimeouts.set(id, timeout))
    }
  }

  private isAssetUsedByActiveScene(assetId: string): boolean {
    const usage = this.usageMap.get(assetId)
    if (!usage) return false
    
    for (const sceneId of usage.sceneIds) {
      if (this.activeScenes.has(sceneId)) {
        return true
      }
    }
    return false
  }

  getUnusedAssets(): string[] {
    const unused: string[] = []
    for (const [assetId] of this.usageMap) {
      if (!this.isAssetUsedByActiveScene(assetId)) {
        unused.push(assetId)
      }
    }
    return unused
  }

  getTotalMemoryEstimate(): number {
    let total = 0
    for (const { sizeEstimate } of this.usageMap.values()) {
      total += sizeEstimate
    }
    return total
  }

  getLRUSortedAssets(): string[] {
    return Array.from(this.usageMap.values())
      .sort((a, b) => a.lastAccessed - b.lastAccessed)
      .map(u => u.assetId)
  }

  cleanup(): void {
    for (const timeout of this.gcTimeouts.values()) {
      clearTimeout(timeout)
    }
    this.gcTimeouts.clear()
    this.usageMap.clear()
    this.activeScenes.clear()
  }
}
