Feature: As a Validation Officer
  I want to review and confirm the outcome of an appeal as valid or invalid or something missing or wrong

@smoke
  Scenario: E2E journey for validating the outcome of an appeal as Valid
    Given the user is on the ‘Review appeal submission’ page
    When the user selects the outcome as 'Valid' and click on 'Continue' button
    Then 'Valid appeal details' page is displayed
    When user enters Description of development and click on 'Continue' button
    Then 'Check and confirm' page is displayed
    When the user clicks on the 'Confirm and start appeal' button
    Then the review is complete and the appeal status is 'Valid'

  Scenario: E2E journey for validating the outcome of an appeal as Invalid
    Given the user is on the ‘Review appeal submission’ page
    When the user selects the outcome as 'Invalid' and click on 'Continue' button
    Then 'Invalid appeal details' page is displayed
    When user selects Reasons the appeal is invalid as 'Out of time' and click on 'Continue' button
    Then 'Check and confirm' page is displayed
    When the user clicks on the 'Confirm and turn away appeal' button
    Then the review is complete and the appeal status is 'Invalid'

  Scenario: E2E journey for validating the outcome of an appeal as Something is missing or wrong
    Given the user is on the ‘Review appeal submission’ page
    When the user selects the outcome as 'Something is missing or wrong' and click on 'Continue' button
    Then 'What is missing or wrong?' page is displayed
    When user selects 'Names do not match' and click on 'Continue' button
    Then 'Check and confirm' page is displayed
    When the user clicks on the 'Confirm and finish review' button
    Then the review is complete and the appeal status is 'Something is missing or wrong'