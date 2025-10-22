"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/GoogleTagManager.tsx
var react_1 = require("react");
var GoogleTagManager = function (_a) {
    var gtmId = _a.gtmId, _b = _a.dataLayer, dataLayer = _b === void 0 ? [] : _b, _c = _a.additionalScripts, additionalScripts = _c === void 0 ? [] : _c, _d = _a.dataLayerName, dataLayerName = _d === void 0 ? "dataLayer" : _d, auth = _a.auth, preview = _a.preview, nonce = _a.nonce;
    var scriptsRef = (0, react_1.useRef)([]);
    (0, react_1.useEffect)(function () {
        var _a;
        // Initialize the dataLayer if not already present
        if (!window.dataLayer) {
            window.dataLayer = [];
        }
        // If custom dataLayer is provided, push it
        if (dataLayer.length > 0) {
            (_a = window.dataLayer).push.apply(_a, dataLayer);
        }
        // Build GTM URL with optional parameters
        var gtmUrl = "https://www.googletagmanager.com/gtm.js?id=".concat(gtmId, "&l=").concat(dataLayerName);
        if (auth && preview) {
            gtmUrl += "&gtm_auth=".concat(auth, "&gtm_preview=").concat(preview, "&gtm_cookies_win=x");
        }
        // Create and insert the GTM script
        var script = document.createElement("script");
        script.src = gtmUrl;
        script.async = true;
        if (nonce) {
            script.setAttribute("nonce", nonce);
        }
        document.head.appendChild(script);
        scriptsRef.current.push(script);
        // Load additional scripts
        additionalScripts.forEach(function (src) {
            // Basic URL validation
            try {
                new URL(src);
                var additionalScript = document.createElement("script");
                additionalScript.src = src;
                additionalScript.async = true;
                if (nonce) {
                    additionalScript.setAttribute("nonce", nonce);
                }
                document.head.appendChild(additionalScript);
                scriptsRef.current.push(additionalScript);
            }
            catch (error) {
                console.warn("Invalid URL provided in additionalScripts: ".concat(src));
            }
        });
        // Cleanup on component unmount
        return function () {
            scriptsRef.current.forEach(function (scriptElement) {
                if (scriptElement.parentNode) {
                    scriptElement.parentNode.removeChild(scriptElement);
                }
            });
            scriptsRef.current = [];
        };
    }, [gtmId, auth, preview, dataLayerName, nonce]);
    return null;
};
exports.default = GoogleTagManager;
//# sourceMappingURL=GoogleTagManager.js.map