import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export async function Header(): Promise<JSX.Element> {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6dac9] bg-[#fcf8f1]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#245741]">
          VETEA
        </Link>
        <nav aria-label="Global" className="flex items-center gap-3 text-sm font-medium">
          <Link href="/menu" className="text-[#5b4632] hover:text-[#245741]">
            Menu
          </Link>
          <Link href="/cart" className="text-[#5b4632] hover:text-[#245741]">
            Cart
          </Link>
          {userId ? (
            <Link href="/profile" className="text-[#5b4632] hover:text-[#245741]">
              Profile
            </Link>
          ) : (
            <Link href="/sign-in" className="text-[#5b4632] hover:text-[#245741]">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
