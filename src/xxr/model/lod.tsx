import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, type Object3D } from 'three'

export type LODLevel = {
  readonly distance: number
  readonly object: Object3D
}

export type LODProps = {
  readonly levels: LODLevel[]
  readonly position?: [number, number, number]
  readonly hysteresis?: number
}

export const LOD = ({ levels, position = [0, 0, 0], hysteresis = 0.1 }: LODProps) => {
  const groupRef = useRef<Group>(null)
  const activeIndexRef = useRef(0)
  const lastDistanceRef = useRef(0)

  // Add all level objects to the group and set initial visibility
  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    group.clear()

    // Add all levels, only first visible
    for (let i = 0; i < levels.length; i++) {
      const obj = levels[i].object
      obj.visible = i === 0
      group.add(obj as any)
    }
    activeIndexRef.current = 0

    return () => {
      group.clear()
    }
  }, [levels])

  useFrame(({ camera }) => {
    const group = groupRef.current
    if (!group || levels.length === 0) return

    const dx = camera.position.x - position[0]
    const dy = camera.position.y - position[1]
    const dz = camera.position.z - position[2]
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // Only update if distance changed significantly (hysteresis)
    if (Math.abs(distance - lastDistanceRef.current) > hysteresis) {
      lastDistanceRef.current = distance

      // Find appropriate LOD level
      let newIndex = levels.length - 1
      for (let i = 0; i < levels.length; i++) {
        if (distance < levels[i].distance) {
          newIndex = i
          break
        }
      }

      if (newIndex !== activeIndexRef.current) {
        // Toggle visibility directly — no React re-render
        const children = group.children
        if (children[activeIndexRef.current]) children[activeIndexRef.current].visible = false
        if (children[newIndex]) children[newIndex].visible = true
        activeIndexRef.current = newIndex
      }
    }
  })

  if (levels.length === 0) return null

  return <group ref={groupRef} position={position} />
}
