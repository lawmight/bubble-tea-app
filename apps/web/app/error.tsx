'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm rounded-2xl border border-[#E8DDD0] bg-white p-8">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" stroke="#D4C5B2" strokeWidth="1.5" />
          <path
            d="M12 8v4"
            stroke="#A0524F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="15" r="0.75" fill="#A0524F" />
        </svg>

        <h1 className="font-display text-2xl text-[#6B5344]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[#8C7B6B]">
          We couldn&apos;t load this page. Please try again.
        </p>

        <Button onClick={reset} className="mt-6 w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
