import { describe, it, expect } from 'vitest'
import * as loaders from '../assets/loaders'

describe('asset loaders barrel exports', () => {
  const expectedLoaders = [
    'GLB', 'FBX', 'DAE', 'TDS', 'KMZ',
    'STL', 'PLY', 'XYZ',
    'HDR', 'EXR',
    'SVG',
    'IFC',
  ] as const

  for (const name of expectedLoaders) {
    it(`exports ${name} loader as a function`, () => {
      expect(loaders[name]).toBeDefined()
      expect(typeof loaders[name]).toBe('function')
    })
  }

  it('exports exactly 12 loaders', () => {
    const exportedFunctions = Object.entries(loaders).filter(
      ([, v]) => typeof v === 'function',
    )
    expect(exportedFunctions.length).toBe(12)
  })
})
