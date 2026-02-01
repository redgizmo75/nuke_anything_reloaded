## Why

Users currently lack visibility into which elements are hidden and cannot unhide specific elements without iteratively undoing their actions or refreshing the page. A popup interface to view and manage hidden elements will provide necessary control and transparency.

## What Changes

- [NEW] **Popup UI**: An extension popup listing all hidden elements on the current tab.
- [NEW] **Element Identification**: Logic to identifying hidden elements in the list (e.g., by tag name, ID, class, or text preview).
- [NEW] **Unhide Controls**: 'Unhide' button for individual items and 'Unhide All' for the page.
- [MODIFY] **Storage Logic**: Refactor `nukeStash` (stack) to support random-access removal/restoration to enable unhiding specific items.
- [NEW] **Messaging**: Communication between Popup and Content Script to sync hidden element state.
- [MODIFY] **Manifest**: Add `action` (or `browser_action`) with `default_popup`.

## Capabilities

### New Capabilities
- `hidden-element-management`: Provides a UI to list, identify, and restore hidden elements on the active tab.

### Modified Capabilities
<!-- No existing spec files found for element hiding, so no modified capabilities listed. The changes to hiding logic are implementation details dealing with the new capability's requirements. -->
