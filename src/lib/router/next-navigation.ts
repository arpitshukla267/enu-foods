import { useState, useEffect } from 'react';

// Event dispatcher for custom client-side route changes
export const ROUTE_CHANGE_EVENT = 'enu_route_change';

export function navigate(url: string, replace = false) {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
    window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT));
  }
}

export function useRouter() {
  return {
    push: (url: string, options?: { scroll?: boolean }) => navigate(url, false),
    replace: (url: string, options?: { scroll?: boolean }) => navigate(url, true),
    back: () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    },
    forward: () => {
      if (typeof window !== 'undefined') {
        window.history.forward();
      }
    },
    prefetch: () => {},
  };
}

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener(ROUTE_CHANGE_EVENT, handleLocationChange);
    };
  }, []);

  return pathname;
}

export function useParams<T extends Record<string, string | string[]>>(): T {
  const pathname = usePathname();
  
  // Extract params for /products/[productId]
  const productMatch = pathname.match(/^\/products\/([^/]+)/);
  if (productMatch) {
    return { productId: productMatch[1] } as unknown as T;
  }

  return {} as T;
}
