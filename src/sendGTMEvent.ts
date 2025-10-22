// src/sendGTMEvent.ts
export interface GTMEvent {
  event: string;
  [key: string]: any; // Allows for any additional properties
}

export interface GTMConfig {
  debug?: boolean;
}

let config: GTMConfig = {
  debug: false,
};

/**
 * Configure GTM behavior
 * @param options Configuration options
 */
export const configureGTM = (options: GTMConfig): void => {
  config = { ...config, ...options };
};

/**
 * Send an event to Google Tag Manager
 * @param eventData The event data to push to dataLayer
 */
export const sendGTMEvent = (eventData: GTMEvent): void => {
  if (!window.dataLayer) {
    console.warn("Google Tag Manager dataLayer is not initialized.");
    return;
  }

  if (config.debug) {
    console.log("[GTM Debug]", eventData);
  }

  window.dataLayer.push(eventData);
};