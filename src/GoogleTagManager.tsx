// src/GoogleTagManager.tsx
import React, { useEffect, useRef } from "react";

export interface GoogleTagManagerProps {
  gtmId: string;
  dataLayer?: Record<string, any>[];
  additionalScripts?: string[];
  dataLayerName?: string;
  auth?: string;
  preview?: string;
  nonce?: string;
}

const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({
  gtmId,
  dataLayer = [],
  additionalScripts = [],
  dataLayerName = "dataLayer",
  auth,
  preview,
  nonce,
}) => {
  const scriptsRef = useRef<HTMLScriptElement[]>([]);

  useEffect(() => {
    // Initialize the dataLayer if not already present
    if (!window.dataLayer) {
      window.dataLayer = [];
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
    document.head.appendChild(script);
    scriptsRef.current.push(script);

    // Load additional scripts
    additionalScripts.forEach((src) => {
      // Basic URL validation
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
    };
  }, [gtmId, auth, preview, dataLayerName, nonce]);

  return null;
};

export default GoogleTagManager;
