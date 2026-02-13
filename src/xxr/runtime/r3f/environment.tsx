import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Color } from 'three'

const DREI_PRESETS = [
  'apartment', 'city', 'dawn', 'forest', 'lobby', 'night',
  'park', 'studio', 'sunset', 'warehouse',
] as const

type DreiPreset = typeof DREI_PRESETS[number]

const isDreiPreset = (value: string): value is DreiPreset =>
  (DREI_PRESETS as readonly string[]).includes(value)

const COLOR_RE = /^(#|rgb|hsl|oklch|oklab|lch|lab|hwb|color\()/i

const isColor = (value: string): boolean => {
  // Only accept explicit color formats to avoid false positives
  return COLOR_RE.test(value)
}

export type R3FEnvironmentProps = {
  readonly background?: string
}

const ColorBackground = ({ color }: { color: string }) => {
  const { scene } = useThree()
  useEffect(() => {
    const c = new Color(color)
    scene.background = c
    return () => { if (scene.background === c) scene.background = null }
  }, [color, scene])
  return null
}

export const R3FEnvironment = ({ background }: R3FEnvironmentProps) => {
  if (!background) return null

  // Check Drei presets first to avoid false color detection
  if (isDreiPreset(background)) {
    return <Environment preset={background} background />
  }

  if (isColor(background)) {
    return <ColorBackground color={background} />
  }

  return <Environment files={background} background />
}
