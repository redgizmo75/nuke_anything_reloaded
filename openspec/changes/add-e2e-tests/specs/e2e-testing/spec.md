## ADDED Requirements

### Requirement: Test Environment Setup
The system SHALL provide an automated test environment using Playwright that loads the extension into a chromium browser context.

#### Scenario: Launch with Extension
- **WHEN** the test suite is executed
- **THEN** a chromium browser instance launches
- **AND** the "Nuke Anything Reloaded" extension is installed and active
- **AND** the extension background service worker is running

### Requirement: Nuke Element
The system SHALL allow users to hide an element on the page via the context menu.

#### Scenario: Nuke an Element
- **WHEN** a user right-clicks on a visible DOM element on a test page
- **AND** selects "Nuke it" from the context menu
- **THEN** the target element becomes hidden (display: none)
- **AND** the element remains in the DOM but is not visible

### Requirement: Unnuke Element
The system SHALL allow users to restore the most recently hidden element.

#### Scenario: Unnuke last hidden element
- **WHEN** a user has hidden one or more elements using "Nuke it"
- **AND** the user right-clicks anywhere on the page
- **AND** selects "Unnuke last" from the context menu
- **THEN** the most recently hidden element becomes visible again (restores original display style)
