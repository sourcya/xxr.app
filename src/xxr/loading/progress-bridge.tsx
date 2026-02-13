import { useEffect } from 'react'
import { useLoadingProgress, type LoadingProgress } from './use-loading-progress'

export type ProgressBridgeProps = {
  readonly onProgress: (progress: LoadingProgress) => void
}

export const ProgressBridge = ({ onProgress }: ProgressBridgeProps) => {
  const progress = useLoadingProgress()

  useEffect(() => {
    onProgress(progress)
  }, [progress, onProgress])

  return null
}
