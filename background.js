// Create context menu items on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "nuke",
        "title": chrome.i18n.getMessage("menuitem_caption_nuke"),
        "contexts": ["all"]
    });
    chrome.contextMenus.create({
        "id": "unnuke",
        "title": chrome.i18n.getMessage("menuitem_caption_unnuke"),
        "contexts": ["all"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "nuke") {
        chrome.tabs.sendMessage(tab.id, "nukeThisObject");
    } else if (info.menuItemId === "unnuke") {
        chrome.tabs.sendMessage(tab.id, "unnukeObject");
    }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab) return;

    if (command === "nuke") {
        chrome.tabs.sendMessage(tab.id, "nukeHovered");
    } else if (command === "unnuke") {
        chrome.tabs.sendMessage(tab.id, "unnukeObject");
    }
});
