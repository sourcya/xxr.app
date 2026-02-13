import { useState, useEffect } from 'react'
import { useXXR } from '../core/context'
import { DEFAULT_DURATION } from './types'

export const DissolveTransition = ({ duration = DEFAULT_DURATION }: { duration?: number }) => {
  const { transition } = useXXR()
  const [opacity, setOpacity] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (transition === 'dissolve') {
      setActive(true)
      setOpacity(0.5)
      const timer = setTimeout(() => setOpacity(0), duration * 500)
      const cleanup = setTimeout(() => setActive(false), duration * 1000)
      return () => {
        clearTimeout(timer)
        clearTimeout(cleanup)
      }
    }
  }, [transition, duration])

  if (!active) return null

  return (
    <mesh position={[0, 0, -0.5]} renderOrder={999}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="black" transparent opacity={opacity} depthTest={false} />
    </mesh>
  )
}
