Feature: As a Case Officer/CST member
         I want to see details of an appeal
         So that I can check the appeal information is accurate

  Scenario: Customer Service team member views the Summary Section
    Given the user on the Search Results Page
    When the user select an appeal to view the details
    Then the user is presented with the appeal details in the 'Summary' section
    And the user is presented with the appeal details in the 'Case File' section
    And the user is presented with the appeal details in the 'Evidence Case Details' section
    And the user is presented with the appeal details in the 'Evidence Appellant Case' section
    And the user is presented with the appeal details in the 'Evidence Local Planning Department Documents' section
    And the user is presented with the appeal details in the 'Evidence Constraints' section
    And the user is presented with the appeal details in the 'Evidence Policies' section
    And the user is presented with the appeal details in the 'Evidence Representation' section
    And the user is presented with the appeal details in the 'Evidence Correspondence' section
    And the user is presented with the appeal details in the 'Stages Validation' section
    And the user is presented with the appeal details in the 'Stages Start' section
    And the user is presented with the appeal details in the 'Stages Questionnaire' section
    And the user is presented with the appeal details in the 'Stages Site Visit' section
    And the user is presented with the appeal details in the 'Stages Decision' section

  Scenario: Click on Back link from Appeal Details Page
    Given the user on the Search Results Page
    When the user select an appeal to view the details
    Then the user is presented with the appeal details in the 'Summary' section
    When the user select the back link
    And the user will be navigated to the Search Results Page


    # Future work to write scenario for Agent as the data mapping is not correct and there is no e2e flow between questionnaire and appeals

