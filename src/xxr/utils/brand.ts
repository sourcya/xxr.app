// Branded types for improved type safety

declare const __brand: unique symbol

type Brand<T, TBrand extends string> = T & { readonly [__brand]: TBrand }

export type AssetId = Brand<string, 'AssetId'>
export type SceneId = Brand<string, 'SceneId'>

export const asAssetId = (id: string): AssetId => id as AssetId
export const asSceneId = (id: string): SceneId => id as SceneId

export const unwrapAssetId = (id: AssetId): string => id as string
export const unwrapSceneId = (id: SceneId): string => id as string
