import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { RendererStats } from './renderer-stats'

export type StatsCollectorProps = {
  /** Callback fired with fresh stats at the given interval */
  readonly onStats: (stats: RendererStats) => void
  /** Reporting interval in milliseconds. Defaults to 500. */
  readonly interval?: number
}

export const StatsCollector = ({ onStats, interval = 500 }: StatsCollectorProps) => {
  const { gl } = useThree()
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameTimesRef = useRef<number[]>([])
  const prevFrameRef = useRef(performance.now())

  useFrame(() => {
    const now = performance.now()
    frameTimesRef.current.push(now - prevFrameRef.current)
    prevFrameRef.current = now
    frameCountRef.current++

    const elapsed = now - lastTimeRef.current
    if (elapsed >= interval) {
      const info = gl.info
      const times = frameTimesRef.current
      const avgFrameTime = times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0

      onStats({
        fps: Math.round((frameCountRef.current / elapsed) * 1000),
        frameTime: avgFrameTime,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: (info as any).programs?.length ?? 0,
      })

      frameCountRef.current = 0
      lastTimeRef.current = now
      frameTimesRef.current = []
    }
  })

  return null
}
