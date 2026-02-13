import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EquirectangularReflectionMapping } from 'three'
import type { EnvironmentAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const HDR = ({ id, src, onLoad, onError }: EnvironmentAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'environment', { onLoad, onError })
  const texture = useLoader(RGBELoader, src)

  useEffect(() => {
    if (texture) {
      texture.mapping = EquirectangularReflectionMapping
      reportLoaded(texture)
    }
  }, [texture, reportLoaded])

  return null
}
