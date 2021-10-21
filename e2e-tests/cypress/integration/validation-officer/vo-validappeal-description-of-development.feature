Feature: As a Validation Officer
  I want to Capture the Description of development if the appeal outcome is Valid

  Scenario: Navigate to the ‘Valid appeal details’ Page from the ‘Review appeal submission’ page
    Given the validation Officer has selected outcome as valid on the ‘Review appeal submission’ page
    When the Validation Officer selects ‘Continue’
    Then the Valid appeal details Page will be displayed with the appeal reference

  Scenario: Error when a ‘Description of development’ has not been provided
    Given the Validation Officer has not provided a Description of development on the Valid appeal details Page
    When the Validation Officer selects ‘Continue’
    Then error message 'Enter a description of development' will be displayed

  Scenario: ‘Description of development’ has been provided
    Given the Validation Officer has provided a Description of development on the Valid appeal details Page
    When the Validation Officer selects ‘Continue’
    Then check and confirm page is displayed

  Scenario: ‘Back’ link navigation
    Given the Validation Officer is on the Valid appeal details page
    When the Validation Officer selects the ‘Back’ link
    Then the Review appeal submission Page will be displayed showing the previously selected outcome


