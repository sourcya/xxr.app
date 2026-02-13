import { useCallback, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useXXR } from '../core/context'

export const PerfOverlay = () => {
  const { devtools } = useXXR()
  const { gl } = useThree()
  const textRef = useRef<HTMLDivElement>(null)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  const setRef = useCallback((node: HTMLDivElement | null) => {
    (textRef as React.MutableRefObject<HTMLDivElement | null>).current = node
  }, [])

  useFrame(() => {
    if (!devtools) return
    frameCount.current++
    const now = performance.now()
    const elapsed = now - lastTime.current

    if (elapsed >= 1000) {
      const info = gl.info
      const fps = Math.round((frameCount.current / elapsed) * 1000)
      const drawCalls = info.render.calls
      const triangles = info.render.triangles
      const memory = info.memory.geometries + info.memory.textures

      // Direct DOM update — no React re-render
      if (textRef.current) {
        textRef.current.textContent =
          `FPS: ${fps}\nDraw calls: ${drawCalls}\nTriangles: ${triangles}\nGeom+Tex: ${memory}`
      }

      frameCount.current = 0
      lastTime.current = now
    }
  })

  if (!devtools) return null

  return (
    <Html
      position={[0, 3, -2]}
      center
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        ref={setRef}
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#0f0',
          fontFamily: 'monospace',
          fontSize: 11,
          padding: '8px 12px',
          borderRadius: 6,
          lineHeight: 1.6,
          whiteSpace: 'pre',
        }}
      >
        FPS: 0{'\n'}Draw calls: 0{'\n'}Triangles: 0{'\n'}Geom+Tex: 0
      </div>
    </Html>
  )
}
