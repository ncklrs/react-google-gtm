// src/performance/index.ts
import { GTMEvent } from "../sendGTMEvent";

export type LoadStrategy = "defer" | "async" | "idle" | "worker";

export interface PerformanceConfig {
  strategy?: LoadStrategy;
  preconnect?: boolean;
  timeout?: number;
  priority?: "high" | "low" | "auto";
}

/**
 * Performance metrics tracker
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Start timing an operation
   */
  startTiming(name: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.addMetric(name, duration);
    };
  }

  /**
   * Add a metric
   */
  addMetric(name: string, value: number): void {
    const existing = this.metrics.get(name) || [];
    existing.push(value);
    this.metrics.set(name, existing);
  }

  /**
   * Get metrics for a name
   */
  getMetrics(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  /**
   * Get average metric value
   */
  getAverage(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get all metrics summary
   */
  getSummary(): Record<string, { count: number; avg: number; min: number; max: number }> {
    const summary: Record<string, any> = {};

    this.metrics.forEach((values, name) => {
      summary[name] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Report metrics to GTM
   */
  reportToGTM(dataLayer: GTMEvent[]): void {
    const summary = this.getSummary();

    Object.entries(summary).forEach(([name, stats]) => {
      dataLayer.push({
        event: 'performance_metric',
        metric_name: name,
        ...stats,
      });
    });
  }
}

/**
 * Lazy load GTM script
 */
export function lazyLoadGTM(
  gtmId: string,
  options: PerformanceConfig = {}
): Promise<void> {
  const {
    strategy = "async",
    preconnect = true,
    timeout = 5000,
    priority = "auto",
  } = options;

  return new Promise((resolve, reject) => {
    // Add preconnect for faster DNS resolution
    if (preconnect) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://www.googletagmanager.com";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    if (priority !== "auto") {
      script.setAttribute("fetchpriority", priority);
    }

    switch (strategy) {
      case "defer":
        script.defer = true;
        break;
      case "async":
        script.async = true;
        break;
      case "idle":
        // Load during idle time
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => {
            script.async = true;
            document.head.appendChild(script);
          });
          return;
        }
        // Fallback to async
        script.async = true;
        break;
      case "worker":
        // Use web worker if available (experimental)
        console.warn("Web Worker strategy not yet implemented, falling back to async");
        script.async = true;
        break;
    }

    // Timeout handling
    const timeoutId = setTimeout(() => {
      reject(new Error(`GTM script load timeout after ${timeout}ms`));
    }, timeout);

    script.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    script.onerror = (error) => {
      clearTimeout(timeoutId);
      reject(error);
    };

    document.head.appendChild(script);
  });
}

/**
 * Measure dataLayer push performance
 */
export function measureEventPerformance(
  eventFn: () => void
): number {
  const start = performance.now();
  eventFn();
  return performance.now() - start;
}

/**
 * Debounce event sending for performance
 */
export function createDebouncedEventSender(
  sendEvent: (event: GTMEvent) => void,
  delay: number = 100
): (event: GTMEvent) => void {
  let timeoutId: NodeJS.Timeout;

  return (event: GTMEvent) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      sendEvent(event);
    }, delay);
  };
}

/**
 * Throttle event sending
 */
export function createThrottledEventSender(
  sendEvent: (event: GTMEvent) => void,
  limit: number = 100
): (event: GTMEvent) => void {
  let lastRun = 0;

  return (event: GTMEvent) => {
    const now = Date.now();

    if (now - lastRun >= limit) {
      sendEvent(event);
      lastRun = now;
    }
  };
}

/**
 * Check if GTM is causing performance issues
 */
export function checkGTMPerformance(): {
  scriptLoadTime: number | null;
  dataLayerSize: number;
  eventCount: number;
} {
  const scriptLoadTime = performance
    .getEntriesByType("resource")
    .find((entry: any) => entry.name.includes("googletagmanager.com/gtm.js"));

  return {
    scriptLoadTime: scriptLoadTime ? (scriptLoadTime as any).duration : null,
    dataLayerSize: window.dataLayer ? window.dataLayer.length : 0,
    eventCount: window.dataLayer
      ? window.dataLayer.filter((item: any) => item.event).length
      : 0,
  };
}
