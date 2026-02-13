import { describe, it, expect } from 'vitest'
import { Vector3 } from 'three'

// Pure function mirroring the camera-relative movement math in hero.tsx
const computeCameraRelativeMovement = (
  cameraDirection: Vector3,
  cameraUp: Vector3,
  inputX: number,
  inputZ: number,
  speed: number,
): Vector3 => {
  const forward = cameraDirection.clone()
  forward.y = 0
  forward.normalize()

  const right = new Vector3().crossVectors(cameraUp, forward).normalize()

  const move = new Vector3()
  move.addScaledVector(forward, -inputZ * speed)
  move.addScaledVector(right, -inputX * speed)
  return move
}

describe('camera-relative movement', () => {
  const UP = new Vector3(0, 1, 0)

  it('W moves forward along camera direction (projected to XZ)', () => {
    // Camera looking along -Z (default)
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, 0, -1, 1)
    expect(move.x).toBeCloseTo(0, 4)
    expect(move.y).toBeCloseTo(0, 4)
    expect(move.z).toBeCloseTo(-1, 4) // forward = -Z
  })

  it('S moves backward along camera direction', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, 0, 1, 1)
    expect(move.x).toBeCloseTo(0, 4)
    expect(move.z).toBeCloseTo(1, 4) // backward = +Z
  })

  it('A moves left relative to camera', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, -1, 0, 1)
    expect(move.x).toBeCloseTo(-1, 4)
    expect(move.z).toBeCloseTo(0, 4)
  })

  it('D moves right relative to camera', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, 1, 0, 1)
    expect(move.x).toBeCloseTo(1, 4)
    expect(move.z).toBeCloseTo(0, 4)
  })

  it('W with rotated camera moves in camera forward direction', () => {
    // Camera looking along +X (rotated 90° left)
    const dir = new Vector3(1, 0, 0)
    const move = computeCameraRelativeMovement(dir, UP, 0, -1, 1)
    expect(move.x).toBeCloseTo(1, 4) // forward = +X when camera faces +X
    expect(move.z).toBeCloseTo(0, 4)
  })

  it('diagonal input produces correct magnitude', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, -1, -1, 1)
    // Diagonal: forward-left, each component ~1 (not normalized input)
    expect(move.x).toBeCloseTo(-1, 4)
    expect(move.z).toBeCloseTo(-1, 4)
  })

  it('speed scales movement', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, 0, -1, 5)
    expect(move.z).toBeCloseTo(-5, 4)
  })

  it('camera Y component is ignored (stays on XZ plane)', () => {
    // Camera looking down at 45°
    const dir = new Vector3(0, -0.707, -0.707)
    const move = computeCameraRelativeMovement(dir, UP, 0, -1, 1)
    expect(move.y).toBeCloseTo(0, 4) // no vertical movement
    expect(move.z).toBeCloseTo(-1, 4)
  })

  it('no input produces zero movement', () => {
    const dir = new Vector3(0, 0, -1)
    const move = computeCameraRelativeMovement(dir, UP, 0, 0, 1)
    expect(move.length()).toBeCloseTo(0, 4)
  })
})
