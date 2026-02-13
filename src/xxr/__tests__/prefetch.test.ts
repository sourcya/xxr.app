import { describe, it, expect } from 'vitest'
import { prioritizeAssets, getAdjacentSceneIds } from '../assets/prefetch'
import type { AssetEntry } from '../assets/manifest'

const assets: AssetEntry[] = [
  { type: 'model', src: '/a.glb', sceneId: 'scene-1' },
  { type: 'model', src: '/b.glb', sceneId: 'scene-2' },
  { type: 'environment', src: '/c.hdr', sceneId: 'scene-3' },
  { type: 'model', src: '/d.glb', sceneId: 'scene-3' },
]

describe('getAdjacentSceneIds', () => {
  const scenes = ['scene-1', 'scene-2', 'scene-3']

  it('returns next scene for first scene', () => {
    expect(getAdjacentSceneIds(scenes, 'scene-1')).toEqual(['scene-2'])
  })

  it('returns prev and next for middle scene', () => {
    expect(getAdjacentSceneIds(scenes, 'scene-2')).toEqual(['scene-1', 'scene-3'])
  })

  it('returns prev scene for last scene', () => {
    expect(getAdjacentSceneIds(scenes, 'scene-3')).toEqual(['scene-2'])
  })

  it('returns empty for unknown scene', () => {
    expect(getAdjacentSceneIds(scenes, 'unknown')).toEqual([])
  })
})

describe('prioritizeAssets', () => {
  it('prioritizes active scene assets as high', () => {
    const result = prioritizeAssets(assets, 'scene-1', ['scene-2'])
    expect(result[0].priority).toBe('high')
    expect(result[0].asset.sceneId).toBe('scene-1')
  })

  it('prioritizes adjacent scene assets as normal', () => {
    const result = prioritizeAssets(assets, 'scene-1', ['scene-2'])
    const normal = result.filter((e) => e.priority === 'normal')
    expect(normal.length).toBe(1)
    expect(normal[0].asset.sceneId).toBe('scene-2')
  })

  it('prioritizes distant scene assets as low', () => {
    const result = prioritizeAssets(assets, 'scene-1', ['scene-2'])
    const low = result.filter((e) => e.priority === 'low')
    expect(low.length).toBe(2)
    expect(low.every((e) => e.asset.sceneId === 'scene-3')).toBe(true)
  })

  it('sorts by priority: high → normal → low', () => {
    const result = prioritizeAssets(assets, 'scene-2', ['scene-1', 'scene-3'])
    const priorities = result.map((e) => e.priority)
    expect(priorities).toEqual(['high', 'normal', 'normal', 'normal'])
  })

  it('handles all assets in active scene', () => {
    const singleScene: AssetEntry[] = [
      { type: 'model', src: '/a.glb', sceneId: 'scene-1' },
      { type: 'model', src: '/b.glb', sceneId: 'scene-1' },
    ]
    const result = prioritizeAssets(singleScene, 'scene-1', [])
    expect(result.every((e) => e.priority === 'high')).toBe(true)
  })
})
