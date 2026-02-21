import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getProducts } from '@/lib/queries/products';

import { ProductCard } from '@/components/shop/ProductCard';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Home',
  description: 'Discover handcrafted bubble tea at VETEA.',
};

export default async function HomePage(): Promise<JSX.Element> {
  const products = await getProducts();
  const featured = products.slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-[#245741] p-6 text-white">
        <div className="max-w-xs space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[#dcecdf]">VETEA</p>
          <h1 className="text-3xl font-semibold leading-tight">
            Fresh bubble tea, brewed for pickup.
          </h1>
          <p className="text-sm text-[#dcecdf]">
            Build your perfect drink in a few taps and skip the queue.
          </p>
          <Link
            href="/menu"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-[#245741]"
          >
            Order now
          </Link>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80"
          alt="Bubble tea hero"
          width={360}
          height={280}
          className="absolute -bottom-6 -right-12 hidden rounded-3xl object-cover md:block"
          priority
          fetchPriority="high"
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2a2a2a]">Featured drinks</h2>
          <Link href="/menu" className="text-sm font-medium text-[#245741]">
            See full menu
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>
      </section>
    </div>
  );
}
