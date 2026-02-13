import { Suspense, useEffect, useRef } from 'react'
import type { AssetsProps } from '../core/types'
import { useAssetsContext } from './context'
import { AssetErrorBoundary } from './error-boundary'

export const Assets = ({ children, onAllLoaded }: AssetsProps) => {
  const ctx = useAssetsContext()
  const firedRef = useRef(false)

  useEffect(() => {
    if (!ctx || !onAllLoaded) return
    return ctx.subscribe(() => {
      if (firedRef.current) return
      const all = ctx.getAll()
      if (all.length > 0 && all.every((e) => e.status === 'loaded')) {
        firedRef.current = true
        onAllLoaded()
      }
    })
  }, [ctx, onAllLoaded])

  return (
    <AssetErrorBoundary>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </AssetErrorBoundary>
  )
}
