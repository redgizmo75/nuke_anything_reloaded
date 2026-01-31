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

const nukeStash = [];

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
            nukeStash.push({
                "element": clickedElementNAR,
                "displayStyle": clickedElementNAR.style.display
            });
            clickedElementNAR.style.display = "none";
        }
    } else if (request === "nukeHovered") {
        if (hoveredElementNAR) {
            hoveredElementNAR.classList.remove("nuke-highlight"); // Remove highlight before hiding
            nukeStash.push({
                "element": hoveredElementNAR,
                "displayStyle": hoveredElementNAR.style.display
            });
            hoveredElementNAR.style.display = "none";
        }
    } else if (request === "unnukeObject") {
        const unnukeElement = nukeStash.pop();
        if (typeof unnukeElement !== 'undefined') {
            unnukeElement.element.style.display = unnukeElement.displayStyle;
        }
    }
});
