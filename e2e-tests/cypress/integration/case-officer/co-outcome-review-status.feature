Feature: As a Case Officer I need to confirm the outcome for the questionnaire review

Scenario: AC-01 Navigate to the ‘Check and confirm’ page from the ‘Review questionnaire’ page
  Given a Case Officer selects continue on the review questionnaire page
  When the questionnaire review is 'complete'
  Then the 'Check and confirm' page is displayed showing the questionnaire as 'complete'

Scenario: AC-02Return to review questionnaire
  Given a case officer wants to amend the outcome of a review
  When case officer select Go back to review questionnaire
  Then the Review Questionnaire screen is displayed
  And case officer is able to view and amend the previously entered data

Scenario: AC-03 ‘Questionnaires for review' in the breadcrumb navigates back to the ‘Questionnaires for review’ page
  Given a Case Officer is on the 'check and confirm' page
  When a Case Officer selects the 'Questionnaires for review' link in the breadcrumb
  Then the 'Questionnaires for review' page will be displayed

Scenario: AC-04 reference in the breadcrumb navigates back to the ‘Review questionnaire’ page
  Given a Case Officer is on the 'check and confirm' page
  When a Case Officer selects the 'Appeal reference' link in the breadcrumb
  Then the 'Review questionnaire' page will be displayed

Scenario: AC-05 outcome from Complete to Incomplete
  Given the outcome of the review is complete
  When a Case Officer amends the outcome to 'incomplete'
  And case officer navigates to the 'Check and Confirm' page
  Then the review outcome will be displayed as 'Incomplete'