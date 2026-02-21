import {
  ProductModel,
  SIZES,
  SWEETNESS_LEVELS,
  TOPPINGS,
  type ProductCategory,
} from '@vetea/shared';

import { connectDB } from '../lib/db';

interface SeedProduct {
  name: string;
  slug: string;
  description: string;
  basePriceInCents: number;
  category: ProductCategory;
  image: string;
}

const BASE_PRODUCTS: SeedProduct[] = [
  {
    name: 'Taro Milk Tea',
    slug: 'taro-milk-tea',
    description: 'Creamy taro with silky milk tea.',
    basePriceInCents: 550,
    category: 'milk-tea',
    image:
      'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Brown Sugar Boba',
    slug: 'brown-sugar-boba',
    description: 'Rich brown sugar syrup and chewy pearls.',
    basePriceInCents: 590,
    category: 'special',
    image:
      'https://images.unsplash.com/photo-1594489428504-5c0f0f63316f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Jasmine Fruit Tea',
    slug: 'jasmine-fruit-tea',
    description: 'Refreshing jasmine tea with citrus notes.',
    basePriceInCents: 520,
    category: 'fruit-tea',
    image:
      'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Classic Pearl Milk Tea',
    slug: 'classic-pearl-milk-tea',
    description: 'Traditional milk tea balanced with pearls.',
    basePriceInCents: 540,
    category: 'classic',
    image:
      'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=1200&q=80',
  },
];

async function seed(): Promise<void> {
  await connectDB();

  for (const product of BASE_PRODUCTS) {
    await ProductModel.findOneAndUpdate(
      { slug: product.slug },
      {
        ...product,
        available: true,
        customizations: [
          { type: 'size', options: SIZES },
          { type: 'sugar', options: SWEETNESS_LEVELS },
          {
            type: 'ice',
            options: [
              { name: 'No ice', priceModifierInCents: 0, available: true },
              { name: 'Less ice', priceModifierInCents: 0, available: true },
              { name: 'Regular ice', priceModifierInCents: 0, available: true },
            ],
          },
          { type: 'topping', options: TOPPINGS },
        ],
      },
      { upsert: true, new: true },
    ).exec();
  }
}

seed()
  .then(() => {
    console.info('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
