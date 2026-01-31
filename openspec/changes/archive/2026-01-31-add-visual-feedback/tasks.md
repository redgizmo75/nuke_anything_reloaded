## 1. Style Config

- [x] 1.1 Add `.nuke-mode-active` (cursor: crosshair) and `.nuke-highlight` (outline: red) logic to content script or separate CSS file.
- [x] 1.2 Ensure styles are injected into the page/shadow DOMs correctly.

## 2. Content Script Logic
- [x] 2.1 Implement `keydown`/`keyup` listeners to track `Alt+Shift` state.
- [x] 2.2 Manage global body class `.nuke-mode-active` toggle.
- [x] 2.3 Update `mouseover` handler to apply `.nuke-highlight` if mode is active.
- [x] 2.4 Handle `mouseout` to clean up highlight.
- [x] 2.5 Ensure cleanup (remove all classes) when keys are released.

## 3. Testing & Verification
- [x] 3.1 Verify `Alt+Shift` toggles crosshair cursor.
- [x] 3.2 Verify hovering elements while `Alt+Shift` is held shows red outline.
- [x] 3.3 Verify releasing keys removes all visual artifacts immediately.
- [x] 3.4 Verify normal browsing (no keys held) has no visual side effects.
