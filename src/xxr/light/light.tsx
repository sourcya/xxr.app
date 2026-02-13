import type { Vec3, PlacementSlot } from '../core/types'
import { resolvePosition } from '../core/placement'

export type LightType = 'ambient' | 'directional' | 'point' | 'spot'

export type LightProps = {
  readonly type: LightType
  readonly intensity?: number
  readonly color?: string
  readonly at?: PlacementSlot | Vec3
  readonly target?: PlacementSlot | Vec3
  readonly castShadow?: boolean
  readonly angle?: number
  readonly penumbra?: number
  readonly decay?: number
  readonly distance?: number
}

const resolveTarget = (target?: PlacementSlot | Vec3): Vec3 =>
  resolvePosition(undefined, target, undefined, undefined, 'model')

export const Light = ({
  type: lightType,
  intensity = 1,
  color = '#ffffff',
  at,
  target,
  castShadow = false,
  angle = Math.PI / 6,
  penumbra = 0,
  decay = 2,
  distance = 0,
}: LightProps) => {
  const pos = at ? resolvePosition(undefined, at, undefined, undefined, 'model') : [5, 5, 5] as Vec3
  const tgt = target ? resolveTarget(target) : [0, 0, 0] as Vec3

  switch (lightType) {
    case 'ambient':
      return <ambientLight intensity={intensity} color={color} />

    case 'directional':
      return (
        <directionalLight
          position={pos}
          intensity={intensity}
          color={color}
          castShadow={castShadow}
          target-position={tgt}
        />
      )

    case 'point':
      return (
        <pointLight
          position={pos}
          intensity={intensity}
          color={color}
          castShadow={castShadow}
          decay={decay}
          distance={distance}
        />
      )

    case 'spot':
      return (
        <spotLight
          position={pos}
          intensity={intensity}
          color={color}
          castShadow={castShadow}
          angle={angle}
          penumbra={penumbra}
          decay={decay}
          distance={distance}
          target-position={tgt}
        />
      )

    default:
      return null
  }
}
