import { describe, it, expect } from 'vitest'
import { createRayFromPointer, isHitWithinDistance } from '../interactions/raycast'
import type { RaycastHit } from '../interactions/raycast'

describe('createRayFromPointer', () => {
  it('maps center of screen to (0, 0)', () => {
    const result = createRayFromPointer(0.5, 0.5)
    expect(result.x).toBeCloseTo(0, 2)
    expect(result.y).toBeCloseTo(0, 2)
  })

  it('maps top-left to (-1, 1)', () => {
    const result = createRayFromPointer(0, 0)
    expect(result.x).toBeCloseTo(-1, 2)
    expect(result.y).toBeCloseTo(1, 2)
  })

  it('maps bottom-right to (1, -1)', () => {
    const result = createRayFromPointer(1, 1)
    expect(result.x).toBeCloseTo(1, 2)
    expect(result.y).toBeCloseTo(-1, 2)
  })
})

describe('isHitWithinDistance', () => {
  const hit: RaycastHit = { point: [1, 0, 0], distance: 5, objectName: 'test' }

  it('returns true when hit is within max distance', () => {
    expect(isHitWithinDistance(hit, 10)).toBe(true)
  })

  it('returns true when hit is exactly at max distance', () => {
    expect(isHitWithinDistance(hit, 5)).toBe(true)
  })

  it('returns false when hit exceeds max distance', () => {
    expect(isHitWithinDistance(hit, 3)).toBe(false)
  })
})
