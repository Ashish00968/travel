import { useSyncExternalStore, useMemo } from 'react';

export function useMediaQuery(query: string): boolean {
  const mediaQuery = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.matchMedia(query);
  }, [query]);

  const subscribe = useMemo(() => {
    return (callback: () => void) => {
      if (!mediaQuery) return () => {};
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    };
  }, [mediaQuery]);

  const getSnapshot = () => mediaQuery ? mediaQuery.matches : false;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
