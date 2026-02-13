import type { RendererStats } from './renderer-stats'

export type StatsMonitorProps = {
  /** Current renderer stats to display */
  readonly stats: RendererStats
  /** Optional title. Defaults to "Stats Monitor". */
  readonly title?: string
  /** Position of the overlay. Defaults to 'top-right'. */
  readonly position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const positionStyles: Record<NonNullable<StatsMonitorProps['position']>, React.CSSProperties> = {
  'top-left': { top: 12, left: 12 },
  'top-right': { top: 12, right: 12 },
  'bottom-left': { bottom: 12, left: 12 },
  'bottom-right': { bottom: 12, right: 12 },
}

const fpsColor = (fps: number): string =>
  fps >= 55 ? '#4caf50' : fps >= 30 ? '#ff9800' : '#f44336'

export const StatsMonitor = ({
  stats,
  title = 'Stats Monitor',
  position = 'top-right',
}: StatsMonitorProps) => (
  <div
    style={{
      position: 'absolute',
      ...positionStyles[position],
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 12,
      padding: '12px 16px',
      borderRadius: 8,
      lineHeight: 1.8,
      zIndex: 1000,
      minWidth: 200,
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none',
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#7c8aff' }}>
      {title}
    </div>
    <div>FPS: <span style={{ color: fpsColor(stats.fps), fontWeight: 700 }}>{stats.fps}</span></div>
    <div>Frame time: <span style={{ color: '#aaa' }}>{stats.frameTime.toFixed(1)}ms</span></div>
    <div>Draw calls: <span style={{ color: '#aaa' }}>{stats.drawCalls}</span></div>
    <div>Triangles: <span style={{ color: '#aaa' }}>{stats.triangles.toLocaleString()}</span></div>
    <div>Geometries: <span style={{ color: '#aaa' }}>{stats.geometries}</span></div>
    <div>Textures: <span style={{ color: '#aaa' }}>{stats.textures}</span></div>
    <div>Programs: <span style={{ color: '#aaa' }}>{stats.programs}</span></div>
  </div>
)
