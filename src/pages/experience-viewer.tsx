import { useState, useEffect } from 'react'
import type { ComponentType } from 'react'
import { useParams, Link } from 'react-router-dom'
import { findExperience } from '../experiences/registry'

export const ExperienceViewer = () => {
  const { id } = useParams<{ id: string }>()
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setComponent(null)

    const entry = findExperience(id ?? '')
    if (!entry) {
      setError(true)
      setLoading(false)
      return
    }

    entry.component()
      .then((mod) => {
        setComponent(() => mod.Experience)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fff',
        background: '#0d0d1a',
      }}>
        <p style={{ opacity: 0.5, fontSize: 15 }}>Loading experience...</p>
      </div>
    )
  }

  if (error || !Component) {
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
        <h1 style={{ fontSize: 36, margin: '0 0 12px', fontWeight: 700 }}>Not Found</h1>
        <p style={{ opacity: 0.5, margin: '0 0 32px', fontSize: 14 }}>
          Experience &ldquo;{id}&rdquo; does not exist.
        </p>
        <Link
          to="/"
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: '#fff',
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          ← Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Component />
    </div>
  )
}
