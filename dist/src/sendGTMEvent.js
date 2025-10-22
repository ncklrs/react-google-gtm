"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGTMEvent = exports.configureGTM = void 0;
var config = {
    debug: false,
};
/**
 * Configure GTM behavior
 * @param options Configuration options
 */
var configureGTM = function (options) {
    config = __assign(__assign({}, config), options);
};
exports.configureGTM = configureGTM;
/**
 * Send an event to Google Tag Manager
 * @param eventData The event data to push to dataLayer
 */
var sendGTMEvent = function (eventData) {
    if (!window.dataLayer) {
        console.warn("Google Tag Manager dataLayer is not initialized.");
        return;
    }
    if (config.debug) {
        console.log("[GTM Debug]", eventData);
    }
    window.dataLayer.push(eventData);
};
exports.sendGTMEvent = sendGTMEvent;
//# sourceMappingURL=sendGTMEvent.js.map