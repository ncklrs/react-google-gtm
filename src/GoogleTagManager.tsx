// src/GoogleTagManager.tsx
import React, { useEffect } from "react";

interface GoogleTagManagerProps {
  gtmId: string;
  dataLayer?: Record<string, any>[];
  additionalScripts?: string[];
}

const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({
  gtmId,
  dataLayer = [],
  additionalScripts = [],
}) => {
  useEffect(() => {
    // Initialize the dataLayer if not already present
    window.dataLayer = window.dataLayer || [];
    // If custom dataLayer is provided, merge it
    window.dataLayer.push(...dataLayer);

    // Create and insert the GTM script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    script.async = true;
    document.head.appendChild(script);

    // Load additional scripts
    additionalScripts.forEach((src) => {
      const additionalScript = document.createElement("script");
      additionalScript.src = src;
      additionalScript.async = true;
      document.head.appendChild(additionalScript);
    });

    // Cleanup on component unmount
    return () => {
      document.head.removeChild(script);
      additionalScripts.forEach((src) => {
        const scriptToRemove = document.querySelector(`script[src="${src}"]`);
        if (scriptToRemove) {
          document.head.removeChild(scriptToRemove);
        }
      });
    };
  }, [gtmId, dataLayer, additionalScripts]);

  return null;
};

export default GoogleTagManager;
