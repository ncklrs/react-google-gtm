import React from "react";
export interface GoogleTagManagerProps {
    gtmId: string;
    dataLayer?: Record<string, any>[];
    additionalScripts?: string[];
    dataLayerName?: string;
    auth?: string;
    preview?: string;
    nonce?: string;
}
declare const GoogleTagManager: React.FC<GoogleTagManagerProps>;
export default GoogleTagManager;
//# sourceMappingURL=GoogleTagManager.d.ts.map