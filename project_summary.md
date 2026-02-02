# Project Summary: ZapIt

## Overview
**ZapIt** is a Chrome Extension that allows users to temporarily hide any DOM element on a webpage via the context menu.

## Architecture
The project is built as a **Manifest V3** Chrome Extension using vanilla JavaScript.

### Core Components
1.  **Manifest (`manifest.json`)**:
    - Defines the extension configuration.
    - Permissions: `contextMenus`.
    - Host Permissions: `*://*/*`, `file:///*/*` (runs on all pages).
    - Background: Service Worker (`background.js`).
    - Content Scripts: `content_script.js` (injected into all frames).

2.  **Service Worker (`background.js`)**:
    - Handles the extension lifecycle (installation).
    - Creates the Context Menu items ("Zap this object", "Undo last zap").
    - Listens for context menu clicks (`chrome.contextMenus.onClicked`).
    - Sends messages to the active tab to trigger actions.

3.  **Content Script (`content_script.js`)**:
    - Runs in the context of the web page.
    - **Target Capture**: Listens for `mousedown` (right-click) to track the element under the cursor (`clickedElementZap`).
    - **Message Handling**: Listens for messages from the Service Worker:
        - `zapObject`: Hides the captured element (`display: none`) and pushes it to a stack (`zapStash`).
        - `unzapObject`: Pops the last element from the stack and restores its original display style.

### Data Flow
1.  **User Interaction**: User right-clicks an element on a webpage.
2.  **Capture**: `content_script.js` temporarily saves the reference to this element.
3.  **Action**: User selects "Zap this object" from the Chrome Context Menu.
4.  **Signal**: `background.js` receives the menu click event and sends a `zapObject` message to the active tab.
5.  **Execution**: `content_script.js` receives the message, modifies the DOM style of the captured element, and saves the state for potential reversal.

## Current State
- **Manifest Version**: 3
- **Language**: Modern JavaScript (ES6+).
- **Tooling**:
    - NPM project initialized.
    - No build step required (native JS).
