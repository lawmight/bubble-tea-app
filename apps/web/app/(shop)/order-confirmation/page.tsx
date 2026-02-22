import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your VETEA order has been placed successfully.',
  robots: {
    index: false,
    follow: false,
  },
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{ orderNumber?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps): Promise<JSX.Element> {
  const { orderNumber } = await searchParams;

  return (
    <section className="relative flex flex-col items-center px-4 py-10 text-center">
      {/* CSS confetti celebration */}
      <div className="confetti-container" aria-hidden="true">
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
        <div className="confetti-dot" />
      </div>

      {/* Success checkmark with scale-in animation */}
      <div className="animate-scale-in mb-6">
        <svg
          width="88"
          height="88"
          viewBox="0 0 88 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="44" cy="44" r="44" fill="#8B9F82" />
          <circle cx="44" cy="44" r="38" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
          <path
            d="M26 45L37 56L62 31"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="animate-fade-in-up font-display text-2xl text-[#6B5344]">
        Thank you for your order!
      </h1>

      <p className="animate-fade-in-up animate-delay-100 mt-1.5 text-sm text-[#8C7B6B]">
        Your bubble tea is being prepared with care.
      </p>

      {orderNumber && (
        <div className="animate-fade-in-up animate-delay-200 mt-4 rounded-xl border border-[#E8DDD0] bg-white px-6 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[#8C7B6B]">Order Number</p>
          <p className="mt-0.5 text-2xl font-bold text-[#6B5344]">#{orderNumber}</p>
        </div>
      )}

      {/* Pickup time card */}
      <div className="animate-fade-in-up animate-delay-300 mt-4 flex items-center gap-2 rounded-xl bg-[#8B9F82]/10 px-5 py-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
          <circle cx="12" cy="12" r="10" stroke="#8B9F82" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold text-[#8B9F82]">Estimated Ready Time: 10-15 mins</span>
      </div>

      {/* Action buttons */}
      <div className="animate-fade-in-up animate-delay-400 mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/orders"
          className="flex h-12 w-full items-center justify-center rounded-full border-2 border-[#8B9F82] bg-[#8B9F82]/10 text-sm font-bold text-[#8B9F82] transition-colors hover:bg-[#8B9F82]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
        >
          View Order
        </Link>
        <Link
          href="/menu"
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#6B5344] text-sm font-bold transition-colors hover:bg-[#5A4538] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B5344]"
          style={{ color: '#FFFFFF' }}
        >
          Back to Menu
        </Link>
      </div>

      {/* Help text */}
      <p className="animate-fade-in-up animate-delay-500 mt-8 text-xs text-[#8C7B6B]">
        Need help?{' '}
        <a href="mailto:hello@vetea.com" className="font-medium text-[#8B9F82] underline underline-offset-2 hover:text-[#7A8E72]">
          Contact us
        </a>
      </p>
    </section>
  );
}
