import React from 'react';
import { render, waitFor } from '@testing-library/react';
import GoogleTagManager from '../GoogleTagManager';

describe('GoogleTagManager', () => {
  beforeEach(() => {
    // Clear any existing scripts
    document.head.innerHTML = '';
    // Reset dataLayer
    delete (window as any).dataLayer;
  });

  it('should render without crashing', () => {
    render(<GoogleTagManager gtmId="GTM-TEST123" />);
    expect(document.querySelector('script')).toBeInTheDocument();
  });

  it('should initialize dataLayer', async () => {
    render(<GoogleTagManager gtmId="GTM-TEST123" />);
    await waitFor(() => {
      expect(window.dataLayer).toBeDefined();
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });
  });

  it('should add GTM script with correct src', async () => {
    render(<GoogleTagManager gtmId="GTM-TEST123" />);
    await waitFor(() => {
      const script = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
      expect(script).toBeInTheDocument();
      expect(script?.getAttribute('src')).toContain('GTM-TEST123');
    });
  });

  it('should push custom dataLayer items', async () => {
    const customData = [{ event: 'custom', data: 'test' }];
    render(<GoogleTagManager gtmId="GTM-TEST123" dataLayer={customData} />);

    await waitFor(() => {
      expect(window.dataLayer).toBeDefined();
      expect(window.dataLayer).toContainEqual({ event: 'custom', data: 'test' });
    });
  });

  it('should add environment parameters when auth and preview are provided', async () => {
    render(
      <GoogleTagManager
        gtmId="GTM-TEST123"
        auth="test-auth"
        preview="test-preview"
      />
    );

    await waitFor(() => {
      const script = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
      const src = script?.getAttribute('src');
      expect(src).toContain('gtm_auth=test-auth');
      expect(src).toContain('gtm_preview=test-preview');
      expect(src).toContain('gtm_cookies_win=x');
    });
  });

  it('should add nonce attribute when provided', async () => {
    render(<GoogleTagManager gtmId="GTM-TEST123" nonce="test-nonce-123" />);

    await waitFor(() => {
      const script = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
      expect(script?.getAttribute('nonce')).toBe('test-nonce-123');
    });
  });

  it('should validate and add additional scripts', async () => {
    const additionalScripts = [
      'https://example.com/script1.js',
      'https://example.com/script2.js',
    ];

    render(
      <GoogleTagManager
        gtmId="GTM-TEST123"
        additionalScripts={additionalScripts}
      />
    );

    await waitFor(() => {
      const script1 = document.querySelector('script[src="https://example.com/script1.js"]');
      const script2 = document.querySelector('script[src="https://example.com/script2.js"]');
      expect(script1).toBeInTheDocument();
      expect(script2).toBeInTheDocument();
    });
  });

  it('should warn about invalid URLs in additionalScripts', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const invalidScripts = ['not-a-valid-url'];

    render(
      <GoogleTagManager
        gtmId="GTM-TEST123"
        additionalScripts={invalidScripts}
      />
    );

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid URL provided in additionalScripts')
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('should cleanup scripts on unmount', async () => {
    const { unmount } = render(<GoogleTagManager gtmId="GTM-TEST123" />);

    await waitFor(() => {
      expect(document.querySelector('script[src*="googletagmanager.com/gtm.js"]')).toBeInTheDocument();
    });

    unmount();

    expect(document.querySelector('script[src*="googletagmanager.com/gtm.js"]')).not.toBeInTheDocument();
  });
});
