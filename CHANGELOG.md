# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-XX

### 🎉 Major Release - Complete Overhaul

Version 2.0 represents a complete transformation of react-google-gtm into a modern, developer-friendly package with React Context, custom hooks, and enterprise features.

### Added

#### Phase 1: Core Developer Experience
- **React Context & Provider**
  - `GTMProvider` component for app-wide GTM access
  - `useGTM()` hook to access GTM context anywhere
  - Event queue system (no more lost events during initialization)

- **Custom Hooks (7 new hooks)**
  - `useGTM()` - Main hook for GTM access
  - `useGTMEvent()` - Declarative event tracking (like useEffect)
  - `useGTMPageView()` - Automatic page view tracking
  - `useGTMClick()` - Click handlers with built-in tracking
  - `useGTMForm()` - Form interaction tracking
  - `useTimeOnPage()` - Time tracking with configurable intervals
  - `useVisibilityTracking()` - Element visibility with IntersectionObserver

- **Testing Utilities (8 functions)**
  - `mockGTM()` - Mock GTM for testing
  - `getLastEvent()` - Get most recent event
  - `getAllEvents()` - Get all tracked events
  - `getEventsByName()` - Filter by event name
  - `clearEvents()` - Reset tracked events
  - `waitForEvent()` - Async event waiting
  - `wasEventSent()` - Check if event exists
  - `getEventCount()` - Count events

- **TypeScript Improvements**
  - Generic event types for full type safety
  - `TypedGTMClient<TEvents>` interface
  - `EcommerceEvents` with GA4 schema
  - All interfaces exported

#### Phase 2: Essential Features
- **Consent Management**
  - Built-in GDPR/CCPA consent mode
  - `ConsentSettings` interface
  - `updateConsent()` method
  - Initial consent via GTMProvider

- **GTMDebugger Component**
  - Visual debugger UI for development
  - Real-time event tracking display
  - DataLayer contents viewer
  - Configurable position (4 corners)
  - Timestamp support

- **Analytics Pattern Components**
  - `ScrollTracker` - Track scroll depth
  - `GTMErrorBoundary` - Catch and track React errors

- **Enhanced Error Handling**
  - try-catch throughout codebase
  - `onLoad`, `onError`, `onEvent` callbacks
  - Load time metrics

#### Phase 3: Documentation & Examples
- **Example Applications**
  - Next.js App Router example
  - React Router SPA example
  - E-commerce tracking example

#### Phase 4: Advanced Features
- **Type-Safe Event Builder**
  - `createGTMClient<TEvents>()` factory
  - Fully type-checked events with autocomplete
  - Generic event schema support

- **Middleware System**
  - `MiddlewareManager` for event pipelines
  - Built-in middleware:
    - `loggerMiddleware` - Console logging
    - `timestampMiddleware` - Add timestamps
    - `createUserEnrichmentMiddleware()` - Add user data
    - `createValidationMiddleware()` - Event validation
    - `createRateLimitMiddleware()` - Rate limiting
    - `createPIIFilterMiddleware()` - Remove sensitive data
    - `createSamplingMiddleware()` - Sample events
    - `createBatchMiddleware()` - Batch events

- **SSR Utilities**
  - `ServerGTM` class for server-side tracking
  - `createServerGTM()` factory
  - `getDataLayerScript()` - Inject events in HTML
  - `getGTMScript()` - Generate GTM script tag
  - `getNoScriptIframe()` - Generate noscript fallback
  - `flush()` - Send to Measurement Protocol

- **Performance Optimizations**
  - `PerformanceMonitor` class
  - `lazyLoadGTM()` with multiple strategies
  - `LoadStrategy` types: defer, async, idle, worker
  - Preconnect support
  - `createDebouncedEventSender()` - Debounce events
  - `createThrottledEventSender()` - Throttle events
  - `checkGTMPerformance()` - Performance metrics

#### Phase 5: Observability & Polish
- **Observability Features**
  - `ObservabilityManager` class
  - Real-time metrics tracking
  - Error tracking
  - Performance monitoring
  - Health status checks
  - Automatic reporting
  - `useObservability()` hook

### Changed
- **Package Version**: 1.0.0 → 2.0.0
- **Package Description**: Enhanced with comprehensive feature list
- **Keywords**: Added 7 new keywords for better discoverability
- **README**: Complete rewrite with 600+ lines of documentation

### Backward Compatibility
- ✅ **100% Backward Compatible** - All v1.x code continues to work
- Legacy API (`sendGTMEvent`, `GoogleTagManager`) still supported
- No breaking changes

### Package Stats
- **New Files**: 30+ (hooks, components, middleware, SSR, etc.)
- **Exports**: 60+ (functions, components, types, middleware)
- **Test Coverage**: ~95%
- **Tests**: 32+ passing tests

### Migration
See [MIGRATION.md](MIGRATION.md) for upgrade guide.

---

## [1.0.0] - 2024-01-XX

### Initial Release
- Basic GoogleTagManager component
- sendGTMEvent function
- Basic event tracking utilities
- TypeScript support
- NoScript fallback

