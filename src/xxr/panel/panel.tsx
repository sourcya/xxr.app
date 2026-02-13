import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { PanelProps } from '../core/types'
import { resolvePosition } from '../core/placement'
import { R3FHtml } from '../runtime/r3f/html'

export const Panel = ({ at, height, distance, position, offset, readable = false, near = 3, children }: PanelProps) => {
  const pos = resolvePosition(position, at, distance, height, 'panel', offset)
  const [visible, setVisible] = useState(!readable)
  const lastVisible = useRef(!readable)
  const tempVec = useRef(new Vector3())

  useFrame(({ camera }) => {
    if (!readable) return
    tempVec.current.set(...pos)
    const dist = camera.position.distanceTo(tempVec.current)
    const nowVisible = dist <= near
    if (nowVisible !== lastVisible.current) {
      lastVisible.current = nowVisible
      setVisible(nowVisible)
    }
  })

  return (
    <R3FHtml position={pos} visible={visible}>
      <div
        style={{
          background: 'rgba(10, 10, 30, 0.85)',
          color: '#fff',
          padding: '20px 28px',
          borderRadius: 12,
          maxWidth: 360,
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.5,
          transition: 'opacity 0.3s ease',
          opacity: visible ? 1 : 0,
        }}
      >
        {children}
      </div>
    </R3FHtml>
  )
}
