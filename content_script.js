let clickedElementNAR = null;
let hoveredElementNAR = null;
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
    hoveredElementNAR = event.target;
}, true);

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
