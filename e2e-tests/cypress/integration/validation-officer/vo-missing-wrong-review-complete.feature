Feature: As a Validation Officer validating an appeal as Something missing or wrong
  I want to receive confirmation
  So that I know the validation outcome has been saved

  Scenario: Confirmation page updated to cover the Something missing or wrong outcome
    Given a Validation Officer has confirmed an appeal as 'Something missing or wrong' on the 'Check and confirm' page
    When the Validation Officer selects 'Confirm and finish review'
    Then the Confirmation Page will be displayed showing 'Something is missing or wrong'

  Scenario: Return to task list navigation
    Given a Validation Officer is on the Review complete page for the outcome 'Something missing or wrong'
    When the Validation Officer selects the Return to task list link
    Then the 'Appeal submissions for review' Page will be displayed