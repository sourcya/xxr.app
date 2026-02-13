import type { ComponentType } from 'react'
import type { NavigationAction, NavigationState } from '../core/types'

export type PluginLifecycleHook = {
  onInit?: () => void | Promise<void>
  onSceneMount?: (sceneId: string) => void
  onSceneUnmount?: (sceneId: string) => void
  onDestroy?: () => void
}

export type NavigationMiddleware = (
  action: NavigationAction,
  state: NavigationState,
  next: (action: NavigationAction) => void
) => void

export type XXRPlugin = {
  readonly name: string
  readonly version?: string
  readonly components?: Record<string, ComponentType<any>>
  readonly loaders?: Record<string, ComponentType<any>>
  readonly middleware?: NavigationMiddleware[]
  readonly hooks?: PluginLifecycleHook
}

export type PluginContext = {
  readonly getState: () => NavigationState
  readonly navigate: (to: string) => void
  readonly registerComponent: (name: string, component: ComponentType<any>) => void
  readonly registerLoader: (extension: string, loader: ComponentType<any>) => void
}
