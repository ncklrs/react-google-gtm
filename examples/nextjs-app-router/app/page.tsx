// examples/nextjs-app-router/app/page.tsx
'use client';

import { useGTM, useGTMPageView, useGTMClick, GTMDebugger } from 'react-google-gtm';

export default function Home() {
  const { sendEvent, isReady, updateConsent } = useGTM();

  // Track page view automatically
  useGTMPageView('/home', { page_type: 'landing' });

  // Create tracked click handler
  const handleCTAClick = useGTMClick('cta_click', {
    button_name: 'Get Started',
    location: 'hero',
  });

  const handleAcceptCookies = () => {
    updateConsent({
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });

    sendEvent({
      event: 'consent_update',
      consent_type: 'accepted',
    });
  };

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">
        Next.js + GTM Example
      </h1>

      <div className="space-y-4">
        <p>GTM Status: {isReady ? '✅ Ready' : '⏳ Loading...'}</p>

        <button
          onClick={handleCTAClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Get Started
        </button>

        <button
          onClick={handleAcceptCookies}
          className="px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Accept Cookies
        </button>

        <button
          onClick={() => sendEvent({
            event: 'custom_event',
            action: 'test',
            value: 123,
          })}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg"
        >
          Send Custom Event
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <GTMDebugger position="bottom-right" />
      )}
    </main>
  );
}
