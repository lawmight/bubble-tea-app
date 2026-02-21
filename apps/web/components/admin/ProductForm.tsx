'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import type { Product } from '@vetea/shared';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/admin';

interface ProductFormProps {
  initialData?: Product;
  productId?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

const CATEGORIES = [
  { value: 'milk-tea', label: 'Milk Tea' },
  { value: 'fruit-tea', label: 'Fruit Tea' },
  { value: 'special', label: 'Special' },
  { value: 'classic', label: 'Classic' },
] as const;

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState(
    initialData ? (initialData.basePriceInCents / 100).toFixed(2) : '',
  );
  const [category, setCategory] = useState(initialData?.category ?? 'milk-tea');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [available, setAvailable] = useState(initialData?.available ?? true);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(name));
    }
  }, [name, slugManuallyEdited]);

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = productId
        ? await updateProduct(productId, formData)
        : await createProduct(formData);

      if (result.success) {
        setSuccess(result.message);
        if (!productId) {
          router.push('/admin/products');
        }
      } else {
        setError(result.message);
      }
    });
  }

  function handleDelete() {
    if (!productId || !confirm('Are you sure you want to delete this product?')) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result.success) {
        router.push('/admin/products');
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <Card className="mx-auto max-w-2xl p-6 md:p-8">
      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-[#A0524F]/20 bg-[#A0524F]/5 p-3 text-sm text-[#A0524F]">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-[#8B9F82]/20 bg-[#8B9F82]/5 p-3 text-sm text-[#8B9F82]">
            {success}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-[#6B5344]">
            Name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Classic Milk Tea"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-[#6B5344]">
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="classic-milk-tea"
            required
          />
          <p className="text-xs text-[#8C7B6B]">Auto-generated from name. Edit to customize.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-[#6B5344]">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A rich and creamy tea blended with fresh milk..."
            rows={3}
            required
            className="w-full rounded-xl border border-[#D4C5B2] bg-[#FAF7F2] px-3 py-2.5 text-sm text-[#6B5344] placeholder:text-[#8C7B6B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-[#6B5344]">
              Price (USD)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8C7B6B]">
                $
              </span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="6.50"
                required
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-[#6B5344]">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              className="h-11 w-full rounded-xl border border-[#D4C5B2] bg-[#FAF7F2] px-3 text-sm text-[#6B5344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium text-[#6B5344]">
            Image URL
          </label>
          <Input
            id="image"
            name="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="available"
            name="available"
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-5 w-5 rounded border-[#D4C5B2] accent-[#8B9F82]"
          />
          <label htmlFor="available" className="text-sm font-medium text-[#6B5344]">
            Available for ordering
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? 'Saving...'
              : productId
                ? 'Save Changes'
                : 'Create Product'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>
        </div>

        {productId && (
          <div className="border-t border-[#E8DDD0] pt-6">
            <h3 className="mb-2 text-sm font-semibold text-[#A0524F]">Danger Zone</h3>
            <p className="mb-3 text-sm text-[#8C7B6B]">
              Permanently delete this product. This cannot be undone.
            </p>
            <Button type="button" variant="danger" onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
