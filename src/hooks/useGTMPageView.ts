// src/hooks/useGTMPageView.ts
import { useEffect } from "react";
import { useGTMContext } from "../context/GTMContext";

/**
 * Hook to automatically track page views
 *
 * @param page - Page identifier (optional, defaults to window.location.pathname)
 * @param additionalData - Additional data to include with page view
 *
 * @example
 * ```tsx
 * // Track current page on mount
 * useGTMPageView();
 *
 * // Track specific page
 * useGTMPageView('/checkout');
 *
 * // Track with additional data
 * useGTMPageView('/product', { product_id: '123', category: 'electronics' });
 * ```
 */
export const useGTMPageView = (
  page?: string,
  additionalData?: Record<string, any>
) => {
  const { sendEvent } = useGTMContext();

  useEffect(() => {
    const pagePath = page || (typeof window !== "undefined" ? window.location.pathname : "");

    sendEvent({
      event: "page_view",
      page: pagePath,
      ...additionalData,
    });
  }, [page, sendEvent]);
};
