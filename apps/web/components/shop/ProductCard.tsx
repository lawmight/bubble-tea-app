import { formatMoney, toMoney, type Product } from '@vetea/shared/client';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  index?: number;
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps): JSX.Element {
  return (
    <Link
      href={`/menu/${product.slug}`}
      className="group block animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="overflow-hidden rounded-2xl border border-[#D4C5B2] bg-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="shimmer relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.name} bubble tea`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </div>
        <div className="px-3 py-3 text-center">
          <h3 className="text-sm font-semibold text-[#6B5344]">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-[#8B9F82]">
            <span className="text-xs font-normal text-[#8C7B6B]">From </span>
            {formatMoney(toMoney(product.basePriceInCents))}
          </p>
        </div>
      </div>
    </Link>
  );
}
