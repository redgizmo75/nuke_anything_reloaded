const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

// Helper to get modifier keys for current platform
const getModifiers = () => {
    const isMac = process.platform === 'darwin';
    return {
        cmd: isMac ? 'Meta' : 'Control',
        alt: 'Alt',
        shift: 'Shift'
    };
};

test.describe('ZapIt', () => {
    let browserContext;
    let page;
    let extensionId;

    test.beforeEach(async () => {
        const pathToExtension = path.join(__dirname, '../src');

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

    test('should zap an element', async () => {
        // Load a local test file or a public page
        const testFile = 'file://' + path.join(__dirname, '../test.html');
        await page.goto(testFile);

        // Get an element to nuke
        const targetSelector = '#hero-section';
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

        // Execute the logic in the Service Worker: send "zapObject" to the active tab
        // We need to know the tab ID.
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, "zapObject");
            }
        });

        // Verify it is hidden
        await expect(target).toBeHidden();
    });

    test('should unzap the last element', async () => {
        // Setup: Zap an element first
        const testFile = 'file://' + path.join(__dirname, '../test.html');
        await page.goto(testFile);
        const targetSelector = '#hero-section';
        const target = page.locator(targetSelector);

        await target.click({ button: 'right' });

        let [backgroundWorker] = browserContext.serviceWorkers();
        if (!backgroundWorker)
            backgroundWorker = await browserContext.waitForEvent('serviceworker');

        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            chrome.tabs.sendMessage(tab.id, "zapObject");
        });

        await expect(target).toBeHidden();

        // Now Unnuke
        // Trigger right click anywhere (not strictly needed for unnuke logic but good practice)
        await page.locator('body').click({ button: 'right' });

        // Send Unzap message
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            chrome.tabs.sendMessage(tab.id, "unzapObject");
        });

        // Verify it is visible again
        await expect(target).toBeVisible();
    });

    test('should zap an element via keyboard shortcut logic', async () => {
        // Load a local test file
        const testFile = 'file://' + path.join(__dirname, '../test.html');
        await page.goto(testFile);

        // Hover over the element
        const elementToZap = page.locator('#hero-section');
        await elementToZap.hover();

        // We cannot reliably trigger extension keyboard shortcuts (Alt+Shift+X) via Playwright's keyboard.press 
        // in this headless/extension environment.
        // Instead, we verify the chain:
        // 1. Hover updates content script state (tested by the fact that zapHovered will work)
        // 2. Background sends 'zapHovered' (simulated here)
        // 3. Content script handles 'zapHovered' (hides element)

        let [backgroundWorker] = browserContext.serviceWorkers();
        if (!backgroundWorker)
            backgroundWorker = await browserContext.waitForEvent('serviceworker');

        // Simulate "zap" command: Send zapHovered from background
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, "zapHovered");
            }
        });

        // Verify the element is hidden
        await expect(elementToZap).toBeHidden();

        // Simulate "unzap" command: Send unzapObject from background
        await backgroundWorker.evaluate(async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, "unzapObject");
            }
        });

        // Verify the element is visible again
        await expect(elementToZap).toBeVisible();
    });

    test('should show visual feedback in Zap Mode', async () => {
        await page.goto(`file://${path.join(__dirname, '../test.html')}`);
        const elementToHover = page.locator('#hero-section');
        const body = page.locator('body');

        // Hover element - should NOT have highlight initially
        await elementToHover.hover();
        await expect(elementToHover).not.toHaveClass(/zap-highlight/);
        await expect(body).not.toHaveClass(/zap-mode-active/);

        // Enter Nuke Mode (Press Alt+Shift)
        await page.keyboard.down('Alt');
        await page.keyboard.down('Shift');

        // Verify visual feedback active
        await expect(body).toHaveClass(/zap-mode-active/);
        // Move mouse slightly to trigger mouseover if needed, or re-hover
        await elementToHover.hover();
        await expect(elementToHover).toHaveClass(/zap-highlight/);

        // Exit Nuke Mode (Release keys)
        await page.keyboard.up('Shift');
        await page.keyboard.up('Alt');

        // Verify visual feedback removed
        await expect(body).not.toHaveClass(/zap-mode-active/);
        await expect(elementToHover).not.toHaveClass(/zap-highlight/);
    });
});
