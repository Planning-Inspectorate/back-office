Feature: As a Validation Officer validating an appeal
  I want to provide the reason(s) why the appeal is invalid
  So that the reason(s) can be provided to the appellant

  Scenario: Navigate to the 'Invalid appeal details Page' from the 'Review appeal submission' page
    Given the validation Officer has selected outcome as 'Invalid' on the Review appeal submission page
    When a Validation Officer selects ‘Continue’
    Then the ‘Invalid appeal details’ Page will be displayed showing the appeal reference 'APP/Q9999/D/21/1234567'

  Scenario: Error when a ‘Reason’ has not been selected
    Given the Validation Officer has not selected a reason on the ‘Invalid appeal details’ Page
    When the Validation Officer selects ‘Continue’
    Then error message 'Select why the appeal is invalid' will be displayed

  Scenario: Error when a Other was selected as the ‘Invalid reason’ but text has not been provided
    Given the Validation Officer selects ‘Other’ as the invalid reason but has not provided any text
    When the Validation Officer selects ‘Continue’
    Then error message 'Enter why the appeal is invalid' will be displayed

  Scenario: Other selected as reason
    Given the Validation Officer is on the ‘Invalid appeal details' Page
    When the Validation Officer selects ‘Other’ as the invalid reason
    Then a text box will be displayed below the ‘Other’ option

  Scenario: Other List reasons has been provided
    Given the Validation Officer is on the ‘Invalid appeal details' Page
    When the Validation Officer selects ‘Other’ as the invalid reason
    And provide the Other List reasons
    And the Validation Officer selects ‘Continue’
    Then the Invalid outcome Check and confirm page is displayed

  Scenario: ‘Back’ link navigation
    Given the Validation Officer is on the ‘Invalid appeal details' Page
    When the Validation Officer selects the ‘Back’ link
    Then the Review appeal submission Page will be displayed showing the previously selected outcome as 'Invalid'