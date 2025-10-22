// src/hooks/useGTMEvent.ts
import { useEffect, useRef } from "react";
import { useGTMContext } from "../context/GTMContext";
import { GTMEvent } from "../sendGTMEvent";

/**
 * Hook to send GTM events declaratively based on dependencies
 * Similar to useEffect, but for GTM events
 *
 * @param eventData - The event data to send (can be a function)
 * @param deps - Dependencies array (like useEffect)
 *
 * @example
 * ```tsx
 * // Send event when location changes
 * useGTMEvent({ event: 'page_view', page: location.pathname }, [location]);
 *
 * // Send event with dynamic data
 * useGTMEvent(() => ({
 *   event: 'user_action',
 *   user_id: currentUser?.id
 * }), [currentUser]);
 * ```
 */
export const useGTMEvent = (
  eventData: GTMEvent | (() => GTMEvent),
  deps: React.DependencyList
) => {
  const { sendEvent } = useGTMContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on first render to match useEffect behavior
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const event = typeof eventData === "function" ? eventData() : eventData;
    sendEvent(event);
  }, deps);
};
