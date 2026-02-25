'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
  sizes?: string;
  priority?: boolean;
}

const SWIPE_THRESHOLD = 50;

export function ImageCarousel({
  images,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: ImageCarouselProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setActiveIndex(index);
      }
    },
    [images.length],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (isHorizontalSwipe.current === null) {
      isHorizontalSwipe.current = Math.abs(dx) > Math.abs(dy);
    }

    if (isHorizontalSwipe.current) {
      e.preventDefault();
      setOffsetX(dx);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
      if (offsetX < 0 && activeIndex < images.length - 1) {
        goTo(activeIndex + 1);
      } else if (offsetX > 0 && activeIndex > 0) {
        goTo(activeIndex - 1);
      }
    }
    setOffsetX(0);
    isHorizontalSwipe.current = null;
  }, [offsetX, activeIndex, images.length, goTo]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    touchStartX.current = e.clientX;
    isHorizontalSwipe.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || e.pointerType === 'touch') return;
      const dx = e.clientX - touchStartX.current;
      setOffsetX(dx);
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsDragging(false);
      if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
        if (offsetX < 0 && activeIndex < images.length - 1) {
          goTo(activeIndex + 1);
        } else if (offsetX > 0 && activeIndex > 0) {
          goTo(activeIndex - 1);
        }
      }
      setOffsetX(0);
    },
    [offsetX, activeIndex, images.length, goTo],
  );

  const translateX = -activeIndex * 100;
  const dragPercent = isDragging
    ? (offsetX / (typeof window !== 'undefined' ? window.innerWidth : 400)) * 100
    : 0;

  return (
    <div className="relative w-full overflow-hidden" aria-roledescription="carousel" aria-label="Product images">
      <div
        className="flex touch-pan-y select-none"
        style={{
          transform: `translateX(${translateX + dragPercent}%)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {images.map((img, idx) => (
          <div
            key={img.src}
            className="relative aspect-square w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`Image ${idx + 1} of ${images.length}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="pointer-events-none object-cover"
              sizes={sizes}
              priority={priority && idx === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to image ${idx + 1}`}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-5 bg-white/90'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
