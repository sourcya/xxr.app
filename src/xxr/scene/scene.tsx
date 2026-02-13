import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { SceneProps, BackgroundConfig, LightingConfig, LightingPreset, CameraConfig, OrbitConfig, ShadowConfig } from '../core/types'
import { useXXR } from '../core/context'
import { SceneContext } from './context'
import { useAsset } from '../assets/context'
import { R3FEnvironment } from '../runtime/r3f/environment'

const LIGHTING_PRESETS: Record<LightingPreset, LightingConfig> = {
  studio: { ambient: 0.5, directional: 0.8 },
  outdoor: { ambient: 0.3, directional: 1.0 },
  dim: { ambient: 0.1, directional: 0.3 },
}

const resolveLighting = (lighting?: LightingPreset | LightingConfig): LightingConfig => {
  if (!lighting) return LIGHTING_PRESETS.studio
  if (typeof lighting === 'string') return LIGHTING_PRESETS[lighting]
  return lighting
}

const AssetBackground = ({ assetId }: { assetId: string }) => {
  const { scene } = useThree()
  const entry = useAsset(assetId)

  useEffect(() => {
    if (entry?.status === 'loaded' && entry.type === 'environment' && entry.data) {
      const prevEnvironment = scene.environment
      const prevBackground = scene.background
      
      scene.environment = entry.data
      scene.background = entry.data
      
      return () => {
        if (scene.environment === entry.data) scene.environment = prevEnvironment
        if (scene.background === entry.data) scene.background = prevBackground
      }
    }
  }, [entry, scene])

  return null
}

const BackgroundRenderer = ({ background }: { background?: BackgroundConfig }) => {
  if (!background) return null

  // Handle explicit background config objects
  if (typeof background === 'object') {
    switch (background.type) {
      case 'color':
        return <R3FEnvironment background={background.value} />
      case 'preset':
        return <R3FEnvironment background={background.value} />
      case 'asset': {
        const assetEntry = useAsset(background.value)
        if (assetEntry?.type === 'environment') {
          return <AssetBackground assetId={background.value} />
        }
        return null
      }
      case 'file':
        return <R3FEnvironment background={background.value} />
      default:
        return null
    }
  }

  // Legacy string support - auto-detect type
  const assetEntry = useAsset(background)
  if (assetEntry?.type === 'environment') {
    return <AssetBackground assetId={background} />
  }

  return <R3FEnvironment background={background} />
}

const SceneCameraApplier = ({ camera, orbit, transition = 'instant', transitionDuration = 0.5 }: {
  camera?: CameraConfig
  orbit?: OrbitConfig
  transition?: 'instant' | 'smooth'
  transitionDuration?: number
}) => {
  const { camera: threeCamera, controls } = useThree()
  const ctx = useXXR()
  const lerpProgress = useRef(transition === 'smooth' ? 0 : 1)
  const startPos = useRef(new Vector3())
  const targetPos = useRef(new Vector3())
  const startTarget = useRef(new Vector3())
  const targetTarget = useRef(new Vector3())

  useEffect(() => {
    const mergedCamera = { ...ctx.camera, ...camera }
    const mergedOrbit = { ...ctx.orbit, ...orbit }

    if (transition === 'smooth') {
      startPos.current.copy(threeCamera.position)
      if (mergedCamera.position) targetPos.current.set(...mergedCamera.position)
      else targetPos.current.copy(threeCamera.position)

      const ctrl = controls as any
      if (ctrl?.target) {
        startTarget.current.copy(ctrl.target)
        if (mergedCamera.target) targetTarget.current.set(...mergedCamera.target)
        else targetTarget.current.copy(ctrl.target)
      }
      lerpProgress.current = 0
    } else {
      if (mergedCamera.position) threeCamera.position.set(...mergedCamera.position)
      lerpProgress.current = 1
    }

    if (mergedCamera.fov && 'fov' in threeCamera) {
      (threeCamera as any).fov = mergedCamera.fov;
      (threeCamera as any).updateProjectionMatrix()
    }

    const ctrl = controls as any
    if (ctrl) {
      if (transition === 'instant' && mergedCamera.target) ctrl.target?.set(...mergedCamera.target)
      if (mergedOrbit.enabled !== undefined) ctrl.enabled = mergedOrbit.enabled
      if (mergedOrbit.minDistance !== undefined) ctrl.minDistance = mergedOrbit.minDistance
      if (mergedOrbit.maxDistance !== undefined) ctrl.maxDistance = mergedOrbit.maxDistance
      if (mergedOrbit.minPolarAngle !== undefined) ctrl.minPolarAngle = mergedOrbit.minPolarAngle
      if (mergedOrbit.maxPolarAngle !== undefined) ctrl.maxPolarAngle = mergedOrbit.maxPolarAngle
      if (mergedOrbit.minAzimuthAngle !== undefined) ctrl.minAzimuthAngle = mergedOrbit.minAzimuthAngle
      if (mergedOrbit.maxAzimuthAngle !== undefined) ctrl.maxAzimuthAngle = mergedOrbit.maxAzimuthAngle
      if (mergedOrbit.rotateSpeed !== undefined) ctrl.rotateSpeed = mergedOrbit.rotateSpeed
      if (mergedOrbit.zoomSpeed !== undefined) ctrl.zoomSpeed = mergedOrbit.zoomSpeed
      if (mergedOrbit.panSpeed !== undefined) ctrl.panSpeed = mergedOrbit.panSpeed
      if (mergedOrbit.enableRotate !== undefined) ctrl.enableRotate = mergedOrbit.enableRotate
      if (mergedOrbit.enableZoom !== undefined) ctrl.enableZoom = mergedOrbit.enableZoom
      if (mergedOrbit.enablePan !== undefined) ctrl.enablePan = mergedOrbit.enablePan
      if (mergedOrbit.autoRotate !== undefined) ctrl.autoRotate = mergedOrbit.autoRotate
      if (mergedOrbit.autoRotateSpeed !== undefined) ctrl.autoRotateSpeed = mergedOrbit.autoRotateSpeed
      if (mergedOrbit.enableDamping !== undefined) ctrl.enableDamping = mergedOrbit.enableDamping
      if (mergedOrbit.dampingFactor !== undefined) ctrl.dampingFactor = mergedOrbit.dampingFactor
      ctrl.update?.()
    }
  }, [camera, orbit, ctx.camera, ctx.orbit, threeCamera, controls, transition])

  useFrame((_, delta) => {
    if (lerpProgress.current >= 1) return
    lerpProgress.current = Math.min(lerpProgress.current + delta / transitionDuration, 1)
    const t = lerpProgress.current
    const ease = t * (2 - t) // ease-out quad

    threeCamera.position.lerpVectors(startPos.current, targetPos.current, ease)
    const ctrl = controls as any
    if (ctrl?.target) {
      ctrl.target.lerpVectors(startTarget.current, targetTarget.current, ease)
      ctrl.update?.()
    }
  })

  return null
}

const resolveShadows = (shadows?: boolean | ShadowConfig) => {
  if (shadows === false) return { enabled: false, mapSize: 1024, bias: -0.0001, radius: 1 }
  if (shadows === true || shadows === undefined) return { enabled: true, mapSize: 1024, bias: -0.0001, radius: 1 }
  return { enabled: shadows.enabled ?? true, mapSize: shadows.mapSize ?? 1024, bias: shadows.bias ?? -0.0001, radius: shadows.radius ?? 1 }
}

export const Scene = ({ id, background, lighting, camera, orbit, cameraTransition, cameraTransitionDuration, children }: SceneProps) => {
  const { activeScene } = useXXR()
  const [groundY, setGroundYRaw] = useState(0)
  const setGroundY = useCallback((y: number) => setGroundYRaw(y), [])
  const sceneCtx = useMemo(() => ({ groundY, setGroundY }), [groundY, setGroundY])

  if (activeScene !== id) return null

  const light = resolveLighting(lighting)
  const shadow = resolveShadows(light.shadows)

  return (
    <SceneContext.Provider value={sceneCtx}>
      <BackgroundRenderer background={background} />
      {(camera || orbit) && <SceneCameraApplier camera={camera} orbit={orbit} transition={cameraTransition} transitionDuration={cameraTransitionDuration} />}
      <ambientLight
        intensity={light.ambient ?? 0.5}
        color={light.ambientColor ?? '#ffffff'}
      />
      <directionalLight
        position={light.direction ?? [5, 5, 5]}
        intensity={light.directional ?? 0.8}
        color={light.directionalColor ?? '#ffffff'}
        castShadow={shadow.enabled}
        shadow-mapSize-width={shadow.mapSize}
        shadow-mapSize-height={shadow.mapSize}
        shadow-bias={shadow.bias}
        shadow-radius={shadow.radius}
      />
      {children}
    </SceneContext.Provider>
  )
}
