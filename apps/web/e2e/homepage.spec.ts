import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('displays VETEA branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=VETEA').first()).toBeVisible();
  });

  test('shows product cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid="product-card"], article, .product-card');
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test('has bottom navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').last();
    await expect(nav).toBeVisible();
  });
});
