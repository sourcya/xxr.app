import { useEffect, useRef, useState } from 'react'
import type { LoadingProgress } from './use-loading-progress'

const KEYFRAMES_ID = 'xxr-loading-keyframes'

const KEYFRAMES_CSS = `
@keyframes xxr-spin {
  to { transform: rotate(360deg); }
}
@keyframes xxr-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes xxr-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`

const ensureKeyframes = () => {
  if (typeof document === 'undefined') return
  if (document.getElementById(KEYFRAMES_ID)) return
  const style = document.createElement('style')
  style.id = KEYFRAMES_ID
  style.textContent = KEYFRAMES_CSS
  document.head.appendChild(style)
}

export type LoadingScreenProps = {
  readonly progress: LoadingProgress
  readonly withProgress: boolean
}

export const LoadingScreen = ({ progress, withProgress }: LoadingScreenProps) => {
  const [gone, setGone] = useState(false)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(ensureKeyframes, [])

  // Loading is "done" when we have registered assets AND none are still loading
  const isDone = progress.total > 0 && !progress.active

  // Fade out then unmount after done
  useEffect(() => {
    if (isDone) {
      fadeTimerRef.current = setTimeout(() => setGone(true), 600)
    } else {
      setGone(false)
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [isDone])

  if (gone) return null

  const pct = withProgress ? progress.progress : 0
  const countLabel = progress.total > 0
    ? `${progress.loaded} / ${progress.total} assets`
    : 'Preparing…'

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #1e1e3a 0%, #0b0b14 100%)',
        opacity: isDone ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isDone ? 'none' : 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Spinner ring */}
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid rgba(255,255,255,0.08)',
        borderTopColor: '#7c8aff',
        borderRadius: '50%',
        animation: 'xxr-spin 0.9s linear infinite',
        boxShadow: '0 0 20px rgba(124,138,255,0.15)',
      }} />

      {/* Label */}
      <div style={{
        marginTop: 20,
        fontSize: 14,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.04em',
        animation: 'xxr-pulse 2s ease-in-out infinite',
      }}>
        Loading experience…
      </div>

      {/* Progress section */}
      {withProgress && (
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: 240 }}>
          {/* Track */}
          <div style={{
            width: '100%',
            height: 4,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            {/* Fill */}
            <div style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 4,
              background: 'linear-gradient(90deg, #5b6abf, #7c8aff, #a78bfa)',
              backgroundSize: '200% 100%',
              animation: 'xxr-shimmer 1.5s linear infinite',
              transition: 'width 0.35s ease-out',
              boxShadow: '0 0 8px rgba(124,138,255,0.4)',
            }} />
          </div>

          {/* Percentage + count */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span>{countLabel}</span>
            <span>{pct}%</span>
          </div>
        </div>
      )}

      {/* Subtle error notice */}
      {progress.errors.length > 0 && (
        <div style={{
          marginTop: 16,
          fontSize: 11,
          color: 'rgba(255,120,120,0.6)',
        }}>
          {progress.errors.length} asset{progress.errors.length > 1 ? 's' : ''} failed to load
        </div>
      )}
    </div>
  )
}
