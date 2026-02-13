import { Children, isValidElement, useCallback, useMemo, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { NavigationAction, TransitionType, Vec3, XXRProps } from './types'
import type { XXRContextValue } from './context'
import { createInitialState, navigationReducer } from '../navigation/router'
import { R3FCanvas } from '../runtime/r3f/canvas'
import { createAssetRegistry } from '../assets/registry'
import { LoadingScreen } from '../loading/loading-screen'
import type { LoadingProgress } from '../loading/use-loading-progress'
import { EMPTY_STATS, type RendererStats } from '../devtools/renderer-stats'
import { StatsMonitor } from '../devtools/stats-monitor'
import { StressContext } from '../devtools/stress-context'
import { StressControls } from '../devtools/stress-controls'

const IDLE_PROGRESS: LoadingProgress = { active: false, progress: 100, loaded: 0, total: 0, errors: [] }

const collectSceneIds = (children: ReactNode): readonly string[] => {
  const ids: string[] = []
  Children.forEach(children, (child) => {
    if (isValidElement(child) && typeof child.props === 'object' && child.props !== null && 'id' in child.props) {
      ids.push(child.props.id as string)
    }
  })
  return ids
}

const computeProgress = (registry: ReturnType<typeof createAssetRegistry>): LoadingProgress => {
  const all = registry.getAll()
  if (all.length === 0) return IDLE_PROGRESS

  const total = all.length
  const loaded = all.filter((e) => e.status === 'loaded').length
  const errors = all.filter((e) => e.status === 'error').map((e) => e.id)
  const active = loaded + errors.length < total
  const progress = total > 0 ? Math.round(((loaded + errors.length) / total) * 100) : 100

  return { active, progress, loaded, total, errors }
}

export const XXR = ({ start, devtools = false, withXR = false, withLoading = false, withProgress = false, withStats = false, withStressTest = false, shadows, performance, camera, orbit, children }: XXRProps) => {
  const sceneIds = useMemo(() => collectSceneIds(children), [children])

  const registry = useMemo(() => createAssetRegistry(), [])

  const [state, dispatch] = useReducer(
    (s: ReturnType<typeof createInitialState>, a: NavigationAction) =>
      navigationReducer(s, a, start),
    start,
    createInitialState,
  )

  const [playerPosition, setPlayerPosition] = useState<Vec3>([0, 0, 0])

  // Stats state (lifted out of canvas so StatsMonitor can read it)
  const [stats, setStats] = useState<RendererStats>(EMPTY_STATS)
  const handleStats = useCallback((s: RendererStats) => setStats(s), [])

  // Stress test state
  const [modelCount, setModelCount] = useState(4)
  const stressCtx = useMemo(() => ({ modelCount, setModelCount }), [modelCount])

  // Stable snapshot for useSyncExternalStore — only create new object when values change
  const prevProgressRef = useRef(IDLE_PROGRESS)
  const loadingProgress = useSyncExternalStore(
    registry.subscribe,
    () => {
      const next = computeProgress(registry)
      const prev = prevProgressRef.current
      if (
        prev.active === next.active &&
        prev.progress === next.progress &&
        prev.loaded === next.loaded &&
        prev.total === next.total &&
        prev.errors.length === next.errors.length
      ) {
        return prev
      }
      prevProgressRef.current = next
      return next
    },
  )

  const navigate = useCallback(
    (to: string, transition?: TransitionType) =>
      dispatch({ type: 'navigate', to, transition }),
    [],
  )

  const back = useCallback(() => dispatch({ type: 'back' }), [])
  const home = useCallback(() => dispatch({ type: 'home' }), [])

  const ctx: XXRContextValue = useMemo(() => ({
    activeScene: state.activeScene,
    sceneIds,
    transition: state.transition,
    navigate,
    back,
    home,
    playerPosition,
    setPlayerPosition,
    loading: withLoading && loadingProgress.active,
    devtools,
    camera,
    orbit,
  }), [state.activeScene, state.transition, sceneIds, navigate, back, home, playerPosition, setPlayerPosition, withLoading, loadingProgress.active, devtools, camera, orbit])

  const content = (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <R3FCanvas ctx={ctx} registry={registry} withXR={withXR} withStats={withStats} onStats={handleStats} shadows={shadows} performance={performance} camera={camera} orbit={orbit}>
        {children}
      </R3FCanvas>
      {withLoading && (
        <LoadingScreen progress={loadingProgress} withProgress={withProgress} />
      )}
      {withStats && <StatsMonitor stats={stats} />}
      {withStressTest && <StressControls />}
    </div>
  )

  return withStressTest
    ? <StressContext.Provider value={stressCtx}>{content}</StressContext.Provider>
    : content
}
