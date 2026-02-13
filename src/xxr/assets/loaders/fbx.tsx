import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import type { ModelAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const FBX = ({ id, src, onLoad, onError }: ModelAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const group = useLoader(FBXLoader, src)

  useEffect(() => {
    if (group) reportLoaded(group)
  }, [group, reportLoaded])

  return null
}
