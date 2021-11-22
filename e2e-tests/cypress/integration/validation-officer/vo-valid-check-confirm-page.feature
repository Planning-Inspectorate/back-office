Feature: As a Validation Officer validating an appeal
I want to check the answers I’ve provided So that in case I’ve made any mistakes

  Scenario: Navigate to the Check and confirm Page
    Given the Validation Officer has provided a Description of development on the Valid appeal details Page
    When the Validation Officer selects ‘Continue’
    Then the Check and confirm Page will be displayed showing the outcome as 'Valid'

  Scenario: Back link navigation
    Given the Validation Officer is on the Check and confirm page
    When the Validation Officer selects the ‘Back’ link
    Then the Valid appeal details Page will be displayed with the description of development details

  Scenario: Change outcome navigation
    Given the Validation Officer goes to the ’Valid appeal details’ page
    When the Validation Officer clicks on ‘Change outcome’ link
    Then the ‘Review appeal submission’ Page will be displayed
    #Then the ‘Review appeal submission’ Page will be displayed for change outcome link from development page

#  Scenario: Change outcome navigation in Check and Confirm page
#    Given the Validation Officer has provided a Description of development on the Valid appeal details Page
#    When the Validation Officer selects ‘Continue’
#    Then the Check and confirm Page will be displayed showing the outcome as 'Valid'
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    When the Validation Officer goes to the ’Valid appeal details’ page by selecting valid outcome
#    Then the Valid appeal details Page will be displayed with the description of development details
#    Then ‘Description of development’ field should have the related description
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    Given the Validation Officer has provided the invalid reasons on the ‘Invalid appeal details’ page
#    When the Validation Officer selects ‘Continue’
#    Then the ‘Check and confirm’ Page will be displayed showing the the outcome as Invalid
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    When the Validation Officer goes to the ’Valid appeal details’ page
#    Then the Valid appeal details Page will be displayed with the description of development details
#    Then The Valid appeal details Page should have an empty ’description of development’ field
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    Given the Validation Officer has provided what is missing or wrong on the 'What is missing or wrong?’ page
#    When the Validation Officer selects 'Continue'
#    Then the 'Check and confirm' page will be displayed showing the Outcome and Reasons
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    When the Validation Officer goes to the ’Missing or Wrong’ page
#    Then the ‘Missing or Wrong’ Page will be displayed as populated
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    Given the Validation Officer has provided the invalid reasons on the ‘Invalid appeal details’ page
#    When the Validation Officer selects ‘Continue’
#    Then the ‘Check and confirm’ Page will be displayed showing the the outcome as Invalid
#    When the Validation Officer clicks on ‘Change outcome’ link
#    Then the ‘Review appeal submission’ Page will be displayed
#    When the Validation Officer goes to the ’Missing or Wrong’ page
#    Then the ‘Missing or Wrong’ Page will be displayed as empty
