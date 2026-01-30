# Project Summary: Nuke Anything Reloaded

## Overview
**Nuke Anything Reloaded** is a Chrome Extension that allows users to temporarily hide any DOM element on a webpage via the context menu. It is inspired by the "Nuke Anything" functionality from other browser add-ons.

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
    - Creates the Context Menu items ("Nuke it", "Unnuke last").
    - Listens for context menu clicks (`chrome.contextMenus.onClicked`).
    - Sends messages to the active tab to trigger actions.

3.  **Content Script (`content_script.js`)**:
    - Runs in the context of the web page.
    - **Target Capture**: Listens for `mousedown` (right-click) to track the element under the cursor (`clickedElementNAR`).
    - **Message Handling**: Listens for messages from the Service Worker:
        - `nukeThisObject`: Hides the captured element (`display: none`) and pushes it to a stack (`nukeStash`).
        - `unnukeObject`: Pops the last element from the stack and restores its original display style.

### Data Flow
1.  **User Interaction**: User right-clicks an element on a webpage.
2.  **Capture**: `content_script.js` temporarily saves the reference to this element.
3.  **Action**: User selects "Nuke it" from the Chrome Context Menu.
4.  **Signal**: `background.js` receives the menu click event and sends a `nukeThisObject` message to the active tab.
5.  **Execution**: `content_script.js` receives the message, modifies the DOM style of the captured element, and saves the state for potential reversal.

## Current State
- **Manifest Version**: 3 (Migrated from V2).
- **Language**: Modern JavaScript (ES6+).
- **Tooling**:
    - NPM project initialized.
    - `@fission-ai/openspec` installed for AI-driven development.
    - No build step required (native JS).

## Roadmap & Potential Improvements
These items are candidates for future OpenSpec tasks:
1.  **Visual Feedback**: Highlight the element under the cursor when the context menu is open (pending API limitations) or on hover before nuking.
2.  **Persistence**: Save "nuked" selectors for specific domains so they remain hidden after reload.
3.  **UI/Popup**: A popup interface to view and manage hidden elements on the current page.
4.  **Testing**: Implement E2E tests with Puppeteer to verify functionality automatically.
5.  **Keyboard Shortcuts**: Add hotkeys for quick nuking.
