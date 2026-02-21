import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm rounded-2xl border border-[#E8DDD0] bg-white p-8">
        {/* Tea cup icon */}
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="mx-auto mb-4"
        >
          <path
            d="M5 12h12a3 3 0 0 1 0 6H5V12z"
            stroke="#D4C5B2"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M5 12V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3"
            stroke="#8B9F82"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 18h14"
            stroke="#D4C5B2"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M9 5.5c0-1 .5-1.5 1-1.5s1 .5 1 1.5"
            stroke="#8B9F82"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M12 5c0-1.2.5-2 1-2s1 .8 1 2"
            stroke="#8B9F82"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>

        <h1 className="font-display text-5xl text-[#D4C5B2]">404</h1>
        <p className="mt-3 font-display text-lg text-[#6B5344]">
          Page not found
        </p>
        <p className="mt-1 text-sm text-[#8C7B6B]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#8B9F82] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#7A8E72]"
        >
          Back to menu
        </Link>
      </div>
    </div>
  );
}
