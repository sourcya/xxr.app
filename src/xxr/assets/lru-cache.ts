export type CacheEntry<T> = {
  readonly key: string
  readonly value: T
  readonly size: number
  lastAccessed: number
}

export class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private maxSize: number
  private currentSize = 0

  constructor(maxSize: number) {
    this.maxSize = maxSize
  }

  set(key: string, value: T, size = 1): void {
    const existing = this.cache.get(key)
    if (existing) {
      this.currentSize -= existing.size
    }

    // Evict LRU entries if needed
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictLRU()
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      size,
      lastAccessed: Date.now(),
    }

    this.cache.set(key, entry)
    this.currentSize += size
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key)
    if (entry) {
      entry.lastAccessed = Date.now()
      return entry.value
    }
    return undefined
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentSize -= entry.size
      return this.cache.delete(key)
    }
    return false
  }

  private evictLRU(): void {
    let oldest: CacheEntry<T> | null = null
    
    for (const entry of this.cache.values()) {
      if (!oldest || entry.lastAccessed < oldest.lastAccessed) {
        oldest = entry
      }
    }

    if (oldest) {
      this.delete(oldest.key)
    }
  }

  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  getSize(): number {
    return this.currentSize
  }

  getMaxSize(): number {
    return this.maxSize
  }

  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize
    while (this.currentSize > this.maxSize && this.cache.size > 0) {
      this.evictLRU()
    }
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }
}
