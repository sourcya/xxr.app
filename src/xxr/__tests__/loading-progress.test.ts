import { describe, it, expect } from 'vitest'
import { createAssetRegistry } from '../assets/registry'

/**
 * Tests the loading progress computation logic that useLoadingProgress uses
 * against the asset registry. We test the pure logic here since hooks
 * require a React rendering context.
 */

const computeProgress = (registry: ReturnType<typeof createAssetRegistry>) => {
  const all = registry.getAll()
  if (all.length === 0) return { active: false, progress: 100, loaded: 0, total: 0, errors: [] as string[] }

  const total = all.length
  const loaded = all.filter((e) => e.status === 'loaded').length
  const errors = all.filter((e) => e.status === 'error').map((e) => e.id)
  const active = loaded + errors.length < total
  const progress = total > 0 ? Math.round(((loaded + errors.length) / total) * 100) : 100

  return { active, progress, loaded, total, errors }
}

describe('Loading progress computation', () => {
  it('returns idle state when no assets registered', () => {
    const reg = createAssetRegistry()
    const p = computeProgress(reg)
    expect(p.active).toBe(false)
    expect(p.progress).toBe(100)
    expect(p.loaded).toBe(0)
    expect(p.total).toBe(0)
    expect(p.errors).toEqual([])
  })

  it('reports active while assets are loading', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')

    const p = computeProgress(reg)
    expect(p.active).toBe(true)
    expect(p.progress).toBe(0)
    expect(p.loaded).toBe(0)
    expect(p.total).toBe(2)
  })

  it('tracks partial progress', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')
    reg.reportLoading('c', 'model')
    reg.register('a', 'model', { scene: 'ok' })

    const p = computeProgress(reg)
    expect(p.active).toBe(true)
    expect(p.progress).toBe(33)
    expect(p.loaded).toBe(1)
    expect(p.total).toBe(3)
  })

  it('reports 100% when all loaded', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'environment')
    reg.register('a', 'model', {})
    reg.register('b', 'environment', {})

    const p = computeProgress(reg)
    expect(p.active).toBe(false)
    expect(p.progress).toBe(100)
    expect(p.loaded).toBe(2)
    expect(p.total).toBe(2)
    expect(p.errors).toEqual([])
  })

  it('counts errors toward completion but tracks them', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')
    reg.register('a', 'model', {})
    reg.reportError('b', 'model', 'Network error')

    const p = computeProgress(reg)
    expect(p.active).toBe(false)
    expect(p.progress).toBe(100)
    expect(p.loaded).toBe(1)
    expect(p.errors).toEqual(['b'])
  })

  it('handles mixed loading/loaded/error states', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')
    reg.reportLoading('c', 'model')
    reg.reportLoading('d', 'model')
    reg.register('a', 'model', {})
    reg.register('b', 'model', {})
    reg.reportError('c', 'model', 'fail')
    // d still loading

    const p = computeProgress(reg)
    expect(p.active).toBe(true)
    expect(p.progress).toBe(75)
    expect(p.loaded).toBe(2)
    expect(p.total).toBe(4)
    expect(p.errors).toEqual(['c'])
  })

  it('updates reactively via subscribe', () => {
    const reg = createAssetRegistry()
    const snapshots: ReturnType<typeof computeProgress>[] = []

    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')

    reg.subscribe(() => {
      snapshots.push(computeProgress(reg))
    })

    reg.register('a', 'model', {})
    reg.register('b', 'model', {})

    expect(snapshots).toHaveLength(2)
    expect(snapshots[0].progress).toBe(50)
    expect(snapshots[0].active).toBe(true)
    expect(snapshots[1].progress).toBe(100)
    expect(snapshots[1].active).toBe(false)
  })
})
