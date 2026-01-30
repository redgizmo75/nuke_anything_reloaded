let clickedElementNAR = null;
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
 * Message listener. Takes messages from background.js and removes the object clicked or restores the top object from
 * the nuke stash.
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "nukeThisObject") {
        nukeStash.push({
            "element": clickedElementNAR,
            "displayStyle": clickedElementNAR.style.display
        });
        clickedElementNAR.style.display = "none";
    } else if (request === "unnukeObject") {
        const unnukeElement = nukeStash.pop();
        if (typeof unnukeElement !== 'undefined') {
            unnukeElement.element.style.display = unnukeElement.displayStyle;
        }
    }
});
