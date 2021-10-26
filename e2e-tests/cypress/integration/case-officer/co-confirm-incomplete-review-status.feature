Feature: As a Case Officer I need to confirm the outcome for the questionnaire review

Scenario: AC-01 Navigate to the Check and confirm page from the Review questionnaire page
  Given a Case Officer selects continue on the review questionnaire page
  When the questionnaire review is 'Incomplete'
  Then the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'