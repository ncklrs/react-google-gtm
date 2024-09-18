interface PageViewEvent {
  event: "page_view";
  page: string;
}

interface ButtonClickEvent {
  event: "button_click";
  button_name: string;
}

interface FormSubmissionEvent {
  event: "form_submission";
  form_id: string;
}

type CustomEvent = {
  event: string;
  [key: string]: any;
};

// Generic function to send any event
const sendGTMEvent = (eventData: CustomEvent): void => {
  if (!window.dataLayer) {
    console.warn("Google Tag Manager dataLayer is not initialized.");
    return;
  }
  window.dataLayer.push(eventData);
};

// Utility function for page views
export const trackPageView = (page: string): void => {
  sendGTMEvent({
    event: "page_view",
    page,
  });
};

// Utility function for button clicks
export const trackButtonClick = (buttonName: string): void => {
  sendGTMEvent({
    event: "button_click",
    button_name: buttonName,
  });
};

// Utility function for form submissions
export const trackFormSubmission = (formId: string): void => {
  sendGTMEvent({
    event: "form_submission",
    form_id: formId,
  });
};

// Utility function for custom events
export const trackCustomEvent = (
  eventName: string,
  properties: Record<string, any>
): void => {
  sendGTMEvent({
    event: eventName,
    ...properties,
  });
};
