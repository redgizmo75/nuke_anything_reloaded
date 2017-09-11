
function zapOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "zapEm", null);
}

function unzapOnClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, "unzapEm", null);
}

// Create context menu items
chrome.contextMenus.create({"title": "Remove this object", "contexts": ["all"], "onclick": zapOnClick});
chrome.contextMenus.create({"title": "Undo last remove", "contexts": ["all"], "onclick": unzapOnClick});
