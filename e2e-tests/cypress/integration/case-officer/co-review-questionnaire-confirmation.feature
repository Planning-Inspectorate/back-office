Feature: As a Case Officer
  I need to be able to see the questionnaire review confirmation page
  So that I know whether the questionnaire review is complete

  Scenario: AC-01 Case Officer completes the review of the questionnaire and the outcome is 'Complete'
    Given Case officer is on Check and confirm page for 'Complete' status
    When Case Officer clicks on Confirm outcome
    Then Case officer is navigated to confirm outcome page for 'Complete' status

  Scenario: AC-02 Case Officer completes the review of the questionnaire and the outcome is 'Incomplete'
    Given Case officer is on Check and confirm page for 'Incomplete' status
    When Case Officer clicks on Confirm outcome
    Then Case officer is navigated to confirm outcome page for 'Incomplete' status


  Scenario: Questionnaire review page link goes to Questionnaire review page
    Given Case officer is navigated to confirm outcome page
    When the Case Officer clicks Return to Questionnaire review link
    Then the Case Officer should be taken to review questionnaire list page