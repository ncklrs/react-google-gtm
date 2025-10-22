# react-google-gtm

[![CI](https://github.com/yourusername/react-google-gtm/workflows/CI/badge.svg)](https://github.com/yourusername/react-google-gtm/actions)
[![npm version](https://badge.fury.io/js/react-google-gtm.svg)](https://www.npmjs.com/package/react-google-gtm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe React package for integrating Google Tag Manager with your application. Built with TypeScript and designed for production use.

## ✨ What's New in v2.0

Version 2.0 brings a completely revamped developer experience with React Context, custom hooks, and powerful analytics patterns:

- 🎣 **React Hooks API** - `useGTM`, `useGTMEvent`, `useGTMPageView`, `useGTMClick`, `useGTMForm`
- 🏗️ **Context Provider** - Access GTM anywhere in your app with `GTMProvider`
- ⚡ **Event Queue** - Events sent before GTM loads are automatically queued and flushed
- 🍪 **Consent Management** - Built-in GDPR/CCPA consent mode support
- 🐛 **Visual Debugger** - Beautiful debug UI component for development
- 📊 **Analytics Patterns** - Scroll tracking, time on page, visibility tracking, error boundary
- 🧪 **Testing Utilities** - Comprehensive testing helpers for GTM events
- 📘 **TypeScript First** - Enhanced type safety with generic event types

## Features

- **TypeScript Support**: Full type definitions included
- **React Hooks**: Built with modern React hooks
- **Context API**: Access GTM anywhere in your component tree
- **Event Queue**: Never lose events during GTM initialization
- **Consent Management**: GDPR/CCPA compliant consent mode
- **Debug Mode**: Visual debugger component + console logging
- **Environment Support**: GTM preview and authentication for testing
- **CSP Compatible**: Support for nonce attributes
- **SSR Ready**: Works with Next.js and other SSR frameworks
- **Tree-shakeable**: ESM and CommonJS builds
- **Fully Tested**: Comprehensive test coverage with testing utilities
- **Type-safe Events**: Export all TypeScript interfaces
- **Analytics Patterns**: Common tracking patterns built-in

## Installation

```bash
npm install react-google-gtm
```

## Quick Start

### Modern API (v2.0 - Recommended)

Use the new Context Provider and hooks for the best developer experience:

```tsx
import React from 'react';
import { GTMProvider, useGTM, useGTMPageView } from 'react-google-gtm';

function App() {
  return (
    <GTMProvider
      gtmId="GTM-XXXXXX"
      config={{ debug: true }}
    >
      <YourApp />
    </GTMProvider>
  );
}

function YourComponent() {
  const { sendEvent, isReady } = useGTM();

  // Automatically track page views
  useGTMPageView();

  const handleClick = () => {
    sendEvent({
      event: 'button_click',
      button_name: 'Get Started'
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Get Started</button>
      {isReady && <p>GTM is ready!</p>}
    </div>
  );
}
```

### Legacy API (Still Supported)

The original API continues to work for backwards compatibility:

```tsx
import React from 'react';
import { GoogleTagManager, sendGTMEvent } from 'react-google-gtm';

const App: React.FC = () => {
  return (
    <>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      <button onClick={() => sendGTMEvent({ event: 'button_click' })}>
        Click Me
      </button>
    </>
  );
};
```

## Core API

### GTMProvider

Wrap your app with the GTM Provider to enable hooks and context:

```tsx
import { GTMProvider } from 'react-google-gtm';

<GTMProvider
  gtmId="GTM-XXXXXX"
  config={{ debug: true }}
  consent={{
    ad_storage: 'denied',
    analytics_storage: 'granted'
  }}
  onLoad={(loadTime) => console.log('GTM loaded in', loadTime, 'ms')}
  onError={(error) => console.error('GTM error:', error)}
  onEvent={(event) => console.log('Event sent:', event)}
>
  <App />
</GTMProvider>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `gtmId` | `string` | Your GTM container ID |
| `config` | `GTMConfig` | Debug mode and other config |
| `consent` | `ConsentSettings` | GDPR consent settings |
| `dataLayer` | `Record<string, any>[]` | Initial dataLayer |
| `auth` | `string` | GTM environment auth |
| `preview` | `string` | GTM environment preview |
| `nonce` | `string` | CSP nonce |
| `onLoad` | `(loadTime: number) => void` | Called when GTM loads |
| `onError` | `(error: Error) => void` | Error callback |
| `onEvent` | `(event: GTMEvent) => void` | Called for each event |

## React Hooks

### useGTM()

Access GTM context from any component:

```tsx
import { useGTM } from 'react-google-gtm';

function MyComponent() {
  const { sendEvent, isReady, updateConsent, getDataLayer } = useGTM();

  return (
    <button onClick={() => sendEvent({ event: 'click', button: 'subscribe' })}>
      Subscribe
    </button>
  );
}
```

### useGTMEvent()

Declarative event tracking based on dependencies:

```tsx
import { useGTMEvent } from 'react-google-gtm';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  // Send event when location changes
  useGTMEvent(
    { event: 'page_view', page: location.pathname },
    [location]
  );

  return <Routes />;
}
```

### useGTMPageView()

Automatic page view tracking:

```tsx
import { useGTMPageView } from 'react-google-gtm';

function ProductPage({ productId }: { productId: string }) {
  useGTMPageView('/product', {
    product_id: productId,
    category: 'electronics'
  });

  return <ProductDetails />;
}
```

### useGTMClick()

Create click handlers with automatic tracking:

```tsx
import { useGTMClick } from 'react-google-gtm';

function CTAButton() {
  const handleClick = useGTMClick('cta_click', {
    button_name: 'Sign Up',
    location: 'hero'
  });

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### useGTMForm()

Track form interactions:

```tsx
import { useGTMForm } from 'react-google-gtm';

function ContactForm() {
  const { onSubmit, onChange } = useGTMForm({
    formId: 'contact_form',
    trackChange: true
  });

  return (
    <form onSubmit={onSubmit}>
      <input name="email" onChange={onChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### useTimeOnPage()

Track time spent on page:

```tsx
import { useTimeOnPage } from 'react-google-gtm';

function Article() {
  useTimeOnPage({
    pageName: 'blog_article',
    intervals: [10000, 30000, 60000], // 10s, 30s, 1min
    sendOnUnmount: true
  });

  return <article>...</article>;
}
```

### useVisibilityTracking()

Track element visibility:

```tsx
import { useVisibilityTracking } from 'react-google-gtm';
import { useRef } from 'react';

function Hero() {
  const heroRef = useRef(null);

  useVisibilityTracking(heroRef, {
    threshold: 0.5,
    trackOnce: true,
    onVisible: () => console.log('Hero is visible!')
  });

  return <div ref={heroRef}>Hero Content</div>;
}
```

## Components

### GTMDebugger

Visual debugger for development:

```tsx
import { GTMDebugger } from 'react-google-gtm';

function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <GTMDebugger
          position="bottom-right"
          maxEvents={20}
          showTimestamp={true}
        />
      )}
      <YourApp />
    </>
  );
}
```

### ScrollTracker

Track scroll depth:

```tsx
import { ScrollTracker } from 'react-google-gtm';

function App() {
  return (
    <>
      <ScrollTracker
        thresholds={[25, 50, 75, 100]}
        eventName="scroll_depth"
        onThreshold={(percent) => console.log('Scrolled', percent, '%')}
      />
      <YourApp />
    </>
  );
}
```

### GTMErrorBoundary

Track React errors:

```tsx
import { GTMErrorBoundary } from 'react-google-gtm';

function App() {
  return (
    <GTMErrorBoundary
      eventName="react_error"
      fallback={<ErrorPage />}
      sendErrorDetails={true}
    >
      <YourApp />
    </GTMErrorBoundary>
  );
}
```

## Consent Management

### Setting Initial Consent

```tsx
<GTMProvider
  gtmId="GTM-XXXXXX"
  consent={{
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  }}
>
  <App />
</GTMProvider>
```

### Updating Consent

```tsx
import { useGTM } from 'react-google-gtm';

function CookieConsent() {
  const { updateConsent } = useGTM();

  const handleAccept = () => {
    updateConsent({
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
  };

  return <button onClick={handleAccept}>Accept Cookies</button>;
}
```

## Testing

### Testing Utilities

```tsx
import {
  mockGTM,
  getLastEvent,
  getAllEvents,
  clearEvents,
  wasEventSent
} from 'react-google-gtm/testing';

describe('MyComponent', () => {
  beforeEach(() => {
    mockGTM();
  });

  afterEach(() => {
    clearEvents();
  });

  it('should track button click', () => {
    render(<MyButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(getLastEvent()).toEqual({
      event: 'button_click',
      button_name: 'Submit'
    });
  });

  it('should track multiple events', () => {
    render(<MyComponent />);

    expect(wasEventSent('page_view')).toBe(true);
    expect(getAllEvents()).toHaveLength(3);
  });
});
```

## TypeScript

### Type-Safe Events

Define your event schema for full type safety:

```tsx
import { GTMProvider, useGTM } from 'react-google-gtm';

interface MyEvents {
  purchase: {
    transaction_id: string;
    value: number;
    currency: string;
  };
  button_click: {
    button_name: string;
    location?: string;
  };
}

// Your IDE will autocomplete and type-check these!
function MyComponent() {
  const { sendEvent } = useGTM();

  sendEvent({
    event: 'purchase',
    transaction_id: 'T123',
    value: 99.99,
    currency: 'USD'
  });
}
```

### Built-in E-commerce Types

```tsx
import type { EcommerceEvents } from 'react-google-gtm';

// Use pre-defined GA4 e-commerce event types
const purchaseEvent: EcommerceEvents['purchase'] = {
  transaction_id: 'T123',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      item_id: 'SKU123',
      item_name: 'Product',
      price: 99.99,
      quantity: 1
    }
  ]
};
```

## Next.js Integration

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { GTMProvider } from 'react-google-gtm';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GTMProvider gtmId="GTM-XXXXXX">
          {children}
        </GTMProvider>
      </body>
    </html>
  );
}

// app/page.tsx
'use client';

import { useGTMPageView } from 'react-google-gtm';

export default function Home() {
  useGTMPageView();
  return <div>Home</div>;
}
```

### Pages Router

```tsx
// pages/_app.tsx
import { GTMProvider } from 'react-google-gtm';

function MyApp({ Component, pageProps }) {
  return (
    <GTMProvider gtmId="GTM-XXXXXX">
      <Component {...pageProps} />
    </GTMProvider>
  );
}
```

## React Router Integration

```tsx
import { useLocation } from 'react-router-dom';
import { useGTMEvent } from 'react-google-gtm';

function App() {
  const location = useLocation();

  useGTMEvent(
    { event: 'page_view', page: location.pathname },
    [location.pathname]
  );

  return <Routes />;
}
```

## Migration Guide

### From v1.x to v2.0

v2.0 is fully backwards compatible. You can migrate incrementally:

**Step 1: Wrap with Provider (optional but recommended)**

```tsx
// Before
<GoogleTagManager gtmId="GTM-XXX" />

// After
<GTMProvider gtmId="GTM-XXX">
  <App />
</GTMProvider>
```

**Step 2: Use hooks where beneficial**

```tsx
// Before
import { sendGTMEvent } from 'react-google-gtm';
sendGTMEvent({ event: 'click' });

// After
import { useGTM } from 'react-google-gtm';
const { sendEvent } = useGTM();
sendEvent({ event: 'click' });
```

**Step 3: Leverage new features**

- Add `<GTMDebugger />` for development
- Use `<ScrollTracker />` for scroll depth
- Add consent management
- Write tests with testing utilities

## Best Practices

1. **Use GTMProvider** - Wrap your app for best DX
2. **Enable debug mode** - Use `<GTMDebugger />` in development
3. **Type your events** - Define event schemas for type safety
4. **Test your tracking** - Use testing utilities
5. **Handle consent** - Implement GDPR-compliant consent
6. **Use hooks** - Leverage React patterns over imperative API
7. **Monitor errors** - Use `<GTMErrorBoundary />`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT © [Your Name]

## Support

- [GitHub Issues](https://github.com/yourusername/react-google-gtm/issues)
- [Documentation](https://github.com/yourusername/react-google-gtm#readme)
