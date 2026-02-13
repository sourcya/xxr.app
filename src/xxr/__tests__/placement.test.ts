import { describe, it, expect } from 'vitest'
import { resolveAt, resolvePosition } from '../core/placement'

describe('resolveAt', () => {
  it('resolves front at mid distance for panel', () => {
    const [x, y, z] = resolveAt('front', undefined, undefined, 'panel')
    expect(x).toBeCloseTo(0, 2)
    expect(y).toBeCloseTo(1.5, 2)
    expect(z).toBeCloseTo(-3, 2)
  })

  it('resolves front at mid distance for hotspot', () => {
    const [x, y, z] = resolveAt('front', undefined, undefined, 'hotspot')
    expect(x).toBeCloseTo(0, 2)
    expect(y).toBeCloseTo(1.0, 2)
    expect(z).toBeCloseTo(-3, 2)
  })

  it('resolves front at mid distance for model', () => {
    const [x, y, z] = resolveAt('front', undefined, undefined, 'model')
    expect(x).toBeCloseTo(0, 2)
    expect(y).toBeCloseTo(0, 2)
    expect(z).toBeCloseTo(-3, 2)
  })

  it('resolves center slot at origin with component default height', () => {
    const [x, y, z] = resolveAt('center', undefined, undefined, 'model')
    expect(x).toBeCloseTo(0, 2)
    expect(y).toBeCloseTo(0, 2)
    expect(z).toBeCloseTo(0, 2)
  })

  it('resolves right at mid distance', () => {
    const [x, y, z] = resolveAt('right', undefined, undefined, 'hotspot')
    expect(x).toBeCloseTo(3, 2)
    expect(y).toBeCloseTo(1.0, 2)
    expect(z).toBeCloseTo(0, 1)
  })

  it('resolves left at mid distance', () => {
    const [x, y, z] = resolveAt('left', undefined, undefined, 'hotspot')
    expect(x).toBeCloseTo(-3, 2)
    expect(y).toBeCloseTo(1.0, 2)
    expect(z).toBeCloseTo(0, 1)
  })

  it('resolves back at mid distance', () => {
    const [x, y, z] = resolveAt('back', undefined, undefined, 'panel')
    expect(x).toBeCloseTo(0, 1)
    expect(y).toBeCloseTo(1.5, 2)
    expect(z).toBeCloseTo(3, 2)
  })

  it('respects near distance', () => {
    const [, , z] = resolveAt('front', 'near', undefined, 'panel')
    expect(z).toBeCloseTo(-1.5, 2)
  })

  it('respects far distance', () => {
    const [, , z] = resolveAt('front', 'far', undefined, 'panel')
    expect(z).toBeCloseTo(-5, 2)
  })

  it('respects height override', () => {
    const [, y] = resolveAt('front', undefined, 'overhead', 'model')
    expect(y).toBeCloseTo(2.5, 2)
  })

  it('respects ground height override', () => {
    const [, y] = resolveAt('front', undefined, 'ground', 'panel')
    expect(y).toBeCloseTo(0, 2)
  })

  it('resolves front-left diagonally', () => {
    const [x, , z] = resolveAt('front-left', undefined, undefined, 'panel')
    expect(x).toBeLessThan(0)
    expect(z).toBeLessThan(0)
  })

  it('resolves front-right diagonally', () => {
    const [x, , z] = resolveAt('front-right', undefined, undefined, 'panel')
    expect(x).toBeGreaterThan(0)
    expect(z).toBeLessThan(0)
  })

  it('defaults to front when at is undefined', () => {
    const [x, , z] = resolveAt(undefined, undefined, undefined, 'panel')
    expect(x).toBeCloseTo(0, 2)
    expect(z).toBeCloseTo(-3, 2)
  })
})

describe('resolveAt with Vec3', () => {
  it('returns Vec3 directly when at is a Vec3', () => {
    const pos = resolveAt([1, 2, 3], undefined, undefined, 'model')
    expect(pos).toEqual([1, 2, 3])
  })

  it('ignores distance and height when at is a Vec3', () => {
    const pos = resolveAt([5, 5, 5], 'far', 'overhead', 'panel')
    expect(pos).toEqual([5, 5, 5])
  })
})

describe('resolvePosition', () => {
  it('returns explicit position when provided', () => {
    const pos = resolvePosition([1, 2, 3], 'front', undefined, undefined, 'panel')
    expect(pos).toEqual([1, 2, 3])
  })

  it('falls back to resolveAt when no position provided', () => {
    const pos = resolvePosition(undefined, 'front', undefined, undefined, 'panel')
    expect(pos[0]).toBeCloseTo(0, 2)
    expect(pos[1]).toBeCloseTo(1.5, 2)
    expect(pos[2]).toBeCloseTo(-3, 2)
  })

  it('applies offset additively to resolved slot position', () => {
    const pos = resolvePosition(undefined, 'center', undefined, undefined, 'model', [0, 0.5, 0])
    expect(pos).toEqual([0, 0.5, 0])
  })

  it('applies offset additively to Vec3 at', () => {
    const pos = resolvePosition(undefined, [1, 0, -2], undefined, undefined, 'model', [0, 1, 0])
    expect(pos).toEqual([1, 1, -2])
  })

  it('applies offset additively to explicit position', () => {
    const pos = resolvePosition([2, 0, 3], undefined, undefined, undefined, 'model', [0, 0.5, -1])
    expect(pos).toEqual([2, 0.5, 2])
  })

  it('returns base position when offset is undefined', () => {
    const pos = resolvePosition(undefined, 'center', undefined, undefined, 'model')
    expect(pos[0]).toBeCloseTo(0, 2)
    expect(pos[1]).toBeCloseTo(0, 2)
    expect(pos[2]).toBeCloseTo(0, 2)
  })

  it('handles Vec3 at with no offset', () => {
    const pos = resolvePosition(undefined, [3, 1, -4], undefined, undefined, 'panel')
    expect(pos).toEqual([3, 1, -4])
  })
})
