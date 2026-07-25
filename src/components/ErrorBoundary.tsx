import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service (future)
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback takes precedence
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bright px-6 text-center">
          <div className="max-w-md mx-auto w-full flex flex-col items-center gap-md">
            <AlertTriangle size={64} className="text-error" />
            <h1 className="font-h2 text-[32px] font-semibold text-error">Something went wrong</h1>
            <p className="font-body-md text-on-surface-variant">
              We encountered an unexpected error while rendering this page. The error has been logged.
            </p>
            <details className="text-left w-full mt-sm text-xs text-on-surface-variant">
              <summary className="cursor-pointer flex items-center gap-2">
                <ChevronRight size={12} /> Technical details
              </summary>
              <pre className="mt-xs p-sm bg-surface-container rounded-md overflow-x-auto font-mono">
                Error: {this.state.error?.name || "UnknownError"}
                Message: {this.state.error?.message || "No message available"}
              </pre>
            </details>
            <div className="flex flex-col sm:flex-row gap-sm mt-md">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-sm py-xs rounded-md bg-primary text-on-primary font-button hover:bg-primary-container transition-colors"
              >
                <RefreshCw size={16} /> Retry
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-sm py-xs rounded-md bg-surface-container text-on-surface font-button hover:bg-surface-container-high transition-colors"
              >
                <Home size={16} /> Return to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
