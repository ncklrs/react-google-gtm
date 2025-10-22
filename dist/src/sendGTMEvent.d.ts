export interface GTMEvent {
    event: string;
    [key: string]: any;
}
export interface GTMConfig {
    debug?: boolean;
}
/**
 * Configure GTM behavior
 * @param options Configuration options
 */
export declare const configureGTM: (options: GTMConfig) => void;
/**
 * Send an event to Google Tag Manager
 * @param eventData The event data to push to dataLayer
 */
export declare const sendGTMEvent: (eventData: GTMEvent) => void;
//# sourceMappingURL=sendGTMEvent.d.ts.map