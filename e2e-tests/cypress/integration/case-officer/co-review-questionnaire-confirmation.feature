Feature: As a Case Officer
  I need to be able to see the questionnaire review confirmation page
  So that I know whether the questionnaire review is complete

  Scenario: Case Officer completes the review of the questionnaire and the outcome is 'Complete'
    Given the Case Officer is on the Check and Confirm page
    When the Review outcome is Complete
    Then the Case Officer is presented with the confirmation page
    Then the Confirmation page should have link to Questionnaire review page

  Scenario: Questionnaire review page link goes to Questionnaire review page
    Given the Case Officer is on the Check and Confirm page
    When the Review outcome is Complete
    Then the Case Officer is presented with the confirmation page
    When the Case Officer clicks Return to Questionnaire review link
    Then the Case Officer should be taken to review questionnaire list page