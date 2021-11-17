Feature: As a Case Officer I need to confirm the outcome for the questionnaire review

Scenario: AC-01 Navigate to the Check and confirm page from the Review questionnaire page
  Given a Case officer is on the Review questionnaire page for 'Received' status
  When Case Officer finishes the review as no missing information
  Then the 'Check and confirm' page is displayed showing the questionnaire as 'Complete'

  Scenario Outline: AC-02 Navigate to the Check and confirm page from the Review questionnaire page
    Given a Case officer is on the Review questionnaire page for 'Received' status
    When the Case officer enters '<missing_info>' information for '<document_section>'
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