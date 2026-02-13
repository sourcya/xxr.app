import { useMemo } from 'react'
import { useStressContext } from './stress-context'
import { Model } from '../model'
import type { Vec3 } from '../core/types'

export type StressGridProps = {
  /** Asset ID to render in the grid */
  readonly asset: string
  /** Spacing between grid cells. Defaults to 2.5. */
  readonly spacing?: number
  /** Scale applied to each model. Defaults to 0.6. */
  readonly scale?: number
  /** Whether models snap to ground. Defaults to true. */
  readonly grounded?: boolean
  /** Whether models cast shadows. Defaults to true. */
  readonly castShadow?: boolean
}

const generateGridPositions = (count: number, spacing: number): Vec3[] => {
  const cols = Math.ceil(Math.sqrt(count))
  const offsetX = ((cols - 1) * spacing) / 2
  const offsetZ = ((Math.ceil(count / cols) - 1) * spacing) / 2

  const positions: Vec3[] = []
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    positions.push([col * spacing - offsetX, 0, row * spacing - offsetZ])
  }
  return positions
}

export const StressGrid = ({
  asset,
  spacing = 2.5,
  scale = 0.6,
  grounded = true,
  castShadow = true,
}: StressGridProps) => {
  const { modelCount } = useStressContext()
  const positions = useMemo(() => generateGridPositions(modelCount, spacing), [modelCount, spacing])

  return (
    <>
      {positions.map((pos, i) => (
        <Model
          key={`${asset}-${i}`}
          asset={asset}
          at={pos}
          scale={scale}
          grounded={grounded}
          castShadow={castShadow}
        />
      ))}
    </>
  )
}
