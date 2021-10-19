Feature: As a Validation Officer
I want to view appeals that need to be validated
So that the appeal can be started

 @as-2151
  Scenario: Appeals in status of ‘Appeal received' are displayed on the Submissions for review’ page
    Given user is on the Validation Officer Login page
    Then appeal submissions page is displayed and page title and page header footer are verified
    #When the login details are entered -> needs to be implemented after SSO
    #Then all the appeals with status of 'Appeal Received’ and that have a Horizon ID are displayed

  Scenario: Verify the table headers and data
    Given appeal submissions page is displayed
    And headers 'Appeal reference', 'Received on', 'Appeal site' are displayed
    Then header contains the appeals data
   

