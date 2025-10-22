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
exports.trackCustomEvent = exports.trackFormSubmission = exports.trackButtonClick = exports.trackPageView = void 0;
var sendGTMEvent_1 = require("../sendGTMEvent");
// Utility function for page views
var trackPageView = function (page) {
    (0, sendGTMEvent_1.sendGTMEvent)({
        event: "page_view",
        page: page,
    });
};
exports.trackPageView = trackPageView;
// Utility function for button clicks
var trackButtonClick = function (buttonName) {
    (0, sendGTMEvent_1.sendGTMEvent)({
        event: "button_click",
        button_name: buttonName,
    });
};
exports.trackButtonClick = trackButtonClick;
// Utility function for form submissions
var trackFormSubmission = function (formId) {
    (0, sendGTMEvent_1.sendGTMEvent)({
        event: "form_submission",
        form_id: formId,
    });
};
exports.trackFormSubmission = trackFormSubmission;
// Utility function for custom events
var trackCustomEvent = function (eventName, properties) {
    (0, sendGTMEvent_1.sendGTMEvent)(__assign({ event: eventName }, properties));
};
exports.trackCustomEvent = trackCustomEvent;
//# sourceMappingURL=trackEvents.js.map