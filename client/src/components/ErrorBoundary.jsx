/**
 * @file ErrorBoundary.jsx
 * @author Alex Kachur
 * @since 2025-11-25
 * @purpose Catches JavaScript errors in child components and displays a fallback UI.
 * Prevents the entire app from crashing due to a single component error.
 */
import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Error info:', errorInfo.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI when an error occurs
            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <h1 className="error-boundary__title">Something went wrong</h1>
                        <p className="error-boundary__message">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <pre className="error-boundary__details">
                                {this.state.error.toString()}
                            </pre>
                        )}
                        <div className="error-boundary__actions">
                            <button
                                type="button"
                                className="btn"
                                onClick={this.handleReset}
                            >
                                Try Again
                            </button>
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={() => window.location.href = '/'}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
