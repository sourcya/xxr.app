import { Html } from '@react-three/drei'
import { useXXR } from '../core/context'

export const NavMap = () => {
  const { devtools, sceneIds, activeScene, navigate } = useXXR()

  if (!devtools) return null

  return (
    <Html
      position={[3, 3, -2]}
      style={{ pointerEvents: 'auto', userSelect: 'none' }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        color: '#ccc',
        fontFamily: 'monospace',
        fontSize: 11,
        padding: '8px 12px',
        borderRadius: 6,
        minWidth: 140,
      }}>
        <div style={{ color: '#4fc3f7', fontWeight: 600, marginBottom: 6 }}>Nav Map</div>
        {sceneIds.map((id, i) => (
          <div
            key={id}
            onClick={() => navigate(id)}
            style={{
              padding: '3px 6px',
              marginBottom: 2,
              borderRadius: 4,
              cursor: 'pointer',
              background: id === activeScene ? 'rgba(79,195,247,0.3)' : 'transparent',
              color: id === activeScene ? '#4fc3f7' : '#999',
              fontWeight: id === activeScene ? 600 : 400,
            }}
          >
            {i + 1}. {id}
          </div>
        ))}
      </div>
    </Html>
  )
}
