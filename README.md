# react-google-gtm

[![CI](https://github.com/yourusername/react-google-gtm/workflows/CI/badge.svg)](https://github.com/yourusername/react-google-gtm/actions)
[![npm version](https://badge.fury.io/js/react-google-gtm.svg)](https://www.npmjs.com/package/react-google-gtm)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, type-safe React package for integrating Google Tag Manager with your application. Built with TypeScript and designed for production use.

## Features

- **TypeScript Support**: Full type definitions included
- **React Hooks**: Built with modern React hooks
- **Debug Mode**: Enable debug logging for development
- **Environment Support**: GTM preview and authentication for testing
- **CSP Compatible**: Support for nonce attributes
- **SSR Ready**: Works with Next.js and other SSR frameworks
- **Tree-shakeable**: ESM and CommonJS builds
- **Fully Tested**: Comprehensive test coverage
- **Type-safe Events**: Export all TypeScript interfaces

## Installation

```bash
npm install react-google-gtm
```

## Quick Start

### Basic Setup

```tsx
import React from 'react';
import { GoogleTagManager } from 'react-google-gtm';

const App: React.FC = () => {
  return (
    <>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      {/* Your app content */}
    </>
  );
};

export default App;
```

### With NoScript Fallback

For users with JavaScript disabled, add the `NoScript` component in your document body:

```tsx
import { GoogleTagManager, NoScript } from 'react-google-gtm';

const App: React.FC = () => {
  return (
    <html>
      <head>
        <GoogleTagManager gtmId="GTM-XXXXXX" />
      </head>
      <body>
        <NoScript gtmId="GTM-XXXXXX" />
        {/* Your app content */}
      </body>
    </html>
  );
};
```

## API Reference

### `GoogleTagManager`

Main component to load the Google Tag Manager script.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gtmId` | `string` | Yes | - | Your Google Tag Manager ID (e.g., "GTM-XXXXXX") |
| `dataLayer` | `Record<string, any>[]` | No | `[]` | Initial dataLayer configuration |
| `additionalScripts` | `string[]` | No | `[]` | Additional script URLs to load |
| `dataLayerName` | `string` | No | `"dataLayer"` | Custom dataLayer variable name |
| `auth` | `string` | No | - | GTM environment auth parameter |
| `preview` | `string` | No | - | GTM environment preview parameter |
| `nonce` | `string` | No | - | Nonce attribute for CSP compatibility |

**Example:**

```tsx
<GoogleTagManager
  gtmId="GTM-XXXXXX"
  dataLayer={[{ userId: '12345', userType: 'premium' }]}
  auth="abc123"
  preview="env-1"
  nonce="random-nonce-value"
/>
```

### `NoScript`

Fallback component for users with JavaScript disabled.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gtmId` | `string` | Yes | - | Your Google Tag Manager ID |
| `auth` | `string` | No | - | GTM environment auth parameter |
| `preview` | `string` | No | - | GTM environment preview parameter |

### `sendGTMEvent`

Send custom events to the dataLayer.

**Parameters:**
- `eventData` (`GTMEvent`): The event data to be pushed to the dataLayer.

**Example:**

```tsx
import { sendGTMEvent } from 'react-google-gtm';

const handlePurchase = () => {
  sendGTMEvent({
    event: 'purchase',
    ecommerce: {
      transaction_id: 'T12345',
      value: 99.99,
      currency: 'USD',
      items: [
        {
          item_id: 'SKU123',
          item_name: 'Product Name',
          price: 99.99,
        }
      ]
    }
  });
};
```

### `configureGTM`

Configure GTM behavior globally.

**Parameters:**
- `options` (`GTMConfig`): Configuration options

**Options:**
- `debug` (`boolean`): Enable debug logging to console

**Example:**

```tsx
import { configureGTM } from 'react-google-gtm';

// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  configureGTM({ debug: true });
}
```

## Tracking Utilities

Convenience functions for common tracking scenarios:

### `trackPageView`

Track page view events.

```tsx
import { trackPageView } from 'react-google-gtm';

trackPageView('home');
```

### `trackButtonClick`

Track button click events.

```tsx
import { trackButtonClick } from 'react-google-gtm';

const Button = () => (
  <button onClick={() => trackButtonClick('Subscribe Now')}>
    Subscribe
  </button>
);
```

### `trackFormSubmission`

Track form submission events.

```tsx
import { trackFormSubmission } from 'react-google-gtm';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  trackFormSubmission('contact-form');
};
```

### `trackCustomEvent`

Track custom events with additional properties.

```tsx
import { trackCustomEvent } from 'react-google-gtm';

trackCustomEvent('video_play', {
  category: 'engagement',
  label: 'product_demo',
  value: 1,
  video_duration: 120
});
```

## Advanced Usage

### TypeScript Integration

All interfaces are exported for type safety:

```tsx
import type { GTMEvent, GoogleTagManagerProps } from 'react-google-gtm';

const customEvent: GTMEvent = {
  event: 'user_action',
  action_type: 'click',
  element_id: 'hero-cta'
};
```

### React Router Integration

Track page views on route changes:

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from 'react-google-gtm';

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
}
```

### Next.js Integration

#### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { GoogleTagManager } from 'react-google-gtm';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="GTM-XXXXXX" />
      </head>
      <body>
        <NoScript gtmId="GTM-XXXXXX" />
        {children}
      </body>
    </html>
  );
}
```

#### Pages Router (Next.js 12 and below)

```tsx
// pages/_app.tsx
import { GoogleTagManager } from 'react-google-gtm';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trackPageView } from 'react-google-gtm';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <GoogleTagManager gtmId="GTM-XXXXXX" />
      <Component {...pageProps} />
    </>
  );
}
```

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';
import { NoScript } from 'react-google-gtm';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <NoScript gtmId="GTM-XXXXXX" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Testing with GTM Environments

Use GTM environments for testing in staging:

```tsx
const gtmAuth = process.env.NEXT_PUBLIC_GTM_AUTH;
const gtmPreview = process.env.NEXT_PUBLIC_GTM_PREVIEW;

<GoogleTagManager
  gtmId="GTM-XXXXXX"
  auth={gtmAuth}
  preview={gtmPreview}
/>
```

### Content Security Policy (CSP)

If you're using CSP, provide a nonce:

```tsx
// Generate nonce server-side
const nonce = generateNonce();

<GoogleTagManager
  gtmId="GTM-XXXXXX"
  nonce={nonce}
/>
```

Your CSP header should include:
```
Content-Security-Policy: script-src 'nonce-{NONCE}' https://www.googletagmanager.com;
```

### E-commerce Tracking

```tsx
import { sendGTMEvent } from 'react-google-gtm';

// Track add to cart
const handleAddToCart = (product) => {
  sendGTMEvent({
    event: 'add_to_cart',
    ecommerce: {
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    }
  });
};

// Track purchase
const handlePurchase = (order) => {
  sendGTMEvent({
    event: 'purchase',
    ecommerce: {
      transaction_id: order.id,
      value: order.total,
      currency: 'USD',
      tax: order.tax,
      shipping: order.shipping,
      items: order.items
    }
  });
};
```

## Best Practices

1. **Place GTM component early**: Add the `GoogleTagManager` component in your root component or layout for earliest initialization.

2. **Use debug mode in development**: Enable debug mode to see events in the console during development.

3. **Type your events**: Use TypeScript to ensure your events have the correct structure.

4. **Test with GTM environments**: Use GTM preview mode and environments for testing before production.

5. **Handle privacy compliance**: Respect user consent preferences before loading GTM.

6. **Avoid redundant tracking**: Use React hooks like `useEffect` to prevent duplicate events.

## Debugging

Enable debug mode to see all events logged to the console:

```tsx
import { configureGTM } from 'react-google-gtm';

if (process.env.NODE_ENV === 'development') {
  configureGTM({ debug: true });
}
```

You can also verify events in:
- Browser DevTools Console
- Google Tag Manager Preview Mode
- Google Analytics Real-Time Reports

## Browser Support

This package supports all modern browsers that support ES5:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/yourusername/react-google-gtm/issues)
- [Documentation](https://github.com/yourusername/react-google-gtm#readme)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.
