import { useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { examples } from './index'

export const ExampleList = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#fff',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
  }}>
    <h1 style={{ fontSize: 48, fontWeight: 700, margin: '0 0 8px', letterSpacing: -1 }}>XXR</h1>
    <p style={{ margin: '0 0 40px', opacity: 0.6, fontSize: 16 }}>Declarative XR Experiences</p>
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720 }}>
      {examples.map((ex) => (
        <Link
          key={ex.id}
          to={`/xxr/${ex.id}`}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '24px 28px',
            color: '#fff',
            cursor: 'pointer',
            textAlign: 'left',
            width: 220,
            transition: 'all 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.borderColor = 'rgba(79,195,247,0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>{ex.title}</div>
          <div style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.4 }}>{ex.description}</div>
        </Link>
      ))}
    </div>
    <Link
      to="/xxr/docs"
      style={{
        marginTop: 40,
        padding: '10px 28px',
        borderRadius: 8,
        border: '1px solid rgba(79,195,247,0.3)',
        background: 'rgba(79,195,247,0.08)',
        color: '#4fc3f7',
        fontSize: 14,
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(79,195,247,0.16)'
        e.currentTarget.style.borderColor = 'rgba(79,195,247,0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(79,195,247,0.08)'
        e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)'
      }}
    >
      Documentation →
    </Link>
  </div>
)

export const ExamplePage = () => {
  const { exampleId } = useParams<{ exampleId: string }>()
  const navigate = useNavigate()
  const handleBack = useCallback(() => navigate('/xxr'), [navigate])

  const entry = examples.find((e) => e.id === exampleId)

  if (!entry) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      }}>
        <h1 style={{ fontSize: 36, margin: '0 0 16px' }}>404</h1>
        <p style={{ opacity: 0.6, marginBottom: 24 }}>Example &ldquo;{exampleId}&rdquo; not found</p>
        <Link
          to="/xxr"
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          ← Back to Examples
        </Link>
      </div>
    )
  }

  const ActiveComponent = entry.component

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <button
        onClick={handleBack}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: 13,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        ← Back
      </button>
      <ActiveComponent />
    </div>
  )
}
