Feature: As a Validation Officer validating an appeal
  I want to receive confirmation
  So that I know the validation outcome has been saved

  Scenario: Navigate to the Review complete Page
    Given the Validation Officer is on the Check and confirm page and has deemed the appeal Valid
    When the Validation Officer selects ‘Continue’
    Then the Review completePage will be displayed showing the validation outcome as Appeal valid and appeal reference

  Scenario: Return to task list navigation
    Given a Validation Officer is on the Review complete page
    When the Validation Officer selects the Return to task list link
    Then the 'Appeal submissions for review' Page will be displayed