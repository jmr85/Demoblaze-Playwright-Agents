import { Page, Locator } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly phonesCategory: Locator;
    readonly laptopsCategory: Locator;
    readonly monitorsCategory: Locator;

    constructor(page: Page) {
        this.page = page;
        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });
    }

    async goto() {
        await this.page.goto('https://www.demoblaze.com/');
    }

    async clickCategory(categoryName: 'Phones' | 'Laptops' | 'Monitors') {
        switch (categoryName) {
            case 'Phones':
                await this.phonesCategory.click();
                break;
            case 'Laptops':
                await this.laptopsCategory.click();
                break;
            case 'Monitors':
                await this.monitorsCategory.click();
                break;
        }
    }
}
