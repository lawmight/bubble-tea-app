import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

export async function Header(): Promise<JSX.Element> {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6dac9] bg-[#fcf8f1]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#245741]">
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
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
