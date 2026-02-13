import type { HotspotProps } from '../core/types'
import { useXXR } from '../core/context'
import { resolvePosition } from '../core/placement'
import { R3FHtml } from '../runtime/r3f/html'

export const Hotspot = ({ to, at, height, distance, position, offset, icon, children }: HotspotProps) => {
  const { navigate } = useXXR()
  const pos = resolvePosition(position, at, distance, height, 'hotspot', offset)

  return (
    <group position={pos}>
      <mesh
        onClick={() => navigate(to)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#4fc3f7"
          emissive="#4fc3f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.6}
        />
      </mesh>
      <R3FHtml position={[0, 0.45, 0]} interactive>
        <div
          onClick={() => navigate(to)}
          style={{
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
          {children}
        </div>
      </R3FHtml>
    </group>
  )
}
