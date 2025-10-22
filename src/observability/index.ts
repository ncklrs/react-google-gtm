// src/observability/index.ts
import { GTMEvent } from "../sendGTMEvent";

export interface ObservabilityConfig {
  enableMetrics?: boolean;
  enableErrorTracking?: boolean;
  enablePerformanceTracking?: boolean;
  reportingInterval?: number;
  onReport?: (metrics: ObservabilityMetrics) => void;
}

export interface ObservabilityMetrics {
  events: {
    total: number;
    byType: Record<string, number>;
    failed: number;
    queued: number;
  };
  performance: {
    avgEventTime: number;
    gtmLoadTime: number | null;
    dataLayerSize: number;
  };
  errors: Array<{
    message: string;
    timestamp: number;
    event?: GTMEvent;
  }>;
}

/**
 * Observability manager for monitoring GTM behavior
 */
export class ObservabilityManager {
  private config: ObservabilityConfig;
  private metrics: ObservabilityMetrics;
  private eventTimes: number[] = [];
  private reportingTimer: NodeJS.Timeout | null = null;

  constructor(config: ObservabilityConfig = {}) {
    this.config = {
      enableMetrics: true,
      enableErrorTracking: true,
      enablePerformanceTracking: true,
      reportingInterval: 60000, // 1 minute
      ...config,
    };

    this.metrics = {
      events: {
        total: 0,
        byType: {},
        failed: 0,
        queued: 0,
      },
      performance: {
        avgEventTime: 0,
        gtmLoadTime: null,
        dataLayerSize: 0,
      },
      errors: [],
    };

    if (this.config.reportingInterval) {
      this.startReporting();
    }
  }

  /**
   * Track an event
   */
  trackEvent(event: GTMEvent, duration?: number): void {
    if (!this.config.enableMetrics) return;

    this.metrics.events.total++;
    this.metrics.events.byType[event.event] =
      (this.metrics.events.byType[event.event] || 0) + 1;

    if (duration !== undefined) {
      this.eventTimes.push(duration);
      this.metrics.performance.avgEventTime =
        this.eventTimes.reduce((a, b) => a + b, 0) / this.eventTimes.length;
    }
  }

  /**
   * Track a failed event
   */
  trackFailure(event: GTMEvent, error: Error): void {
    if (!this.config.enableErrorTracking) return;

    this.metrics.events.failed++;
    this.metrics.errors.push({
      message: error.message,
      timestamp: Date.now(),
      event,
    });

    // Keep only last 100 errors
    if (this.metrics.errors.length > 100) {
      this.metrics.errors.shift();
    }
  }

  /**
   * Track queued event
   */
  trackQueued(): void {
    if (!this.config.enableMetrics) return;
    this.metrics.events.queued++;
  }

  /**
   * Set GTM load time
   */
  setGTMLoadTime(duration: number): void {
    if (!this.config.enablePerformanceTracking) return;
    this.metrics.performance.gtmLoadTime = duration;
  }

  /**
   * Update dataLayer size
   */
  updateDataLayerSize(size: number): void {
    if (!this.config.enablePerformanceTracking) return;
    this.metrics.performance.dataLayerSize = size;
  }

  /**
   * Get current metrics
   */
  getMetrics(): ObservabilityMetrics {
    return JSON.parse(JSON.stringify(this.metrics));
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = {
      events: {
        total: 0,
        byType: {},
        failed: 0,
        queued: 0,
      },
      performance: {
        avgEventTime: 0,
        gtmLoadTime: null,
        dataLayerSize: 0,
      },
      errors: [],
    };
    this.eventTimes = [];
  }

  /**
   * Start automatic reporting
   */
  private startReporting(): void {
    this.reportingTimer = setInterval(() => {
      this.report();
    }, this.config.reportingInterval);
  }

  /**
   * Stop automatic reporting
   */
  stopReporting(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
      this.reportingTimer = null;
    }
  }

  /**
   * Report metrics
   */
  report(): void {
    if (this.config.onReport) {
      this.config.onReport(this.getMetrics());
    }
  }

  /**
   * Send metrics to GTM as event
   */
  sendMetricsToGTM(dataLayer: any[]): void {
    const metrics = this.getMetrics();

    dataLayer.push({
      event: 'gtm_observability_metrics',
      metrics,
    });
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    status: "healthy" | "degraded" | "unhealthy";
    issues: string[];
  } {
    const issues: string[] = [];
    let status: "healthy" | "degraded" | "unhealthy" = "healthy";

    // Check failure rate
    const failureRate =
      this.metrics.events.total > 0
        ? this.metrics.events.failed / this.metrics.events.total
        : 0;

    if (failureRate > 0.1) {
      issues.push(`High failure rate: ${(failureRate * 100).toFixed(1)}%`);
      status = "degraded";
    }

    if (failureRate > 0.3) {
      status = "unhealthy";
    }

    // Check dataLayer size
    if (this.metrics.performance.dataLayerSize > 1000) {
      issues.push(
        `Large dataLayer size: ${this.metrics.performance.dataLayerSize}`
      );
      if (status === "healthy") status = "degraded";
    }

    // Check load time
    if (
      this.metrics.performance.gtmLoadTime &&
      this.metrics.performance.gtmLoadTime > 3000
    ) {
      issues.push(
        `Slow GTM load: ${this.metrics.performance.gtmLoadTime.toFixed(0)}ms`
      );
      if (status === "healthy") status = "degraded";
    }

    // Check recent errors
    const recentErrors = this.metrics.errors.filter(
      (e) => Date.now() - e.timestamp < 60000 // Last minute
    );

    if (recentErrors.length > 10) {
      issues.push(`High error rate: ${recentErrors.length} errors/min`);
      status = "unhealthy";
    }

    return { status, issues };
  }
}

/**
 * Create an observability manager
 */
export function createObservabilityManager(
  config?: ObservabilityConfig
): ObservabilityManager {
  return new ObservabilityManager(config);
}

/**
 * React hook for observability metrics
 */
export function useObservability(manager: ObservabilityManager) {
  const [metrics, setMetrics] = React.useState<ObservabilityMetrics>(
    manager.getMetrics()
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(manager.getMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, [manager]);

  return {
    metrics,
    health: manager.getHealthStatus(),
    reset: () => manager.reset(),
    report: () => manager.report(),
  };
}

// Add React import for the hook
import * as React from "react";
