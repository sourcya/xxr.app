import type { AssetRegistryEntry, AssetType, AssetsContextValue } from './context'
import { disposeObject3D, disposeTexture } from '../utils/three-disposal'

export const createAssetRegistry = (): AssetsContextValue & {
  remove: (id: string) => void
  clear: () => void
  gc: (ids: string[]) => void
} => {
  const map = new Map<string, AssetRegistryEntry>()
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const l of listeners) l()
  }

  const subscribe = (cb: () => void) => {
    listeners.add(cb)
    return () => { listeners.delete(cb) }
  }

  const register = (id: string, type: AssetType, data: any) => {
    map.set(id, { id, type, status: 'loaded', data })
    notify()
  }

  const reportError = (id: string, type: AssetType, error: string) => {
    map.set(id, { id, type, status: 'error', data: null, error })
    notify()
  }

  const reportLoading = (id: string, type: AssetType) => {
    if (!map.has(id)) {
      map.set(id, { id, type, status: 'loading', data: null })
      notify()
    }
  }

  const get = (id: string) => map.get(id)

  const getAll = (): readonly AssetRegistryEntry[] => Array.from(map.values())

  const remove = (id: string) => {
    const entry = map.get(id)
    if (entry && entry.status === 'loaded') {
      // Dispose resources based on type
      if (entry.type === 'model' && entry.data) {
        if (entry.data.scene) {
          disposeObject3D(entry.data.scene)
        } else {
          disposeObject3D(entry.data)
        }
      } else if (entry.type === 'environment' && entry.data) {
        disposeTexture(entry.data)
      }
    }
    map.delete(id)
    notify()
  }

  const clear = () => {
    for (const id of map.keys()) {
      remove(id)
    }
  }

  const gc = (ids: string[]) => {
    for (const id of ids) {
      remove(id)
    }
  }

  return { register, reportError, reportLoading, get, getAll, subscribe, remove, clear, gc }
}
