# Migration Guide

## Upgrading from v1.x to v2.0

v2.0 is **fully backward compatible** with v1.x. You can upgrade without any breaking changes and adopt new features incrementally.

## Quick Start

1. **Install/Update**
```bash
npm install react-google-gtm@2.0.0
```

2. **Your existing code works as-is**
```tsx
// ✅ This still works exactly the same
import { GoogleTagManager, sendGTMEvent } from 'react-google-gtm';

<GoogleTagManager gtmId="GTM-XXX" />
sendGTMEvent({ event: 'button_click' });
```

3. **Gradually adopt new features** (optional but recommended)

---

## Migration Strategies

### Strategy 1: Keep Using v1 API (No Changes Required)

If you're happy with your current implementation, you don't need to change anything. The v1 API is fully supported.

```tsx
// ✅ All v1.x code works in v2.0
import { GoogleTagManager, sendGTMEvent } from 'react-google-gtm';

function App() {
  return (
    <>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      <button onClick={() => sendGTMEvent({ event: 'click' })}>
        Click Me
      </button>
    </>
  );
}
```

### Strategy 2: Incremental Migration (Recommended)

Adopt new features gradually without breaking existing code.

#### Step 1: Add GTMProvider (Optional but recommended)

```tsx
// Before
import { GoogleTagManager } from 'react-google-gtm';

function App() {
  return (
    <>
      <GoogleTagManager gtmId="GTM-XXX" />
      <YourApp />
    </>
  );
}

// After
import { GTMProvider } from 'react-google-gtm';

function App() {
  return (
    <GTMProvider gtmId="GTM-XXX" config={{ debug: true }}>
      <YourApp />
    </GTMProvider>
  );
}
```

**Benefits:**
- Access GTM anywhere with `useGTM()` hook
- Global configuration
- Middleware support
- Better performance

#### Step 2: Replace `sendGTMEvent` with `useGTM` (Where beneficial)

```tsx
// Before
import { sendGTMEvent } from 'react-google-gtm';

function MyButton() {
  const handleClick = () => {
    sendGTMEvent({ event: 'button_click', button: 'subscribe' });
  };

  return <button onClick={handleClick}>Subscribe</button>;
}

// After (more React-like)
import { useGTM } from 'react-google-gtm';

function MyButton() {
  const { sendEvent } = useGTM();

  const handleClick = () => {
    sendEvent({ event: 'button_click', button: 'subscribe' });
  };

  return <button onClick={handleClick}>Subscribe</button>;
}

// Or even better with useGTMClick
import { useGTMClick } from 'react-google-gtm';

function MyButton() {
  const handleClick = useGTMClick('button_click', { button: 'subscribe' });
  return <button onClick={handleClick}>Subscribe</button>;
}
```

#### Step 3: Add Debug Mode (Development only)

```tsx
import { GTMProvider, GTMDebugger } from 'react-google-gtm';

function App() {
  return (
    <GTMProvider gtmId="GTM-XXX">
      {process.env.NODE_ENV === 'development' && (
        <GTMDebugger position="bottom-right" />
      )}
      <YourApp />
    </GTMProvider>
  );
}
```

#### Step 4: Add Consent Management (If needed)

```tsx
<GTMProvider
  gtmId="GTM-XXX"
  consent={{
    ad_storage: 'denied',
    analytics_storage: 'granted'
  }}
>
  <App />
</GTMProvider>

// Update consent later
const { updateConsent } = useGTM();
updateConsent({ ad_storage: 'granted' });
```

---

## Feature Migration Paths

### Page View Tracking

```tsx
// Before
import { sendGTMEvent } from 'react-google-gtm';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    sendGTMEvent({
      event: 'page_view',
      page: location.pathname
    });
  }, [location]);

  return <Routes />;
}

// After
import { useGTMEvent } from 'react-google-gtm';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useGTMEvent(
    { event: 'page_view', page: location.pathname },
    [location]
  );

  return <Routes />;
}

// Or even simpler
import { useGTMPageView } from 'react-google-gtm';

function HomePage() {
  useGTMPageView('/home', { page_type: 'landing' });
  return <div>Home</div>;
}
```

### Form Tracking

```tsx
// Before
import { sendGTMEvent } from 'react-google-gtm';

function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    sendGTMEvent({ event: 'form_submission', form_id: 'contact' });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// After
import { useGTMForm } from 'react-google-gtm';

function ContactForm() {
  const { onSubmit } = useGTMForm({ formId: 'contact' });
  return <form onSubmit={onSubmit}>...</form>;
}
```

### Testing

```tsx
// Before
// Had to manually mock window.dataLayer

describe('MyComponent', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('tracks events', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(window.dataLayer).toContainEqual({ event: 'click' });
  });
});

// After
import { mockGTM, getLastEvent } from 'react-google-gtm/testing';

describe('MyComponent', () => {
  beforeEach(() => {
    mockGTM();
  });

  it('tracks events', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button'));
    expect(getLastEvent()).toEqual({ event: 'click' });
  });
});
```

---

## New Features You Should Adopt

### 1. Type-Safe Events (Highly Recommended)

```tsx
import { createGTMClient, useGTM } from 'react-google-gtm';

// Define your event schema
interface AppEvents {
  purchase: {
    transaction_id: string;
    value: number;
    currency: string;
  };
  button_click: {
    button_name: string;
  };
}

function MyComponent() {
  const gtm = createGTMClient<AppEvents>(useGTM());

  // Fully type-checked with autocomplete!
  gtm.sendEvent('purchase', {
    transaction_id: 'T123',
    value: 99.99,
    currency: 'USD'
  });
}
```

### 2. Middleware for Common Patterns

```tsx
import {
  GTMProvider,
  timestampMiddleware,
  createUserEnrichmentMiddleware,
  createValidationMiddleware
} from 'react-google-gtm';

const userMiddleware = createUserEnrichmentMiddleware(() => ({
  user_id: getCurrentUser()?.id,
  user_type: getCurrentUser()?.type
}));

const validationMiddleware = createValidationMiddleware((event) => {
  if (!event.event) return 'Event name is required';
  return true;
});

// Note: Middleware requires custom context implementation
// See advanced docs for details
```

### 3. Performance Monitoring

```tsx
import { createObservabilityManager } from 'react-google-gtm';

const observer = createObservabilityManager({
  enableMetrics: true,
  reportingInterval: 60000,
  onReport: (metrics) => {
    console.log('GTM Health:', metrics);
  }
});

const health = observer.getHealthStatus();
// { status: 'healthy', issues: [] }
```

### 4. Server-Side Rendering

```tsx
// Next.js App Router
import { createServerGTM } from 'react-google-gtm/ssr';

export default function RootLayout({ children }) {
  const serverGTM = createServerGTM('GTM-XXX');

  serverGTM.sendEvent({ event: 'server_render', page: '/home' });

  const { head, bodyStart } = serverGTM.getCompleteSnippet();

  return (
    <html>
      <head dangerouslySetInnerHTML={{ __html: head }} />
      <body>
        <div dangerouslySetInnerHTML={{ __html: bodyStart }} />
        {children}
      </body>
    </html>
  );
}
```

---

## What's Different?

### Improved

| Feature | v1.x | v2.0 |
|---------|------|------|
| Event Sending | `sendGTMEvent()` | `useGTM().sendEvent()` + helpers |
| Page Tracking | Manual useEffect | `useGTMPageView()` |
| Click Tracking | Manual handlers | `useGTMClick()` |
| Form Tracking | Manual handlers | `useGTMForm()` |
| Testing | Manual mocking | `mockGTM()` + utilities |
| Type Safety | Basic | Full generic support |
| Consent | Manual | Built-in |
| Debugging | Console only | Visual debugger |
| SSR | Manual | Built-in utilities |

### Added

- Context Provider for global access
- 7 custom hooks
- 8 testing utilities
- Middleware system
- Type-safe event builder
- Performance monitoring
- Observability features
- SSR utilities
- Example applications

---

## Common Questions

### Q: Do I have to migrate?

**A:** No. v2.0 is fully backward compatible. You can stay on the v1 API indefinitely.

### Q: Can I mix v1 and v2 APIs?

**A:** Yes! You can use `sendGTMEvent()` and `useGTM()` in the same codebase.

### Q: What are the benefits of migrating?

**A:**
- Better DX with hooks
- Type safety
- Easier testing
- Visual debugger
- Consent management
- Performance monitoring

### Q: Is there a performance difference?

**A:** v2.0 is actually more performant with:
- Event queue (no lost events)
- Optional lazy loading
- Middleware for optimization
- Performance monitoring tools

### Q: How long will v1 API be supported?

**A:** The v1 API will be supported indefinitely. No plans to deprecate.

---

## Need Help?

- [Full Documentation](./README.md)
- [Examples](./examples/)
- [GitHub Issues](https://github.com/yourusername/react-google-gtm/issues)

---

## TL;DR

1. **Nothing breaks** - v2.0 is fully backward compatible
2. **Adopt gradually** - Use new features when beneficial
3. **Start with GTMProvider** - Wrap your app for hooks
4. **Add GTMDebugger** - Visual debugging in development
5. **Use testing utilities** - Easier GTM testing
6. **Type-safe events** - Define schemas for type checking

Happy tracking! 🎉
