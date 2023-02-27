Feature: Validate mandatory fields

	Background: the user visits the homepage as a case admin
		Given the user visits the home page
		Then the logged in user should be a Case Admin

	@CaseAdmin @smoke @InitCaseInfo
	Scenario: User should Validate errors on mandatory fields
		When the user starts the creation of a new case
		And the user clicks the "Save and Continue" button
		Then the user should see 2 error messages
		Then the user should see the "Enter the name of the project" error message
		And the user should see the "Enter the description of the project" error message
		When the user enters a name and description for the new case
		And the user clicks the "Save and Continue" button
		Then the user should see 1 error message
		Then the user should see the "Choose the sector of the project" error message
		When the user chooses the sector for the case
		And the user clicks the "Save and Continue" button
		Then the user should see 1 error message
		Then the user should see the "Choose the subsector of the project" error message
		Then the user should see 1 error message
		When the user chooses the subsector for the case
		And the user clicks the "Save and Continue" button
		Then the user should see 3 error messages
		Then the user should see the "Enter the project location" error message
		And the user should see the "Enter the Grid reference Easting" error message
		And the user should see the "Enter the Grid reference Northing" error message
		And the user enters geographical information for the new case
		And the user clicks the "Save and Continue" button
		Then the user should see 1 error message
		Then the user should see the "Choose at least one region" error message
		When the user chooses the regions for the new case
		And the user clicks the "Save and Continue" button
		And the user clicks the "Save and Continue" button
		And the user clicks the "Save and Continue" button
		And the user enters the internal anticipated submission date 01/02/2021
		And the user clicks the "Save and Continue" button
		Then the user should see the "The anticipated submission date internal must be in the future" error message
		And the user enters the internal anticipated submission date correctly
		And the user clicks the "Save and Continue" button
		Then the user should successfully verify mandatory answers on the summary page against form inputs
		When the user clicks the "I accept - confirm creation of a new case" button
		Then the user should confirm that a new case has been created
