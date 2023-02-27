Feature: View and Edit a case from the Project Information Page as a Case Admin user

	Background: the user visits the homepage as a case admin
		Given the user visits the home page
		Then the logged in user should be a Case Admin

	@CaseAdmin @smoke @InitCaseInfo
	Scenario: Case Admins should be able view and edit the case - Omit optional parameters and add them on project information section
		When the user starts the creation of a new case
		And the user enters a name and description for the new case
		And the user chooses the sector for the case
		And the user chooses the subsector for the case
		And the user enters geographical information for the new case
		And the user chooses the regions for the new case
		And the user clicks the "Save and Continue" button
		And the user clicks the "Save and Continue" button
		And the user clicks the "Save and Continue" button
		And the user enters the internal anticipated submission date correctly
		And the user clicks the "Save and Continue" button
		Then the user should successfully verify mandatory answers on the summary page against form inputs
		When the user clicks the "I accept - confirm creation of a new case" button
		Then the user should confirm that a new case has been created
		When the user goes to the dashboard
		And the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file 1 and mandatory data
		When the user clicks the "Update project information" link
		And the user clicks the "Show all sections" accordion
		Then the user should validate the Project information page with file 1 and mandatory data
		When the user updates the project information with file 2
		Then the user should validate the Project information page with file 2 and complete data
		When the user clicks the "Preview and publish project" link
		Then the user should validate the Preview and Publish page with file 2 and complete data
		When the user clicks the "Accept and publish project" button
		Then the user should see a banner message displaying "Project page published"



