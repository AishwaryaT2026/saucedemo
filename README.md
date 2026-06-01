# Sauce Demo Playwright Framework

This repository contains a small end-to-end automation framework for `https://www.saucedemo.com` using Playwright and the Page Object Model.

## Framework Structure

- `tests/pages/` - Page object classes for login, inventory, cart, and checkout flows.
- `tests/utils/` - Shared configuration and logging helpers.
- `tests/sauce-demo.spec.js` - End-to-end scenario covering positive shopping flow with cart management.
- `playwright.config.js` - Playwright test configuration.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the full suite:
   ```bash
   npm test
   ```

3. Run the scenario test only:
   ```bash
   npm run test:sauce
   ```

4. Open the HTML report after execution:
   ```bash
   npm run report
   ```

## Environment Configuration

The framework supports environment overrides via environment variables.

- `BASE_URL` - Base URL for the target application (default: `https://www.saucedemo.com`).
- `SAUCE_USER` - Login username (default: `standard_user`).
- `SAUCE_PASS` - Login password (default: `secret_sauce`).
- `FIRST_NAME` - Checkout first name (default: `Test`).
- `LAST_NAME` - Checkout last name (default: `User`).
- `POSTAL_CODE` - Checkout postal code (default: `12345`).

Example:
```bash
BASE_URL=https://www.saucedemo.com SAUCE_USER=standard_user SAUCE_PASS=secret_sauce npm run test:sauce
```

## Design Notes

- **Page Object Model** is used to separate page interactions from test orchestration.
- **Reusable utilities** centralize configuration and logging.
- **Explicit waits** are provided through Playwright `expect()` assertions and locator waits.
- **Error handling** uses assertion-driven verification so failures are reported clearly.
- **Reporting** is handled by Playwright's built-in HTML reporter.

## Trade-offs

- The framework is intentionally lightweight for a single scenario, with a focus on maintainability.
- No external logging library is added; a small wrapper around `console.log` is used for readability.
- The code is kept in plain JavaScript so the repo remains runnable without additional TypeScript setup.
