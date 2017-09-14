/**
 * onClick listener to send message to the content script to remove the current object.
 * @param info
 * @param tab
 */
function nukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "nukeThisObject", null);
}

/**
 * onClick listener to send message to the content script torestore the last removed.
 * @param info
 * @param tab
 */
function unnukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "unnukeObject", null);
}

// Create context menu items
chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuitem_caption_nuke"), "contexts": ["all"], "onclick": nukeOnClick});
chrome.contextMenus.create({"title": chrome.i18n.getMessage("menuitem_caption_unnuke"), "contexts": ["all"], "onclick": unnukeOnClick});
