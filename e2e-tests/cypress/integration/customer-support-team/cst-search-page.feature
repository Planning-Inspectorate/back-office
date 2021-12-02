Feature: As a Case Officer/CST member
         I want to see details of an appeal
         So that I can check the appeal information is accurate

 Scenario Outline: Search Page
    Given Customer Support Team is on the search dashboard page
    When the user enter '<data>' and click on Search button
    Then the results page is displayed with the data matching the search criteria

   Examples:
     | reference            | data    |
     | appeal reference     | 82      |
     | 1st line of address  | 22      |
     | postcode             | RG      |
     | postcode             | RG6 1DX |
     #| postcode             | RG61DX  |
     | appellant agent name | ka      |


