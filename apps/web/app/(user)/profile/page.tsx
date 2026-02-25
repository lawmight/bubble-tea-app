import type { Metadata } from 'next';
import Link from 'next/link';

import { SignOutButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';

import { FavoritesList } from '@/components/shop/FavoritesList';
import { getUserByClerkId } from '@/lib/queries/users';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your VETEA profile details.',
  robots: {
    index: false,
    follow: false,
  },
};

function ChevronRight() {
  return (
    <svg
      className="shrink-0 text-[#D4C5B2] transition-transform duration-200 group-hover:translate-x-0.5"
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

function formatMemberSince(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function ProfilePage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const user = await getUserByClerkId(userId);
  const clerkUser = await currentUser();

  const email = user?.email ?? clerkUser?.emailAddresses[0]?.emailAddress ?? 'N/A';
  const name = user?.name ?? clerkUser?.fullName ?? 'Customer';
  const initial = name.charAt(0).toUpperCase();
  const memberSince = user?.createdAt ?? (clerkUser?.createdAt ? new Date(clerkUser.createdAt) : null);

  return (
    <section className="space-y-6">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#8B9F82] shadow-sm">
          <span className="font-display text-2xl leading-none text-white">{initial}</span>
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-3xl text-[#6B5344]">{name}</h1>
          <p className="mt-0.5 text-sm text-[#8C7B6B]">{email}</p>
          {memberSince && (
            <p className="mt-1 text-xs text-[#B5A898]">
              Member since {formatMemberSince(memberSince)}
            </p>
          )}
        </div>
      </div>

      {/* Favorites */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B5A898]">
          Your Favorites
        </h2>
        <FavoritesList />
      </div>

      {/* Navigation */}
      <nav className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
        <Link
          href="/orders"
          className="group flex items-center gap-3.5 px-5 py-4 transition-all duration-200 hover:bg-[#F5F0E8]/60 hover:pl-6"
        >
          <svg
            className="shrink-0 text-[#8B9F82]"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
          <span className="flex-1 font-medium text-[#6B5344]">My Orders</span>
          <ChevronRight />
        </Link>

        <div className="mx-5 border-t border-[#E8DDD0]" />

        <Link
          href="/settings"
          className="group flex items-center gap-3.5 px-5 py-4 transition-all duration-200 hover:bg-[#F5F0E8]/60 hover:pl-6"
        >
          <svg
            className="shrink-0 text-[#8B9F82]"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V22a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          </svg>
          <span className="flex-1 font-medium text-[#6B5344]">Account Settings</span>
          <ChevronRight />
        </Link>

        <div className="mx-5 border-t border-[#E8DDD0]" />

        <SignOutButton>
          <button className="group flex w-full items-center gap-3.5 px-5 py-4 transition-all duration-200 hover:bg-[#F5F0E8]/60 hover:pl-6">
            <svg
              className="shrink-0 text-[#A0524F]"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="flex-1 text-left font-medium text-[#6B5344]">Sign Out</span>
            <ChevronRight />
          </button>
        </SignOutButton>
      </nav>
    </section>
  );
}
