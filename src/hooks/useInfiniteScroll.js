import { useEffect, useRef, useCallback } from 'react';

/**
 * Trigger a callback when the user scrolls near the bottom.
 * @param {Function} callback - Function to call when near bottom
 * @param {boolean} hasMore - Whether more items are available
 * @param {boolean} loading - Whether a fetch is in progress
 */
export const useInfiniteScroll = (callback, hasMore, loading) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const setSentinel = useCallback((node) => {
    sentinelRef.current = node;
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          callback();
        }
      },
      { rootMargin: '200px' }
    );

    observerRef.current = observer;

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [callback, hasMore, loading]);

  return setSentinel;
};
