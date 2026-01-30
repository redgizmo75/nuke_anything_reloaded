## 1. Environment Setup

- [x] 1.1 Install `@playwright/test` as a dev dependency.
- [x] 1.2 Add `test` script to `package.json` executing `playwright test`.

## 2. Playwright Configuration

- [x] 2.1 Create `playwright.config.js`.
- [x] 2.2 Configure persistent context launch settings (extension loading, headless: false by default for extensions).
- [x] 2.3 Set test directory to `tests/`.

## 3. Test Implementation

- [x] 3.1 Create `tests/e2e.spec.js` file.
- [x] 3.2 Implement test setup (launch browser with extension).
- [x] 3.3 Implement data attribute injection or element selection strategy for testing.
- [x] 3.4 Implement "Nuke Element" test scenario (right-click -> nuke -> verify hidden).
- [x] 3.5 Implement "Unnuke Element" test scenario (right-click -> unnuke -> verify visible).

## 4. Verification

- [x] 4.1 Run full test suite and ensure all tests pass.
- [x] 4.2 Verify CI readiness (optional, ensure it runs in headless mode if possible or document requirements).
