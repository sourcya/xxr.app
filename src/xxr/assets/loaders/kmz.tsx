import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { KMZLoader } from 'three/examples/jsm/loaders/KMZLoader.js'
import type { ModelAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const KMZ = ({ id, src, onLoad, onError }: ModelAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'model', { onLoad, onError })
  const kmz = useLoader(KMZLoader, src)

  useEffect(() => {
    if (kmz) reportLoaded(kmz)
  }, [kmz, reportLoaded])

  return null
}
