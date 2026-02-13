import { useXXR } from '../core/context'
import { FadeTransition } from './fade'
import { DissolveTransition } from './dissolve'

export const TransitionManager = () => {
  const { transition } = useXXR()

  switch (transition) {
    case 'fade':
      return <FadeTransition />
    case 'dissolve':
      return <DissolveTransition />
    default:
      return null
  }
}
