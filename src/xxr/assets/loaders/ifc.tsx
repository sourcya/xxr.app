import type { ModelAssetProps } from '../../core/types'

// IFC loading requires the `web-ifc-three` package which is not included by default.
// Install it with: pnpm add web-ifc-three web-ifc
//
// Usage:
//   <Assets>
//     <IFC id="building" src="/model.ifc" />
//   </Assets>

export const IFC = ({ id, src, onError }: ModelAssetProps) => {
  console.warn(
    `[xxr] IFC loader: "${id}" ("${src}") requires "web-ifc-three" package. ` +
    'Install with: pnpm add web-ifc-three web-ifc'
  )
  onError?.(new Error('IFC loader requires web-ifc-three package'))
  return null
}
