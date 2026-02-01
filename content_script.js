let clickedElementNAR = null;
let hoveredElementNAR = null;
let isNukeMode = false;

// Inject Styles for Visual Feedback
const style = document.createElement('style');
style.textContent = `
    .nuke-highlight {
        outline: 2px dashed red !important;
        outline-offset: -2px;
        cursor: crosshair !important;
    }
    .nuke-mode-active {
        cursor: crosshair !important;
    }
`;
document.head.appendChild(style);


// Stash for hidden elements: Map<string, {element: HTMLElement, originalDisplay: string, timestamp: number, label: string}>
// Using a Map to preserve insertion order for LIFO unnuke, while allowing random access by ID.
const nukeStash = new Map();

/**
 * Generate a unique ID for hidden elements
 */
function generateId() {
    return 'nuke-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
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
        clickedElementNAR = event.target;
    }
}, true);

/**
 * Mouseover listener, track the element under the cursor for keyboard shortcuts.
 */
document.addEventListener("mouseover", function (event) {
    if (hoveredElementNAR && isNukeMode) {
        hoveredElementNAR.classList.remove("nuke-highlight");
    }
    hoveredElementNAR = event.target;
    if (isNukeMode && hoveredElementNAR) {
        hoveredElementNAR.classList.add("nuke-highlight");
    }
}, true);

/**
 * Handle Alt+Shift State for Nuke Mode
 */
function updateNukeMode(event) {
    if (event.altKey && event.shiftKey) {
        if (!isNukeMode) {
            isNukeMode = true;
            document.body.classList.add("nuke-mode-active");
            if (hoveredElementNAR) {
                hoveredElementNAR.classList.add("nuke-highlight");
            }
        }
    } else {
        if (isNukeMode) {
            isNukeMode = false;
            document.body.classList.remove("nuke-mode-active");
            if (hoveredElementNAR) {
                hoveredElementNAR.classList.remove("nuke-highlight");
            }
            // Cleanup any other potential artifacts
            document.querySelectorAll(".nuke-highlight").forEach(el => el.classList.remove("nuke-highlight"));
        }
    }
}

document.addEventListener("keydown", updateNukeMode, true);
document.addEventListener("keyup", updateNukeMode, true);


/**
 * Message listener. Takes messages from background.js and removes the object clicked or restores the top object from
 * the nuke stash.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "nukeThisObject") {
        if (clickedElementNAR) {
            const id = generateId();
            nukeStash.set(id, {
                "element": clickedElementNAR,
                "displayStyle": clickedElementNAR.style.display,
                "timestamp": Date.now(),
                "label": generateLabel(clickedElementNAR)
            });
            clickedElementNAR.style.display = "none";
        }
    } else if (request === "nukeHovered") {
        if (hoveredElementNAR) {
            hoveredElementNAR.classList.remove("nuke-highlight"); // Remove highlight before hiding
            const id = generateId();
            nukeStash.set(id, {
                "element": hoveredElementNAR,
                "displayStyle": hoveredElementNAR.style.display,
                "timestamp": Date.now(),
                "label": generateLabel(hoveredElementNAR)
            });
            hoveredElementNAR.style.display = "none";
        }
    } else if (request === "unnukeObject") {
        // LIFO behavior: get the last inserted element
        if (nukeStash.size > 0) {
            const lastEntry = Array.from(nukeStash.entries()).pop();
            const [id, data] = lastEntry;
            data.element.style.display = data.displayStyle;
            nukeStash.delete(id);
        }

    } else if (request.action === "getHiddenElements") {
        // Return list of hidden elements summaries
        const list = [];
        // Map iterates in insertion order, so we reverse it to show newest first in UI if desired
        // Or keep insertion order. Let's send them in order; UI can decide.
        // Actually, nukeStash is a Map.
        for (const [id, data] of nukeStash.entries()) {
            list.push({
                id: id,
                label: data.label,
                timestamp: data.timestamp
            });
        }
        sendResponse(list.reverse()); // Reverse to show LIFO nature (newest hidden on top)
    } else if (request.action === "unhideElement") {
        const id = request.id;
        if (nukeStash.has(id)) {
            const data = nukeStash.get(id);
            data.element.style.display = data.displayStyle;
            nukeStash.delete(id);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: 'Element not found' });
        }
    } else if (request.action === "unhideAll") {
        for (const [id, data] of nukeStash.entries()) {
            data.element.style.display = data.displayStyle;
        }
        nukeStash.clear();
        sendResponse({ success: true });
    }
});


