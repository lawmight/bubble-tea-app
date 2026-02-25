'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  themeColor?: string;
}

const FALLBACK_THEME_COLOR = '#d4c5b2';

function makeBlurDataUrl(color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(svg) : Buffer.from(svg).toString('base64')}`;
}

export function ProductImage({
  src,
  alt,
  fill = true,
  className = 'object-cover',
  sizes,
  priority,
  fetchPriority,
  themeColor,
}: ProductImageProps): JSX.Element {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#f8f4ed] text-[#8C7B6B] ${fill ? 'absolute inset-0' : ''}`}
        aria-label={alt}
      >
        <svg
          className="h-16 w-16 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="mt-2 text-sm font-medium">No image</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div
          className={`${fill ? 'absolute inset-0' : ''} animate-pulse`}
          style={{
            backgroundColor: themeColor ?? FALLBACK_THEME_COLOR,
            filter: 'blur(20px)',
            opacity: 0.6,
          }}
          aria-hidden
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        sizes={sizes}
        priority={priority}
        fetchPriority={fetchPriority}
        placeholder="blur"
        blurDataURL={makeBlurDataUrl(themeColor ?? FALLBACK_THEME_COLOR)}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
