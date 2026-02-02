// Create context menu items on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "zap",
        "title": chrome.i18n.getMessage("menuitem_caption_zap"),
        "contexts": ["all"]
    });
    chrome.contextMenus.create({
        "id": "unzap",
        "title": chrome.i18n.getMessage("menuitem_caption_unzap"),
        "contexts": ["all"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "zap") {
        chrome.tabs.sendMessage(tab.id, "zapObject");
    } else if (info.menuItemId === "unzap") {
        chrome.tabs.sendMessage(tab.id, "unzapObject");
    }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab) return;

    if (command === "zap") {
        chrome.tabs.sendMessage(tab.id, "zapHovered");
    } else if (command === "unzap") {
        chrome.tabs.sendMessage(tab.id, "unzapObject");
    }
});
