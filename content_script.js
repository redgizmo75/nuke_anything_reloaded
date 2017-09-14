var clickedElementNAR = null;
var zapStash = [];

document.addEventListener("mousedown", function (event) {
    // only right click
    if (event.button === 2) {
        clickedElementNAR = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "nukeThisObject") {
        zapStash.push(clickedElementNAR);
        clickedElementNAR.style.display = "none";
    } else if (request === "unnukeObject") {
        var unnukeElement = zapStash.pop();
        if (typeof unnukeElement !== 'undefined') {
            unnukeElement.style.display = "";
        }
    }
});
