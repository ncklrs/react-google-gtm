// src/components/GTMErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import { GTMEvent } from "../sendGTMEvent";

export interface GTMErrorBoundaryProps {
  eventName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  sendErrorDetails?: boolean;
  children: ReactNode;
}

interface GTMErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary that tracks React errors to GTM
 *
 * @example
 * ```tsx
 * <GTMErrorBoundary
 *   eventName="react_error"
 *   fallback={<div>Something went wrong</div>}
 * >
 *   <App />
 * </GTMErrorBoundary>
 * ```
 */
export class GTMErrorBoundary extends Component<
  GTMErrorBoundaryProps,
  GTMErrorBoundaryState
> {
  constructor(props: GTMErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): GTMErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { eventName = "react_error", onError, sendErrorDetails = false } = this.props;

    // Send error to GTM
    if (typeof window !== "undefined" && window.dataLayer) {
      const errorEvent: GTMEvent = {
        event: eventName,
        error_message: error.message,
        error_name: error.name,
      };

      if (sendErrorDetails) {
        errorEvent.error_stack = error.stack;
        errorEvent.error_component_stack = errorInfo.componentStack;
      }

      window.dataLayer.push(errorEvent);
    }

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("GTMErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div style={{ padding: 20, textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <p>We've been notified and are working on a fix.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
