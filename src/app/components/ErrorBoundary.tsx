/**
 * ErrorBoundary - React Error Boundary for Graceful Failure
 * 
 * FEATURES:
 * - Catches JavaScript errors in component tree
 * - Displays fallback UI instead of crash
 * - Logs errors for debugging
 * - Allows recovery without page reload
 * 
 * USAGE:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // Log to error tracking service (in production)
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // In production: Send to Sentry, LogRocket, etc.
    const errorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    try {
      // Store locally for now
      const errors = JSON.parse(localStorage.getItem('error_log') || '[]');
      errors.push(errorLog);
      // Keep last 50 errors
      const recentErrors = errors.slice(-50);
      localStorage.setItem('error_log', JSON.stringify(recentErrors));
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#FEE2E2] p-8 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <AlertTriangle className="w-8 h-8" style={{ color: '#DC2626' }} />
            </div>

            <h2 className="text-xl font-bold text-[#1A1D23] mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-sm text-[#6B7280] mb-6">
              We encountered an unexpected error. Your data is safe, and we've recorded the issue.
            </p>

            {/* Show error message in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-[#FEF2F2] rounded-lg text-left">
                <p className="text-xs font-mono text-[#DC2626] break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all active:scale-95"
                style={{ backgroundColor: '#0066CC' }}
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                }}
              >
                Reload App
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF] mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * AsyncErrorBoundary - For async operations
 */
export function useAsyncError() {
  const [, setError] = React.useState();
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}
