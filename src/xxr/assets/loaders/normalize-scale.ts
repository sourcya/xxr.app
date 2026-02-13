import type { Vec3 } from '../../core/types'

export const normalizeScale = (s?: number | Vec3): Vec3 =>
  s == null ? [1, 1, 1] : typeof s === 'number' ? [s, s, s] : s
