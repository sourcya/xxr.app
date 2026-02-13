import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export const LandingPage = () => {
  const [id, setId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = id.trim()
    if (trimmed) navigate(`/x/${trimmed}`)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
      background: '#0d0d1a',
    }}>
      <h1 style={{ fontSize: 56, fontWeight: 700, margin: '0 0 12px', letterSpacing: -1.5 }}>XXR</h1>
      <p style={{ margin: '0 0 48px', opacity: 0.45, fontSize: 15 }}>Immersive experiences</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 480, padding: '0 24px' }}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Type the experience ID you want"
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: 15,
            outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.5)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
        />
        <button
          type="submit"
          style={{
            padding: '14px 24px',
            borderRadius: 10,
            border: 'none',
            background: '#4fc3f7',
            color: '#0d0d1a',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          Go
        </button>
      </form>

      <Link
        to="/xxr"
        style={{
          marginTop: 56,
          fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
      >
        XXR Library →
      </Link>
    </div>
  )
}
