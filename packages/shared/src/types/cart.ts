export interface CartItemSelection {
  size: string;
  sugar: string;
  ice: string;
  toppings: string[];
}

export interface CartItem {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  quantity: number;
  basePriceInCents: number;
  unitPriceInCents?: number;
  selection: CartItemSelection;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
}
