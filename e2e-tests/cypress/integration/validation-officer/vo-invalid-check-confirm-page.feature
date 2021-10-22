Feature: As a Validation Officer validating an appeal
  I want to check the answers for Invalid Appeal details I’ve provided So that in case I’ve made any mistakes

  Scenario: Navigate to the Check and confirm from the Invalid appeal details page
    Given the Validation Officer has provided the invalid reasons on the ‘Invalid appeal details’ page
    When the Validation Officer selects ‘Continue’
    Then the ‘Check and confirm’ Page will be displayed showing the the outcome as Invalid

  Scenario:  Back link goes back to the ‘Invalid appeal details’ page
    Given the Validation Officer is on the ‘Check and confirm’ page and the outcome is ‘Invalid’
    When the Validation Officer selects ‘Back’ link
    Then the ‘Invalid appeal details’ page will be displayed along with the previously input data