import { useGLTF } from '@react-three/drei'
import { Suspense } from 'react'
import type { Vec3 } from '../../core/types'

export type R3FGltfProps = {
  readonly src: string
  readonly position: Vec3
  readonly scale?: number | Vec3
  readonly rotation?: Vec3
}

const GltfInner = ({ src, position, scale = 1, rotation }: R3FGltfProps) => {
  const { scene } = useGLTF(src)

  const scaleArr: Vec3 = typeof scale === 'number'
    ? [scale, scale, scale]
    : scale

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scaleArr}
      rotation={rotation}
    />
  )
}

export const R3FGltf = (props: R3FGltfProps) => (
  <Suspense fallback={null}>
    <GltfInner {...props} />
  </Suspense>
)
