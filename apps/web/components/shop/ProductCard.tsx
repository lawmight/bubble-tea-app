import { formatMoney, toMoney, type Product } from '@vetea/shared';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps): JSX.Element {
  return (
    <Card className="overflow-hidden p-0">
      <Link href={`/menu/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f8f4ed]">
          <Image
            src={product.image}
            alt={`${product.name} bubble tea`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-[#2a2a2a]">{product.name}</h3>
            <Badge>{product.category}</Badge>
          </div>
          <p className="line-clamp-2 text-sm text-[#6f5a44]">{product.description}</p>
          <p className="text-sm font-semibold text-[#245741]">
            {formatMoney(toMoney(product.basePriceInCents))}
          </p>
        </div>
      </Link>
    </Card>
  );
}
