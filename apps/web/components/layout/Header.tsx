import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

export async function Header(): Promise<JSX.Element> {
  await auth();

  return (
    <header className="sticky top-0 z-30 bg-[#F5F0E8]/95 backdrop-blur-md dark:bg-[var(--color-bg)]/95">
      <div className="mx-auto grid w-full max-w-3xl grid-cols-[2.5rem_1fr_auto] items-center px-4 py-3">
        <div aria-hidden="true" />

        <Link
          href="/"
          className="flex items-center justify-center gap-2"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 3C8 3 5.5 6.5 5.5 11c0 4 2.5 7.5 6.5 10 4-2.5 6.5-6 6.5-10 0-4.5-2.5-8-6.5-8z"
              fill="#8B9F82"
            />
            <path
              d="M12 7v10"
              stroke="#F5F0E8"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M9.5 10c1.5 1 3.5 1 5 0"
              stroke="#F5F0E8"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-xl tracking-wide text-[#6B5344] font-display dark:text-[var(--color-text)]">
            VETEA
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1">
          <ThemeToggle size="sm" />
          <Link
            href="/menu"
            aria-label="Search menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B5344] transition-colors hover:bg-[#E8DDD0] dark:text-[var(--color-text)] dark:hover:bg-[var(--color-bg-muted)]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
