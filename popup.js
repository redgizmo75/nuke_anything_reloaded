document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('hiddenList');
    const emptyState = document.getElementById('emptyState');
    const unhideAllBtn = document.getElementById('unhideAll');

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) {
        showEmptyState();
        return;
    }

    // Localize static content
    document.title = chrome.i18n.getMessage("popup_title");
    document.getElementById('popupTitle').textContent = chrome.i18n.getMessage("popup_title");
    document.getElementById('unhideAll').textContent = chrome.i18n.getMessage("popup_unhide_all");
    document.getElementById('emptyState').textContent = chrome.i18n.getMessage("popup_empty_state");

    // Request hidden elements list
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: "getHiddenElements" });
        renderList(response);
    } catch (e) {
        // Content script might not be injected (e.g., restriction page)
        console.error("Could not fetch hidden elements:", e);
        showEmptyState();
    }

    // Unhide All handler
    unhideAllBtn.addEventListener('click', async () => {
        try {
            await chrome.tabs.sendMessage(tab.id, { action: "unhideAll" });
            renderList([]); // Clear list manually after success
        } catch (e) {
            console.error("Failed to unhide all:", e);
        }
    });

    function renderList(items) {
        listContainer.innerHTML = '';

        if (!items || items.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        items.forEach(item => {
            const listEl = document.createElement('div');
            listEl.className = 'list-item';

            const labelEl = document.createElement('span');
            labelEl.className = 'item-label';
            labelEl.textContent = item.label || chrome.i18n.getMessage("popup_unknown_element");
            labelEl.title = item.label; // Tooltip for full text

            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'restore-btn secondary-btn';
            restoreBtn.textContent = chrome.i18n.getMessage("popup_unhide");
            restoreBtn.onclick = async () => {
                try {
                    await chrome.tabs.sendMessage(tab.id, { action: "unhideElement", id: item.id });
                    // Remove from UI
                    listEl.remove();
                    // Check if empty
                    if (listContainer.children.length === 0) {
                        showEmptyState();
                    }
                } catch (e) {
                    console.error("Failed to unhide element:", e);
                }
            };

            listEl.appendChild(labelEl);
            listEl.appendChild(restoreBtn);
            listContainer.appendChild(listEl);
        });
    }

    function showEmptyState() {
        emptyState.classList.remove('hidden');
        listContainer.classList.add('hidden');
        unhideAllBtn.disabled = true;
        unhideAllBtn.style.opacity = '0.5';
    }

    function hideEmptyState() {
        emptyState.classList.add('hidden');
        listContainer.classList.remove('hidden');
        unhideAllBtn.disabled = false;
        unhideAllBtn.style.opacity = '1';
    }
});
