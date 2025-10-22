// src/factory/createGTMClient.ts
import { GTMEvent } from "../sendGTMEvent";
import { GTMContextValue } from "../context/GTMContext";

export type EventSchema<TEvents extends Record<string, any>> = {
  [K in keyof TEvents]: TEvents[K] & { event?: never };
};

export interface TypeSafeGTMClient<TEvents extends Record<string, any>> {
  /**
   * Send a type-safe event
   */
  sendEvent<K extends keyof TEvents>(
    eventName: K,
    data: TEvents[K]
  ): void;

  /**
   * Check if GTM is ready
   */
  isReady: boolean;

  /**
   * Get the underlying GTM context
   */
  context: GTMContextValue;
}

/**
 * Create a type-safe GTM client with custom event definitions
 *
 * @example
 * ```tsx
 * interface AppEvents {
 *   purchase: {
 *     transaction_id: string;
 *     value: number;
 *     currency: string;
 *   };
 *   button_click: {
 *     button_name: string;
 *     location?: string;
 *   };
 * }
 *
 * const gtm = createGTMClient<AppEvents>(useGTM());
 *
 * // Fully type-checked with autocomplete
 * gtm.sendEvent('purchase', {
 *   transaction_id: 'T123',
 *   value: 99.99,
 *   currency: 'USD'
 * });
 * ```
 */
export function createGTMClient<TEvents extends Record<string, any>>(
  context: GTMContextValue
): TypeSafeGTMClient<TEvents> {
  return {
    sendEvent<K extends keyof TEvents>(
      eventName: K,
      data: TEvents[K]
    ): void {
      const event: GTMEvent = {
        event: String(eventName),
        ...data,
      };
      context.sendEvent(event);
    },

    get isReady() {
      return context.isReady;
    },

    context,
  };
}

/**
 * Hook version of createGTMClient for convenience
 */
export { createGTMClient as useTypedGTM };
