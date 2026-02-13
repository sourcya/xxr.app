import { describe, it, expect, vi } from 'vitest'
import { createAssetRegistry } from '../assets/registry'

describe('Asset registry — ID-based', () => {
  it('registers an asset by id', () => {
    const reg = createAssetRegistry()
    reg.register('fox', 'model', { scene: 'mock' })
    const entry = reg.get('fox')
    expect(entry?.id).toBe('fox')
    expect(entry?.status).toBe('loaded')
    expect(entry?.type).toBe('model')
    expect(entry?.data).toEqual({ scene: 'mock' })
  })

  it('tracks loading status', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('fox', 'model')
    expect(reg.get('fox')?.status).toBe('loading')
  })

  it('updates from loading to loaded', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('fox', 'model')
    reg.register('fox', 'model', { scene: 'loaded' })
    expect(reg.get('fox')?.status).toBe('loaded')
  })

  it('tracks error status', () => {
    const reg = createAssetRegistry()
    reg.reportLoading('fox', 'model')
    reg.reportError('fox', 'model', 'Network error')
    expect(reg.get('fox')?.status).toBe('error')
    expect(reg.get('fox')?.error).toBe('Network error')
  })

  it('notifies subscribers on register', () => {
    const reg = createAssetRegistry()
    const listener = vi.fn()
    reg.subscribe(listener)

    reg.register('a', 'model', {})
    expect(listener).toHaveBeenCalledOnce()
  })

  it('notifies subscribers on error', () => {
    const reg = createAssetRegistry()
    const listener = vi.fn()
    reg.subscribe(listener)

    reg.reportError('a', 'model', 'fail')
    expect(listener).toHaveBeenCalledOnce()
  })

  it('notifies subscribers on loading', () => {
    const reg = createAssetRegistry()
    const listener = vi.fn()
    reg.subscribe(listener)

    reg.reportLoading('a', 'model')
    expect(listener).toHaveBeenCalledOnce()
  })

  it('unsubscribe stops notifications', () => {
    const reg = createAssetRegistry()
    const listener = vi.fn()
    const unsub = reg.subscribe(listener)

    reg.register('a', 'model', {})
    expect(listener).toHaveBeenCalledOnce()

    unsub()
    reg.register('b', 'model', {})
    expect(listener).toHaveBeenCalledOnce()
  })

  it('onAllLoaded pattern via subscribe', () => {
    const reg = createAssetRegistry()
    const onAllLoaded = vi.fn()
    let fired = false

    reg.subscribe(() => {
      if (fired) return
      const all = reg.getAll()
      if (all.length > 0 && all.every((e) => e.status === 'loaded')) {
        fired = true
        onAllLoaded()
      }
    })

    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'environment')
    expect(onAllLoaded).not.toHaveBeenCalled()

    reg.register('a', 'model', {})
    expect(onAllLoaded).not.toHaveBeenCalled()

    reg.register('b', 'environment', {})
    expect(onAllLoaded).toHaveBeenCalledOnce()
  })

  it('does not fire onAllLoaded if any has error', () => {
    const reg = createAssetRegistry()
    const onAllLoaded = vi.fn()

    reg.subscribe(() => {
      const all = reg.getAll()
      if (all.length > 0 && all.every((e) => e.status === 'loaded')) {
        onAllLoaded()
      }
    })

    reg.reportLoading('a', 'model')
    reg.reportLoading('b', 'model')
    reg.register('a', 'model', {})
    reg.reportError('b', 'model', 'fail')

    expect(onAllLoaded).not.toHaveBeenCalled()
  })

  it('getAll returns all entries', () => {
    const reg = createAssetRegistry()
    reg.register('a', 'model', {})
    reg.register('b', 'environment', {})
    reg.reportError('c', 'geometry', 'fail')
    expect(reg.getAll().length).toBe(3)
  })

  it('returns undefined for unknown id', () => {
    const reg = createAssetRegistry()
    expect(reg.get('nonexistent')).toBeUndefined()
  })

  it('distinguishes asset types correctly', () => {
    const reg = createAssetRegistry()
    reg.register('env', 'environment', { texture: true })
    reg.register('mdl', 'model', { scene: true })
    reg.register('geo', 'geometry', { bufferGeometry: true })

    expect(reg.get('env')?.type).toBe('environment')
    expect(reg.get('mdl')?.type).toBe('model')
    expect(reg.get('geo')?.type).toBe('geometry')
  })
})
