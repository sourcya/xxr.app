import { useStressContext } from './stress-context'

const PRESETS = [4, 16, 36, 64, 100] as const

export const StressControls = () => {
  const { modelCount, setModelCount } = useStressContext()

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        padding: '16px 20px',
        borderRadius: 8,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 240,
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, color: '#7c8aff' }}>
        Stress Test
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 4, opacity: 0.7, fontSize: 11 }}>
          Model Count: <strong style={{ color: '#fff' }}>{modelCount}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={modelCount}
          onChange={(e) => setModelCount(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#7c8aff' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.4 }}>
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {PRESETS.map((n) => (
          <button
            key={n}
            onClick={() => setModelCount(n)}
            style={{
              flex: 1,
              padding: '4px 0',
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 600,
              background: modelCount === n ? '#7c8aff' : 'rgba(255,255,255,0.08)',
              color: modelCount === n ? '#fff' : 'rgba(255,255,255,0.5)',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
