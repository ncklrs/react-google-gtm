import React from "react";
interface GoogleTagManagerProps {
    gtmId: string;
    dataLayer?: Record<string, any>[];
    additionalScripts?: string[];
}
declare const GoogleTagManager: React.FC<GoogleTagManagerProps>;
export default GoogleTagManager;
