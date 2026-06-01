import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { USERNAME, PASSWORD } from '../utils/config.js';
import { log } from '../utils/logger.js';

export class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async open() {
        log('Opening login page');
        await this.navigate('/');
        await expect(this.usernameInput).toBeVisible();
    }

    async login(username = USERNAME, password = PASSWORD) {
        log(`Logging in as ${username}`);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await expect(this.page).toHaveURL(/inventory.html/);
    }

    async verifyLoginFailed() {
        await expect(this.errorMessage).toBeVisible();
    }
}
