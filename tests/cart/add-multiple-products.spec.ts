// spec: specs/product_purchase_test_plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Gestión del Carrito de Compras', () => {
  test('Agregar múltiples productos al carrito', async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');

    // 1. Agregar el producto 'Samsung galaxy s6' ($360) al carrito
    await page.getByRole('link', { name: 'Phones' }).click();
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
    await page.getByRole('link', { name: 'Add to cart' }).click();
    
    // Accept product added confirmation dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // 2. Navegar a la categoría 'Laptops' y seleccionar 'MacBook air' ($700)
    await page.getByRole('link', { name: 'Home (current)' }).click();
    await page.getByRole('link', { name: 'Laptops' }).click();
    await page.getByRole('link', { name: 'MacBook air' }).click();

    // 3. Hacer clic en 'Add to cart'
    await page.getByRole('link', { name: 'Add to cart' }).click();

    // 4. Navegar al carrito
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    
    // Wait for cart products to load
    await new Promise(f => setTimeout(f, 2 * 1000));

    // Verify both products are displayed in the cart
    await expect(page.getByText('Samsung galaxy s6')).toBeVisible();
    await expect(page.getByText('MacBook air')).toBeVisible();
    
    // Verify the total is 1060 (360 + 700)
    await expect(page.getByText('1060')).toBeVisible();
  });
});