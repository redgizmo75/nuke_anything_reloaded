## 1. Core Logic Refactoring

- [x] 1.1 Update `content_script.js`: Replace `nukeStash` array with a Map or Object-based structure to store hidden elements with unique IDs.
- [x] 1.2 Update `content_script.js`: Modify "nuke" logic to generate a unique ID and label for each hidden element.
- [x] 1.3 Update `content_script.js`: Implement `nukeThisObject` and `nukeHovered` to use the new storage structure.
- [x] 1.4 Update `content_script.js`: Maintain LIFO "unnuke" behavior by tracking insertion order or using timestamp.

## 2. Messaging Implementation

- [x] 2.1 Update `content_script.js`: Add listener for `getHiddenElements`. Respond with array of `{id, label, type}`.
- [x] 2.2 Update `content_script.js`: Add listener for `unhideElement`. Retrieve element by ID, restore display style, and remove from stash.
- [x] 2.3 Update `content_script.js`: Add listener for `unhideAll`. Iterate through stash, restore all, and clear stash.

## 3. Popup UI Implementation

- [x] 3.1 Update `manifest.json`: Add `"action": { "default_popup": "popup.html" }`.
- [x] 3.2 Create `popup.html`: Basic structure with a list container and "Unhide All" button.
- [x] 3.3 Create `popup.css`: Styling for the list items, buttons, and empty state.
- [x] 3.4 Create `popup.js`: Implement initialization logic (request hidden elements).
- [x] 3.5 Update `popup.js`: Render list of hidden elements with labels and "Unhide" buttons.
- [x] 3.6 Update `popup.js`: Implement click handlers for "Unhide" (single) and "Unhide All", sending messages to active tab.
- [x] 3.7 Update `popup.js`: Handle empty state (show message when no elements hidden).

## 4. Verification

- [x] 4.1 Manual Verification: Test hiding elements via context menu and shortcut, then verifying they appear in popup.
- [x] 4.2 Manual Verification: Test unhiding specific element from popup.
- [x] 4.3 Manual Verification: Test unhiding all elements from popup.
- [x] 4.4 Manual Verification: Test legacy "Unnuke" (Alt+Shift+Z) still works LIFO.
- [x] 4.4 Manual Verification: Test legacy "Unnuke" (Alt+Shift+Z) still works LIFO.

## 5. Internationalization

- [x] 5.1 Update `_locales/en/messages.json`: Add keys for popup title, buttons, and messages.
- [x] 5.2 Update `_locales/de/messages.json`: Add German translations for popup keys.
- [x] 5.3 Update `popup.html`: Use `__MSG_key__` for static text.
- [x] 5.4 Update `popup.js`: Use `chrome.i18n.getMessage` for dynamic text.

## 6. Documentation

- [x] 6.1 Update `README.md`: Add "Usage" section describing context menu, shortcuts, and popup.
