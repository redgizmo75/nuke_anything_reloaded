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
