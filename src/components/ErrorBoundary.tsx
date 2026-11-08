import { Component, type ErrorInfo, type ReactNode } from 'react'
import { InternalServerErrorPage } from '../pages/Errors/ErrorPages'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('A runtime error was caught by the application boundary.', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <InternalServerErrorPage />
    }

    return this.props.children
  }
}

export default ErrorBoundary
