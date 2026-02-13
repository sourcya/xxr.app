import { useEffect } from 'react'
import { useAssetsContext, type AssetType } from '../context'
import type { AssetLoadHandler } from '../../core/types'

export const useAssetReport = (id: string, assetType: AssetType, handlers?: AssetLoadHandler) => {
  const ctx = useAssetsContext()

  useEffect(() => {
    ctx?.reportLoading(id, assetType)
  }, [id, assetType, ctx])

  const reportLoaded = (data: any) => {
    ctx?.register(id, assetType, data)
    handlers?.onLoad?.()
  }

  const reportError = (error: Error) => {
    ctx?.reportError(id, assetType, error.message)
    handlers?.onError?.(error)
  }

  return { reportLoaded, reportError }
}
