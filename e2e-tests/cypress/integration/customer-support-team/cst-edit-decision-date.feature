Feature: As a CST/Case Officer within the view appeal screen
         I want to edit the Application Decision Date
         So that the appeal data is accurate

  Scenario: AC1. Navigating to the 'change application decision date' page
    Given user is on the Appeal Details page
    When the user click on Change Outcome link for application decision date in the case file section
    Then the 'Change decision date' page will be displayed

  Scenario: AC2. Whilst doing checks, the Validation Officer notices the incorrect date has been entered and has now received confirmation of the correct date.
    Given user is on the 'Change decision date'
    When user edits the information and saves
    Then user can see that the Application date now reads correctly

  Scenario Outline: AC3. Invalid Date Validations
    Given user is on the 'Change decision date'
    When user edits the '<day>' and '<month>' and '<year>'
    Then user can see the validation message as '<reason>'
    Examples:
      | day | month | year | reason                                          |
      |     |       |      | Enter the Decision Date                         |
      |     | 12    | 2021 | The Decision Date must include a day            |
      | 30  |       | 2021 | The Decision Date must include a month          |
      | 30  | 12    |      | The Decision Date must include a year           |
      |     |       | 2021 | The Decision Date must include a day and month  |
      |     | 12    |      | The Decision Date must include a day and year   |
      | 30  |       |      | The Decision Date must include a month and year |
      | 32  | 12    | 2021 | The Decision Date must be a real date           |
      | 30  | 13    | 2021 | The Decision Date must be a real date           |
      | 31  | 12    | 3000 | Decision date must be today or in the past      |

  Scenario: Navigate using back link
   Given user is on the 'Change decision date'
   When user click on Back link
   Then user should be on the Appeal Details page

