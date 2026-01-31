## Why
Users currently have to right-click and select a context menu item to Nuke or Unnuke elements. This is slow. Adding keyboard shortcuts will allow power users to rapidly clean up web pages without breaking flow.

## What Changes
- **Manifest**: Add `commands` key to `manifest.json` defining defaults (`Alt+Shift+X` for Nuke, `Alt+Shift+Z` for Unnuke).
- **Background Script**: Listen for `chrome.commands.onCommand` and send messages to the active tab.
- **Content Script**: 
    - Track the element currently under the mouse cursor (`mouseover`) so the "Nuke" hotkey knows what to target.
    - Handle `nuke` and `unnuke` messages triggered by hotkeys.

## Capabilities

### New Capabilities
- `keyboard-shortcuts`: Defines the shortcuts and their default bindings.

### Modified Capabilities
<!-- No existing functional capabilities are changing requirements, but we are extending logic. core-nuking logic modification is an implementation detail unless we formalized it as a spec. Since no 'core-nuking' spec exists in specs/ (only e2e-testing), we treat this as implementation detail or new spec. -->
