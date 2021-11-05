Feature: Questionnaire already reviewed
  As a Case Officer
  I want to know when a questionnaire has already been reviewed
  So that I don’t  submit another review

  Scenario: AC-01 Questionnaire already reviewed
    Given a case officer is reviewing a questionnaire
    When the questionnaire review outcome is set as complete or incomplete
    Then the Questionnaire already reviewed page is displayed

  Scenario: AC-02 Case Officer selects to return to questionnaires for review page
    Given the case officer has navigated to questionnaire already reviewed page
    When case officer selects return to questionnaires for review link
    Then the questionnaires for review page is displayed