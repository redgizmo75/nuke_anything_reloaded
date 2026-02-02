let clickedElementZap = null;
let hoveredElementZap = null;
let isZapMode = false;

// Inject Styles for Visual Feedback
const style = document.createElement('style');
style.textContent = `
    .zap-highlight {
        outline: 2px dashed red !important;
        outline-offset: -2px;
        cursor: crosshair !important;
    }
    .zap-mode-active {
        cursor: crosshair !important;
    }
`;
document.head.appendChild(style);


// Stash for hidden elements: Map<string, {element: HTMLElement, originalDisplay: string, timestamp: number, label: string}>
// Using a Map to preserve insertion order for LIFO unzap, while allowing random access by ID.
const zapStash = new Map();

/**
 * Generate a unique ID for hidden elements
 */
function generateId() {
    return 'zap-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * Generate a label for the hidden element
 */
function generateLabel(element) {
    if (element.id) return '#' + element.id;
    if (element.innerText && element.innerText.trim().length > 0) {
        return element.innerText.trim().substring(0, 30) + (element.innerText.trim().length > 30 ? '...' : '');
    }
    let label = element.tagName.toLowerCase();
    if (element.className) {
        label += '.' + element.className.split(' ').join('.');
    }
    return label;
}


/**
 * Mousedown listener, save the DOM object under the mouse click to be able to use it later.
 */
document.addEventListener("mousedown", function (event) {
    // only right click
    if (event.button === 2) {
        clickedElementZap = event.target;
    }
}, true);

/**
 * Mouseover listener, track the element under the cursor for keyboard shortcuts.
 */
document.addEventListener("mouseover", function (event) {
    if (hoveredElementZap && isZapMode) {
        hoveredElementZap.classList.remove("zap-highlight");
    }
    hoveredElementZap = event.target;
    if (isZapMode && hoveredElementZap) {
        hoveredElementZap.classList.add("zap-highlight");
    }
}, true);

/**
 * Handle Alt+Shift State for Zap Mode
 */
function updateZapMode(event) {
    if (event.altKey && event.shiftKey) {
        if (!isZapMode) {
            isZapMode = true;
            document.body.classList.add("zap-mode-active");
            if (hoveredElementZap) {
                hoveredElementZap.classList.add("zap-highlight");
            }
        }
    } else {
        if (isZapMode) {
            isZapMode = false;
            document.body.classList.remove("zap-mode-active");
            if (hoveredElementZap) {
                hoveredElementZap.classList.remove("zap-highlight");
            }
            // Cleanup any other potential artifacts
            document.querySelectorAll(".zap-highlight").forEach(el => el.classList.remove("zap-highlight"));
        }
    }
}

document.addEventListener("keydown", updateZapMode, true);
document.addEventListener("keyup", updateZapMode, true);


/**
 * Message listener. Takes messages from background.js and removes the object clicked or restores the top object from
 * the nuke stash.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "zapObject") {
        if (clickedElementZap) {
            const id = generateId();
            zapStash.set(id, {
                "element": clickedElementZap,
                "displayStyle": clickedElementZap.style.display,
                "timestamp": Date.now(),
                "label": generateLabel(clickedElementZap)
            });
            clickedElementZap.style.display = "none";
        }
    } else if (request === "zapHovered") {
        if (hoveredElementZap) {
            hoveredElementZap.classList.remove("zap-highlight"); // Remove highlight before hiding
            const id = generateId();
            zapStash.set(id, {
                "element": hoveredElementZap,
                "displayStyle": hoveredElementZap.style.display,
                "timestamp": Date.now(),
                "label": generateLabel(hoveredElementZap)
            });
            hoveredElementZap.style.display = "none";
        }
    } else if (request === "unzapObject") {
        // LIFO behavior: get the last inserted element
        if (zapStash.size > 0) {
            const lastEntry = Array.from(zapStash.entries()).pop();
            const [id, data] = lastEntry;
            data.element.style.display = data.displayStyle;
            zapStash.delete(id);
        }

    } else if (request.action === "getHiddenElements") {
        // Return list of hidden elements summaries
        const list = [];
        // Map iterates in insertion order, so we reverse it to show newest first in UI if desired
        // Or keep insertion order. Let's send them in order; UI can decide.
        // Actually, zapStash is a Map.
        for (const [id, data] of zapStash.entries()) {
            list.push({
                id: id,
                label: data.label,
                timestamp: data.timestamp
            });
        }
        sendResponse(list.reverse()); // Reverse to show LIFO nature (newest hidden on top)
    } else if (request.action === "unhideElement") {
        const id = request.id;
        if (zapStash.has(id)) {
            const data = zapStash.get(id);
            data.element.style.display = data.displayStyle;
            zapStash.delete(id);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: 'Element not found' });
        }
    } else if (request.action === "unhideAll") {
        for (const [id, data] of zapStash.entries()) {
            data.element.style.display = data.displayStyle;
        }
        zapStash.clear();
        sendResponse({ success: true });
    }
});


