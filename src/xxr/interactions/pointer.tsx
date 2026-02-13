import type { PointerProps } from '../core/types'
import { resolvePosition } from '../core/placement'
import { R3FHtml } from '../runtime/r3f/html'

export const Pointer = ({ onActivate, at, height, distance, position, offset, children }: PointerProps) => {
  const pos = resolvePosition(position, at, distance, height, 'hotspot', offset)

  return (
    <group position={pos}>
      <mesh
        onClick={() => onActivate?.()}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ff9800"
          emissive="#ff9800"
          emissiveIntensity={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      {children && (
        <R3FHtml position={[0, 0.4, 0]} interactive>
          <div
            onClick={() => onActivate?.()}
            style={{
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {children}
          </div>
        </R3FHtml>
      )}
    </group>
  )
}
