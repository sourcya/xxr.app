import type { ComponentType } from 'react'
import type { PlacementProps, ComponentType as XXRComponentType } from '../core/types'
import { resolvePosition } from '../core/placement'

export const withPlacement = <P extends object>(
  Component: ComponentType<P & { position?: [number, number, number] }>,
  defaultComponentType: XXRComponentType = 'model'
) => {
  const WithPlacement = ({
    at,
    height,
    distance,
    position,
    ...props
  }: P & PlacementProps) => {
    const resolvedPosition = resolvePosition(position, at, distance, height, defaultComponentType)
    return <Component position={resolvedPosition} {...(props as P)} />
  }

  WithPlacement.displayName = `withPlacement(${Component.displayName || Component.name || 'Component'})`

  return WithPlacement
}
