var clickedElementZE = null;
var zapStash = [];

document.addEventListener("mousedown", function (event) {
    // only right click
    if (event.button === 2) {
        clickedElementZE = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "zapEm") {
        zapStash.push(clickedElementZE);
        clickedElementZE.style.display = "none";
    } else if (request === "unzapEm") {
        var unzapElement = zapStash.pop();
        if (typeof unzapElement !== 'undefined') {
            unzapElement.style.display = "";
        }
    }
});

console.log("content script active");