import { Component, type ReactNode } from 'react'

type Props = {
  readonly children: ReactNode
  readonly fallback?: ReactNode
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

type State = {
  readonly hasError: boolean
  readonly error?: Error
}

export class AssetErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[XXR] Asset loading error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
