import { createContext, useContext } from 'react'
import type { CameraConfig, OrbitConfig, TransitionType, Vec3 } from './types'

export type XXRContextValue = {
  readonly activeScene: string
  readonly sceneIds: readonly string[]
  readonly transition: TransitionType
  readonly navigate: (to: string, transition?: TransitionType) => void
  readonly back: () => void
  readonly home: () => void
  readonly playerPosition: Vec3
  readonly setPlayerPosition: (pos: Vec3) => void
  readonly devtools: boolean
  readonly camera?: CameraConfig
  readonly orbit?: OrbitConfig
}

export const XXRContext = createContext<XXRContextValue | null>(null)

export const useXXR = (): XXRContextValue => {
  const ctx = useContext(XXRContext)
  if (!ctx) {
    throw new Error('useXXR must be used within an <XXR> component')
  }
  return ctx
}
