import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { GazeProps } from '../core/types'
import { resolvePosition } from '../core/placement'
import { R3FHtml } from '../runtime/r3f/html'

export const Gaze = ({ duration = 2, onGaze, at, height, distance, position, offset, children }: GazeProps) => {
  const pos = resolvePosition(position, at, distance, height, 'hotspot', offset)
  const [progress, setProgress] = useState(0)
  const gazeTime = useRef(0)
  const isGazing = useRef(false)
  const fired = useRef(false)

  useFrame((_, delta) => {
    if (isGazing.current && !fired.current) {
      gazeTime.current += delta
      setProgress(Math.min(gazeTime.current / duration, 1))
      if (gazeTime.current >= duration) {
        fired.current = true
        onGaze?.()
      }
    }
  })

  const handlePointerEnter = () => {
    isGazing.current = true
    gazeTime.current = 0
    fired.current = false
  }

  const handlePointerLeave = () => {
    isGazing.current = false
    gazeTime.current = 0
    setProgress(0)
    fired.current = false
  }

  return (
    <group position={pos}>
      <mesh
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.4} />
      </mesh>
      {progress > 0 && (
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32, 1, 0, Math.PI * 2 * progress]} />
          <meshBasicMaterial color="#4fc3f7" />
        </mesh>
      )}
      {children && (
        <R3FHtml position={[0, 0.35, 0]}>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}>
            {children}
          </div>
        </R3FHtml>
      )}
    </group>
  )
}
