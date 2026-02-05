// spec: specs/product_purchase_test_plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Navegación y Exploración de Productos', () => {
  test('Navegación por categorías de productos', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navegar a la página principal de la tienda
    await homePage.goto();
    await expect(page.getByRole('link', { name: 'Phones' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Laptops' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Monitors' })).toBeVisible();

    // 2. Hacer clic en la categoría 'Phones'
    await homePage.clickCategory('Phones');
    await expect(page.getByRole('link', { name: 'Samsung galaxy s6' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nokia lumia 1520' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nexus 6' })).toBeVisible();

    // 3. Hacer clic en la categoría 'Laptops'
    await homePage.clickCategory('Laptops');
    await expect(page.getByRole('link', { name: 'Sony vaio i5' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sony vaio i7' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'MacBook air' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dell i7 8gb' })).toBeVisible();

    // 4. Hacer clic en la categoría 'Monitors'
    await homePage.clickCategory('Monitors');
    await expect(page.getByRole('link', { name: 'Apple monitor 24' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'ASUS Full HD' })).toBeVisible();
  });
});
