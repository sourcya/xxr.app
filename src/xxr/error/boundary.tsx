import { Component, type ReactNode, type ErrorInfo } from 'react'

type Props = {
  readonly children: ReactNode
  readonly fallback?: ReactNode | ((error: Error) => ReactNode)
  readonly onError?: (error: Error, errorInfo: ErrorInfo) => void
  readonly resetKeys?: readonly any[]
}

type State = {
  readonly hasError: boolean
  readonly error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[XXR] Error boundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: Props): void {
    if (this.state.hasError && this.props.resetKeys) {
      const hasChanged = this.props.resetKeys.some(
        (key, i) => key !== prevProps.resetKeys?.[i]
      )
      if (hasChanged) {
        this.setState({ hasError: false, error: undefined })
      }
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error)
      }
      return this.props.fallback ?? <DefaultFallback error={this.state.error} />
    }
    return this.props.children
  }
}

const DefaultFallback = ({ error }: { error: Error }) => (
  <div style={{
    padding: '20px',
    background: '#fee',
    border: '2px solid #c00',
    borderRadius: '8px',
    color: '#c00',
    fontFamily: 'monospace',
    fontSize: '14px'
  }}>
    <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Error</h3>
    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{error.message}</pre>
  </div>
)
