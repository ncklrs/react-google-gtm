"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/GoogleTagManager.tsx
var react_1 = require("react");
var GoogleTagManager = function (_a) {
    var gtmId = _a.gtmId, _b = _a.dataLayer, dataLayer = _b === void 0 ? [] : _b, _c = _a.additionalScripts, additionalScripts = _c === void 0 ? [] : _c;
    (0, react_1.useEffect)(function () {
        var _a;
        // Initialize the dataLayer if not already present
        window.dataLayer = window.dataLayer || [];
        // If custom dataLayer is provided, merge it
        (_a = window.dataLayer).push.apply(_a, dataLayer);
        // Create and insert the GTM script
        var script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtm.js?id=".concat(gtmId);
        script.async = true;
        document.head.appendChild(script);
        // Load additional scripts
        additionalScripts.forEach(function (src) {
            var additionalScript = document.createElement("script");
            additionalScript.src = src;
            additionalScript.async = true;
            document.head.appendChild(additionalScript);
        });
        // Cleanup on component unmount
        return function () {
            document.head.removeChild(script);
            additionalScripts.forEach(function (src) {
                var scriptToRemove = document.querySelector("script[src=\"".concat(src, "\"]"));
                if (scriptToRemove) {
                    document.head.removeChild(scriptToRemove);
                }
            });
        };
    }, [gtmId, dataLayer, additionalScripts]);
    return null;
};
exports.default = GoogleTagManager;
