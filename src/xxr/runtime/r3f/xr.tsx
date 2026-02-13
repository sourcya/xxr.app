import { XROrigin } from '@react-three/xr'
import type { Vec3 } from '../../core/types'

export type R3FXROriginProps = {
  readonly position?: Vec3
}

export const R3FXROrigin = ({ position = [0, 0, 0] }: R3FXROriginProps) => (
  <XROrigin position={position} />
)
