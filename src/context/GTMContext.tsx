// src/context/GTMContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { GTMEvent, GTMConfig } from "../sendGTMEvent";

export interface ConsentSettings {
  ad_storage?: "granted" | "denied";
  analytics_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
  functionality_storage?: "granted" | "denied";
  personalization_storage?: "granted" | "denied";
  security_storage?: "granted" | "denied";
}

export interface GTMProviderProps {
  gtmId: string;
  dataLayer?: Record<string, any>[];
  additionalScripts?: string[];
  dataLayerName?: string;
  auth?: string;
  preview?: string;
  nonce?: string;
  config?: GTMConfig;
  consent?: ConsentSettings;
  onLoad?: (loadTime: number) => void;
  onError?: (error: Error) => void;
  onEvent?: (event: GTMEvent) => void;
  children: React.ReactNode;
}

export interface GTMContextValue {
  gtmId: string;
  isReady: boolean;
  config: GTMConfig;
  sendEvent: (event: GTMEvent) => void;
  updateConsent: (consent: ConsentSettings) => void;
  getDataLayer: () => any[];
}

const GTMContext = createContext<GTMContextValue | undefined>(undefined);

// Event queue for events sent before GTM is ready
const eventQueue: GTMEvent[] = [];
let isGTMReady = false;

export const GTMProvider: React.FC<GTMProviderProps> = ({
  gtmId,
  dataLayer = [],
  additionalScripts = [],
  dataLayerName = "dataLayer",
  auth,
  preview,
  nonce,
  config = { debug: false },
  consent,
  onLoad,
  onError,
  onEvent,
  children,
}) => {
  const [ready, setReady] = useState(false);
  const scriptsRef = useRef<HTMLScriptElement[]>([]);
  const startTime = useRef<number>(Date.now());

  // Initialize dataLayer and handle consent
  useEffect(() => {
    try {
      // Initialize the dataLayer if not already present
      if (!window.dataLayer) {
        window.dataLayer = [];
      }

      // Handle consent mode if provided
      if (consent) {
        window.dataLayer.push({
          event: "consent_default",
          ...consent,
        });
      }

      // If custom dataLayer is provided, push it
      if (dataLayer.length > 0) {
        window.dataLayer.push(...dataLayer);
      }

      // Build GTM URL with optional parameters
      let gtmUrl = `https://www.googletagmanager.com/gtm.js?id=${gtmId}&l=${dataLayerName}`;
      if (auth && preview) {
        gtmUrl += `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`;
      }

      // Create and insert the GTM script
      const script = document.createElement("script");
      script.src = gtmUrl;
      script.async = true;
      if (nonce) {
        script.setAttribute("nonce", nonce);
      }

      script.onload = () => {
        const loadTime = Date.now() - startTime.current;
        setReady(true);
        isGTMReady = true;

        // Flush queued events
        if (eventQueue.length > 0) {
          eventQueue.forEach((event) => {
            window.dataLayer.push(event);
            if (config.debug) {
              console.log("[GTM Debug] Flushed queued event:", event);
            }
          });
          eventQueue.length = 0; // Clear the queue
        }

        if (onLoad) {
          onLoad(loadTime);
        }
      };

      script.onerror = (error) => {
        const err = new Error("Failed to load Google Tag Manager");
        console.error(err);
        if (onError) {
          onError(err);
        }
      };

      document.head.appendChild(script);
      scriptsRef.current.push(script);

      // Load additional scripts
      additionalScripts.forEach((src) => {
        try {
          new URL(src);
          const additionalScript = document.createElement("script");
          additionalScript.src = src;
          additionalScript.async = true;
          if (nonce) {
            additionalScript.setAttribute("nonce", nonce);
          }
          document.head.appendChild(additionalScript);
          scriptsRef.current.push(additionalScript);
        } catch (error) {
          console.warn(`Invalid URL provided in additionalScripts: ${src}`);
        }
      });

      // Cleanup on component unmount
      return () => {
        scriptsRef.current.forEach((scriptElement) => {
          if (scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        });
        scriptsRef.current = [];
        isGTMReady = false;
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error initializing GTM");
      console.error(err);
      if (onError) {
        onError(err);
      }
    }
  }, [gtmId, auth, preview, dataLayerName, nonce]);

  const sendEvent = useCallback(
    (event: GTMEvent) => {
      try {
        if (!window.dataLayer) {
          console.warn("Google Tag Manager dataLayer is not initialized.");
          return;
        }

        // Queue events if GTM is not ready yet
        if (!isGTMReady) {
          eventQueue.push(event);
          if (config.debug) {
            console.log("[GTM Debug] Event queued (GTM not ready):", event);
          }
          return;
        }

        if (config.debug) {
          console.log("[GTM Debug]", event);
        }

        window.dataLayer.push(event);

        if (onEvent) {
          onEvent(event);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error sending GTM event");
        console.error("Error sending GTM event:", err);
        if (onError) {
          onError(err);
        }
      }
    },
    [config.debug, onEvent, onError]
  );

  const updateConsent = useCallback(
    (newConsent: ConsentSettings) => {
      try {
        if (!window.dataLayer) {
          console.warn("Google Tag Manager dataLayer is not initialized.");
          return;
        }

        window.dataLayer.push({
          event: "consent_update",
          ...newConsent,
        });

        if (config.debug) {
          console.log("[GTM Debug] Consent updated:", newConsent);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error updating consent");
        console.error("Error updating consent:", err);
        if (onError) {
          onError(err);
        }
      }
    },
    [config.debug, onError]
  );

  const getDataLayer = useCallback(() => {
    return window.dataLayer || [];
  }, []);

  const value: GTMContextValue = {
    gtmId,
    isReady: ready,
    config,
    sendEvent,
    updateConsent,
    getDataLayer,
  };

  return <GTMContext.Provider value={value}>{children}</GTMContext.Provider>;
};

export const useGTMContext = (): GTMContextValue => {
  const context = useContext(GTMContext);
  if (context === undefined) {
    throw new Error("useGTMContext must be used within a GTMProvider");
  }
  return context;
};
