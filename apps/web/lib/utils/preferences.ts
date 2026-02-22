import type { Product } from '@vetea/shared';

/**
 * Maps settings UI ice labels to possible product option names (products may use different casing/labels).
 */
const ICE_PREF_TO_PRODUCT_OPTION: Record<string, string> = {
  'No Ice': 'No ice',
  'Less Ice': 'Less ice',
  'Normal Ice': 'Regular ice',
  'Extra Ice': 'Extra ice',
};

function getProductOptionNames(product: Product, type: 'sugar' | 'ice'): string[] {
  const options = product.customizations.find((c) => c.type === type)?.options ?? [];
  return options.filter((o) => o.available).map((o) => o.name);
}

function getFirstAvailable(product: Product, type: 'sugar' | 'ice'): string {
  const names = getProductOptionNames(product, type);
  return names[0] ?? '';
}

/**
 * Resolves the product option value to use for sugar default.
 * If userPref is set and the product has that option, use it; otherwise first available.
 */
export function resolveDefaultSugar(product: Product, userPref?: string): string {
  if (!userPref) return getFirstAvailable(product, 'sugar');
  const options = getProductOptionNames(product, 'sugar');
  return options.includes(userPref) ? userPref : getFirstAvailable(product, 'sugar');
}

/**
 * Resolves the product option value to use for ice default.
 * Maps settings labels (e.g. "Normal Ice") to product option names (e.g. "Regular ice") when needed.
 */
export function resolveDefaultIce(product: Product, userPref?: string): string {
  if (!userPref) return getFirstAvailable(product, 'ice');
  const productOptionName = ICE_PREF_TO_PRODUCT_OPTION[userPref] ?? userPref;
  const options = getProductOptionNames(product, 'ice');
  return options.includes(productOptionName) ? productOptionName : getFirstAvailable(product, 'ice');
}
