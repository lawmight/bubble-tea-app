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
    <section className="space-y-4 rounded-2xl border border-[#e6dac9] bg-white p-6">
      <h1 className="text-2xl font-semibold text-[#2a2a2a]">Something went wrong</h1>
      <p className="text-sm text-[#6f5a44]">
        We could not load this page. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
