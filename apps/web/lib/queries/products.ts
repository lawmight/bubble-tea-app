import { unstable_cache } from 'next/cache';

import { ProductModel, type Product } from '@vetea/shared';

import { connectDB } from '@/lib/db';

function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    id: String(raw._id),
    name: String(raw.name),
    slug: String(raw.slug),
    description: String(raw.description),
    basePriceInCents: Number(raw.basePriceInCents),
    category: raw.category as Product['category'],
    image: String(raw.image),
    available: Boolean(raw.available),
    customizations: (raw.customizations as Product['customizations']) ?? [],
    createdAt: new Date(String(raw.createdAt)),
    updatedAt: new Date(String(raw.updatedAt)),
  };
}

const getProductsCached = unstable_cache(
  async (category?: string) => {
    await connectDB();
    const filter = category
      ? { available: true, category }
      : {
          available: true,
        };

    const products = await ProductModel.find(filter)
      .select(
        'name slug description basePriceInCents category image available customizations createdAt updatedAt',
      )
      .lean()
      .exec();

    return products.map((product) => normalizeProduct(product as Record<string, unknown>));
  },
  ['products-list'],
  { revalidate: 3600, tags: ['products'] },
);

const getProductBySlugCached = unstable_cache(
  async (slug: string) => {
    await connectDB();
    const product = await ProductModel.findOne({ slug, available: true }).lean().exec();

    if (!product) {
      return null;
    }

    return normalizeProduct(product as Record<string, unknown>);
  },
  ['product-by-slug'],
  { revalidate: 3600, tags: ['products'] },
);

export async function getProducts(category?: string): Promise<Product[]> {
  return getProductsCached(category);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getProductBySlugCached(slug);
}
