"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class Viewer3DErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-dots bg-board p-8 text-center">
          <svg
            viewBox="0 0 64 64"
            className="h-16 w-16"
            fill="none"
            stroke="#B9BCC4"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <rect x="8" y="20" width="48" height="24" rx="6" />
            <circle cx="18" cy="32" r="2" fill="#B9BCC4" />
            <circle cx="28" cy="32" r="2" fill="#B9BCC4" />
            <circle cx="38" cy="32" r="2" fill="#B9BCC4" />
            <circle cx="48" cy="32" r="2" fill="#B9BCC4" />
          </svg>
          <p className="font-display font-semibold text-muted">
            3D viewer crashed
          </p>
          <p className="max-w-[36ch] text-sm text-muted/80">
            The 3D preview hit a rendering error. Your project data is safe
            — try reloading the viewer or use the Wiring tab instead.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre className="mt-2 max-w-full overflow-auto rounded-lg bg-surface p-3 text-left font-mono text-xs text-muted">
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className="btn-ghost mt-2 !px-4 !py-2 text-xs"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
