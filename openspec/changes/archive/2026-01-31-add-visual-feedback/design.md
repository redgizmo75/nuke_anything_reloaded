## Context
Users need to know which element they are about to nuke. Highlighting every element on hover during normal browsing is intrusive. We need a way to show feedback only when the user is "active" in nuking.

## Goals / Non-Goals
**Goals:**
- Highlight the element under the cursor with a red outline.
- Only show the highlight when the user is holding the `Alt` key (part of the Nuke shortcut `Alt+Shift+X`).
- Ensure the highlight is removed immediately when the key is released or mouse moves away.

**Non-Goals:**
- Persistent highlighting options (always on).
- Customizing the highlight color (hardcoded red for V1).

## Decisions

### 1. Trigger Mechanism
**Decision**: Use `keydown` and `keyup` to track if BOTH `Alt` and `Shift` are held.
**Rationale**: The shortcuts are `Alt+Shift+X/Z`. Highlighting should active when the user is "preparing" to nuke. `Alt` alone is too common. `Alt+Shift` is a deliberate action aligning with the shortcut.

### 2. Implementation Logic
- **CSS**: 
    - Inject `.nuke-highlight` (`outline: 2px dashed red !important;`).
    - Inject global body class `.nuke-mode-active` (`cursor: crosshair !important;`).
- **State**: Track `isNukeMode` (true only when Alt AND Shift are held).
- **Events**:
    - `keydown`: Check `event.altKey && event.shiftKey`. If true -> Enable Mode.
    - `keyup`: If either key released -> Disable Mode.
    - `mouseover`: Update `hoveredElementNAR`. If `isNukeMode`, add highlight class.
    - `mouseout`: Remove highlight class.

## Risks / Trade-offs
- **Risk**: `Alt+Shift` switches keyboard layouts on Windows.
- **Mitigation**: This is a default OS behavior. Users of such shortcuts are used to it, or have disabled it. The visual feedback (cursor/outline) actually helps them know if they are in the "extension mode" vs "OS mode".
