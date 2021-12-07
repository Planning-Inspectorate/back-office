Feature: As a Case Officer/Inspector/CST team within the view appeal screen
         I want to edit the appellants site address
         So that the appeal data is accurate

  Scenario: AC1. Navigating to the 'change address of appeal site' page
    Given the user is on the Appeal Details page
    When the user selects site address in the summary section
    Then the 'Change address of appeal site' page will be displayed

  Scenario: AC2. Site address has a spelling error that needs to be corrected
    Given the user is on the Site Address change page
    When the user edits information and saves
    Then the user can see the site address has been updated with correct information

  Scenario Outline: AC3. Validation Errors
    Given the user is on the Site Address change page
    When the user enters '<addline1>' and '<addline2>' and '<towncity>' and '<county>' and '<postcode>'
    Then the validation error message '<errormessage>' displayed
    Examples:
      | addline1 | addline2 | towncity | county | postcode    | errormessage                                              |
      |          |          |          |        |             | Enter the first line of the address,Enter a real postcode |
      |          |          |          |        | RG61DS      | Enter the first line of the address                       |
      | 101      |          |          |        |             | Enter a real postcode                                     |
      |          |          |          |        | 123RSFASDAF | Postcode must be 8 characters or fewer                    |

