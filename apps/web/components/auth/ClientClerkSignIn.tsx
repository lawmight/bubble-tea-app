'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';

type SignInAppearance = ComponentProps<typeof SignIn>['appearance'];

const placeholderClasses =
  'w-full max-w-sm bg-white shadow-none border border-[#E8DDD0] rounded-2xl min-h-[280px] flex items-center justify-center';

export function ClientClerkSignIn({
  appearance,
}: {
  appearance?: SignInAppearance;
}): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={placeholderClasses} aria-hidden="true">
        <span className="text-sm text-[#8C7B6B]">Loading…</span>
      </div>
    );
  }

  return <SignIn appearance={appearance} />;
}
