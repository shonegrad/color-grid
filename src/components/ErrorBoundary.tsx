import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error('Palette App errorBoundary caught', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 16 }}>Palette App failed to load. See console for details.</div>
    }
    return this.props.children
  }
}

export default ErrorBoundary
