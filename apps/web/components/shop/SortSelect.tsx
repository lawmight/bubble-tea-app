'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price: Low \u2192 High' },
  { value: 'price-desc', label: 'Price: High \u2192 Low' },
  { value: 'name-asc', label: 'Name: A \u2192 Z' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

export function SortSelect(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get('sort') as SortOption) ?? 'popular';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const next = e.target.value;
    if (next === 'popular') {
      params.delete('sort');
    } else {
      params.set('sort', next);
    }
    const qs = params.toString();
    router.push(`/menu${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      aria-label="Sort drinks"
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
