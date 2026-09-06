import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          background: 'var(--bg-color)', 
          color: 'var(--text-main)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--error-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom: '1rem'}}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2 style={{margin: '0 0 1rem 0'}}>Something went wrong</h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>
            The application encountered an unexpected error.
          </p>
          <button 
            onClick={this.handleRefresh}
            style={{
              background: 'var(--accent-color)',
              color: '#000',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
