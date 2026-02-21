export const PRODUCT_CATEGORIES = [
  'milk-tea',
  'fruit-tea',
  'special',
  'classic',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export type CustomizationType = 'size' | 'sugar' | 'ice' | 'topping';

export interface CustomizationOption {
  name: string;
  priceModifierInCents: number;
  available: boolean;
}

export interface ProductCustomization {
  type: CustomizationType;
  options: CustomizationOption[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePriceInCents: number;
  category: ProductCategory;
  image: string;
  available: boolean;
  customizations: ProductCustomization[];
  createdAt: Date;
  updatedAt: Date;
}
