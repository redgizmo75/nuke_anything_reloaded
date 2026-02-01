## ADDED Requirements

### Requirement: List Hidden Elements
The system SHALL display a list of all currently hidden elements for the active tab in the extension popup.

#### Scenario: View hidden elements
- **WHEN** user clicks the extension icon
- **THEN** a popup opens displaying a list of elements previously hidden on the current page
- **AND** if no elements are hidden, an empty state message is shown

### Requirement: Identify Elements
The system SHALL provide identifying information for each hidden element in the list to help the user distinguish them.

#### Scenario: Element with ID
- **WHEN** a hidden element has an ID attribute
- **THEN** the list item displays the ID (e.g., `#header-main`)

#### Scenario: Element with text content
- **WHEN** a hidden element has no ID but has text content
- **THEN** the list item displays a truncated preview of the text

#### Scenario: Element with classes only
- **WHEN** a hidden element has no ID or meaningful text
- **THEN** the list item displays the tag name and classes (e.g., `div.container.wrapper`)

### Requirement: Unhide Single Element
The system SHALL allow the user to restore a specific hidden element to its original visibility state.

#### Scenario: Restore specific element
- **WHEN** user clicks the "Unhide" or "Restore" button next to a list item
- **THEN** the corresponding element reappears on the web page
- **AND** the item is removed from the popup list
- **AND** other hidden elements remain hidden

### Requirement: Unhide All Elements
The system SHALL allow the user to restore all hidden elements on the page at once.

#### Scenario: Restore all
- **WHEN** user clicks the "Unhide All" button
- **THEN** all hidden elements on the page reappear
- **AND** the popup list becomes empty
