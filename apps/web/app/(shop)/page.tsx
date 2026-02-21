import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ProductCard } from '@/components/shop/ProductCard';
import { getProducts } from '@/lib/queries/products';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover handcrafted bubble tea at VETEA.',
};

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80';

const CATEGORIES = [
  {
    label: 'Milk Tea',
    slug: 'milk-tea',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M12 8h16l-2 24H14L12 8z" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8h20" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill="#8B9F82" />
        <circle cx="17" cy="25" r="1.5" fill="#8B9F82" />
        <circle cx="23" cy="24" r="1.5" fill="#8B9F82" />
      </svg>
    ),
  },
  {
    label: 'Fruit Tea',
    slug: 'fruit-tea',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <circle cx="20" cy="22" r="10" stroke="#6B5344" strokeWidth="2" />
        <path d="M20 12c0-4 3-6 6-5" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 12c-2-3 0-7 3-7" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 20c2-1 5-1 8 0" stroke="#6B5344" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Special',
    slug: 'special',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M20 6l3.09 9.51h10l-8.09 5.88 3.09 9.51L20 25.02l-8.09 5.88 3.09-9.51L6.91 15.5h10L20 6z" stroke="#6B5344" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="20" r="3" fill="#8B9F82" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: 'Classic',
    slug: 'classic',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M14 14c2-6 10-6 12 0" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 14h16c0 8-3 14-8 18-5-4-8-10-8-18z" stroke="#6B5344" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 20c1 2 3 2 4 0" stroke="#8B9F82" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

const STEPS = [
  {
    title: 'Browse',
    description: 'Pick your perfect drink',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6" aria-hidden="true">
        <rect x="8" y="6" width="24" height="28" rx="3" stroke="#6B5344" strokeWidth="2" />
        <path d="M13 14h14M13 20h10M13 26h7" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Customize',
    description: 'Choose size, sugar, ice & toppings',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6" aria-hidden="true">
        <line x1="10" y1="12" x2="30" y2="12" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="20" x2="30" y2="20" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="28" x2="30" y2="28" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="12" r="3" fill="#8B9F82" stroke="white" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="3" fill="#8B9F82" stroke="white" strokeWidth="1.5" />
        <circle cx="18" cy="28" r="3" fill="#8B9F82" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Pickup',
    description: 'Grab your order in minutes',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M10 16h20l-2 16H12L10 16z" stroke="#6B5344" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15 16v-3a5 5 0 0 1 10 0v3" stroke="#6B5344" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="24" r="2" fill="#8B9F82" />
      </svg>
    ),
  },
] as const;

export default async function HomePage(): Promise<JSX.Element> {
  const products = await getProducts();
  const popular = products.slice(0, 4);

  return (
    <div className="space-y-10 pb-12">
      {/* ── 1. Greeting + Hero ── */}
      <section className="motion-safe:animate-fade-in-up">
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl">
          <Image
            src={popular[0]?.image ?? HERO_IMAGE}
            alt="Handcrafted boba tea"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 448px"
            priority
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              VETEA
            </p>
            <h1 className="font-display text-3xl leading-tight text-white">
              Freshly Brewed.<br />
              Naturally Sweet.
            </h1>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/80">
              Handcrafted bubble tea, ready for pickup
            </p>
            <Link
              href="/menu"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-[#8B9F82] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#7A8E72]"
            >
              Order Now
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Category Quick-Links ── */}
      <section className="motion-safe:animate-fade-in-up motion-safe:animate-delay-100">
        <div className="hide-scrollbar flex gap-4 overflow-x-auto px-1 py-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/menu?category=${cat.slug}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4C5B2] bg-[#FAF7F2] transition-colors hover:border-[#8B9F82] hover:bg-[#EFF2EC]">
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-[#6B5344]">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Popular Drinks ── */}
      <section className="motion-safe:animate-fade-in-up motion-safe:animate-delay-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-[#6B5344]">Popular</h2>
          <Link
            href="/menu"
            className="text-sm font-medium text-[#8B9F82] transition-colors hover:text-[#7A8E72]"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popular.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* ── 4. Promotional Banner ── */}
      <section className="motion-safe:animate-fade-in-up motion-safe:animate-delay-300">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#F5F0E8] to-[#E8EDE5] px-6 py-8">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#8B9F82]/10" />
          <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-[#8B9F82]/5" />
          <div className="relative flex flex-col gap-3">
            <span className="text-xs font-semibold tracking-widest text-[#8B9F82] uppercase">
              Welcome offer
            </span>
            <h3 className="font-display text-xl leading-snug text-[#6B5344]">
              First time?<br />Get 10% off your order
            </h3>
            <p className="max-w-[240px] text-sm leading-relaxed text-[#8C7B6B]">
              Explore our handcrafted drinks and find your new favourite.
            </p>
            <Link
              href="/menu"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-[#8B9F82] px-5 py-2 text-sm font-semibold text-[#8B9F82] transition-colors hover:bg-[#8B9F82] hover:text-white"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. How It Works ── */}
      <section className="motion-safe:animate-fade-in-up motion-safe:animate-delay-400 space-y-5">
        <h2 className="font-display text-2xl text-[#6B5344]">How It Works</h2>
        <div className="grid grid-cols-3 gap-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center gap-2.5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF7F2] ring-1 ring-[#D4C5B2]">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6B5344]">
                  <span className="mr-1 text-[#8B9F82]">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-[#8C7B6B]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Brand Story Teaser ── */}
      <section className="motion-safe:animate-fade-in-up motion-safe:animate-delay-500">
        <div className="rounded-2xl border border-[#D4C5B2] bg-white px-6 py-7 text-center">
          <p className="text-xs font-semibold tracking-widest text-[#8B9F82] uppercase">
            Our Story
          </p>
          <h3 className="mt-2 font-display text-xl text-[#6B5344]">The Art of Tea</h3>
          <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-[#8C7B6B]">
            Every cup at VETEA is brewed with single-origin leaves and fresh,
            natural ingredients — no shortcuts, no artificial flavours.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-block text-sm font-semibold text-[#8B9F82] transition-colors hover:text-[#7A8E72]"
          >
            Discover our drinks &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
