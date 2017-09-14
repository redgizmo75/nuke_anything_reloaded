
function nukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "nukeThisObject", null);
}

function unnukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "unnukeObject", null);
}

// Create context menu items
chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuitem_caption_nuke"), "contexts": ["all"], "onclick": nukeOnClick});
chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuitem_caption_unnuke"), "contexts": ["all"], "onclick": unnukeOnClick});
