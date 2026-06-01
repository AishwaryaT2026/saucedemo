import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { log } from '../utils/logger.js';

export class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.completeHeader = page.locator('.complete-header');
    }

    async fillShippingInformation(firstName, lastName, postalCode) {
        log('Filling shipping information');
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
        await expect(this.page).toHaveURL(/checkout-step-two.html/);
    }

    async getSummaryTotal() {
        const subtotalText = await this.subtotalLabel.textContent();
        const taxText = await this.taxLabel.textContent();
        const totalText = await this.totalLabel.textContent();
        return {
            subtotal: Number(subtotalText.replace('Item total: $', '').trim()),
            tax: Number(taxText.replace('Tax: $', '').trim()),
            total: Number(totalText.replace('Total: $', '').trim()),
        };
    }

    async finishOrder() {
        log('Finishing order');
        await this.finishButton.click();
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
    }
}
