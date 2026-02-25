import type { Metadata } from 'next';
import Link from 'next/link';

import { auth, currentUser } from '@clerk/nextjs/server';

import { getUserByClerkId } from '@/lib/queries/users';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your VETEA account and preferences.',
  robots: {
    index: false,
    follow: false,
  },
};

function ChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 text-[#D4C5B2] ${className}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B5A898]">
      {children}
    </h2>
  );
}

import { PreferencesSegment } from './PreferencesSegment';
import { AppearanceSegment } from './AppearanceSegment';

export default async function SettingsPage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const user = await getUserByClerkId(userId);
  const clerkUser = await currentUser();

  const email = user?.email ?? clerkUser?.emailAddresses[0]?.emailAddress ?? 'N/A';
  const name = user?.name ?? clerkUser?.fullName ?? 'Customer';

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#E8DDD0]"
          aria-label="Back to profile"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6B5344]"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-display text-3xl text-[#6B5344]">Settings</h1>
      </div>

      {/* Account Section */}
      <div className="space-y-3">
        <SectionHeading>Account</SectionHeading>
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
          <div className="px-5 py-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#B5A898]">Name</p>
                <p className="text-sm font-medium text-[#6B5344]">{name}</p>
              </div>
              <div>
                <p className="text-xs text-[#B5A898]">Email</p>
                <p className="text-sm font-medium text-[#6B5344]">{email}</p>
              </div>
            </div>
          </div>

          <div className="mx-5 border-t border-[#E8DDD0]" />

          <a
            href="https://accounts.clerk.dev/user"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-5 py-3.5 transition-all duration-200 hover:bg-[#F5F0E8]/60"
          >
            <svg
              className="shrink-0 text-[#8B9F82]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span className="flex-1 text-sm font-medium text-[#6B5344]">
              Manage account
            </span>
            <ChevronRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Preferences Section */}
      <PreferencesSegment
        initialSugarLevel={user?.defaultSugarLevel ?? '50%'}
        initialIceLevel={user?.defaultIceLevel ?? 'Normal Ice'}
      />

      {/* Appearance Section */}
      <AppearanceSegment />

      {/* About Section */}
      <div className="space-y-3">
        <SectionHeading>About</SectionHeading>
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm font-medium text-[#6B5344]">App version</span>
            <span className="text-sm text-[#B5A898]">VETEA v1.0</span>
          </div>

          <div className="mx-5 border-t border-[#E8DDD0]" />

          <a
            href="#"
            className="group flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-[#F5F0E8]/60"
          >
            <span className="text-sm font-medium text-[#6B5344]">Terms of Service</span>
            <ChevronRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          <div className="mx-5 border-t border-[#E8DDD0]" />

          <a
            href="#"
            className="group flex items-center justify-between px-5 py-3.5 transition-all duration-200 hover:bg-[#F5F0E8]/60"
          >
            <span className="text-sm font-medium text-[#6B5344]">Privacy Policy</span>
            <ChevronRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Footer branding */}
      <div className="pb-4 pt-2 text-center">
        <p className="font-display text-sm text-[#D4C5B2]">VETEA</p>
        <p className="mt-0.5 text-[10px] text-[#D4C5B2]">Crafted with care</p>
      </div>
    </section>
  );
}
