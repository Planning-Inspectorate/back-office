Feature: As a Validation Officer
  I want to review and confirm the outcome of an appeal as valid or invalid or something missing or wrong

  @smoke @as-3248
  Scenario Outline: E2e tests to cover all the outcomes of an appeal
    Given the user is on the Review appeal submission page
    When the user selects the outcome as '<outcome>' and click on Continue button
    Then the '<next-page>' is displayed
    When the user selects or enters '<reasons>' and click on Continue button
    Then the Check and confirm page for '<outcome>' is displayed
    When the user clicks on the '<button>'
    Then the review is complete with the appeal status as '<outcome>'

    Examples:
      | outcome                       | next-page                | reasons                    | button                       |
      | valid                         | valid appeal details     | description of development | confirm and start appeal     |
      | invalid                       | invalid appeal details   | out of time                | confirm and turn away appeal |
      | something is missing or wrong | what is missing or wrong | names do not match         | confirm and finish review    |


    # verify the data has been captured all the way through the journey and where ever needed

