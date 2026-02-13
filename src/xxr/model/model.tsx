import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AnimationMixer, Box3, Vector3 } from 'three'
import type { Group } from 'three'
import type { ModelProps, Vec3 } from '../core/types'
import { resolvePosition } from '../core/placement'
import { useSceneContext } from '../scene/context'
import { useAsset } from '../assets/context'
import { disposeObject3D } from '../utils/three-disposal'

const normalizeScale = (s?: number | Vec3): Vec3 =>
  s == null ? [1, 1, 1] : typeof s === 'number' ? [s, s, s] : s

const extractScene = (data: any) => {
  if (!data) return null
  if (data.scene) return data.scene.clone()
  if (data.clone) return data.clone()
  return null
}

const extractAnimations = (data: any) => {
  if (!data) return []
  return data.animations ?? []
}

// Reuse across all Model instances to avoid GC pressure
const _box3 = new Box3()

export const Model = ({
  asset, src: _src, at, height, distance, position, offset, lookAt,
  scale, rotation, castShadow, receiveShadow, animate = false, grounded = false,
}: ModelProps) => {
  const pos = resolvePosition(position, at, distance, height, 'model', offset)
  const entry = useAsset(asset)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const groupRef = useRef<Group>(null)

  // Track the actual data object to avoid re-cloning when only the entry wrapper changes
  const rawData = entry?.status === 'loaded' ? entry.data : null

  const scene = useMemo(() => {
    if (!rawData) return null
    return extractScene(rawData)
  }, [rawData])

  const animations = useMemo(() => {
    if (!rawData) return []
    return extractAnimations(rawData)
  }, [rawData])

  // Dispose scene on unmount or when scene changes
  useEffect(() => {
    return () => {
      if (scene) {
        disposeObject3D(scene)
      }
    }
  }, [scene])

  useEffect(() => {
    if (!animate || !scene || animations.length === 0) return
    const mixer = new AnimationMixer(scene)
    for (const clip of animations) {
      mixer.clipAction(clip).play()
    }
    mixerRef.current = mixer
    return () => { 
      mixer.stopAllAction()
      mixer.uncacheRoot(scene)
      mixerRef.current = null
    }
  }, [animate, scene, animations])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
  })

  const { groundY } = useSceneContext()

  const groundedOffset = useMemo(() => {
    if (!grounded || !scene) return 0
    _box3.setFromObject(scene)
    return groundY - _box3.min.y
  }, [grounded, scene, groundY])

  const finalPos: Vec3 = groundedOffset
    ? [pos[0], pos[1] + groundedOffset, pos[2]]
    : pos

  useFrame(({ camera }) => {
    if (!groupRef.current || !lookAt || rotation) return
    if (lookAt === 'camera') {
      groupRef.current.lookAt(camera.position)
    }
  })

  useEffect(() => {
    if (!groupRef.current || !lookAt || lookAt === 'camera' || rotation) return
    const target = lookAt === 'center' ? new Vector3(0, 0, 0) : new Vector3(...lookAt)
    groupRef.current.lookAt(target)
  }, [lookAt, rotation])

  if (!scene) return null

  return (
    <group ref={groupRef} position={finalPos} rotation={lookAt ? undefined : rotation}>
      <primitive
        object={scene}
        scale={normalizeScale(scale)}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      />
    </group>
  )
}
