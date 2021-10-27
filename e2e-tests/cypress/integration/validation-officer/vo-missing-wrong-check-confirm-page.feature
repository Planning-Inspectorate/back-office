Feature: As a Validation Officer validating an appeal as Something missing or wrong
  I want to check the answers I’ve provided So that in case I’ve made any mistakes

  Scenario: AC01 - Navigate to the Check and confirm page from the What is missing or wrong page
    Given the Validation Officer has provided what is missing or wrong on the 'What is missing or wrong?’ page
    When the Validation Officer selects 'Continue'
    Then the 'Check and confirm' page will be displayed showing the Outcome and Reasons

  Scenario:  AC02 - Validation Officer does not select the checkbox page in Check and confirm page for Something is missing or wrong
    Given the Validation Officer has not selected the checkbox on the 'Check and confirm' page
    When the Validation Officer selects 'Continue'
    Then error message 'Confirm if you have completed all follow-up tasks and emails' will be displayed

  Scenario: AC03 - Back link navigates back to the What is missing or wrong? page
    Given the Validation Officer is on the 'Check and confirm' page with the outcome being 'Something missing or wrong'
    When the Validation Officer selects the ‘Back’ link
    Then the 'What is missing or wrong?' page will be displayed