Feature: As a Validation Officer validating an appeal
I want to check the answers I’ve provided So that in case I’ve made any mistakes

  Scenario: Navigate to the Check and confirm Page
    Given the Validation Officer has provided a Description of development on the Valid appeal details Page
    When the Validation Officer selects ‘Continue’
    Then the Check and confirm Page will be displayed showing the outcome as 'Valid'

  Scenario: Back link navigation
    Given the Validation Officer is on the Check and confirm page
    When the Validation Officer selects the ‘Back’ link
    Then the Valid appeal details Page will be displayed with the description of development details




