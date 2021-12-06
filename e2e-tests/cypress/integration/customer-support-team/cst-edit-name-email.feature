Feature: As a Case Officer/Inspector/Customer Support Team
         I want to edit the appellants name and email address
         So that the appeal data is accurate

  Scenario: AC1. Navigating to the change appellant page
    Given the user is on the Appeal Details page
    When the user selects appellant name in the summary section
    Then the 'Change appellant details' page will be displayed

  Scenario: AC2. AC3. Appellant’s name on the submission of the appeal form is slightly different to the name of the applicant in the Application Form
    Given the user is on the Change appellant details page
    When the user edits the information and saves
    Then the appellant's name and email address are updated on the Appeal Details page within the summary, contact details, appellant case

  Scenario Outline: AC4. Scenario - Validation error message for invalid name and email address
    Given the user is on the Change appellant details page
    When '<name>' and '<email>' are submitted
    Then name is invalid because '<nameReason>'
    And email is invalid because '<emailReason>'

    Examples:
      | name      | email          | nameReason                                                             | emailReason                                                         |
      |           |                | Enter your name                                                        | Enter your email address                                            |
      |           | test@gmail.com | Enter your name                                                        |                                                                     |
      | Test Name |                |                                                                        | Enter your email address                                            |
      | 123       | test@gmail.com | Name must only include letters a to z, hyphens, spaces and apostrophes |                                                                     |
      | a         |                | Name must be between 2 and 80 characters                               | Enter your email address                                            |
      | Test Name | 123            |                                                                        | Enter an email address in the correct format, like name@example.com |
      | Test Name | test@test@tt2  |                                                                        | Enter an email address in the correct format, like name@example.com |


