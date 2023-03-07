Feature: Create New Case journey as an Case Team member

	Background: the user visits the homepage as a Case Team member
		Given the user visits the home page
		Then the logged in user should be a Case Team member

	@CaseTeam @smoke @InitCaseInfo
	Scenario: Case Team member should be able to create a new case
		When the user starts the creation of a new case
		And the user enters a name and description for the new case
		When the user chooses the sector for the case
		And the user chooses the subsector for the case
		And the user enters geographical information for the new case
		And the user chooses the regions for the new case
		And the user chooses the zoom level for the new case
		And the user enters the case email address for the new case
		When the user chooses all the available options for applicant information available
		And the user enters the applicant's organisation name for the new case
		And the user enters the applicant's first and last name for the new case
		And the user enters the applicant's postcode as "BS1 6PN"
		And the user clicks the "Find address" button
		And the user selects option "1" from the "Address" list
		And the user clicks the "Save and continue" button
		And the user enters the applicant's website for the new case
		And the user enters the applicant's email for the new case
		And the user enters the applicant's phone number for the new case
		And the user enters the anticipated submission date
		And the user enters the internal anticipated submission date correctly
		And the user clicks the "Save and continue" button
		Then the user should successfully verify "complete" answers on the summary page against form inputs
		When the user clicks the "I accept - confirm creation of a new case" button
		Then the user should confirm that a new case has been created

	@CaseTeam @smoke @InitCaseInfo
	Scenario: Case Team member should be able to create a new case - omit optional fields
		When the user starts the creation of a new case
		And the user enters a name and description for the new case
		When the user chooses the sector for the case
		And the user chooses the subsector for the case
		And the user enters geographical information for the new case
		And the user chooses the regions for the new case
		And the user clicks the "Save and continue" button
		And the user enters the case email address for the new case
		And the user clicks the "Save and continue" button
		And the user enters the anticipated submission date
		And the user enters the internal anticipated submission date correctly
		And the user clicks the "Save and continue" button
		Then the user should successfully verify "mandatory" answers on the summary page against form inputs
		When the user clicks the "I accept - confirm creation of a new case" button
		Then the user should confirm that a new case has been created

