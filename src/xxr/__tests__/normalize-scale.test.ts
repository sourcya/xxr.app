import { describe, it, expect } from 'vitest'
import { normalizeScale } from '../assets/loaders/normalize-scale'

describe('normalizeScale', () => {
  it('defaults to [1,1,1] when undefined', () => {
    expect(normalizeScale(undefined)).toEqual([1, 1, 1])
  })

  it('defaults to [1,1,1] when null', () => {
    expect(normalizeScale(null as any)).toEqual([1, 1, 1])
  })

  it('expands a scalar number to uniform Vec3', () => {
    expect(normalizeScale(2)).toEqual([2, 2, 2])
  })

  it('expands zero scalar', () => {
    expect(normalizeScale(0)).toEqual([0, 0, 0])
  })

  it('expands fractional scalar', () => {
    expect(normalizeScale(0.5)).toEqual([0.5, 0.5, 0.5])
  })

  it('passes through a Vec3 tuple unchanged', () => {
    expect(normalizeScale([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('passes through a negative Vec3', () => {
    expect(normalizeScale([-1, -2, -3])).toEqual([-1, -2, -3])
  })
})
