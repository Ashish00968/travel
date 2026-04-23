import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: string }

export default class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('MapContainer crashed:', error)
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#06080c', gap: '16px',
        }}>
          <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style={{ opacity: 0.3 }}>
            <path d="M28 6L6 48H50L28 6Z" fill="none" stroke="#e8c97a" strokeWidth="2" />
          </svg>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: '10px',
            letterSpacing: '0.2em', color: 'rgba(232,201,122,0.5)',
            textTransform: 'uppercase', textAlign: 'center', padding: '0 24px',
          }}>
            Map failed to initialize.<br />
            <span style={{ opacity: 0.5, fontSize: '9px' }}>{this.state.error}</span>
          </span>
          <button
            onClick={() => this.setState({ hasError: false, error: '' })}
            style={{
              background: 'none', border: '1px solid rgba(232,201,122,0.3)',
              color: '#e8c97a', fontFamily: "'Space Mono', monospace",
              fontSize: '9px', letterSpacing: '0.15em', padding: '8px 16px',
              borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
