import type { AssetEntry } from './manifest'

export type LoadStatus = 'pending' | 'loading' | 'loaded' | 'error'

export type AssetState = {
  readonly entry: AssetEntry
  readonly status: LoadStatus
  readonly error?: string
}

// Unified asset loading tracker
// Runtime adapters (R3F: useGLTF.preload, etc.) plug into this
export const createAssetTracker = () => {
  const assets = new Map<string, AssetState>()

  const register = (entry: AssetEntry): void => {
    if (!assets.has(entry.src)) {
      assets.set(entry.src, { entry, status: 'pending' })
    }
  }

  const setStatus = (src: string, status: LoadStatus, error?: string): void => {
    const current = assets.get(src)
    if (current) {
      assets.set(src, { ...current, status, error })
    }
  }

  const getAll = (): readonly AssetState[] =>
    Array.from(assets.values())

  const getByScene = (sceneId: string): readonly AssetState[] =>
    Array.from(assets.values()).filter((a) => a.entry.sceneId === sceneId)

  const isSceneReady = (sceneId: string): boolean =>
    getByScene(sceneId).every((a) => a.status === 'loaded')

  return { register, setStatus, getAll, getByScene, isSceneReady }
}
