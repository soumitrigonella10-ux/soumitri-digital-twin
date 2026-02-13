// ========================================
// Error Boundary Component for React components
// Provides graceful error handling, recovery, and reporting
// ========================================

"use client";

import React, { Component, ReactNode, useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ========================================
// Error reporting — centralised handler for all caught errors
// In production, replace with Sentry/Datadog/etc.
// ========================================
export function reportError(error: Error, context?: Record<string, unknown>) {
  const payload = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  // Always log in dev
  if (process.env.NODE_ENV === "development") {
    console.error("[ErrorReport]", payload);
  }

  // Production: send to error tracking service
  // e.g. Sentry.captureException(error, { extra: context });
}

// ========================================
// Global unhandled error listeners
// Install once at app boot via <GlobalErrorListener />
// ========================================
export function GlobalErrorListener() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError(event.error ?? new Error(event.message), {
        source: "window.onerror",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      reportError(error, { source: "unhandledrejection" });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

// ========================================
// Props
// ========================================
interface Props {
  children: ReactNode;
  /** Custom title shown in the fallback UI */
  fallbackTitle?: string;
  /** Custom message shown in the fallback UI */
  fallbackMessage?: string;
  /** Show retry button (default: true) */
  showRetry?: boolean;
  /** Callback when user clicks retry */
  onRetry?: () => void;
  /** Granularity tag for error reports (e.g. "WeekPlanner", "Dashboard") */
  boundary?: string;
  /** Completely replace the default fallback UI */
  fallback?: ReactNode;
  /** How many times auto-retry before showing fallback (default: 0 = manual only) */
  maxAutoRetries?: number;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    reportError(error, {
      boundary: this.props.boundary ?? "unknown",
      componentStack: errorInfo.componentStack ?? "",
      retryCount: this.state.retryCount,
    });

    // Auto-retry if configured and within limit
    const maxAutoRetries = this.props.maxAutoRetries ?? 0;
    if (this.state.retryCount < maxAutoRetries) {
      setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          retryCount: prev.retryCount + 1,
        }));
      }, 500 * (this.state.retryCount + 1)); // backoff
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback node
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        fallbackTitle = "Something went wrong",
        fallbackMessage = "We're sorry, but something went wrong. Please try again.",
        showRetry = true,
      } = this.props;

      return (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold">{fallbackTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{fallbackMessage}</p>
            {this.state.error && process.env.NODE_ENV === "development" && (
              <details className="text-xs text-left">
                <summary className="cursor-pointer text-muted-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-2 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              {showRetry && (
                <Button onClick={this.handleRetry} variant="default">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// ========================================
// Named export — primary component
// ========================================
export function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
}

// ========================================
// HOC: withErrorBoundary — wrap any component declaratively
// Usage: export default withErrorBoundary(MyPage, { boundary: "MyPage" })
// ========================================
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  boundaryProps?: Omit<Props, "children">
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary boundary={displayName} {...boundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}