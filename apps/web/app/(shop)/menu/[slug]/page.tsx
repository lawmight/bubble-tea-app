import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { formatMoney, toMoney } from '@vetea/shared';

import { getProductBySlug, getProducts } from '@/lib/queries/products';

const DrinkCustomizer = dynamic(
  () => import('@/components/shop/DrinkCustomizer').then((module) => module.DrinkCustomizer),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse rounded-2xl bg-[#efe5d8]" aria-busy="true" />
    ),
  },
);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const products = await getProducts();
  return products.slice(0, 12).map((product) => ({ slug: product.slug }));
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
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <section className="overflow-hidden rounded-3xl border border-[#e6dac9] bg-white">
        <div className="relative aspect-[4/3] bg-[#f8f4ed]">
          <Image
            src={product.image}
            alt={`${product.name} product photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            fetchPriority="high"
          />
        </div>
        <div className="space-y-2 p-4">
          <h1 className="text-2xl font-semibold text-[#2a2a2a]">{product.name}</h1>
          <p className="text-sm text-[#6f5a44]">{product.description}</p>
          <p className="text-base font-semibold text-[#245741]">
            From {formatMoney(toMoney(product.basePriceInCents))}
          </p>
        </div>
      </section>

      <DrinkCustomizer product={product} />
    </div>
  );
}
