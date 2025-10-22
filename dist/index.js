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
exports.useObservability = exports.createObservabilityManager = exports.ObservabilityManager = exports.checkGTMPerformance = exports.createThrottledEventSender = exports.createDebouncedEventSender = exports.measureEventPerformance = exports.lazyLoadGTM = exports.PerformanceMonitor = exports.createBatchMiddleware = exports.createSamplingMiddleware = exports.createPIIFilterMiddleware = exports.createRateLimitMiddleware = exports.createValidationMiddleware = exports.createUserEnrichmentMiddleware = exports.timestampMiddleware = exports.loggerMiddleware = exports.MiddlewareManager = exports.useTypedGTM = exports.createGTMClient = exports.GTMErrorBoundary = exports.ScrollTracker = exports.GTMDebugger = exports.useVisibilityTracking = exports.useTimeOnPage = exports.useGTMForm = exports.useGTMClick = exports.useGTMPageView = exports.useGTMEvent = exports.useGTM = exports.useGTMContext = exports.GTMProvider = exports.configureGTM = exports.sendGTMEvent = exports.NoScript = exports.GoogleTagManager = void 0;
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
// Type-Safe Event Builder (Phase 4)
var createGTMClient_1 = require("./src/factory/createGTMClient");
Object.defineProperty(exports, "createGTMClient", { enumerable: true, get: function () { return createGTMClient_1.createGTMClient; } });
Object.defineProperty(exports, "useTypedGTM", { enumerable: true, get: function () { return createGTMClient_1.useTypedGTM; } });
// Middleware (Phase 4)
var middleware_1 = require("./src/middleware");
Object.defineProperty(exports, "MiddlewareManager", { enumerable: true, get: function () { return middleware_1.MiddlewareManager; } });
Object.defineProperty(exports, "loggerMiddleware", { enumerable: true, get: function () { return middleware_1.loggerMiddleware; } });
Object.defineProperty(exports, "timestampMiddleware", { enumerable: true, get: function () { return middleware_1.timestampMiddleware; } });
Object.defineProperty(exports, "createUserEnrichmentMiddleware", { enumerable: true, get: function () { return middleware_1.createUserEnrichmentMiddleware; } });
Object.defineProperty(exports, "createValidationMiddleware", { enumerable: true, get: function () { return middleware_1.createValidationMiddleware; } });
Object.defineProperty(exports, "createRateLimitMiddleware", { enumerable: true, get: function () { return middleware_1.createRateLimitMiddleware; } });
Object.defineProperty(exports, "createPIIFilterMiddleware", { enumerable: true, get: function () { return middleware_1.createPIIFilterMiddleware; } });
Object.defineProperty(exports, "createSamplingMiddleware", { enumerable: true, get: function () { return middleware_1.createSamplingMiddleware; } });
Object.defineProperty(exports, "createBatchMiddleware", { enumerable: true, get: function () { return middleware_1.createBatchMiddleware; } });
// Performance Utilities (Phase 4)
var performance_1 = require("./src/performance");
Object.defineProperty(exports, "PerformanceMonitor", { enumerable: true, get: function () { return performance_1.PerformanceMonitor; } });
Object.defineProperty(exports, "lazyLoadGTM", { enumerable: true, get: function () { return performance_1.lazyLoadGTM; } });
Object.defineProperty(exports, "measureEventPerformance", { enumerable: true, get: function () { return performance_1.measureEventPerformance; } });
Object.defineProperty(exports, "createDebouncedEventSender", { enumerable: true, get: function () { return performance_1.createDebouncedEventSender; } });
Object.defineProperty(exports, "createThrottledEventSender", { enumerable: true, get: function () { return performance_1.createThrottledEventSender; } });
Object.defineProperty(exports, "checkGTMPerformance", { enumerable: true, get: function () { return performance_1.checkGTMPerformance; } });
// Observability (Phase 5)
var observability_1 = require("./src/observability");
Object.defineProperty(exports, "ObservabilityManager", { enumerable: true, get: function () { return observability_1.ObservabilityManager; } });
Object.defineProperty(exports, "createObservabilityManager", { enumerable: true, get: function () { return observability_1.createObservabilityManager; } });
Object.defineProperty(exports, "useObservability", { enumerable: true, get: function () { return observability_1.useObservability; } });
//# sourceMappingURL=index.js.map