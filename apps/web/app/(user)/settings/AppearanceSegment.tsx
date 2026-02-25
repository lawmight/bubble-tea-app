'use client';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/hooks/use-theme';

export function AppearanceSegment(): JSX.Element {
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B5A898]">
        Appearance
      </h2>
      <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white dark:border-[var(--color-border-card)] dark:bg-[var(--color-bg-card)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium text-[#6B5344] dark:text-[var(--color-text)]">
              Dark mode
            </p>
            <p className="text-xs text-[#B5A898] dark:text-[var(--color-text-secondary)]">
              {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
