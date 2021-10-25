Feature: As a Validation Officer validating an appeal
  I want to provide the reason(s) why the appeal is missing or wrong
  So that the reason(s) can be provided to the appellant

  Scenario: Change outcome navigation
    Given the Validation Officer is on the ’Missing or Wrong’ page
    When the Validation Officer clicks on ‘Change outcome’ link
    Then the ‘Review appeal submission’ Page will be displayed

  Scenario: Navigate to the What is missing or wrong page from the Review appeal submission page
    Given the Validation Officer selects that ‘something is missing or wrong’ on the ‘Review appeal submission’ page
    When the Validation Officer selects ‘Continue’
    Then the ‘What is missing or wrong’ Page will be displayed showing the appeal reference 'APP/Q9999/D/21/1234567'

  Scenario: Error when a Reason has not been selected
    Given the Validation Officer has not selected a reason on the ‘What is missing or wrong’ Page
    When the Validation Officer selects ‘Continue’
    Then error message 'Select what is missing or wrong in the appeal submission' will be displayed

  Scenario: Missing or wrong documents is selected, but no document(s) has been selected from the list
    Given the Validation Officer has selected that a document is missing or wrong but, has not selected a document from the list on the ‘What is missing or wrong’ Page
    When the Validation Officer selects ‘Continue’
    Then error message 'Select which documents are missing or wrong' will be displayed

  Scenario: Error when a Other was selected as the Reason but text has not been provided
    Given the Validation Officer selects ‘Other’ as the missing or wrong reason but, has not provided any text on the ‘What is missing or wrong’ page
    When the Validation Officer selects ‘Continue’
    Then error message 'Enter what is missing or wrong in the appeal submission' will be displayed

  Scenario: Errors when Missing or wrong documents is selected and Other List Reasons are not provided
    Given the Validation officer does not select any missing documents and no information is provided for other reasons
    When the Validation Officer selects ‘Continue’
    Then error message 'Select which documents are missing or wrong' will be displayed
    And error message 'Enter what is missing or wrong in the appeal submission' will be displayed

  Scenario: Other selected as reason
    Given the Validation Officer is on the ’Missing or Wrong’ page
    When the Validation Officer selects ‘Other’ as the reason
    Then a text box will be displayed below the ‘Other’ option and Validation officer enters data

  Scenario: Select all the available options
    Given the Validation Officer is on the ’Missing or Wrong’ page
    When the Validation Officer selects all the available options and click on 'Continue' button
    Then Check and confirm page for something missing or wrong is displayed

  Scenario: Back link navigation
    Given the Validation Officer is on the ’Missing or Wrong’ page
    When the Validation Officer selects the ‘Back’ link
    Then the ‘Review appeal submission’ Page will be displayed