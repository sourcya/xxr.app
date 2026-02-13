import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { XYZLoader } from 'three/examples/jsm/loaders/XYZLoader.js'
import type { GeometryAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const XYZ = ({ id, src, onLoad, onError }: GeometryAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'points', { onLoad, onError })
  const geometry = useLoader(XYZLoader, src)

  useEffect(() => {
    if (geometry) reportLoaded(geometry)
  }, [geometry, reportLoaded])

  return null
}
