import type { AssetEntry } from './manifest'

export type PrefetchPriority = 'high' | 'normal' | 'low'

export type PrefetchEntry = {
  readonly asset: AssetEntry
  readonly priority: PrefetchPriority
}

export const prioritizeAssets = (
  assets: readonly AssetEntry[],
  activeSceneId: string,
  adjacentSceneIds: readonly string[],
): readonly PrefetchEntry[] => {
  const entries: PrefetchEntry[] = []

  for (const asset of assets) {
    if (asset.sceneId === activeSceneId) {
      entries.push({ asset, priority: 'high' })
    } else if (adjacentSceneIds.includes(asset.sceneId)) {
      entries.push({ asset, priority: 'normal' })
    } else {
      entries.push({ asset, priority: 'low' })
    }
  }

  return entries.sort((a, b) => {
    const order: Record<PrefetchPriority, number> = { high: 0, normal: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })
}

export const getAdjacentSceneIds = (
  sceneIds: readonly string[],
  activeSceneId: string,
): readonly string[] => {
  const idx = sceneIds.indexOf(activeSceneId)
  if (idx === -1) return []
  const adjacent: string[] = []
  if (idx > 0) adjacent.push(sceneIds[idx - 1])
  if (idx < sceneIds.length - 1) adjacent.push(sceneIds[idx + 1])
  return adjacent
}
