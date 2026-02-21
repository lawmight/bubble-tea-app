import type { Metadata } from 'next';

import { auth, currentUser } from '@clerk/nextjs/server';

import { getUserByClerkId } from '@/lib/queries/users';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your VETEA profile details.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const user = await getUserByClerkId(userId);
  const clerkUser = await currentUser();

  const email = user?.email ?? clerkUser?.emailAddresses[0]?.emailAddress ?? 'N/A';
  const name = user?.name ?? clerkUser?.fullName ?? 'Customer';

  return (
    <section className="space-y-4 rounded-2xl border border-[#e6dac9] bg-white p-6">
      <h1 className="text-2xl font-semibold text-[#2a2a2a]">Profile</h1>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-[#5b4632]">Name</dt>
          <dd>{name}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#5b4632]">Email</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt className="font-medium text-[#5b4632]">Phone</dt>
          <dd>{user?.phone ?? 'Not provided'}</dd>
        </div>
      </dl>
    </section>
  );
}
