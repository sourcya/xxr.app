import { useEffect } from 'react'
import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import type { SVGAssetProps } from '../../core/types'
import { useAssetReport } from './use-report'

export const SVG = ({ id, src, onLoad, onError }: SVGAssetProps) => {
  const { reportLoaded } = useAssetReport(id, 'svg', { onLoad, onError })
  const svgData = useLoader(SVGLoader, src)

  useEffect(() => {
    if (svgData) reportLoaded(svgData)
  }, [svgData, reportLoaded])

  return null
}
