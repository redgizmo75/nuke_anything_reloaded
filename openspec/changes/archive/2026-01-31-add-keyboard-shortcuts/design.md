## Context
The current extension relies entirely on the Context Menu API. This requires two clicks (Right Click -> Select Item) to nuke an item. Users want a faster method. We have `content_script.js` which already holds the logic for nuking/unnuking, but it depends on `mousedown` to identify the target. To support keyboard shortcuts, we need to track the element under the mouse cursor *without* a click.

## Goals / Non-Goals
**Goals:**
- Enable "Nuke" via `Alt+Shift+X` (configurable in Chrome shortcuts).
- Enable "Unnuke" via `Alt+Shift+Z`.
- "Nuke" should target the element currently under the mouse cursor.
- "Unnuke" should undo the last nuke operation (pop from stack).

**Non-Goals:**
- Visual highlighting of the element before nuking (that is a separate roadmap item).
- Per-domain persistence.
- Complex multi-frame stack management (global undo history). valid for V1 is per-frame undo.

## Decisions

### 1. Element Targeting
**Decision**: Use `mouseover` event listener in `content_script.js` to track `hoveredElementNAR`.
**Rationale**: Keyboard events (commands) are global or handled by the focused element. Since web pages have many focusable elements, we cannot rely on `document.activeElement`. Users intuit "Nuke this" as "Nuke what I'm pointing at". The `mouseover` event is the standard way to track the hover target.

### 2. Messaging Strategy
**Decision**: Add a new message type `nukeHovered` (or reuse logic with a flag).
**Detail**: 
- `background.js` listens to `nuke` command -> sends `nukeHovered` to active tab.
- `content_script.js` listens to `nukeHovered` -> Hides `hoveredElementNAR` and pushes to `nukeStash`.
- `background.js` listens to `unnuke` command -> sends `unnukeObject` (existing message).
- `content_script.js` handles `unnukeObject` -> Pops from `nukeStash` (existing logic).

### 3. Default Shortcuts
**Decision**: `Alt+Shift+X` and `Alt+Shift+Z`.
**Rationale**: `Alt+Shift` modifiers are generally safe from colliding with browser built-ins (like `Ctrl+Shift+Z` for Redo) or common OS shortcuts. `X` implies "exclude/delete", `Z` implies "undo".

## Risks / Trade-offs
- **Risk**: "Unnuke" command sends message to ALL frames in the active tab.
- **Trade-off**: If the user has nuked items in multiple frames (e.g. main page and an ad iframe), hitting "Unnuke" might restore items in BOTH frames simultaneously if they both receive the message.
- **Mitigation**: Acceptable for V1. Most users nuke sequential items. True global history would require moving the `nukeStash` to `background.js` or `storage`, which complicates the logic significantly (serialization of DOM elements is impossible, would need selectors). Keeping state in `content_script` is simpler and more robust for restoration.

