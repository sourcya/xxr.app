import type { Vec3 } from '../core/types'

export type RaycastHit = {
  readonly point: Vec3
  readonly distance: number
  readonly objectName: string
}

export type RaycastOptions = {
  readonly origin: Vec3
  readonly direction: Vec3
  readonly maxDistance?: number
}

// Runtime-neutral raycast result type
// Actual raycasting is performed by the R3F runtime via Three.js Raycaster
// This module provides the pure data types and utility functions

export const createRayFromPointer = (
  normalizedX: number,
  normalizedY: number,
): { x: number; y: number } => ({
  x: (normalizedX * 2) - 1,
  y: -(normalizedY * 2) + 1,
})

export const isHitWithinDistance = (
  hit: RaycastHit,
  maxDistance: number,
): boolean => hit.distance <= maxDistance
