// src/NoScript.tsx
import React from 'react';

export interface NoScriptProps {
  gtmId: string;
  auth?: string;
  preview?: string;
}

/**
 * GTM NoScript component for users with JavaScript disabled
 * Should be placed immediately after the opening <body> tag
 */
const NoScript: React.FC<NoScriptProps> = ({ gtmId, auth, preview }) => {
  let iframeSrc = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;

  if (auth && preview) {
    iframeSrc += `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`;
  }

  return (
    <noscript>
      <iframe
        src={iframeSrc}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
};

export default NoScript;
