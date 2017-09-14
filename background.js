
function nukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "nukeThisObject", null);
}

function unnukeOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "unnukeObject", null);
}

// Create context menu items
chrome.contextMenus.create({"title": "Remove this object", "contexts": ["all"], "onclick": nukeOnClick});
chrome.contextMenus.create({"title": "Undo last remove", "contexts": ["all"], "onclick": unnukeOnClick});
