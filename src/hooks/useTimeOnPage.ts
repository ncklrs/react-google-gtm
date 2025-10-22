// src/hooks/useTimeOnPage.ts
import { useEffect, useRef } from "react";
import { useGTM } from "./useGTM";

export interface UseTimeOnPageOptions {
  pageName?: string;
  eventName?: string;
  intervals?: number[];
  sendOnUnmount?: boolean;
}

/**
 * Hook to track time spent on page
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // Track time with default intervals (10s, 30s, 60s, 120s)
 * useTimeOnPage({ pageName: 'product_page' });
 *
 * // Custom intervals
 * useTimeOnPage({
 *   pageName: 'checkout',
 *   intervals: [5000, 15000, 30000],
 *   sendOnUnmount: true
 * });
 * ```
 */
export const useTimeOnPage = (options: UseTimeOnPageOptions = {}) => {
  const {
    pageName = typeof window !== "undefined" ? window.location.pathname : "",
    eventName = "time_on_page",
    intervals = [10000, 30000, 60000, 120000], // 10s, 30s, 1min, 2min
    sendOnUnmount = true,
  } = options;

  const { sendEvent } = useGTM();
  const startTime = useRef<number>(Date.now());
  const trackedIntervals = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timers = intervals.map((interval) => {
      return setTimeout(() => {
        if (!trackedIntervals.current.has(interval)) {
          trackedIntervals.current.add(interval);

          sendEvent({
            event: eventName,
            page: pageName,
            time_on_page: interval / 1000, // Convert to seconds
            time_threshold: interval,
          });
        }
      }, interval);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));

      if (sendOnUnmount) {
        const timeSpent = Date.now() - startTime.current;
        sendEvent({
          event: `${eventName}_exit`,
          page: pageName,
          time_on_page: Math.round(timeSpent / 1000), // Convert to seconds
        });
      }
    };
  }, [pageName, eventName, sendEvent, sendOnUnmount]);
};
