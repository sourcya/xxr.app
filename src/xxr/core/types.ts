import type { ReactNode } from 'react'

// ── Placement System ──

export type PlacementSlot =
  | 'front'
  | 'front-left'
  | 'front-right'
  | 'left'
  | 'right'
  | 'back'
  | 'back-left'
  | 'back-right'
  | 'center'

export type PlacementHeight = 'ground' | 'eye' | 'overhead'

export type PlacementDistance = 'near' | 'mid' | 'far'

export type ComponentType = 'panel' | 'hotspot' | 'model' | 'floor' | 'hero'

export type Vec3 = [number, number, number]

export type PlacementProps = {
  readonly at?: PlacementSlot | Vec3
  readonly height?: PlacementHeight
  readonly distance?: PlacementDistance
  readonly offset?: Vec3
  readonly lookAt?: 'camera' | 'center' | Vec3
  /** @deprecated Use `at` with a Vec3 instead */
  readonly position?: Vec3
}

// ── Transition Types ──

export type TransitionType = 'none' | 'fade' | 'dissolve'

// ── Navigation ──

export type NavigationState = {
  readonly activeScene: string
  readonly history: readonly string[]
  readonly transition: TransitionType
}

export type NavigationAction =
  | { readonly type: 'navigate'; readonly to: string; readonly transition?: TransitionType }
  | { readonly type: 'back' }
  | { readonly type: 'home' }

// ── Scene ──

export type DreiPreset = 
  | 'apartment' 
  | 'city' 
  | 'dawn' 
  | 'forest' 
  | 'lobby' 
  | 'night'
  | 'park' 
  | 'studio' 
  | 'sunset' 
  | 'warehouse'

export type BackgroundConfig = 
  | { readonly type: 'color'; readonly value: string }
  | { readonly type: 'preset'; readonly value: DreiPreset }
  | { readonly type: 'asset'; readonly value: string }
  | { readonly type: 'file'; readonly value: string }
  | string // Legacy string support for backward compatibility

// ── Lighting ──

export type ShadowConfig = {
  readonly enabled?: boolean
  readonly mapSize?: number
  readonly bias?: number
  readonly radius?: number
}

export type LightingPreset = 'studio' | 'outdoor' | 'dim'

export type LightingConfig = {
  readonly ambient?: number
  readonly ambientColor?: string
  readonly directional?: number
  readonly directionalColor?: string
  readonly direction?: Vec3
  readonly shadows?: boolean | ShadowConfig
}

// ── Camera ──

export type CameraConfig = {
  readonly position?: Vec3
  readonly target?: Vec3
  readonly fov?: number
}

export type OrbitConfig = {
  readonly enabled?: boolean
  readonly minDistance?: number
  readonly maxDistance?: number
  readonly minPolarAngle?: number
  readonly maxPolarAngle?: number
  readonly minAzimuthAngle?: number
  readonly maxAzimuthAngle?: number
  readonly rotateSpeed?: number
  readonly zoomSpeed?: number
  readonly panSpeed?: number
  readonly enableRotate?: boolean
  readonly enableZoom?: boolean
  readonly enablePan?: boolean
  readonly enableDamping?: boolean
  readonly dampingFactor?: number
  readonly autoRotate?: boolean
  readonly autoRotateSpeed?: number
}

export type SceneDescriptor = {
  readonly id: string
  readonly background?: BackgroundConfig
  readonly lighting?: LightingPreset | LightingConfig
  readonly transition?: TransitionType
}

// ── Performance ──

export type PerformanceConfig = {
  /** Device pixel ratio — single number or [min, max] clamp. Defaults to [1, 2]. */
  readonly dpr?: number | [number, number]
  /** Frameloop mode: 'always' (default), 'demand' (only when props change), 'never'. */
  readonly frameloop?: 'always' | 'demand' | 'never'
  /** Enable adaptive DPR — auto-scales pixel ratio when framerate drops. */
  readonly adaptiveDpr?: boolean
  /** Enable adaptive events — disables raycaster during performance regression. */
  readonly adaptiveEvents?: boolean
  /** Minimum DPR during adaptive regression. Defaults to 0.5. */
  readonly minDpr?: number
}

// ── Component Props ──

export type XXRProps = {
  readonly start: string
  readonly devtools?: boolean
  readonly withXR?: boolean
  readonly withLoading?: boolean
  readonly withProgress?: boolean
  readonly withStats?: boolean
  readonly withStressTest?: boolean
  readonly shadows?: boolean | 'basic' | 'percentage' | 'soft' | 'variance'
  readonly performance?: PerformanceConfig
  readonly camera?: CameraConfig
  readonly orbit?: OrbitConfig
  readonly children: ReactNode
}

export type SceneProps = {
  readonly id: string
  readonly background?: BackgroundConfig
  readonly lighting?: LightingPreset | LightingConfig
  readonly transition?: TransitionType
  readonly camera?: CameraConfig
  readonly orbit?: OrbitConfig
  readonly cameraTransition?: 'instant' | 'smooth'
  readonly cameraTransitionDuration?: number
  readonly children?: ReactNode
}

export type HotspotProps = PlacementProps & {
  readonly to: string
  readonly icon?: string
  readonly children?: ReactNode
}

export type PanelProps = PlacementProps & {
  readonly readable?: boolean
  readonly near?: number
  readonly children?: ReactNode
}

export type ModelProps = PlacementProps & {
  readonly asset: string
  readonly src?: string
  readonly scale?: number | Vec3
  readonly rotation?: Vec3
  readonly castShadow?: boolean
  readonly receiveShadow?: boolean
  readonly animate?: boolean
  readonly grounded?: boolean
}

export type FloorProps = {
  readonly size?: number
  readonly teleportable?: boolean
  readonly asset?: string
  readonly position?: Vec3
  readonly color?: string
  readonly opacity?: number
  readonly visible?: boolean
  readonly grid?: boolean
  readonly gridSize?: number
  readonly contactShadows?: boolean
}

export type HeroMode = 'first-person' | 'third-person'

export type HeroProps = {
  readonly as?: HeroMode
  readonly character?: string
  readonly speed?: number
  // First-person
  readonly mouseSensitivity?: number
  // Third-person
  readonly followOffset?: Vec3
  readonly followDamping?: number
  readonly rotationSpeed?: number
  // Animation clip names
  readonly idleClip?: string
  readonly walkClip?: string
  readonly runClip?: string
}

// ── Interactions ──

export type GazeProps = PlacementProps & {
  readonly duration?: number
  readonly onGaze?: () => void
  readonly children?: ReactNode
}

export type PointerProps = PlacementProps & {
  readonly onActivate?: () => void
  readonly children?: ReactNode
}

// ── Asset Loaders ──

export type AssetLoadHandler = {
  readonly onLoad?: () => void
  readonly onError?: (error: Error) => void
}

export type AssetLoaderBaseProps = AssetLoadHandler & {
  readonly id: string
  readonly src: string
}

export type ModelAssetProps = AssetLoaderBaseProps
export type GeometryAssetProps = AssetLoaderBaseProps
export type EnvironmentAssetProps = AssetLoaderBaseProps
export type SVGAssetProps = AssetLoaderBaseProps

export type AssetsProps = {
  readonly children: ReactNode
  readonly onAllLoaded?: () => void
}
