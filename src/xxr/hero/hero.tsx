import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { XROrigin, useXRInputSourceState } from '@react-three/xr'
import { AnimationMixer, AnimationAction, AnimationClip, Vector3, Quaternion, Euler } from 'three'
import type { Group } from 'three'
import type { HeroProps, Vec3 } from '../core/types'
import { useXXR } from '../core/context'
import { useAsset } from '../assets/context'
import { disposeObject3D } from '../utils/three-disposal'

// ── Shared constants ──

const MOVEMENT_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const _forward = new Vector3()
const _right = new Vector3()
const _move = new Vector3()
const _targetQuat = new Quaternion()
const _euler = new Euler()

// ── Keyboard state hook ──

const useKeyboardState = () => {
  const keysRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const keys = keysRef.current
    const onKeyDown = (e: KeyboardEvent) => {
      if (MOVEMENT_KEYS.includes(e.code)) {
        e.preventDefault()
        keys.add(e.code)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (MOVEMENT_KEYS.includes(e.code)) {
        e.preventDefault()
        keys.delete(e.code)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      keys.clear()
    }
  }, [])

  return keysRef
}

// ── Camera-relative WASD for first-person (moves camera directly) ──

const useFPSMovement = (speed: number, ref: React.RefObject<Group | null>) => {
  const keysRef = useKeyboardState()

  useFrame(({ camera }, delta) => {
    const keys = keysRef.current
    if (keys.size === 0) return

    const s = speed * delta
    let inputZ = 0
    let inputX = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) inputZ -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) inputZ += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) inputX -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) inputX += 1

    // Camera forward/right projected onto XZ plane
    camera.getWorldDirection(_forward)
    _forward.y = 0
    _forward.normalize()
    _right.crossVectors(camera.up, _forward).normalize()

    _move.set(0, 0, 0)
    _move.addScaledVector(_forward, -inputZ * s)
    _move.addScaledVector(_right, -inputX * s)

    // Move XROrigin ref (for VR mode)
    if (ref.current) {
      ref.current.position.add(_move)
    }

    // Move camera directly (PointerLockControls owns rotation)
    camera.position.add(_move)
  })
}

// ── Camera-relative WASD for third-person (moves character, returns movement state) ──

const useTPSMovement = (speed: number, ref: React.RefObject<Group | null>, movingRef: React.MutableRefObject<boolean>) => {
  const keysRef = useKeyboardState()

  useFrame(({ camera }, delta) => {
    const keys = keysRef.current
    if (keys.size === 0) {
      movingRef.current = false
      return
    }

    const s = speed * delta
    let inputZ = 0
    let inputX = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) inputZ -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) inputZ += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) inputX -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) inputX += 1

    // Camera forward/right projected onto XZ plane
    camera.getWorldDirection(_forward)
    _forward.y = 0
    _forward.normalize()
    _right.crossVectors(camera.up, _forward).normalize()

    _move.set(0, 0, 0)
    _move.addScaledVector(_forward, -inputZ * s)
    _move.addScaledVector(_right, -inputX * s)

    if (ref.current) {
      ref.current.position.add(_move)
    }

    movingRef.current = _move.lengthSq() > 0.0001
  })
}

// ── Follow camera for third-person (orbit target tracks character) ──

const useFollowCamera = (
  ref: React.RefObject<Group | null>,
  damping: number,
) => {
  useFrame(({ controls }, delta) => {
    if (!ref.current) return
    const ctrl = controls as any
    if (!ctrl?.target) return

    const pos = ref.current.position
    const t = Math.min(damping * delta, 1)
    ctrl.target.lerp(pos, t)
    ctrl.update?.()
  })
}

// ── Character rotation toward movement direction ──

const useCharacterRotation = (
  ref: React.RefObject<Group | null>,
  movingRef: React.MutableRefObject<boolean>,
  rotationSpeed: number,
) => {
  const prevPos = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!ref.current || !movingRef.current) return

    const pos = ref.current.position
    const dx = pos.x - prevPos.current.x
    const dz = pos.z - prevPos.current.z

    if (dx * dx + dz * dz > 0.0001) {
      const angle = Math.atan2(dx, dz)
      _euler.set(0, angle, 0)
      _targetQuat.setFromEuler(_euler)
      ref.current.quaternion.slerp(_targetQuat, Math.min(rotationSpeed * delta, 1))
    }

    prevPos.current.copy(pos)
  })

  // Initialize prevPos
  useEffect(() => {
    if (ref.current) prevPos.current.copy(ref.current.position)
  })
}

// ── VR thumbstick ──

const useThumbstick = (speed: number, ref: React.RefObject<Group | null>) => {
  const controller = useXRInputSourceState('controller', 'right')

  useFrame((_, delta) => {
    if (!ref.current || !controller) return
    const thumbstick = controller.gamepad['xr-standard-thumbstick']
    if (!thumbstick) return
    ref.current.position.x += (thumbstick.xAxis ?? 0) * speed * delta
    ref.current.position.z += (thumbstick.yAxis ?? 0) * speed * delta
  })
}

// ── Character model with animation state machine ──

type CharacterModelProps = {
  readonly assetId: string
  readonly movingRef: React.MutableRefObject<boolean>
  readonly idleClip?: string
  readonly walkClip?: string
  readonly runClip?: string
}

const findClip = (animations: AnimationClip[], name?: string, fallbackIndex?: number): AnimationClip | null => {
  if (name) {
    const found = AnimationClip.findByName(animations, name)
    if (found) return found
  }
  if (fallbackIndex !== undefined && fallbackIndex < animations.length) {
    return animations[fallbackIndex]
  }
  return null
}

const CharacterModel = ({ assetId, movingRef, idleClip, walkClip, runClip: _runClip }: CharacterModelProps) => {
  const entry = useAsset(assetId)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const idleActionRef = useRef<AnimationAction | null>(null)
  const walkActionRef = useRef<AnimationAction | null>(null)
  const currentRef = useRef<'idle' | 'walk'>('idle')

  const scene = useMemo(() => {
    if (entry?.status !== 'loaded' || !entry.data) return null
    return entry.data.scene ? entry.data.scene.clone() : entry.data.clone?.() ?? null
  }, [entry])

  const animations = useMemo(() => {
    if (entry?.status !== 'loaded') return []
    return entry.data?.animations ?? []
  }, [entry])

  // Dispose scene on unmount or when scene changes
  useEffect(() => {
    return () => {
      if (scene) disposeObject3D(scene)
    }
  }, [scene])

  // Set up mixer and animation actions
  useEffect(() => {
    if (!scene || animations.length === 0) return
    const mixer = new AnimationMixer(scene)
    mixerRef.current = mixer

    const idle = findClip(animations, idleClip, 0)
    const walk = findClip(animations, walkClip, animations.length > 1 ? 1 : 0)

    if (idle) {
      const action = mixer.clipAction(idle)
      action.play()
      idleActionRef.current = action
    }
    if (walk && walk !== idle) {
      const action = mixer.clipAction(walk)
      action.setEffectiveWeight(0)
      action.play()
      walkActionRef.current = action
    }

    currentRef.current = 'idle'

    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(scene)
      mixerRef.current = null
      idleActionRef.current = null
      walkActionRef.current = null
    }
  }, [scene, animations, idleClip, walkClip])

  // Update mixer + crossfade based on movement state
  useFrame((_, delta) => {
    mixerRef.current?.update(delta)

    const moving = movingRef.current
    const idleAction = idleActionRef.current
    const walkAction = walkActionRef.current

    if (!idleAction || !walkAction) return

    if (moving && currentRef.current === 'idle') {
      currentRef.current = 'walk'
      walkAction.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).play()
      idleAction.crossFadeTo(walkAction, 0.3, true)
    } else if (!moving && currentRef.current === 'walk') {
      currentRef.current = 'idle'
      idleAction.reset().setEffectiveWeight(1).setEffectiveTimeScale(1).play()
      walkAction.crossFadeTo(idleAction, 0.3, true)
    }
  })

  if (!scene) return null
  return <primitive object={scene} scale={[1, 1, 1]} />
}

// ── First-Person component ──

const FirstPerson = ({ speed, mouseSensitivity }: { speed: number; mouseSensitivity: number }) => {
  const { playerPosition } = useXXR()
  const ref = useRef<Group>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(...playerPosition)
    }
  }, [playerPosition])

  useFPSMovement(speed, ref)
  useThumbstick(speed, ref)

  return (
    <>
      <PointerLockControls makeDefault pointerSpeed={mouseSensitivity} />
      <XROrigin ref={ref} />
    </>
  )
}

// ── Third-Person component ──

const ThirdPerson = ({
  speed,
  character,
  followOffset,
  followDamping,
  rotationSpeed,
  idleClip,
  walkClip,
  runClip,
}: {
  speed: number
  character?: string
  followOffset: Vec3
  followDamping: number
  rotationSpeed: number
  idleClip?: string
  walkClip?: string
  runClip?: string
}) => {
  const { playerPosition } = useXXR()
  const ref = useRef<Group>(null)
  const movingRef = useRef(false)

  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(...playerPosition)
    }
  }, [playerPosition])

  // Set initial camera offset relative to character
  const { camera } = useThree()
  useEffect(() => {
    if (ref.current) {
      camera.position.set(
        ref.current.position.x + followOffset[0],
        ref.current.position.y + followOffset[1],
        ref.current.position.z + followOffset[2],
      )
    }
  }, [camera, followOffset])

  useTPSMovement(speed, ref, movingRef)
  useFollowCamera(ref, followDamping)
  useCharacterRotation(ref, movingRef, rotationSpeed)
  useThumbstick(speed, ref)

  return (
    <group ref={ref}>
      <XROrigin />
      {character && (
        <CharacterModel
          assetId={character}
          movingRef={movingRef}
          idleClip={idleClip}
          walkClip={walkClip}
          runClip={runClip}
        />
      )}
    </group>
  )
}

// ── Public Hero component ──

export const Hero = ({
  as: mode = 'first-person',
  character,
  speed = 3,
  mouseSensitivity = 1,
  followOffset = [0, 3, -5],
  followDamping = 5,
  rotationSpeed = 8,
  idleClip,
  walkClip,
  runClip,
}: HeroProps) => {
  if (mode === 'third-person') {
    return (
      <ThirdPerson
        speed={speed}
        character={character}
        followOffset={followOffset}
        followDamping={followDamping}
        rotationSpeed={rotationSpeed}
        idleClip={idleClip}
        walkClip={walkClip}
        runClip={runClip}
      />
    )
  }
  return <FirstPerson speed={speed} mouseSensitivity={mouseSensitivity} />
}
