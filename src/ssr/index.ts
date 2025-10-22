// src/ssr/index.ts
import { GTMEvent } from "../sendGTMEvent";

/**
 * Server-side GTM event collector
 * Collects events on the server and provides scripts for hydration
 */
export class ServerGTM {
  private events: GTMEvent[] = [];
  private gtmId: string;

  constructor(gtmId: string) {
    this.gtmId = gtmId;
  }

  /**
   * Add an event to the server-side collection
   */
  sendEvent(event: GTMEvent): void {
    this.events.push(event);
  }

  /**
   * Get all collected events
   */
  getEvents(): GTMEvent[] {
    return [...this.events];
  }

  /**
   * Clear all collected events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Generate a script tag to inject dataLayer events into HTML
   * Should be placed in <head> before GTM script
   */
  getDataLayerScript(): string {
    if (this.events.length === 0) {
      return '';
    }

    const eventsJson = JSON.stringify(this.events);

    return `<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(...${eventsJson});
</script>`;
  }

  /**
   * Generate GTM script tag with optional nonce
   */
  getGTMScript(options?: {
    nonce?: string;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }): string {
    const {
      nonce,
      dataLayerName = 'dataLayer',
      auth,
      preview,
    } = options || {};

    let src = `https://www.googletagmanager.com/gtm.js?id=${this.gtmId}&l=${dataLayerName}`;

    if (auth && preview) {
      src += `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`;
    }

    const nonceAttr = nonce ? ` nonce="${nonce}"` : '';

    return `<script${nonceAttr} async src="${src}"></script>`;
  }

  /**
   * Generate noscript iframe fallback
   */
  getNoScriptIframe(options?: {
    auth?: string;
    preview?: string;
  }): string {
    const { auth, preview } = options || {};

    let src = `https://www.googletagmanager.com/ns.html?id=${this.gtmId}`;

    if (auth && preview) {
      src += `&gtm_auth=${auth}&gtm_preview=${preview}&gtm_cookies_win=x`;
    }

    return `<noscript>
  <iframe src="${src}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>`;
  }

  /**
   * Get complete HTML snippet (dataLayer + GTM script + noscript)
   */
  getCompleteSnippet(options?: {
    nonce?: string;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }): {
    head: string;
    bodyStart: string;
  } {
    return {
      head: [
        this.getDataLayerScript(),
        this.getGTMScript(options),
      ].filter(Boolean).join('\n'),
      bodyStart: this.getNoScriptIframe(options),
    };
  }

  /**
   * Send events to GTM Measurement Protocol (server-side)
   * Requires GTM Server-side tagging
   */
  async flush(serverUrl: string): Promise<void> {
    if (this.events.length === 0) return;

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: this.events,
          gtm_id: this.gtmId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send events: ${response.statusText}`);
      }

      this.clear();
    } catch (error) {
      console.error('Failed to flush GTM events:', error);
      throw error;
    }
  }
}

/**
 * Create a server-side GTM instance
 */
export function createServerGTM(gtmId: string): ServerGTM {
  return new ServerGTM(gtmId);
}

/**
 * Get GTM scripts for server-side rendering
 * For use in Next.js or other SSR frameworks
 *
 * @example
 * ```tsx
 * const scripts = getGTMScripts('GTM-XXX', [{ event: 'server_render' }]);
 * // In your HTML template:
 * <head dangerouslySetInnerHTML={{ __html: scripts.head }} />
 * <body>
 *   <div dangerouslySetInnerHTML={{ __html: scripts.bodyStart }} />
 * </body>
 * ```
 */
export function getGTMScripts(
  gtmId: string,
  options: {
    events?: GTMEvent[];
    nonce?: string;
    auth?: string;
    preview?: string;
    dataLayerName?: string;
  } = {}
): {
  head: string;
  bodyStart: string;
} {
  const { events = [], nonce, auth, preview, dataLayerName } = options;

  const serverGTM = new ServerGTM(gtmId);
  events.forEach((event) => serverGTM.sendEvent(event));

  return serverGTM.getCompleteSnippet({
    nonce,
    auth,
    preview,
    dataLayerName,
  });
}

export type { GTMEvent } from "../sendGTMEvent";
