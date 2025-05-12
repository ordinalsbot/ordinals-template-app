'use client';

import React, { Component, ErrorInfo } from 'react';

import { TErrorBoundaryProps, TErrorBoundaryState } from '@/types/errorBoundary';

import { Button } from '../ui';

class ErrorBoundary extends Component<TErrorBoundaryProps, TErrorBoundaryState> {
  constructor(props: TErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): TErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return (
        fallback || (
          <div className='p-2'>
            <h1>Something went wrong.</h1>
            {error && (
              <p>
                <strong>{error.toString()}</strong>
              </p>
            )}
            {errorInfo && <details className='mt-4 whitespace-pre-wrap'>{errorInfo.componentStack}</details>}
            <Button onClick={this.handleReset}>Try Again</Button>
          </div>
        )
      );
    }

    return children;
  }
}

export default ErrorBoundary;
