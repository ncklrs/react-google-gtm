// examples/react-router/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GTMProvider, useGTMEvent, GTMDebugger } from 'react-google-gtm';

// Track route changes
function RouteTracker() {
  const location = useLocation();

  useGTMEvent(
    {
      event: 'page_view',
      page_path: location.pathname,
      page_title: document.title,
    },
    [location.pathname]
  );

  return null;
}

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h1>About Page</h1>
      <p>Learn more about us</p>
    </div>
  );
}

function App() {
  return (
    <GTMProvider
      gtmId="GTM-XXXXXX"
      config={{ debug: true }}
    >
      <BrowserRouter>
        <RouteTracker />

        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {process.env.NODE_ENV === 'development' && (
          <GTMDebugger position="bottom-right" />
        )}
      </BrowserRouter>
    </GTMProvider>
  );
}

export default App;
