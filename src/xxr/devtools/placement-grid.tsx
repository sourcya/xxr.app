import { useXXR } from '../core/context'
import { resolveAt } from '../core/placement'
import type { PlacementSlot, ComponentType } from '../core/types'

const SLOTS: PlacementSlot[] = [
  'front', 'front-left', 'front-right',
  'left', 'right', 'center',
  'back', 'back-left', 'back-right',
]

const COMPONENT_TYPE: ComponentType = 'panel'

export const PlacementGrid = () => {
  const { devtools } = useXXR()

  if (!devtools) return null

  return (
    <group>
      {SLOTS.map((slot) => {
        const pos = resolveAt(slot, 'mid', 'eye', COMPONENT_TYPE)
        return (
          <group key={slot} position={pos}>
            <mesh>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color="#ff0" wireframe />
            </mesh>
            <mesh position={[0, -pos[1], 0]}>
              <cylinderGeometry args={[0.02, 0.02, pos[1], 4]} />
              <meshBasicMaterial color="#ff0" wireframe opacity={0.3} transparent />
            </mesh>
          </group>
        )
      })}
      {/* Origin marker */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color="#ff0" wireframe />
      </mesh>
    </group>
  )
}
