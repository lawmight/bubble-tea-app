'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'vetea-favorites-v1';

export interface FavoriteItem {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  customization?: string;
}

export interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: FavoriteItem) => void;
  removeFavorite: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function persist(items: FavoriteItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function parseStorage(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as FavoriteItem[];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }): JSX.Element {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(parseStorage());
  }, []);

  useEffect(() => {
    persist(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((f) => f.productId === productId),
    [favorites],
  );

  const toggleFavorite = useCallback((product: FavoriteItem) => {
    setFavorites((current) => {
      const exists = current.some((f) => f.productId === product.productId);
      let next: FavoriteItem[];
      if (exists) {
        next = current.filter((f) => f.productId !== product.productId);
      } else {
        next = [...current, product];
      }
      persist(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((current) => {
      const next = current.filter((f) => f.productId !== productId);
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (ctx == null) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
