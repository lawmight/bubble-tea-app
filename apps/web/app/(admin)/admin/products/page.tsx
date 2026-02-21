import Image from 'next/image';
import Link from 'next/link';

import { formatMoney, toMoney } from '@vetea/shared';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllProducts } from '@/lib/queries/admin';
import { DeleteProductButton } from './DeleteProductButton';

const CATEGORY_LABELS: Record<string, string> = {
  'milk-tea': 'Milk Tea',
  'fruit-tea': 'Fruit Tea',
  special: 'Special',
  classic: 'Classic',
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#6B5344]">Products</h1>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Image</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Name</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Category</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Price</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Status</th>
                <th className="px-4 py-3 text-right font-medium text-[#8C7B6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#8C7B6B]">
                    No products yet. Add your first product to get started.
                  </td>
                </tr>
              )}
              {products.map((product, idx) => (
                <tr
                  key={product.id}
                  className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#FAF7F2] ${
                    idx % 2 === 1 ? 'bg-[#FDFCF9]' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#E8DDD0]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-[#6B5344] hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#8C7B6B]">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6B5344]">
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#6B5344]">
                    {formatMoney(toMoney(product.basePriceInCents))}
                  </td>
                  <td className="px-4 py-3">
                    {product.available ? (
                      <Badge className="bg-[#8B9F82]/10 text-[#8B9F82]">Available</Badge>
                    ) : (
                      <Badge className="bg-[#A0524F]/10 text-[#A0524F]">Unavailable</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" className="h-8 px-3 text-xs">
                          Edit
                        </Button>
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-sm text-[#8C7B6B]">
        {products.length} product{products.length !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}
