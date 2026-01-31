# Capability: Visual Feedback (visual-feedback)

Provides visual indicators to help users identify the target of their actions, improving confidence and reducing errors.

## Requirements

### Requirement: Nuke Mode Activation
The system SHALL activate "Nuke Mode" when the user holds both Alt and Shift keys.

#### Scenario: Enterning Nuke Mode
- **WHEN** user presses `Alt` and `Shift` simultaneously
- **THEN** the persisted body class `nuke-mode-active` is added
- **AND** the mouse cursor changes to a crosshair

#### Scenario: Exiting Nuke Mode
- **WHEN** user releases either `Alt` or `Shift`
- **THEN** the body class `nuke-mode-active` is removed
- **AND** the mouse cursor returns to default

### Requirement: Visual Highlighting
The system SHALL highlight the element under the cursor when Nuke Mode is active.

#### Scenario: Highlight on Hover
- **WHEN** Nuke Mode is active
- **AND** user hovers over an element
- **THEN** the element receives the `.nuke-highlight` class (red dashed outline)

#### Scenario: No Highlight without Mode
- **WHEN** Nuke Mode is NOT active
- **AND** user hovers over an element
- **THEN** the element is NOT highlighted

#### Scenario: Cleanup on Mode Exit
- **WHEN** user exits Nuke Mode
- **THEN** any existing `.nuke-highlight` class is removed from all elements
