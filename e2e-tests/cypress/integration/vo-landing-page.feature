Feature: As a Validation Officer
I want to view appeals that need to be validated
So that the appeal can be started

  Scenario: Appeals in status of ‘Appeal received' are displayed on the Submissions for review’ page
    Given user is on the Case Officer Login page
    When the login details are entered
    Then Appeal submissions page is displayed and page title and page header footer are verified
    #Then all the appeals with status of 'Appeal Received’ and that have a Horizon ID are displayed

  Scenario: Verify the table headers and data
    Given Appeal submissions page is displayed
    And headers 'Appeal reference', 'Received on', 'Appeal site' are displayed
    Then header contains the appeals data
   

