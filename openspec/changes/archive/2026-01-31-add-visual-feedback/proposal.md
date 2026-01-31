## Why
When using keyboard shortcuts or the context menu to nuke an element, it is not always obvious which element is currently targeted (especially with nested elements). Visual feedback gives the user confidence in what they are about to remove.

## What Changes
- **Content Script**:
    - Inject a CSS style for highlighting (e.g., `outline: 2px dashed red`).
    - Apply this style to `hoveredElementNAR` on `mouseover`.
    - Remove this style on `mouseout`.
    - (Optionally) Restrict highlighting to when a modifier key (like Alt) is held to prevent browsing distraction.

## Capabilities

### New Capabilities
- `visual-feedback`: Defines the highlighting behavior and styling.

### Modified Capabilities
- `core-nuking`: (Implied) The content script logic for tracking `hoveredElementNAR` is extended to handle class manipulation, but requirements for nuking stay the same.
