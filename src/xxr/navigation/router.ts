import type { NavigationAction, NavigationState } from '../core/types'

export const createInitialState = (
  startScene: string,
): NavigationState => ({
  activeScene: startScene,
  history: [],
  transition: 'none',
})

export const navigationReducer = (
  state: NavigationState,
  action: NavigationAction,
  startScene: string,
): NavigationState => {
  switch (action.type) {
    case 'navigate':
      return {
        activeScene: action.to,
        history: [...state.history, state.activeScene],
        transition: action.transition ?? 'none',
      }
    case 'back': {
      if (state.history.length === 0) return state
      const previous = state.history[state.history.length - 1]
      return {
        activeScene: previous,
        history: state.history.slice(0, -1),
        transition: 'none',
      }
    }
    case 'home':
      return {
        activeScene: startScene,
        history: [],
        transition: 'none',
      }
    default:
      return state
  }
}
