// src/hooks/useGTMClick.ts
import { useCallback } from "react";
import { useGTMContext } from "../context/GTMContext";

/**
 * Hook to create a click handler that tracks GTM events
 *
 * @param eventName - Name of the event (defaults to 'button_click')
 * @param eventData - Additional data to include with the event
 * @param callback - Optional callback to run after tracking
 * @returns Click handler function
 *
 * @example
 * ```tsx
 * const handleClick = useGTMClick('cta_click', {
 *   button_name: 'Subscribe',
 *   location: 'hero'
 * });
 *
 * return <button onClick={handleClick}>Subscribe</button>;
 *
 * // With custom callback
 * const handleSubmit = useGTMClick('form_submit', { form_id: 'contact' }, () => {
 *   console.log('Form submitted');
 * });
 * ```
 */
export const useGTMClick = (
  eventName: string = "button_click",
  eventData?: Record<string, any>,
  callback?: (event: React.MouseEvent) => void
) => {
  const { sendEvent } = useGTMContext();

  return useCallback(
    (event: React.MouseEvent) => {
      sendEvent({
        event: eventName,
        ...eventData,
      });

      if (callback) {
        callback(event);
      }
    },
    [sendEvent, eventName, eventData, callback]
  );
};
