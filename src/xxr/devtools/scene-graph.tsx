import { useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useXXR } from '../core/context'

const collectGraph = (obj: { name?: string; type?: string; children?: readonly any[] }, depth = 0): string[] => {
  const indent = '  '.repeat(depth)
  const name = obj.name || obj.type || 'unknown'
  const lines = [`${indent}${name}`]
  for (const child of obj.children ?? []) {
    lines.push(...collectGraph(child, depth + 1))
  }
  return lines
}

export const SceneGraph = () => {
  const { devtools } = useXXR()
  const { scene } = useThree()
  const [open, setOpen] = useState(false)

  if (!devtools) return null

  const graph = open ? collectGraph(scene as any) : []

  return (
    <Html
      position={[-3, 3, -2]}
      style={{ pointerEvents: 'auto', userSelect: 'none' }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        color: '#ccc',
        fontFamily: 'monospace',
        fontSize: 10,
        padding: '8px 12px',
        borderRadius: 6,
        maxHeight: 300,
        overflowY: 'auto',
        minWidth: 180,
      }}>
        <div
          onClick={() => setOpen(!open)}
          style={{ cursor: 'pointer', color: '#4fc3f7', marginBottom: 4, fontWeight: 600 }}
        >
          {open ? '▼' : '▶'} Scene Graph
        </div>
        {open && (
          <pre style={{ margin: 0, whiteSpace: 'pre', lineHeight: 1.4 }}>
            {graph.join('\n')}
          </pre>
        )}
      </div>
    </Html>
  )
}
