# Next.js App Router Example

This example demonstrates how to use `react-google-gtm` with Next.js 13+ App Router.

## Features Demonstrated

- ✅ GTMProvider in root layout
- ✅ useGTM hook for event sending
- ✅ useGTMPageView for automatic page tracking
- ✅ useGTMClick for button tracking
- ✅ Consent management
- ✅ GTMDebugger component (dev only)
- ✅ Environment-based configuration

## Setup

1. Install dependencies:
```bash
npm install react-google-gtm
```

2. Create `.env.local`:
```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

3. Run the development server:
```bash
npm run dev
```

## Key Files

- `app/layout.tsx` - GTMProvider setup
- `app/page.tsx` - Hook usage examples
- `.env.local` - Environment configuration

## Best Practices

1. **Provider in Layout**: Place GTMProvider in root layout for app-wide access
2. **Client Components**: Use 'use client' for components that use hooks
3. **Environment Variables**: Store GTM ID in environment variables
4. **Debug Mode**: Enable debugger component in development only
5. **Consent Management**: Handle GDPR/CCPA consent before loading
