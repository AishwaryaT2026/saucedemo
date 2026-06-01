import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { log } from '../utils/logger.js';

export class InventoryPage extends BasePage {
    constructor(page) {
        super(page);
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartButton = page.locator('.shopping_cart_link');
        this.inventoryContainer = page.locator('.inventory_list');
        this.sortSelect = page.locator('.product_sort_container');
        this.footer = page.locator('.footer');
        this.socialLinks = {
            twitter: page.locator('.social_twitter'),
            facebook: page.locator('.social_facebook'),
            linkedin: page.locator('.social_linkedin'),
        };
    }

    productCard(productName) {
        return this.page.locator('.inventory_item', { hasText: productName });
    }

    async getSelectedSortOptionText() {
        return await this.sortSelect.locator('option:checked').textContent();
    }

    async selectSortOption(optionValue) {
        await this.sortSelect.selectOption(optionValue);
    }

    async getVisibleProductNames() {
        return await this.inventoryContainer.locator('.inventory_item_name').allTextContents();
    }

    async getVisibleProductPrices() {
        const prices = await this.inventoryContainer.locator('.inventory_item_price').allTextContents();
        return prices.map((priceText) => Number(priceText.replace('$', '').trim()));
    }

    async getSocialLinkHref(platform) {
        const icon = this.socialLinks[platform.toLowerCase()];
        return await icon.getAttribute('href');
    }

    async getSocialLinkHrefBySelector(selector) {
        const icon = this.page.locator(selector);
        await expect(icon).toBeVisible({ timeout: 5000 });
        const href = await icon.getAttribute('href');
        await expect(href, `Expected social icon ${selector} to have href`).toBeTruthy();
        return href;
    }

    addProduct(productName) {
        log(`Adding product to cart: ${productName}`);
        const addButton = this.productCard(productName).locator('button', { hasText: 'Add to cart' });
        return addButton.click();
    }

    removeProduct(productName) {
        log(`Removing product from cart: ${productName}`);
        const removeButton = this.productCard(productName).locator('button', { hasText: 'Remove' });
        return removeButton.click();
    }

    async verifyProductVisible(productName) {
        const card = this.productCard(productName);
        await expect(card).toBeVisible();
    }

    async getCartCount() {
        if (await this.cartBadge.count() === 0) return 0;
        return Number(await this.cartBadge.textContent());
    }

    async navigateToCart() {
        log('Navigating to cart page');
        await this.cartButton.click();
        await expect(this.page).toHaveURL(/cart.html/);
    }
}
