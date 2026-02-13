import { createContext, useContext } from 'react'

export type SceneContextValue = {
  readonly groundY: number
  readonly setGroundY: (y: number) => void
}

export const SceneContext = createContext<SceneContextValue>({
  groundY: 0,
  setGroundY: () => {},
})

export const useSceneContext = (): SceneContextValue => useContext(SceneContext)
