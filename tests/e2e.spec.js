const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

test.describe('Nuke Anything Reloaded', () => {
    let browserContext;
    let page;
    let extensionId;

    test.beforeEach(async () => {
        const pathToExtension = path.join(__dirname, '..');

        // Launch browser with extension
        browserContext = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });

        page = await browserContext.newPage();

        // Hack to get extension ID isn't strictly necessary for functionality testing 
        // unless we need to inspect extension pages.
        // For now, we focus on content script interaction.
    });

    test.afterEach(async () => {
        await browserContext.close();
    });

    test('should nuke an element', async () => {
        // Load a local test file or a public page
        const testFile = 'file://' + path.join(__dirname, '../test.html');
        await page.goto(testFile);

        // Get an element to nuke
        const targetSelector = '#nuke-target';
        const target = page.locator(targetSelector);
        await expect(target).toBeVisible();

        // Context menu simulation is tricky in Playwright/Automation.
        // Strategy: 
        // 1. Right click to trigger 'mousedown' listener in content script (sets clickedElementNAR)
        // 2. Since we can't click native context menu, we simulate the message that background.js sends

        // 1. Trigger right click (mousedown button 2) to capture element
        await target.click({ button: 'right' });

        // 2. Simulate the message arrival in the content script
        // We can evaluate code in the page context. 
        // However, the content script is isolated.
        // BUT: The content script listens to chrome.runtime.onMessage.

        // Alternative: We can trigger the background worker logic if we can reach it.
        // Easier approach for black-box testing: 
        // Use the Service Worker to send the message to the active tab.

        // Find the background worker
        let [backgroundWorker] = browserContext.serviceWorkers();
        if (!backgroundWorker)
            backgroundWorker = await browserContext.waitForEvent('serviceworker');

        // Execute the logic in the Service Worker: send "nukeThisObject" to the active tab
        // We need to know the tab ID.
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, "nukeThisObject");
            }
        });

        // Verify it is hidden
        await expect(target).toBeHidden();
    });

    test('should unnuke the last element', async () => {
        // Setup: Nuke an element first
        const testFile = 'file://' + path.join(__dirname, '../test.html');
        await page.goto(testFile);
        const targetSelector = '#nuke-target';
        const target = page.locator(targetSelector);

        await target.click({ button: 'right' });

        let [backgroundWorker] = browserContext.serviceWorkers();
        if (!backgroundWorker)
            backgroundWorker = await browserContext.waitForEvent('serviceworker');

        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            chrome.tabs.sendMessage(tab.id, "nukeThisObject");
        });

        await expect(target).toBeHidden();

        // Now Unnuke
        // Trigger right click anywhere (not strictly needed for unnuke logic but good practice)
        await page.locator('body').click({ button: 'right' });

        // Send Unnuke message
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            chrome.tabs.sendMessage(tab.id, "unnukeObject");
        });

        // Verify it is visible again
        await expect(target).toBeVisible();
    });
});
