// src/testing/index.ts
import { GTMEvent } from "../sendGTMEvent";

let mockDataLayer: GTMEvent[] = [];
let isMocked = false;

/**
 * Mock GTM for testing
 * Replaces window.dataLayer with a mock implementation
 *
 * @example
 * ```tsx
 * beforeEach(() => {
 *   mockGTM();
 * });
 *
 * afterEach(() => {
 *   clearEvents();
 * });
 * ```
 */
export const mockGTM = (): void => {
  if (typeof window === "undefined") {
    console.warn("mockGTM called in non-browser environment");
    return;
  }

  mockDataLayer = [];
  isMocked = true;

  // Mock window.dataLayer
  Object.defineProperty(window, "dataLayer", {
    get: () => mockDataLayer,
    set: (value) => {
      mockDataLayer = value;
    },
    configurable: true,
  });

  // Override push to capture events
  const originalPush = mockDataLayer.push.bind(mockDataLayer);
  mockDataLayer.push = function (...items: any[]) {
    return originalPush(...items);
  };
};

/**
 * Restore original GTM implementation
 *
 * @example
 * ```tsx
 * afterAll(() => {
 *   restoreGTM();
 * });
 * ```
 */
export const restoreGTM = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  isMocked = false;
  mockDataLayer = [];
  delete (window as any).dataLayer;
};

/**
 * Get all events sent to GTM
 *
 * @returns Array of all GTM events
 *
 * @example
 * ```tsx
 * const events = getAllEvents();
 * expect(events).toHaveLength(3);
 * ```
 */
export const getAllEvents = (): GTMEvent[] => {
  if (!isMocked) {
    console.warn("getAllEvents called but GTM is not mocked. Call mockGTM() first.");
  }
  return [...mockDataLayer];
};

/**
 * Get the last event sent to GTM
 *
 * @returns The most recent GTM event or undefined
 *
 * @example
 * ```tsx
 * fireEvent.click(button);
 * expect(getLastEvent()).toEqual({
 *   event: 'button_click',
 *   button_name: 'Submit'
 * });
 * ```
 */
export const getLastEvent = (): GTMEvent | undefined => {
  if (!isMocked) {
    console.warn("getLastEvent called but GTM is not mocked. Call mockGTM() first.");
  }
  return mockDataLayer[mockDataLayer.length - 1];
};

/**
 * Get events by event name
 *
 * @param eventName - Name of the event to filter by
 * @returns Array of events matching the name
 *
 * @example
 * ```tsx
 * const pageViews = getEventsByName('page_view');
 * expect(pageViews).toHaveLength(2);
 * ```
 */
export const getEventsByName = (eventName: string): GTMEvent[] => {
  if (!isMocked) {
    console.warn("getEventsByName called but GTM is not mocked. Call mockGTM() first.");
  }
  return mockDataLayer.filter((event) => event.event === eventName);
};

/**
 * Clear all tracked events
 *
 * @example
 * ```tsx
 * afterEach(() => {
 *   clearEvents();
 * });
 * ```
 */
export const clearEvents = (): void => {
  mockDataLayer = [];
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.length = 0;
  }
};

/**
 * Wait for a specific event to be sent
 *
 * @param eventName - Name of the event to wait for
 * @param timeout - Maximum time to wait in ms (default: 1000)
 * @returns Promise that resolves with the event or rejects on timeout
 *
 * @example
 * ```tsx
 * fireEvent.click(button);
 * const event = await waitForEvent('button_click');
 * expect(event.button_name).toBe('Submit');
 * ```
 */
export const waitForEvent = (
  eventName: string,
  timeout: number = 1000
): Promise<GTMEvent> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkForEvent = () => {
      const event = mockDataLayer.find((e) => e.event === eventName);
      if (event) {
        resolve(event);
        return;
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Timeout waiting for event: ${eventName}`));
        return;
      }

      setTimeout(checkForEvent, 10);
    };

    checkForEvent();
  });
};

/**
 * Assert that an event was sent
 *
 * @param eventName - Name of the event
 * @param eventData - Optional partial event data to match
 * @returns boolean indicating if event was found
 *
 * @example
 * ```tsx
 * expect(wasEventSent('page_view', { page: '/home' })).toBe(true);
 * ```
 */
export const wasEventSent = (
  eventName: string,
  eventData?: Partial<GTMEvent>
): boolean => {
  const events = getEventsByName(eventName);

  if (!eventData) {
    return events.length > 0;
  }

  return events.some((event) => {
    return Object.keys(eventData).every(
      (key) => event[key] === eventData[key]
    );
  });
};

/**
 * Get count of events by name
 *
 * @param eventName - Name of the event
 * @returns Number of times the event was sent
 *
 * @example
 * ```tsx
 * expect(getEventCount('button_click')).toBe(3);
 * ```
 */
export const getEventCount = (eventName: string): number => {
  return getEventsByName(eventName).length;
};
