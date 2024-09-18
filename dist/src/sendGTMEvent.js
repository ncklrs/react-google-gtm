"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGTMEvent = void 0;
var sendGTMEvent = function (eventData) {
    if (!window.dataLayer) {
        console.warn("Google Tag Manager dataLayer is not initialized.");
        return;
    }
    window.dataLayer.push(eventData);
};
exports.sendGTMEvent = sendGTMEvent;
