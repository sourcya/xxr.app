import { useRef } from 'react'
import { useSyncExternalStore } from 'react'
import { useAssetsContext } from '../assets/context'

export type LoadingProgress = {
  /** Whether any assets are currently loading */
  readonly active: boolean
  /** 0–100 percentage */
  readonly progress: number
  /** Number of assets that finished loading */
  readonly loaded: number
  /** Total registered assets */
  readonly total: number
  /** Asset IDs that errored */
  readonly errors: readonly string[]
}

const IDLE: LoadingProgress = { active: false, progress: 100, loaded: 0, total: 0, errors: [] }

const noopSubscribe = () => () => {}

export const useLoadingProgress = (): LoadingProgress => {
  const ctx = useAssetsContext()
  const prevRef = useRef(IDLE)

  return useSyncExternalStore(
    ctx?.subscribe ?? noopSubscribe,
    () => {
      if (!ctx) return IDLE
      const all = ctx.getAll()
      if (all.length === 0) return IDLE

      const total = all.length
      let loaded = 0
      let errorCount = 0
      for (const e of all) {
        if (e.status === 'loaded') loaded++
        else if (e.status === 'error') errorCount++
      }

      const active = loaded + errorCount < total
      const progress = total > 0 ? Math.round(((loaded + errorCount) / total) * 100) : 100

      const prev = prevRef.current
      if (
        prev.active === active &&
        prev.progress === progress &&
        prev.loaded === loaded &&
        prev.total === total &&
        prev.errors.length === errorCount
      ) {
        return prev
      }

      // Only allocate error IDs array when values actually changed
      const errors = errorCount > 0
        ? all.filter((e) => e.status === 'error').map((e) => e.id)
        : []
      const next: LoadingProgress = { active, progress, loaded, total, errors }
      prevRef.current = next
      return next
    },
  )
}
