import { Page, Locator } from '@playwright/test';

export class ProductListPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getProductCard(productName: string): Locator {
        return this.page.getByRole('link', { name: productName });
    }

    async isProductVisible(productName: string): Promise<boolean> {
        return await this.getProductCard(productName).isVisible();
    }
}
