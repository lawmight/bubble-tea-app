import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <section className="space-y-4 rounded-2xl border border-[#e6dac9] bg-white p-6 text-center">
      <h1 className="text-3xl font-semibold text-[#2a2a2a]">404</h1>
      <p className="text-sm text-[#6f5a44]">This page does not exist.</p>
      <Link
        href="/menu"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#245741] px-4 text-sm font-semibold text-white"
      >
        Back to menu
      </Link>
    </section>
  );
}
