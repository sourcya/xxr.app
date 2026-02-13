import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ModelAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const GLB = ({ id, src, onLoad, onError }: ModelAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const gltf = useGLTF(src)

  useEffect(() => {
    if (gltf) reportLoaded(gltf)
  }, [gltf, reportLoaded])

  return null
}
