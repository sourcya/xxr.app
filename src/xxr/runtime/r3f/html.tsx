import { Html } from '@react-three/drei'
import type { ReactNode } from 'react'
import type { Vec3 } from '../../core/types'

export type R3FHtmlProps = {
  readonly position: Vec3
  readonly children: ReactNode
  readonly visible?: boolean
  readonly interactive?: boolean
}

export const R3FHtml = ({ position, children, visible = true, interactive = false }: R3FHtmlProps) => {
  if (!visible) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={1.5}
      transform
      sprite
      style={{
        pointerEvents: interactive ? 'auto' : 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </Html>
  )
}
