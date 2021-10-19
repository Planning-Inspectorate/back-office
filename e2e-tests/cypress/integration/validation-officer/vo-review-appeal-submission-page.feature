Feature: As a Validation Officer validating an appeal
  I want to view data and documentation submitted from an appellant
  So that I can easily determine if the appeal is valid to continue

  @as-2552
  Scenario: Navigate to the ‘Review appeal submission’ Page from the validation task list page
    Given Validation Officer is on the ‘Appeal submissions for review’ page
    When the Validation Officer selects an appeal
    Then the ‘Review appeal submission’ Page will be displayed

  Scenario: Continue selected but no outcome has been chosen
    Given Validation Officer has not chosen an outcome on the ‘Review appeal submission’ page
    When the Validation Officer selects ‘Continue’
    Then error message 'Select if the appeal is valid or invalid, or if something is missing or wrong' is displayed

  Scenario: Continue selected with outcome as 'Valid'
    Given Validation Officer has selected outcome as valid on the ‘Review appeal submission’ page
    When the Validation Officer selects ‘Continue’
    Then Description of Development page is displayed

  Scenario: Back link navigates to the ‘Appeal submissions for review’ page
    Given Validation Officer is on the ‘Review appeal submission’ page
    When the Validation Officer selects the ‘Back’ link
    Then the ‘Appeal submissions for review’ page will be displayed

  Scenario: Appellant details are displayed
    Given Validation Officer is on the ‘Appeal submissions for review’ page
    When the Validation Officer selects the appeal 'APP/Q9999/D/21/1234567'
    Then the ‘Review appeal submission’ Page will be displayed with the Appellant details

