Feature: As a Validation Officer validating an appeal as Invalid
  I want to receive confirmation
  So that I know the validation outcome has been saved

  Scenario: Navigate to the Review complete Page
    Given the Validation Officer is on the 'Check and confirm' page and has deemed the appeal as 'InValid'
    When the Validation Officer selects 'Confirm and turn away appeal'
    Then the 'Review complete' Page will be displayed showing the validation outcome as 'Appeal invalid' with appeal reference

  Scenario: Return to task list navigation
    Given a Validation Officer is on the 'Invalid Review complete' page
    When the Validation Officer selects the Return to task list link
    Then the 'Appeal submissions for review' Page will be displayed