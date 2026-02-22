import { ProductModel } from '@vetea/shared/models/Product';
import { UserModel } from '@vetea/shared/models/User';
import {
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
  // Milk Tea (4 products)
  {
    name: 'Taro Milk Tea',
    slug: 'taro-milk-tea',
    description: 'Creamy taro root blended with premium Ceylon tea and fresh milk. A purple dream in every sip.',
    basePriceInCents: 550,
    category: 'milk-tea',
    image:
      'https://images.unsplash.com/photo-1747016804753-866c3ed6b3b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Okinawa Milk Tea',
    slug: 'okinawa-milk-tea',
    description: 'Rich roasted brown sugar from Okinawa mixed with our house-blend black tea and creamy milk.',
    basePriceInCents: 575,
    category: 'milk-tea',
    image:
      'https://images.unsplash.com/photo-1751199956820-ecb919004024?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Thai Milk Tea',
    slug: 'thai-milk-tea',
    description: 'Bold Thai tea with aromatic spices, condensed milk, and a creamy finish.',
    basePriceInCents: 550,
    category: 'milk-tea',
    image:
      'https://images.unsplash.com/photo-1627781245399-a1fe415c0046?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hokkaido Milk Tea',
    slug: 'hokkaido-milk-tea',
    description: 'Smooth Hokkaido milk paired with premium Assam tea for a rich, velvety texture.',
    basePriceInCents: 575,
    category: 'milk-tea',
    image:
      'https://images.unsplash.com/photo-1613018274405-f625e8643383?auto=format&fit=crop&w=800&q=80',
  },
  // Fruit Tea (3 products)
  {
    name: 'Jasmine Fruit Tea',
    slug: 'jasmine-fruit-tea',
    description: 'Light jasmine green tea with fresh citrus notes and a hint of honey.',
    basePriceInCents: 520,
    category: 'fruit-tea',
    image:
      'https://images.unsplash.com/photo-1501199532894-9449c0a85a77?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Peach Oolong',
    slug: 'peach-oolong',
    description: 'Fragrant oolong tea infused with sweet peach and topped with real peach slices.',
    basePriceInCents: 550,
    category: 'fruit-tea',
    image:
      'https://images.unsplash.com/photo-1676693420436-7fa448f054eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mango Green Tea',
    slug: 'mango-green-tea',
    description: 'Tropical mango puree swirled with Japanese green tea. Refreshing and fruity.',
    basePriceInCents: 550,
    category: 'fruit-tea',
    image:
      'https://images.unsplash.com/photo-1764403714198-f10e8e4039d0?auto=format&fit=crop&w=800&q=80',
  },
  // Special (3 products)
  {
    name: 'Brown Sugar Boba',
    slug: 'brown-sugar-boba',
    description: 'Rich brown sugar syrup layered with fresh milk and chewy tapioca pearls. Our signature.',
    basePriceInCents: 650,
    category: 'special',
    image:
      'https://images.unsplash.com/photo-1741244133076-afcdda4befae?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Matcha Latte',
    slug: 'matcha-latte',
    description: 'Ceremonial-grade Uji matcha whisked with oat milk. Earthy, creamy, energizing.',
    basePriceInCents: 650,
    category: 'special',
    image:
      'https://images.unsplash.com/photo-1749280447307-31a68eb38673?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ube Latte',
    slug: 'ube-latte',
    description: 'Filipino purple yam blended with fresh milk for a naturally sweet, vibrant drink.',
    basePriceInCents: 675,
    category: 'special',
    image:
      'https://images.unsplash.com/photo-1607547023948-57254fde4f0b?auto=format&fit=crop&w=800&q=80',
  },
  // Classic (2 products)
  {
    name: 'Classic Pearl Milk Tea',
    slug: 'classic-pearl-milk-tea',
    description: 'The original. Smooth black tea, fresh milk, and hand-cooked tapioca pearls.',
    basePriceInCents: 540,
    category: 'classic',
    image:
      'https://images.unsplash.com/photo-1575080424619-0f203e09e6ec?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hong Kong Milk Tea',
    slug: 'hong-kong-milk-tea',
    description: 'Silky-smooth pulled tea brewed with a blend of Ceylon leaves. No frills, pure tradition.',
    basePriceInCents: 500,
    category: 'classic',
    image:
      'https://images.unsplash.com/photo-1600340432752-a407bab94cc3?auto=format&fit=crop&w=800&q=80',
  },
];

interface SeedAdminUser {
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
}

/**
 * Admin users to seed.
 * IMPORTANT: These users must already exist in Clerk with the 'admin' role set in their metadata.
 * To set the admin role in Clerk:
 * 1. Go to Clerk Dashboard > Users > [User] > Metadata
 * 2. Add: { "role": "admin" }
 * Or use Clerk's API to set user metadata.
 */
const ADMIN_USERS: SeedAdminUser[] = [
  // Add admin users here, e.g.:
  // {
  //   clerkId: 'user_xxxxxxxxxxxxx',
  //   email: 'admin@vetea.com',
  //   name: 'Admin User',
  //   phone: '+1234567890',
  // },
];

async function seedProducts(): Promise<void> {
  console.info('Seeding products...');
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
    console.info(`  ✓ ${product.name}`);
  }
  console.info(`Seeded ${BASE_PRODUCTS.length} products`);
}

async function seedAdminUsers(): Promise<void> {
  if (ADMIN_USERS.length === 0) {
    console.info('No admin users to seed (ADMIN_USERS array is empty)');
    return;
  }

  console.info('Seeding admin users...');
  for (const adminUser of ADMIN_USERS) {
    await UserModel.findOneAndUpdate(
      { clerkId: adminUser.clerkId },
      {
        clerkId: adminUser.clerkId,
        email: adminUser.email,
        name: adminUser.name,
        phone: adminUser.phone,
      },
      { upsert: true, new: true },
    ).exec();
    console.info(`  ✓ ${adminUser.name} (${adminUser.email})`);
  }
  console.info(`Seeded ${ADMIN_USERS.length} admin users`);
  console.info(
    '⚠️  Remember: Admin role must be set in Clerk Dashboard > Users > Metadata: { "role": "admin" }',
  );
}

async function seed(): Promise<void> {
  await connectDB();

  await seedProducts();
  await seedAdminUsers();
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
