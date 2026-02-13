import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js'
import type { ModelAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const TDS = ({ id, src, onLoad, onError }: ModelAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const group = useLoader(TDSLoader, src)

  useEffect(() => {
    if (group) reportLoaded(group)
  }, [group, reportLoaded])

  return null
}
