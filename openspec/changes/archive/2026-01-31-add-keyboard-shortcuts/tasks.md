## 1. Manifest Configuration

- [x] 1.1 Add `commands` section to `manifest.json` with `nuke` (Alt+Shift+X) and `unnuke` (Alt+Shift+Z) defaults.
- [x] 1.2 Verify manifest loads correctly in Chrome (manual or automated check).

## 2. Background Script Implementation

- [x] 2.1 Implement `chrome.commands.onCommand` listener in `background.js`.
- [x] 2.2 Wire up `nuke` command to send `nukeHovered` message to active tab.
- [x] 2.3 Wire up `unnuke` command to send `unnukeObject` message to active tab.

## 3. Content Script Implementation

- [x] 3.1 Implement `mouseover` listener to track `hoveredElementNAR`.
- [x] 3.2 Implement handler for `nukeHovered` message (hide `hoveredElementNAR` and push to stash).
- [x] 3.3 Verify `unnukeObject` handler works with globally triggered messages (existing logic should suffice but needs verification).

## 4. Testing & Verification

- [x] 4.1 Update `tests/e2e.spec.js` to include keyboard shortcut tests.
- [x] 4.2 Test: Hover element -> Press Alt+Shift+X -> Verify hidden.
- [x] 4.3 Test: Press Alt+Shift+Z -> Verify restored.
- [x] 4.4 Run full test suite to ensure no regressions.
