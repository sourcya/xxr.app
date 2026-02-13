import type { ComponentType, PlacementDistance, PlacementHeight, PlacementSlot, Vec3 } from './types'

const SLOT_ANGLES: Record<PlacementSlot, number> = {
  'front': 0,
  'front-left': Math.PI / 4,
  'front-right': -Math.PI / 4,
  'left': Math.PI / 2,
  'right': -Math.PI / 2,
  'back': Math.PI,
  'back-left': (3 * Math.PI) / 4,
  'back-right': -(3 * Math.PI) / 4,
  'center': 0,
}

const DISTANCE_VALUES: Record<PlacementDistance, number> = {
  near: 1.5,
  mid: 3,
  far: 5,
}

const DEFAULT_HEIGHTS: Record<ComponentType, number> = {
  panel: 1.5,
  hotspot: 1.0,
  model: 0,
  floor: 0,
  hero: 0,
}

const HEIGHT_VALUES: Record<PlacementHeight, number> = {
  ground: 0,
  eye: 1.5,
  overhead: 2.5,
}

const isVec3 = (v: unknown): v is Vec3 =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === 'number')

export const resolveAt = (
  at: PlacementSlot | Vec3 | undefined,
  distance: PlacementDistance | undefined,
  height: PlacementHeight | undefined,
  componentType: ComponentType,
): Vec3 => {
  if (isVec3(at)) return at

  const slot = at ?? 'front'
  const dist = slot === 'center' ? 0 : DISTANCE_VALUES[distance ?? 'mid']
  const angle = SLOT_ANGLES[slot]
  const y = height ? HEIGHT_VALUES[height] : DEFAULT_HEIGHTS[componentType]

  const x = -Math.sin(angle) * dist
  const z = -Math.cos(angle) * dist

  return [round(x), round(y), round(z)]
}

const addVec3 = (a: Vec3, b: Vec3): Vec3 =>
  [round(a[0] + b[0]), round(a[1] + b[1]), round(a[2] + b[2])]

export const resolvePosition = (
  position: Vec3 | undefined,
  at: PlacementSlot | Vec3 | undefined,
  distance: PlacementDistance | undefined,
  height: PlacementHeight | undefined,
  componentType: ComponentType,
  offset?: Vec3,
): Vec3 => {
  const base = position ?? resolveAt(at, distance, height, componentType)
  return offset ? addVec3(base, offset) : base
}

const round = (n: number): number =>
  Math.round(n * 1000) / 1000
