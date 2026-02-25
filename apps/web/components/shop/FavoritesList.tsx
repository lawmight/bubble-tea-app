'use client';

import Link from 'next/link';

import { useFavorites } from '@/hooks/use-favorites';

function HeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function FavoritesList(): JSX.Element {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#D4C5B2] px-4 py-6 text-center">
        <p className="text-sm text-[#8C7B6B]">No favorites yet</p>
        <p className="mt-1 text-xs text-[#B5A898]">
          Tap the heart icon on any drink to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {favorites.map((fav) => (
        <Link
          key={fav.productId}
          href={`/menu/${fav.productSlug}`}
          className="group flex items-center gap-3 rounded-xl border border-[#E8DDD0] bg-white px-4 py-3 transition-all duration-200 hover:border-[#8B9F82]/30 hover:shadow-sm"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B9F82]/10 text-[#8B9F82]">
            <HeartIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#6B5344]">{fav.name}</p>
            {fav.customization && (
              <p className="truncate text-xs text-[#B5A898]">{fav.customization}</p>
            )}
          </div>
          <button
            type="button"
            aria-label={`Remove ${fav.name} from favorites`}
            className="shrink-0 rounded-full p-1.5 text-[#B5A898] transition-colors hover:bg-[#F5F0E8] hover:text-[#A0524F]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFavorite(fav.productId);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </Link>
      ))}
    </div>
  );
}
