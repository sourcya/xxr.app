import type { NavigationAction, NavigationState } from '../core/types'

export type NavigationMiddleware = (
  action: NavigationAction,
  state: NavigationState,
  next: (action: NavigationAction) => void
) => void

export const createMiddlewareRunner = (
  middlewares: NavigationMiddleware[]
): ((action: NavigationAction, state: NavigationState, dispatch: (action: NavigationAction) => void) => void) => {
  return (action, state, dispatch) => {
    let index = 0

    const next = (currentAction: NavigationAction): void => {
      if (index >= middlewares.length) {
        dispatch(currentAction)
        return
      }

      const middleware = middlewares[index]
      index++
      middleware(currentAction, state, next)
    }

    next(action)
  }
}

// Built-in middleware examples

export const loggingMiddleware: NavigationMiddleware = (action, state, next) => {
  console.log('[XXR Navigation]', action.type, { from: state.activeScene, to: 'to' in action ? action.to : null })
  next(action)
}

export const validationMiddleware = (validScenes: string[]): NavigationMiddleware => {
  return (action, _state, next) => {
    if (action.type === 'navigate' && !validScenes.includes(action.to)) {
      console.warn(`[XXR] Cannot navigate to invalid scene: ${action.to}`)
      return
    }
    next(action)
  }
}
