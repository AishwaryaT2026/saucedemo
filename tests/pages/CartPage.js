import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { log } from '../utils/logger.js';

export class CartPage extends BasePage {
    constructor(page) {
        super(page);
        this.cartList = page.locator('.cart_list');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    cartItem(productName) {
        return this.page.locator('.cart_item', { hasText: productName });
    }

    async verifyItemVisible(productName) {
        log(`Verifying cart contains item: ${productName}`);
        await expect(this.cartItem(productName)).toBeVisible();
    }

    async removeItem(productName) {
        log(`Removing item from cart: ${productName}`);
        const removeButton = this.cartItem(productName).locator('button', { hasText: 'Remove' });
        await removeButton.click();
    }

    async getItemCount() {
        return await this.cartList.locator('.cart_item').count();
    }

    async checkout() {
        log('Proceeding to checkout');
        await this.checkoutButton.click();
        await expect(this.page).toHaveURL(/checkout-step-one.html/);
    }

    async continueShopping() {
        log('Continuing shopping');
        await this.continueShoppingButton.click();
        await expect(this.page).toHaveURL(/inventory.html/);
    }
}
