Feature: Review Received Questionnaire
  As a case officer
  I want to review the received questionnaire

  Scenario: AC-01 Case officer is able to view appeal questionnaire for received status
    Given a Case Officer is on the Questionnaires for review page
    And appeal status is 'Received'
    When case officer selects the appeal to view
    Then the Review Questionnaire page will be displayed

  Scenario Outline: AC-02 case officer is able to download documents to view
    Given a Case Officer is on the Review questionnaire page
    When the Case Officer selects a '<document>' link in the '<document_section>'
    Then the document '<document>' will be downloaded for the '<document_section>'
    Examples:
    |document_section|document|
    |Decision notice|  decision letter.pdf  |
    |Planning Officer\'s report|officers-report-uploaded-file.pdf|
    |Plans used to reach decision|plans-decision-uploaded-file.pdf|
    |Statutory development plan policies|statutory-development-uploaded-file.pdf|
    |Other relevant policies            |other-policy-uploaded-file.pdf|
    |Supplementary planning documents   |supplementary-planning-uploaded-file.pdf|
    |Conservation area map and guidance |conservation-area-map-uploaded-file.pdf |
    |Application notification           |application-notification-uploaded-file.pdf|
    |Application publicity              |application-publicity-uploaded-file.pdf   |
    |Representations                    |representations-uploaded-file.pdf         |
    |Appeal notification                |upload-file-valid.pdf|


  Scenario Outline: AC-03 Case officer provides missing or incorrect information
    Given a Case Officer is on the Review questionnaire page
    When the case officer selects the missing or incorrect checkbox for a '<document_section>'
    Then the case officer is able to enter '<missing_info>' information for '<document_section>'
    And the case officer is able to submit the review
    Examples:
      |document_section         |missing_info|
      |Plans used to reach decision|Plans used to reach decision are incomplete|
      |Statutory development plan policies|Statutory development plan policies are missing|
      |Other relevant policies            |Other relevant policies need more information|
      |Supplementary planning documents   |Supplementary planning documents are incorrect|
      |Conservation area map and guidance |Conservation area map information required |
      |Listing description                |Listing description further information is required|
      |Application notification           |Select what is missing|
      |Application publicity              ||
      |Representations                    |Information about representations is missing         |
      |Appeal notification                |Select what is missing|
      |Planning Officer\'s report|                                               |

  Scenario Outline: AC-04 case officer is displayed error message when missing information is not provided
    Given a Case Officer is on the Review questionnaire page
    And case officer has selected the checkbox for missing information for '<document_section>'
    When case officer does not provide the relevant missing information for '<document_section>'
    Then an error '<error_message>' is displayed for '<document_section>'
    Examples:
    |document_section                            |error_message                |
    |Plans used to reach decision        |Enter which plans are missing        |
    |Statutory development plan policies|Enter which statutory development plan policies are missing|
    |Other relevant policies            |Enter which other relevant policies are missing|
    |Supplementary planning documents   |Enter which supplementary planning documents are missing|
    |Conservation area map and guidance |Enter what conservation area documentation is missing   |
    |Application notification           |Select which application notification is missing or incorrect|
    |Representations                    |Enter which representations are missing or incorrect         |
    |Appeal notification                |Select which appeal notification is missing or incorrect     |

  Scenario: AC-05 case officer selects to return to previous page
    Given a Case Officer is on the Review questionnaire page
    And the case officer selects the missing or incorrect checkbox for a 'Plans used to reach decision'
    When case officer selects back
#    Then case officer navigates to Questionnaires for review page
#    And review comments will not be saved

  #Breadcrumbs will be implemented separately
#  Scenario: AC-06 case officer is able to navigate to 'Questionnaire for review' from breadcrumbs
#  Given a Case Officer is on the Review questionnaire page
#  When a Case Officer selects the 'Questionnaires for review' link in the breadcrumb
#  Then the Questionnaires for review page will be displayed