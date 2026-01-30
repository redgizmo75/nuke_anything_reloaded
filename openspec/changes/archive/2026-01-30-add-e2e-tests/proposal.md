## Why
Currently, the extension relies on manual testing, which is time-consuming and error-prone. Adding End-to-End (E2E) tests will automate the verification of core functionality ("Nuke" and "Unnuke"), ensuring reliability and preventing regressions during future updates (like the Manifest V3 migration).

## What Changes
- Add `@playwright/test` as a development dependency.
- Configure Playwright for extension testing.
- Create an E2E test suite (`tests/e2e.spec.ts` or `.js`) that:
    - Launches a Chromium instance with the extension loaded (persistent context).
    - Loads a test page.
    - Simulates user interactions (context menu clicks).
    - Verifies DOM changes (elements hiding/reappearing).
- Add a `test` script to `package.json`.

## Capabilities

### New Capabilities
- `e2e-testing`: Infrastructure and test suite for automated end-to-end verification of the extension using Playwright.

### Modified Capabilities
<!-- No existing functional capabilities are changing requirements -->

## Impact
- **Files**: New `tests/` directory, `playwright.config.js`.
- **Dependencies**: New dev-dependency (`@playwright/test`).
- **Process**: `npm test` (or `npx playwright test`) will be available for local development and CI.
- **Production Code**: No changes to extension logic expected, only testing infrastructure.
