Feature: As a Validation Officer validating an appeal as Valid
  I want to receive confirmation
  So that I know the validation outcome has been saved

  Scenario: Navigate to the Review complete Page
    Given the Validation Officer is on the Check and confirm page and has deemed the appeal Valid
    When the Validation Officer selects 'Confirm and start appeal'
    Then the Review completePage will be displayed showing the validation outcome as 'Appeal valid' with appeal reference

  Scenario: Return to task list navigation
    Given a Validation Officer is on the Review complete page
    When the Validation Officer selects the Return to task list link
    Then the 'Appeal submissions for review' Page will be displayed