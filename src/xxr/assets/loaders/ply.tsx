import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import type { GeometryAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const PLY = ({ id, src, onLoad, onError }: GeometryAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'geometry', { onLoad, onError })
  const geometry = useLoader(PLYLoader, src)

  useEffect(() => {
    if (geometry) {
      geometry.computeVertexNormals()
      reportLoaded(geometry)
    }
  }, [geometry, reportLoaded])

  return null
}
