// src/hooks/useGTM.ts
import { useGTMContext } from "../context/GTMContext";

/**
 * Hook to access GTM context
 * @returns GTM context value with sendEvent, isReady, config, etc.
 * @throws Error if used outside GTMProvider
 *
 * @example
 * ```tsx
 * const { sendEvent, isReady, updateConsent } = useGTM();
 *
 * if (isReady) {
 *   sendEvent({ event: 'custom_event', data: 'value' });
 * }
 * ```
 */
export const useGTM = () => {
  return useGTMContext();
};
