import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, OrbitControls } from '@react-three/drei'
import { XR, createXRStore } from '@react-three/xr'
import { useEffect, useMemo, type ReactNode } from 'react'
import { XXRContext, type XXRContextValue } from '../../core/context'
import type { CameraConfig, OrbitConfig, PerformanceConfig } from '../../core/types'
import { AssetsContext, type AssetsContextValue } from '../../assets/context'
import { TransitionManager } from '../../transitions/transition-manager'
import { PerfOverlay } from '../../devtools/perf-overlay'
import { SceneGraph } from '../../devtools/scene-graph'
import { PlacementGrid } from '../../devtools/placement-grid'
import { NavMap } from '../../devtools/nav-map'
import { StatsCollector } from '../../devtools/stats-collector'
import type { RendererStats } from '../../devtools/renderer-stats'

export type R3FCanvasProps = {
  readonly children: ReactNode
  readonly ctx: XXRContextValue
  readonly registry: AssetsContextValue
  readonly withXR?: boolean
  readonly withStats?: boolean
  readonly onStats?: (stats: RendererStats) => void
  readonly shadows?: boolean | 'basic' | 'percentage' | 'soft' | 'variance'
  readonly performance?: PerformanceConfig
  readonly camera?: CameraConfig
  readonly orbit?: OrbitConfig
}

export const R3FCanvas = ({ children, ctx, registry, withXR = false, withStats = false, onStats, shadows, performance, camera, orbit }: R3FCanvasProps) => {
  const store = useMemo(() => createXRStore({
    hand: { teleportPointer: true },
    controller: { teleportPointer: true },
  }), [])

  // Show/hide the @react-three/xr native overlay based on withXR
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll('div').forEach((el) => {
        if (el.shadowRoot) {
          let tag = el.shadowRoot.querySelector('style[data-xxr-xr]') as HTMLStyleElement | null
          if (!tag) {
            tag = document.createElement('style')
            tag.setAttribute('data-xxr-xr', '')
            el.shadowRoot.appendChild(tag)
          }
          tag.textContent = withXR ? '' : ':host { display: none !important; }'
        }
      })
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [withXR])

  // Clean up any active XR session on unmount
  useEffect(() => {
    return () => {
      const session = store.getState().session
      if (session) session.end().catch(() => {})
    }
  }, [store])

  const dpr = performance?.dpr ?? [1, 2]
  const frameloop = performance?.frameloop ?? 'always'
  const minDpr = performance?.minDpr ?? 0.5

  return (
    <>
      <Canvas
        style={{ width: '100%', height: '100%', outline: 'none' }}
        camera={{
          position: camera?.position ?? [0, 1.6, 3],
          fov: camera?.fov ?? 70,
        }}
        dpr={dpr}
        frameloop={frameloop}
        shadows={shadows}
        performance={{ min: minDpr }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        tabIndex={0}
      >
        <AssetsContext.Provider value={registry}>
          <XXRContext.Provider value={ctx}>
            <XR store={store}>
              {children}
            </XR>
            <TransitionManager />
            <PerfOverlay />
            <SceneGraph />
            <PlacementGrid />
            <NavMap />
            {performance?.adaptiveDpr && <AdaptiveDpr pixelated />}
            {performance?.adaptiveEvents && <AdaptiveEvents />}
            {withStats && onStats && <StatsCollector onStats={onStats} />}
            <OrbitControls
              makeDefault
              enabled={orbit?.enabled ?? true}
              enableDamping={orbit?.enableDamping ?? true}
              dampingFactor={orbit?.dampingFactor ?? 0.1}
              target={camera?.target ?? [0, 1.2, 0]}
              minDistance={orbit?.minDistance ?? 1}
              maxDistance={orbit?.maxDistance ?? 15}
              maxPolarAngle={orbit?.maxPolarAngle ?? Math.PI * 0.85}
              minPolarAngle={orbit?.minPolarAngle ?? Math.PI * 0.15}
              minAzimuthAngle={orbit?.minAzimuthAngle ?? -Infinity}
              maxAzimuthAngle={orbit?.maxAzimuthAngle ?? Infinity}
              rotateSpeed={orbit?.rotateSpeed ?? 1}
              zoomSpeed={orbit?.zoomSpeed ?? 1}
              panSpeed={orbit?.panSpeed ?? 1}
              enableRotate={orbit?.enableRotate ?? true}
              enableZoom={orbit?.enableZoom ?? true}
              enablePan={orbit?.enablePan ?? true}
              autoRotate={orbit?.autoRotate ?? false}
              autoRotateSpeed={orbit?.autoRotateSpeed ?? 2}
            />
          </XXRContext.Provider>
        </AssetsContext.Provider>
      </Canvas>
    </>
  )
}
