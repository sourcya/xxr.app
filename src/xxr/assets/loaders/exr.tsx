import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { EquirectangularReflectionMapping } from 'three'
import type { EnvironmentAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const EXR = ({ id, src, onLoad, onError }: EnvironmentAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'environment', { onLoad, onError })
  const texture = useLoader(EXRLoader, src)

  useEffect(() => {
    if (texture) {
      texture.mapping = EquirectangularReflectionMapping
      reportLoaded(texture)
    }
  }, [texture, reportLoaded])

  return null
}
