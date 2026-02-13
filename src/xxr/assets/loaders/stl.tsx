import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import type { GeometryAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const STL = ({ id, src, onLoad, onError }: GeometryAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'geometry', { onLoad, onError })
  const geometry = useLoader(STLLoader, src)

  useEffect(() => {
    if (geometry) reportLoaded(geometry)
  }, [geometry, reportLoaded])

  return null
}
