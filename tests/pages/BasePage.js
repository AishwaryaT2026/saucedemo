export class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path = '/') {
        await this.page.goto(path);
    }

    async waitForVisible(locator) {
        await locator.waitFor({ state: 'visible', timeout: 10000 });
    }

    async getText(locator) {
        return await locator.textContent();
    }
}
