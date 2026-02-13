// Core
export { XXR } from './core/xxr'
export type { XXRProps, SceneProps, HotspotProps, PanelProps, ModelProps, FloorProps, HeroProps, GazeProps, PointerProps, AssetLoaderBaseProps, ModelAssetProps, GeometryAssetProps, EnvironmentAssetProps, SVGAssetProps, AssetsProps } from './core/types'
export type { PlacementSlot, PlacementHeight, PlacementDistance, Vec3, TransitionType, CameraConfig, OrbitConfig, LightingPreset, LightingConfig, ShadowConfig, PerformanceConfig } from './core/types'
export { useXXR } from './core/context'
export { resolveAt, resolvePosition } from './core/placement'

// Domain modules
export { Scene } from './scene'
export { Panel } from './panel'
export { Model } from './model'
export { Floor } from './floor'
export { Hero } from './hero'
export { Light } from './light'
export type { LightProps, LightType } from './light'

// Interactions
export { Hotspot, Gaze, Pointer } from './interactions'
export { createRayFromPointer, isHitWithinDistance } from './interactions'

// Transitions
export { FadeTransition, DissolveTransition } from './transitions'

// Navigation
export { createInitialState, navigationReducer } from './navigation'

// Assets
export { buildManifest, createAssetTracker, prioritizeAssets, getAdjacentSceneIds } from './assets'
export { Assets } from './assets'
export { useAsset } from './assets/context'
export { GLB, FBX, DAE, TDS, KMZ, STL, PLY, XYZ, HDR, EXR, SVG, IFC } from './assets'

// Loading
export { useLoadingProgress, LoadingScreen } from './loading'
export type { LoadingProgress, LoadingScreenProps } from './loading'

// Devtools
export { PerfOverlay, SceneGraph, PlacementGrid, NavMap, StatsCollector, StatsMonitor, EMPTY_STATS, StressGrid, useStressContext } from './devtools'
export type { RendererStats, StatsCollectorProps, StatsMonitorProps, StressGridProps, StressContextValue } from './devtools'