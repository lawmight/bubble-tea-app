import { notFound } from 'next/navigation';

import { ProductForm } from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/queries/admin';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#6B5344]">Edit Product</h1>
      <ProductForm initialData={product} productId={product.id} />
    </div>
  );
}
