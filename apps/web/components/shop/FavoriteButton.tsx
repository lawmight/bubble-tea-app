'use client';

import { toast } from 'sonner';

import { useFavorites, type FavoriteItem } from '@/hooks/use-favorites';

interface FavoriteButtonProps {
  product: FavoriteItem;
}

export function FavoriteButton({ product }: FavoriteButtonProps): JSX.Element {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.productId);

  return (
    <button
      type="button"
      aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
        toast(favorited ? 'Removed from favorites' : 'Added to favorites');
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={favorited ? '#E05252' : 'none'}
        stroke={favorited ? '#E05252' : '#8C7B6B'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
