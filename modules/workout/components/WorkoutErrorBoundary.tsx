"use client";

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Wraps the workout player so a render crash never loses in-progress session data.
 * Sets are already persisted to Dexie on each log, so recovery is safe.
 */
export class WorkoutErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[WorkoutPlayer] Render error:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-base font-semibold text-primary mb-2">Something went wrong</h2>
          <p className="text-sm text-secondary mb-1">
            Your logged sets are safe — they were saved as you went.
          </p>
          <p className="text-xs text-tertiary mb-8">
            Open your workout history to review this session.
          </p>
          <button onClick={this.handleReset} className="btn px-6 py-3 text-sm">
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
