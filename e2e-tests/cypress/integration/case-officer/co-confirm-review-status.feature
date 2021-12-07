Feature: As a Case Officer I need to confirm the outcome for the questionnaire review

Scenario: AC-01 Navigate to the Check and confirm page from the Review questionnaire page
  Given Case officer is on the Review questionnaire page for 'Received' status
  When Case Officer finishes the review as no missing information
  Then the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'

  Scenario Outline: AC-02 Navigate to the Check and confirm page from the Review questionnaire page
    Given Case officer is on the Review questionnaire page for 'Received' status
    When the Case officer enters '<missing_info>' information for '<document_section>'
    And case officer clicks on finish outcome
    Then the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'
    And Case officer can see the '<missing_info>' for the '<document_section>'
    Examples:
      |document_section         |missing_info|
      |Plans used to reach decision|Plans used to reach decision are incomplete|
      |Statutory development plan policies|Statutory development plan policies are missing|
      |Other relevant policies            |Other relevant policies need more information|
      |Supplementary planning documents   |Supplementary planning documents are incorrect|
      |Conservation area map and guidance |Conservation area map information required |
      |Application notification           |Select what is missing|
      |Application publicity              ||
      |Representations                    |Information about representations is missing         |
      |Appeal notification                |Select what is missing|
      |Planning Officer\'s report|                                               |

  Scenario Outline: AC-03 Navigate using breadcrumbs
    Given Case officer is on the Review questionnaire page for 'Received' status
    And Case Officer finishes the review as no missing information
    And the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'
    When Case Officer clicks on '<breadcrumb>' for 'Received' status
    Then Case Officer is navigated to the '<page>'
    Examples:
    |breadcrumb|page|
    |questionnaire for review|Questionnaires for review|
    |review questionnaire submission    |Review questionnaire|

  Scenario: AC-04 Navigate to review questionnaire
    Given Case officer is on the Review questionnaire page for 'Received' status
    And Case Officer finishes the review as no missing information
    And the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'
    When Case Officer clicks on Go back to review questionnaire
    Then Case Officer is navigated to the Review Questionnaire

   Scenario: AC-05 Confirm review outcome
     Given Case officer is on the Review questionnaire page for 'Received' status
     And Case Officer finishes the review as no missing information
     And the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'
     When Case Officer clicks on Confirm outcome
     Then Case officer is navigated to confirm outcome page

   Scenario: AC-06 Change outcome from Complete to Incomplete
     Given Case officer is on the Review questionnaire page for 'Received' status
     And Case Officer finishes the review as no missing information
     And the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'
     When Case Officer clicks on Go back to review questionnaire
     And the Case officer enters 'Plans used to reach decision are incomplete' information for 'Plans used to reach decision'
     And case officer clicks on finish outcome
     Then the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'
     And Case officer can see the 'Plans used to reach decision are incomplete' for the 'Plans used to reach decision'

  Scenario: AC-07 Change outcome from Incomplete to Complete
    Given Case officer is on the Review questionnaire page for 'Received' status
    And the Case officer enters 'Supplementary planning documents are incorrect' information for 'Supplementary planning documents'
    And case officer clicks on finish outcome
    And the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'
    And Case officer can see the 'Supplementary planning documents are incorrect' information for 'Supplementary planning documents'
    When Case Officer clicks on Go back to review questionnaire
    And the Case officer unchecks the 'Supplementary Planning documents'
    Then the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'

  Scenario: AC-08 Change outcome from Incomplete to Incomplete
    Given Case officer is on the Review questionnaire page for 'Received' status
    And the Case officer enters 'Supplementary planning documents are incorrect' information for 'Supplementary planning documents'
    And the Case officer enters 'Plans used to reach decision are incomplete' information for 'Plans used to reach decision'
    And case officer clicks on finish outcome
    And the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'
    And Case officer can see the 'Supplementary planning documents are incorrect' information for 'Supplementary planning documents'
    And Case officer can see the 'Plans used to reach decision are incomplete' information for 'Plans used to reach decision'
    When Case Officer clicks on Go back to review questionnaire
    And the Case officer unchecks the 'Supplementary Planning documents'
    Then the 'Check and confirm' page is displayed showing the questionnaire as 'Incomplete'
    And Case officer can see the 'Plans used to reach decision are incomplete' for the 'Plans used to reach decision'