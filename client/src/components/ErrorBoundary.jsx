import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded z-50 fixed top-10 left-10 right-10">
                    <h2 className="text-lg font-bold">Something went wrong in this component:</h2>
                    <pre className="mt-2 text-sm overflow-auto text-left" dir="ltr">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                    <button
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
