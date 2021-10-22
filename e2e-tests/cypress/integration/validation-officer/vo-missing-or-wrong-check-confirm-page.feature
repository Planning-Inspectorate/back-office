Feature: As a Validation Officer validating an appeal
  I want to provide the reason(s) why the appeal is missing or wrong
  So that the reason(s) can be provided to the appellant

  Scenario: Change outcome navigation
    Given the Validation Officer is on the ’Missing or Wrong’ page
    When the Validation Officer clicks on ‘Change outcome’ link
    Then the ‘Review appeal submission’ Page will be displayed
