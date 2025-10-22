// examples/nextjs-app-router/app/layout.tsx
import { GTMProvider } from 'react-google-gtm';
import './globals.css';

export const metadata = {
  title: 'Next.js + GTM Example',
  description: 'Example of react-google-gtm with Next.js App Router',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GTMProvider
          gtmId={process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXX'}
          config={{ debug: process.env.NODE_ENV === 'development' }}
          consent={{
            ad_storage: 'denied',
            analytics_storage: 'granted',
          }}
        >
          {children}
        </GTMProvider>
      </body>
    </html>
  );
}
