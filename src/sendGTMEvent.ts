// src/sendGTMEvent.ts
interface GTMEvent {
  event: string;
  [key: string]: any; // Allows for any additional properties
}


export const sendGTMEvent = (eventData: GTMEvent): void => {
  if (!window.dataLayer) {
    console.warn("Google Tag Manager dataLayer is not initialized.");
    return;
  }

  window.dataLayer.push(eventData);
};