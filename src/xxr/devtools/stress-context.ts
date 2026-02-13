import { createContext, useContext } from 'react'

export type StressContextValue = {
  readonly modelCount: number
  readonly setModelCount: (count: number) => void
}

export const StressContext = createContext<StressContextValue | null>(null)

export const useStressContext = (): StressContextValue => {
  const ctx = useContext(StressContext)
  if (!ctx) throw new Error('useStressContext must be used inside <XXR withStressTest>')
  return ctx
}
