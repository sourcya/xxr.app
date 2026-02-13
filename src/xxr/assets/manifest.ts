import type { SceneDescriptor } from '../core/types'

export type AssetEntry = {
  readonly type: 'model' | 'environment' | 'texture'
  readonly src: string
  readonly sceneId: string
}

const DREI_PRESETS = new Set([
  'apartment', 'city', 'dawn', 'forest', 'lobby', 'night',
  'park', 'studio', 'sunset', 'warehouse',
])

const isDreiPreset = (value: string): boolean =>
  DREI_PRESETS.has(value)

export const buildManifest = (
  scenes: readonly SceneDescriptor[],
  sceneAssets: Record<string, readonly string[]>,
): readonly AssetEntry[] =>
  scenes.flatMap((scene) => {
    const entries: AssetEntry[] = []

    // Handle background config
    if (scene.background) {
      let bgSrc: string | null = null
      
      if (typeof scene.background === 'object') {
        if (scene.background.type === 'asset' || scene.background.type === 'file') {
          bgSrc = scene.background.value
        }
      } else if (!isDreiPreset(scene.background)) {
        bgSrc = scene.background
      }
      
      if (bgSrc) {
        entries.push({
          type: 'environment',
          src: bgSrc,
          sceneId: scene.id,
        })
      }
    }

    const models = sceneAssets[scene.id] ?? []
    models.forEach((src) => {
      entries.push({
        type: 'model',
        src,
        sceneId: scene.id,
      })
    })

    return entries
  })
