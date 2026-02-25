'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function ServiceWorkerRegistration(): null {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      (process.env.NODE_ENV !== 'production' &&
        process.env.NEXT_PUBLIC_ENABLE_SW !== '1')
    ) {
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'activated' &&
              navigator.serviceWorker.controller
            ) {
              toast('New version available', {
                action: {
                  label: 'Refresh',
                  onClick: () => window.location.reload(),
                },
                duration: Infinity,
              });
            }
          });
        });
      })
      .catch((err) => {
        console.warn('SW registration failed:', err);
      });
  }, []);

  return null;
}
