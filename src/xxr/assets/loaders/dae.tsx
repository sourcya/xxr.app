import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import type { ModelAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const DAE = ({ id, src, onLoad, onError }: ModelAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const collada = useLoader(ColladaLoader, src)

  useEffect(() => {
    if (collada) reportLoaded(collada)
  }, [collada, reportLoaded])

  return null
}
