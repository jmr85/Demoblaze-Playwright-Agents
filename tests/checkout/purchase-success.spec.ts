// spec: specs/product_purchase_test_plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Proceso de Checkout', () => {
    test('Completar compra con datos válidos', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/');

        // 1. Agregar el producto 'Samsung galaxy s6' al carrito y navegar al carrito
        await page.getByRole('link', { name: 'Phones' }).click();
        await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

        // Accept product added confirmation dialog
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.getByRole('link', { name: 'Add to cart' }).click();

        await page.getByRole('link', { name: 'Cart', exact: true }).click();

        // Wait for cart items to load
        await new Promise(f => setTimeout(f, 3 * 1000));

        // Verify Samsung galaxy s6 is in cart
        await expect(page.getByText('Samsung galaxy s6')).toBeVisible();

        // 2. Hacer clic en el botón 'Place Order'
        await page.getByRole('button', { name: 'Place Order' }).click();

        // Verify the checkout modal appears by checking form fields are visible
        await expect(page.locator('#name')).toBeVisible();

        // 3. Completar el formulario con datos válidos
        await page.locator('#name').fill('John Doe');
        await page.locator('#country').fill('United States');
        await page.locator('#city').fill('New York');
        await page.locator('#card').fill('4111111111111111');
        await page.locator('#month').fill('12');
        await page.locator('#year').fill('2026');
        // 4. Hacer clic en el botón 'Purchase'
        await page.getByRole('button', { name: 'Purchase' }).click();

        // Verify confirmation dialog appears
        await expect(page.getByText('Thank you for your purchase!')).toBeVisible();
        await expect(page.getByText('Name: John Doe')).toBeVisible();

        // Verify purchase details contain required information
        await expect(page.locator('text=Amount:')).toBeVisible();
        await expect(page.locator('text=Id:')).toBeVisible();

        // 5. Cerrar el cuadro de diálogo de confirmación
        await page.getByRole('button', { name: 'OK' }).click();

        // Verify cart is empty after successful purchase
        await page.getByRole('link', { name: 'Cart' }).click();

        // Verify cart is empty - no product rows should exist
        await expect(page.locator('table tbody tr').first()).not.toBeVisible();
    });
});