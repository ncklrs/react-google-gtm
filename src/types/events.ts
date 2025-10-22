// src/types/events.ts

/**
 * Create a type-safe GTM client with custom event definitions
 *
 * @example
 * ```tsx
 * interface MyEvents {
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
 * const gtm = createGTMClient<MyEvents>();
 *
 * // Type-safe event sending with autocomplete
 * gtm.sendEvent('purchase', {
 *   transaction_id: '123',
 *   value: 99.99,
 *   currency: 'USD'
 * });
 * ```
 */
export interface TypedGTMClient<TEvents extends Record<string, any>> {
  sendEvent: <K extends keyof TEvents>(
    event: K,
    data: TEvents[K]
  ) => void;
  isReady: boolean;
}

/**
 * Helper type for extracting event data types
 */
export type EventData<
  TEvents extends Record<string, any>,
  K extends keyof TEvents
> = TEvents[K];

/**
 * Generic GTM event with type parameter
 */
export type TypedGTMEvent<T = any> = {
  event: string;
} & T;

/**
 * Common e-commerce events following GA4 schema
 */
export interface EcommerceEvents {
  view_item: {
    currency?: string;
    value?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity?: number;
    }>;
  };
  add_to_cart: {
    currency?: string;
    value?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
  };
  remove_from_cart: {
    currency?: string;
    value?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
  };
  begin_checkout: {
    currency?: string;
    value?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
  };
  purchase: {
    transaction_id: string;
    value: number;
    currency: string;
    tax?: number;
    shipping?: number;
    items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }>;
  };
}
