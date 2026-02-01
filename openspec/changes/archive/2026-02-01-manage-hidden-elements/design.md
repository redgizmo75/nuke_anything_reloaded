## Context

The extension currently allows hiding elements using `display: none` via a context menu or shortcut. These elements are pushed onto a `nukeStash` stack array. Restoration is strictly LIFO (Last-In-First-Out) via "Unnuke". There is no UI to see what is hidden or restore items out of order.

## Goals / Non-Goals

**Goals:**
- Provide a popup UI that lists all hidden elements for the active tab.
- Allow identifying hidden elements via ID, text preview, or tag/classes.
- Enable restoring specific elements (random access) and all elements.
- Persist hidden state per tab (in-memory variable in content script is sufficient for V1).

**Non-Goals:**
- Persistent storage across page reloads (out of scope for now, current behavior is ephemeral).
- Complex filtering or sorting of the hidden list.
- Hiding elements permanently via CSS rules.

## Decisions

### 1. Refactor `nukeStash` to Map/Object with unique IDs
**Decision:** Change `nukeStash` from a simple array stack to a structure that supports random access removal.
**Rationale:** To "unhide" a specific element from the middle of the list, we need to identify it.
**Implementation:**
- Assign a unique internal ID (e.g., timestamp + random) to each hidden entry.
- Store as an array of objects: `{ id, element, originalDisplay, timestamp }`.
- "Unnuke" (LIFO) remains possible by popping the last index.
- "Restore specific" removes by ID.

### 2. Messaging Architecture
**Decision:** Use `chrome.runtime` messaging for popup-content script communication.
**Rationale:** The popup needs to query the content script for the list of hidden items and send commands to restore them.
**Protocol:**
- Popup opens -> sends `getHiddenElements`.
- Content script -> responds with list of summaries (ID, label, type). *Note: Cannot send DOM elements directly.*
- Popup 'Unhide' click -> sends `unhideElement { id }`.
- Popup 'Unhide All' click -> sends `unhideAll`.

### 3. Element Identification in UI
**Decision:** Generate a "label" for each element at hide time.
**Rationale:** Users need to know what they are unhiding.
**Logic:**
- If `id` exists -> `#id`
- Else if `innerText` (truncated) -> `"Text content..."`
- Else -> `tagName.class`

## Risks / Trade-offs

- **Risk**: Stale references if page changes (e.g., SPA navigation).
  - **Mitigation**: The content script runs per page context. If the DOM node is removed by the page's own JS, the reference in our stash might become detached. We should check if `element.isConnected` before attempting to restore, or try to restore anyway (no-op if detached).
- **Trade-off**: Highlighting hidden elements.
  - We are not implementing a "highlight on hover in popup" feature yet to keep V1 simple, though it would be good UX.

## Open Questions
- None.
