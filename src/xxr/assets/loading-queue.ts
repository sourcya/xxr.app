export type LoadPriority = 'high' | 'normal' | 'low'

export type QueuedLoad = {
  readonly assetId: string
  readonly src: string
  readonly priority: LoadPriority
  readonly sceneId: string
}

export class LoadingQueue {
  private queue: QueuedLoad[] = []
  private loading = new Set<string>()
  private loaded = new Set<string>()

  enqueue(load: QueuedLoad): void {
    if (this.loaded.has(load.assetId) || this.loading.has(load.assetId)) {
      return
    }

    // Remove if already queued
    this.queue = this.queue.filter(q => q.assetId !== load.assetId)
    
    // Add with priority sorting
    this.queue.push(load)
    this.sortQueue()
  }

  dequeue(): QueuedLoad | undefined {
    const item = this.queue.shift()
    if (item) {
      this.loading.add(item.assetId)
    }
    return item
  }

  markLoaded(assetId: string): void {
    this.loading.delete(assetId)
    this.loaded.add(assetId)
  }

  markFailed(assetId: string): void {
    this.loading.delete(assetId)
  }

  isLoading(assetId: string): boolean {
    return this.loading.has(assetId)
  }

  isLoaded(assetId: string): boolean {
    return this.loaded.has(assetId)
  }

  clear(): void {
    this.queue = []
    this.loading.clear()
    this.loaded.clear()
  }

  private sortQueue(): void {
    const priorityOrder: Record<LoadPriority, number> = {
      high: 0,
      normal: 1,
      low: 2,
    }
    this.queue.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  getQueueLength(): number {
    return this.queue.length
  }

  getLoadingCount(): number {
    return this.loading.size
  }
}
