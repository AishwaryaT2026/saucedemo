import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { InventoryPage } from './pages/InventoryPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { FIRST_NAME, LAST_NAME, POSTAL_CODE } from './utils/config.js';
import { selectedProducts, finalProduct } from './data/products.js';
import { socialMediaLinks, sortOptions } from './data/validation-data.js';
import { log } from './utils/logger.js';

test('Complete positive shopping flow with cart management', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login();

    for (const product of selectedProducts) {
        await inventoryPage.verifyProductVisible(product);
        await inventoryPage.addProduct(product);
    }

    await expect(await inventoryPage.getCartCount()).toBe(selectedProducts.length);
    log(`Verified ${selectedProducts.length} items in cart badge after add.`);

    await inventoryPage.navigateToCart();
    await expect(await cartPage.getItemCount()).toBe(selectedProducts.length);

    await cartPage.removeItem('Sauce Labs Bolt T-Shirt');
    await expect(await cartPage.getItemCount()).toBe(selectedProducts.length - 1);
    log('Verified item removal in cart.');

    await cartPage.continueShopping();
    await inventoryPage.addProduct(finalProduct);
    await expect(await inventoryPage.getCartCount()).toBe(selectedProducts.length);

    await inventoryPage.navigateToCart();
    await expect(await cartPage.getItemCount()).toBe(selectedProducts.length);
    await cartPage.verifyItemVisible('Sauce Labs Backpack');
    await cartPage.verifyItemVisible('Sauce Labs Bike Light');
    await cartPage.verifyItemVisible(finalProduct);

    await cartPage.checkout();
    await checkoutPage.fillShippingInformation(FIRST_NAME, LAST_NAME, POSTAL_CODE);

    const totals = await checkoutPage.getSummaryTotal();
    const expectedSubtotal = [
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        finalProduct,
    ];

    const priceValues = await Promise.all(
        expectedSubtotal.map(async (name) => {
            const item = page.locator('.cart_item', { hasText: name });
            const priceText = await item.locator('.inventory_item_price').textContent();
            return Number(priceText.replace('$', '').trim());
        })
    );

    const calculatedSubtotal = priceValues.reduce((sum, price) => sum + price, 0);
    log(`Calculated expected subtotal: $${calculatedSubtotal.toFixed(2)}`);

    expect(totals.subtotal).toBeCloseTo(calculatedSubtotal, 2);
    expect(totals.total).toBeCloseTo(totals.subtotal + totals.tax, 2);

    await checkoutPage.finishOrder();
    log('Order completed successfully.');
});

test('Social media icon redirection validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login();

    for (const link of socialMediaLinks) {
        const href = await inventoryPage.getSocialLinkHrefBySelector(link.selector);
        log(`Verifying ${link.platform} footer link destination: ${href}`);
        expect(href).toContain(link.expectedHref);
    }
});

test('Product sorting validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login();

    const defaultSortText = (await inventoryPage.getSelectedSortOptionText())?.trim();
    expect(defaultSortText).toBe(sortOptions.defaultLabel);

    const defaultNames = await inventoryPage.getVisibleProductNames();
    expect(isAlphabeticallySorted(defaultNames)).toBe(true);

    await inventoryPage.selectSortOption(sortOptions.priceLowToHighValue);
    const selectedSortText = (await inventoryPage.getSelectedSortOptionText())?.trim();
    expect(selectedSortText).toBe(sortOptions.priceLowToHighLabel);

    const prices = await inventoryPage.getVisibleProductPrices();
    expect(isNumericallySorted(prices)).toBe(true);
});

function isAlphabeticallySorted(values) {
    const normalized = values.map((value) => value.trim().toLowerCase());
    return normalized.every((value, index) => {
        return index === 0 || normalized[index - 1] <= value;
    });
}

function isNumericallySorted(values) {
    return values.every((value, index) => {
        return index === 0 || values[index - 1] <= value;
    });
}
