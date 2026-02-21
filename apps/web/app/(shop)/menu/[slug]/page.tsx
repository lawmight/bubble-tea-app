import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { formatMoney, toMoney } from '@vetea/shared';

import { DrinkCustomizerDynamic } from '@/components/shop/DrinkCustomizerDynamic';
import { ProductCard } from '@/components/shop/ProductCard';
import { getProductBySlug, getProducts } from '@/lib/queries/products';

/** Dynamic so build does not require MongoDB (avoids auth failure on Vercel build). */
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: 'Drink not found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allInCategory = await getProducts(product.category);
  const relatedProducts = allInCategory
    .filter((p) => p.slug !== product.slug)
    .slice(0, 2);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: (product.basePriceInCents / 100).toFixed(2),
      priceCurrency: 'USD',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="-mx-4 -mt-6">
        <div className="relative aspect-square bg-[#f8f4ed]">
          <Image
            src={product.image}
            alt={`${product.name} product photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fetchPriority="high"
          />
          <Link
            href="/menu"
            className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#6B5344] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            aria-label="Back to menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="mt-5 text-center">
        <h1
          className="text-3xl text-[var(--color-accent)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {product.name}
        </h1>
        <p className="mt-1.5 text-lg text-[var(--color-text-secondary)]">
          {formatMoney(toMoney(product.basePriceInCents))}
        </p>
      </div>

      <DrinkCustomizerDynamic product={product} />

      {relatedProducts.length > 0 && (
        <div className="mt-10 border-t border-[#E8DDD0] pt-8 pb-4">
          <h2 className="font-display text-xl italic text-[#6B5344]">
            You might also like
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
