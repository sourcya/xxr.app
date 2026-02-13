import type { TransitionType } from '../core/types'

export type TransitionConfig = {
  readonly type: TransitionType
  readonly duration: number
}

export const DEFAULT_DURATION = 0.6
