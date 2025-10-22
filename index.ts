// index.ts
// Core Components
import GoogleTagManager from "./src/GoogleTagManager";
import NoScript from "./src/NoScript";
export { GoogleTagManager, NoScript };

// Legacy API (for backwards compatibility)
export { sendGTMEvent, configureGTM } from "./src/sendGTMEvent";
export * from "./src/utils/trackEvents";

// Context & Provider (New in v2.0)
export { GTMProvider, useGTMContext } from "./src/context/GTMContext";

// Hooks (New in v2.0)
export { useGTM } from "./src/hooks/useGTM";
export { useGTMEvent } from "./src/hooks/useGTMEvent";
export { useGTMPageView } from "./src/hooks/useGTMPageView";
export { useGTMClick } from "./src/hooks/useGTMClick";
export { useGTMForm } from "./src/hooks/useGTMForm";
export { useTimeOnPage } from "./src/hooks/useTimeOnPage";
export { useVisibilityTracking } from "./src/hooks/useVisibilityTracking";

// Components (New in v2.0)
export { GTMDebugger } from "./src/components/GTMDebugger";
export { ScrollTracker } from "./src/components/ScrollTracker";
export { GTMErrorBoundary } from "./src/components/GTMErrorBoundary";

// Type-Safe Event Builder (Phase 4)
export { createGTMClient, useTypedGTM } from "./src/factory/createGTMClient";

// Middleware (Phase 4)
export {
  MiddlewareManager,
  loggerMiddleware,
  timestampMiddleware,
  createUserEnrichmentMiddleware,
  createValidationMiddleware,
  createRateLimitMiddleware,
  createPIIFilterMiddleware,
  createSamplingMiddleware,
  createBatchMiddleware,
} from "./src/middleware";

// Performance Utilities (Phase 4)
export {
  PerformanceMonitor,
  lazyLoadGTM,
  measureEventPerformance,
  createDebouncedEventSender,
  createThrottledEventSender,
  checkGTMPerformance,
} from "./src/performance";

// Observability (Phase 5)
export {
  ObservabilityManager,
  createObservabilityManager,
  useObservability,
} from "./src/observability";

// Types
export type { GTMEvent, GTMConfig } from "./src/sendGTMEvent";
export type { GoogleTagManagerProps } from "./src/GoogleTagManager";
export type { NoScriptProps } from "./src/NoScript";
export type {
  GTMProviderProps,
  GTMContextValue,
  ConsentSettings,
} from "./src/context/GTMContext";
export type { GTMFormHandlers, UseGTMFormOptions } from "./src/hooks/useGTMForm";
export type { UseTimeOnPageOptions } from "./src/hooks/useTimeOnPage";
export type { UseVisibilityTrackingOptions } from "./src/hooks/useVisibilityTracking";
export type { GTMDebuggerProps } from "./src/components/GTMDebugger";
export type { ScrollTrackerProps } from "./src/components/ScrollTracker";
export type { GTMErrorBoundaryProps } from "./src/components/GTMErrorBoundary";
export type {
  TypedGTMClient,
  EventData,
  TypedGTMEvent,
  EcommerceEvents,
} from "./src/types/events";
export type {
  TypeSafeGTMClient,
} from "./src/factory/createGTMClient";
export type {
  EventMiddleware,
  AsyncEventMiddleware,
  MiddlewareContext,
} from "./src/middleware/types";
export type {
  LoadStrategy,
  PerformanceConfig,
} from "./src/performance";
export type {
  ObservabilityConfig,
  ObservabilityMetrics,
} from "./src/observability";