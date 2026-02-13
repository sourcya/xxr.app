import { createContext, useContext, useSyncExternalStore } from 'react'

export type AssetStatus = 'loading' | 'loaded' | 'error'

export type AssetType = 'model' | 'geometry' | 'environment' | 'svg' | 'points'

export type AssetRegistryEntry = {
  readonly id: string
  readonly type: AssetType
  readonly status: AssetStatus
  readonly data: any
  readonly error?: string
}

export type AssetsContextValue = {
  readonly register: (id: string, type: AssetType, data: any) => void
  readonly reportError: (id: string, type: AssetType, error: string) => void
  readonly reportLoading: (id: string, type: AssetType) => void
  readonly get: (id: string) => AssetRegistryEntry | undefined
  readonly getAll: () => readonly AssetRegistryEntry[]
  readonly subscribe: (cb: () => void) => () => void
}

export const AssetsContext = createContext<AssetsContextValue | null>(null)

export const useAssetsContext = (): AssetsContextValue | null =>
  useContext(AssetsContext)

const noopSubscribe = () => () => {}

export const useAsset = (id: string): AssetRegistryEntry | undefined => {
  const ctx = useContext(AssetsContext)
  return useSyncExternalStore(
    ctx?.subscribe ?? noopSubscribe,
    () => ctx?.get(id) ?? undefined,
  )
}
