## Context
The "Nuke Anything Reloaded" extension is a pure JavaScript Chrome Extension. Currently, testing is manual. We are introducing automated E2E testing using Playwright to ensure stability and catch regressions. Playwright was chosen over Puppeteer for its modern API and robust browser automation capabilities.

## Goals / Non-Goals

**Goals:**
- Enable automated testing of the full extension lifecycle (load, context menu interaction, DOM manipulation).
- Provide a scalable test structure for future features.
- Integrate testing into the local development workflow (`npm test`).

**Non-Goals:**
- Unit testing of individual functions (focus is on integration/E2E).
- Cross-browser testing beyond Chromium (Chrome Extensions primarily target Chromium).

## Decisions

### 1. Testing Framework: Playwright
- **Rationale**: Playwright offers superior handling of modern web features, auto-waiting, and easier configuration compared to Puppeteer. It supports loading Chrome extensions natively via persistent contexts.
- **Alternatives**: Puppeteer (original proposal, but Playwright requested by user for better DX).

### 2. Browser Context: Persistent Context
- **Rationale**: Chrome Extensions require a persistent browser context (`browserType.launchPersistentContext`) to be loaded effectively. Standard incognito contexts used by default in Playwright tests do not support extensions as easily.
- **Implementation**: The test setup will launch a persistent context with the `--disable-extensions-except` and `--load-extension` flags pointing to the project root.

### 3. Test Structure
- **Location**: `tests/` directory.
- **Spec File**: `tests/e2e.spec.js` (using JS to match project language).
- **Config**: `playwright.config.js` in root.

## Risks / Trade-offs

### Chrome Extension Testing Limitations
- **Risk**: Interacting with native Chrome UI (like the context menu) is restricted in automation protocols.
- **Mitigation**: Pure Playwright cannot click native context menus. We will bypass this by dispatching the underlying message directly to the background service worker or content script if possible, OR use keyboard navigation if Playwright supports it.
    - *Correction*: Playwright generally cannot interact with native OS menus.
    - *Strategy*: We will simulate the *trigger* of the action. Since we can't click the native menu, we will verify the `content_script.js` logic by simulating the messages that the background worker sends, OR we will trigger the background worker logic directly if exposed.
    - *Better Strategy for E2E*: Trigger the logic via `chrome.runtime.onMessage` if we can't click the menu. However, a true E2E test should try to use the UI. Since we can't click the context menu, we might need to rely on testing the side-effects of the *logic* by sending the messages that the context menu *would* send.
    - *Refined Strategy*: We will load the extension. We will load a page. We will use `page.evaluate` to trigger the `mousedown` event to set `clickedElementNAR`. Then we will use `page.evaluate` or a `background` page handle to send the `nukeThisObject` message to the tab. This verifies the entire chain except the physical menu click.

## Migration Plan
1. Install `@playwright/test`.
2. Create configuration.
3. Write initial smoke test.
4. Verify tests pass locally.
