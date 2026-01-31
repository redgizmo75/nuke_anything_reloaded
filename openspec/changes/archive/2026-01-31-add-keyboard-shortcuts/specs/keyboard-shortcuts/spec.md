## ADDED Requirements

### Requirement: Nuke Element via Keyboard
The system SHALL allow users to hide the element under the mouse cursor using a keyboard shortcut.

#### Scenario: Nuking hovered element
- **WHEN** user hovers over an element on a webpage
- **AND** user presses `Alt+Shift+X`
- **THEN** the element is hidden (`display: none`)
- **AND** the element is added to the nuke stash

#### Scenario: Nuking without hover
- **WHEN** user is not hovering over any specific element (e.g. mouse off page)
- **AND** user presses `Alt+Shift+X`
- **THEN** no element is hidden

### Requirement: Unnuke Element via Keyboard
The system SHALL allow users to restore the most recently nuked element using a keyboard shortcut.

#### Scenario: Unnuking last element
- **WHEN** valid elements are in the nuke stash
- **AND** user presses `Alt+Shift+Z`
- **THEN** the last nuked element is restored to its original display style
- **AND** the element is removed from the stash
