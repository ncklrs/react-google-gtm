"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GTMErrorBoundary = exports.ScrollTracker = exports.GTMDebugger = exports.useVisibilityTracking = exports.useTimeOnPage = exports.useGTMForm = exports.useGTMClick = exports.useGTMPageView = exports.useGTMEvent = exports.useGTM = exports.useGTMContext = exports.GTMProvider = exports.configureGTM = exports.sendGTMEvent = exports.NoScript = exports.GoogleTagManager = void 0;
// index.ts
// Core Components
var GoogleTagManager_1 = __importDefault(require("./src/GoogleTagManager"));
exports.GoogleTagManager = GoogleTagManager_1.default;
var NoScript_1 = __importDefault(require("./src/NoScript"));
exports.NoScript = NoScript_1.default;
// Legacy API (for backwards compatibility)
var sendGTMEvent_1 = require("./src/sendGTMEvent");
Object.defineProperty(exports, "sendGTMEvent", { enumerable: true, get: function () { return sendGTMEvent_1.sendGTMEvent; } });
Object.defineProperty(exports, "configureGTM", { enumerable: true, get: function () { return sendGTMEvent_1.configureGTM; } });
__exportStar(require("./src/utils/trackEvents"), exports);
// Context & Provider (New in v2.0)
var GTMContext_1 = require("./src/context/GTMContext");
Object.defineProperty(exports, "GTMProvider", { enumerable: true, get: function () { return GTMContext_1.GTMProvider; } });
Object.defineProperty(exports, "useGTMContext", { enumerable: true, get: function () { return GTMContext_1.useGTMContext; } });
// Hooks (New in v2.0)
var useGTM_1 = require("./src/hooks/useGTM");
Object.defineProperty(exports, "useGTM", { enumerable: true, get: function () { return useGTM_1.useGTM; } });
var useGTMEvent_1 = require("./src/hooks/useGTMEvent");
Object.defineProperty(exports, "useGTMEvent", { enumerable: true, get: function () { return useGTMEvent_1.useGTMEvent; } });
var useGTMPageView_1 = require("./src/hooks/useGTMPageView");
Object.defineProperty(exports, "useGTMPageView", { enumerable: true, get: function () { return useGTMPageView_1.useGTMPageView; } });
var useGTMClick_1 = require("./src/hooks/useGTMClick");
Object.defineProperty(exports, "useGTMClick", { enumerable: true, get: function () { return useGTMClick_1.useGTMClick; } });
var useGTMForm_1 = require("./src/hooks/useGTMForm");
Object.defineProperty(exports, "useGTMForm", { enumerable: true, get: function () { return useGTMForm_1.useGTMForm; } });
var useTimeOnPage_1 = require("./src/hooks/useTimeOnPage");
Object.defineProperty(exports, "useTimeOnPage", { enumerable: true, get: function () { return useTimeOnPage_1.useTimeOnPage; } });
var useVisibilityTracking_1 = require("./src/hooks/useVisibilityTracking");
Object.defineProperty(exports, "useVisibilityTracking", { enumerable: true, get: function () { return useVisibilityTracking_1.useVisibilityTracking; } });
// Components (New in v2.0)
var GTMDebugger_1 = require("./src/components/GTMDebugger");
Object.defineProperty(exports, "GTMDebugger", { enumerable: true, get: function () { return GTMDebugger_1.GTMDebugger; } });
var ScrollTracker_1 = require("./src/components/ScrollTracker");
Object.defineProperty(exports, "ScrollTracker", { enumerable: true, get: function () { return ScrollTracker_1.ScrollTracker; } });
var GTMErrorBoundary_1 = require("./src/components/GTMErrorBoundary");
Object.defineProperty(exports, "GTMErrorBoundary", { enumerable: true, get: function () { return GTMErrorBoundary_1.GTMErrorBoundary; } });
//# sourceMappingURL=index.js.map