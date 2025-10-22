// src/hooks/useVisibilityTracking.ts
import { useEffect, useRef } from "react";
import { useGTM } from "./useGTM";

export interface UseVisibilityTrackingOptions {
  elementId?: string;
  threshold?: number;
  trackOnce?: boolean;
  eventName?: string;
  onVisible?: (entry: IntersectionObserverEntry) => void;
  onHidden?: (entry: IntersectionObserverEntry) => void;
}

/**
 * Hook to track element visibility using Intersection Observer
 *
 * @param elementIdOrRef - Element ID or ref to track
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // Track by element ID
 * useVisibilityTracking('hero-section', {
 *   eventName: 'section_view',
 *   threshold: 0.5,
 *   trackOnce: true
 * });
 *
 * // Track with ref
 * const ref = useRef(null);
 * useVisibilityTracking(ref, {
 *   onVisible: () => console.log('Visible!'),
 *   onHidden: () => console.log('Hidden!')
 * });
 *
 * return <div ref={ref}>Content</div>;
 * ```
 */
export const useVisibilityTracking = (
  elementIdOrRef: string | React.RefObject<HTMLElement>,
  options: UseVisibilityTrackingOptions = {}
) => {
  const {
    threshold = 0.5,
    trackOnce = false,
    eventName = "element_visible",
    onVisible,
    onHidden,
  } = options;

  const { sendEvent } = useGTM();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver is not supported in this browser");
      return;
    }

    const element =
      typeof elementIdOrRef === "string"
        ? document.getElementById(elementIdOrRef)
        : elementIdOrRef.current;

    if (!element) {
      console.warn(`Element not found for visibility tracking`);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (trackOnce && hasTracked.current) {
              return;
            }

            hasTracked.current = true;

            sendEvent({
              event: eventName,
              element_id: element.id || "unknown",
              visibility_ratio: entry.intersectionRatio,
            });

            if (onVisible) {
              onVisible(entry);
            }
          } else {
            if (onHidden) {
              onHidden(entry);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementIdOrRef, threshold, trackOnce, eventName, sendEvent, onVisible, onHidden]);
};
